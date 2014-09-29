var STAGE_WIDTH = 700;
var STAGE_HEIGHT = 500;

var DOT_WIDTH = 12;
var DOT_HEIGHT = 12;

var MAX_POPULATION = 250;

var DIR_DOWN = 1;
var DIR_RIGHT = 2;
var DIR_UP = 3;
var DIR_LEFT = 4;

ko.numericObservable = function(initialValue) {
    var _actual = ko.observable(initialValue);

    var result = ko.dependentObservable({
        read: function() {
            return _actual();
        },
        write: function(newValue) {
            var parsedValue = parseFloat(newValue);
            _actual(isNaN(parsedValue) ? newValue : parsedValue);
        }
    });

    return result;
};


var Scene = function (max_population, stage_width, stage_height, dot_width, dot_height) {
  this.changeHandler = function(newValue) {
    reset();
  }
  this.highlightID = ko.numericObservable(-1);
  this.maxPopulation = ko.numericObservable(max_population);
  this.stageWidth = ko.numericObservable(stage_width);
  this.stageHeight = ko.numericObservable(stage_height);
  this.dotWidth = ko.numericObservable(dot_width);
  this.dotHeight = ko.numericObservable(dot_height);
  this.maxPopulation.subscribe(this.changeHandler);
  this.stageWidth.subscribe(this.changeHandler);
  this.stageHeight.subscribe(this.changeHandler);
  this.dotWidth.subscribe(this.changeHandler);
  this.dotHeight.subscribe(this.changeHandler);
};

var scene = new Scene(MAX_POPULATION, STAGE_WIDTH, STAGE_HEIGHT, DOT_WIDTH, DOT_HEIGHT)
ko.applyBindings(scene);

// ++++++++++++++
// Initialization +
// ++++++++++++++
  
var population = 0;
var stage = Stage(scene.stageWidth(), scene.stageHeight());
var canvas = document.getElementById('canv-1');
var ctx = canvas.getContext('2d');
var dotId = 0;

var quad = new QuadTree({
  x:0,
      y:0,
      width:stage.size.w,
      height:stage.size.h
      });

var stepDot = function(dotToStep, dir) {
  if (dir === DIR_DOWN && dotToStep.y < scene.stageWidth() - scene.dotWidth()) {
    dotToStep.move(dotToStep.x, dotToStep.y + dotToStep.speed);
  }
  if (dir === DIR_RIGHT) {
    dotToStep.move(dotToStep.x + dotToStep.speed, dotToStep.y);
  }
  if (dir === DIR_UP && scene.dotWidth() + dotToStep.speed < dotToStep.y) {
    dotToStep.move(dotToStep.x, dotToStep.y - dotToStep.speed);
  }
  if (dir === DIR_LEFT) {
    dotToStep.move(dotToStep.x - dotToStep.speed, dotToStep.y);
  }
};

var calcDir = function(currDot) {
  var chck;
  var toDir = 0;

  // TODO fix and use QuadTree - overlapping can happen
  var candidateDots = quad.retrieve(currDot);
  //var candidateDots = stage.blueDots.concat(stage.redDots);
  var canStep = true;
  var deltaX = currDot.x <= currDot.aim ? currDot.speed : -currDot.speed;
  
  var bestDot = {found: 0, color: currDot.color};
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];
    if (bestDot.found < chck.found && currDot.aim === chck.aim && currDot.color === chck.color) bestDot = chck;
    if (chck.intersects({id: currDot.id, x: currDot.x + deltaX, y: currDot.y, width: currDot.width, height: currDot.height})) {
      canStep = false;
    }
  }
  
  if (canStep) {
    currDot.found++;
    currDot.stalled = 0;
    if (currDot.x <= currDot.aim) return DIR_RIGHT;
    if (currDot.aim <= currDot.x) return DIR_LEFT;
  } else {
    if (0 < currDot.found) currDot.found = 0;
    else currDot.found--;
    var deltaY = 0;
    var dir;
    deltaX = 0;
    if (currDot.found < -30 && 10 < bestDot.found) {
      if (currDot.y < bestDot.y) {
        deltaY = currDot.speed;
        dir = DIR_DOWN;
      }
      else {
        deltaY = -currDot.speed;
        dir = DIR_UP
      }
    }
    else {
      var randomDirSeed = Math.random();

      if (randomDirSeed < 0.04) {
        if (currDot.x <= currDot.aim) {
          deltaX = -currDot.speed;
          dir = DIR_LEFT;
        }
        else {
          deltaX = currDot.speed;
          dir = DIR_RIGHT;
        }
      }
      else if (randomDirSeed < 0.50) {
        deltaY = currDot.speed;
        dir = DIR_DOWN;
      }
      else {
        deltaY = -currDot.speed;
        dir = DIR_UP
      }
    }
    canStep = true;
    for (j = 0; j < candidateDots.length; j++) {
      chck = candidateDots[j];
    
      if (chck.intersects({id: currDot.id, x: currDot.x + deltaX, y: currDot.y + deltaY, width: currDot.width, height: currDot.height})) {
        canStep = false;
      }
    }
    if (canStep) {
      currDot.stalled = 0;
      return dir;
    }
    currDot.stalled++;
    return 0;
  }
};


