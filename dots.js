var STAGE_WIDTH = 700;
var STAGE_HEIGHT = 500;
var DOT_RADIUS = 12;

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


var Options = function (max_population, stage_width, stage_height, dot_radius) {
  this.changeHandler = function(newValue) {
    reset();
  }
  this.highlightID = ko.numericObservable(-1);
  this.maxPopulation = ko.numericObservable(max_population);
  this.stageWidth = ko.numericObservable(stage_width);
  this.stageHeight = ko.numericObservable(stage_height);
  this.dotRadius = ko.numericObservable(dot_radius);
  this.maxPopulation.subscribe(this.changeHandler);
  this.stageWidth.subscribe(this.changeHandler);
  this.stageHeight.subscribe(this.changeHandler);
  this.dotRadius.subscribe(this.changeHandler);
};

var options = new Options(MAX_POPULATION, STAGE_WIDTH, STAGE_HEIGHT, DOT_RADIUS)
ko.applyBindings(options);

// ++++++++++++++
// Initialization +
// ++++++++++++++
  
var population = 0;
var stage = Stage(options.stageWidth(), options.stageHeight());
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
  if (dir === DIR_DOWN && dotToStep.y < options.stageWidth() - options.
      dotRadius()) {
    dotToStep.move(dotToStep.x, dotToStep.y + dotToStep.speed);
  }
  if (dir === DIR_RIGHT) {
    dotToStep.move(dotToStep.x + dotToStep.speed, dotToStep.y);
  }
  if (dir === DIR_UP && options.dotRadius() + dotToStep.speed < dotToStep.y) {
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
  //var candidateDots = stage.blueDots.concat(stage.dots);
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
  if (options.maxPopulation() <= population) return;
  if (Math.random() <= 0.3) {
    population++;
    var startY = Math.round(Math.random() * 1000) * options.stageHeight() / 1000
    var newDot;
    newDot = Dot(stage.dotColor, 1, startY, options);
    if (! checkIfEmpty(newDot)) return;
    stage.dots.push(newDot);
    
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
  var currDot;
  for (i = 0; i < stage.dots.length; i++) {
    currDot = stage.dots[i];
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
  var currDot;
  for (i = 0; i < stage.dots.length; i++) {
    currDot = stage.dots[i];
    handleWallHit(currDot);
  }
};

function handleWallHit(currDot) {
  if (currDot.aim === 1 && currDot.x <= 1) {
    currDot.aim = options.stageWidth() - options.dotRadius();
  }
  if (currDot.aim === (options.stageWidth() - options.dotRadius()) && (options.stageWidth() - options.dotRadius()) <= currDot.x) {
    currDot.aim = 1;
  }
};

function reset() {
  population = 0;
  dotId = 0;
  stage = Stage(options.stageWidth(), options.stageHeight());
  canvas.width = stage.size.w;
  canvas.height = stage.size.h;
  quad = new QuadTree({x:0, y:0, width:stage.size.w, height:stage.size.h});
}



var bindEvent = function(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        element.attachEvent('on'+type, handler);
    }
}

function dotUnderPoint(x, y) {
  var rect = canvas.getBoundingClientRect()
  
  var offset = {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
  var dotX = x - offset.left;
  var dotY = y - offset.top;
  for (i = 0; i < stage.dots.length; i++) {
    currDot = stage.dots[i];
    if (currDot.contains(dotX, dotY)) return currDot;
  }
  return null;
};

bindEvent(canvas, "click", function (e) { console.log(dotUnderPoint(e.clientX, e.clientY)) });
update();