function spawn() {
  if (scene.maxPopulation() <= population) return;
  if (Math.random() <= 0.3) {
    population++;
    var startY = Math.round(Math.random() * 1000) * scene.stageHeight() / 1000
    var newDot;
    // TODO clean-up
    if (Math.random() <= 1) {
      newDot = Dot("red", stage.redBase, startY);
      if (! checkIfEmpty(newDot)) return;
      stage.redDots.push(newDot);  
    } else {
      newDot = Dot("blue", stage.blueBase, startY);
      if (! checkIfEmpty(newDot)) return;
      stage.blueDots.push(newDot);
    }
    
    quad.insert(newDot);
  }
}

function checkIfEmpty(currDot) {
  var candidateDots = quad.retrieve(currDot);
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];
        
    if (chck.intersects(currDot)) {
      return false;
    }
  }
  return true;
};

function updateQuad() {
  quad.clear();
  var allDots = stage.redDots.concat(stage.blueDots);
  var currDot;
  for (i = 0; i < allDots.length; i++) {
    currDot = allDots[i];
    quad.insert(currDot);
  }
}

function update() {
  stage.draw();
  stage.step();
  updateWorld();
  updateQuad();
  window.requestAnimationFrame(update);
}

function updateWorld() {
  spawn();
  var allDots = stage.redDots.concat(stage.blueDots);
  var currDot;

  for (i = 0; i < allDots.length; i++) {
    currDot = allDots[i];
    handleWallHit(currDot);
  }
};

function handleWallHit2(currDot) {
  var lastX = scene.stageWidth() - scene.dotWidth()
  if (currDot.aim === 1 && currDot.x <= 1) {
    if (! checkIfEmpty({x: lastX, y: currDot.y, width: currDot.width, height: currDot.height})) return;
    currDot.x = lastX;
  }
  if (currDot.aim === lastX && lastX <= currDot.x) {
    if (! checkIfEmpty({x: 1, y: currDot.y, width: currDot.width, height: currDot.height})) return;
    currDot.x = 1;
  }
};

function handleWallHit(currDot) {
  if (currDot.aim === 1 && currDot.x <= 1) {
    currDot.aim = scene.stageWidth() - scene.dotWidth();
  }
  if (currDot.aim === (scene.stageWidth() - scene.dotWidth()) && (scene.stageWidth() - scene.dotWidth()) <= currDot.x) {
    currDot.aim = 1;
  }
};

function reset() {
  population = 0;
  dotId = 0;
  stage = Stage(scene.stageWidth(), scene.stageHeight());
  canvas.width = stage.size.w;
  canvas.height = stage.size.h;
  quad = new QuadTree({x:0, y:0, width:stage.size.w, height:stage.size.h});
}

update();



var bindEvent = function(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        element.attachEvent('on'+type, handler);
    }
}

function dotUnderPoint(x, y) {
  var rect = canvas.getBoundingClientRect()
  var allDots = stage.redDots.concat(stage.blueDots);
  
  var offset = {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
  var dotX = x - offset.left;
  var dotY = y - offset.top;
  for (i = 0; i < allDots.length; i++) {
    currDot = allDots[i];
    if (currDot.contains(dotX, dotY)) return currDot;
  }
  return null;
};

bindEvent(canvas, "click", function (e) { console.log(dotUnderPoint(e.clientX, e.clientY)) });
