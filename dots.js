var STAGE_WIDTH = 500;
var STAGE_HEIGHT = 500;

var DOT_WIDTH = 15;
var DOT_HEIGHT = 3;

var MAX_POPULATION = 300;

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
    
  // TODO Wall hit event-handler
  if (dotToStep.aim === 1 && dotToStep.x <= 1) {
    dotToStep.aim = scene.stageWidth() - scene.dotWidth();
  }
  if (dotToStep.aim === (scene.stageWidth() - scene.dotWidth()) && (scene.stageWidth() - scene.dotWidth()) <= dotToStep.x) {
    dotToStep.aim = 1;
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
  
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];

    if (chck.intersects({id: currDot.id, x: currDot.x + deltaX, y: currDot.y, width: currDot.width, height: currDot.height})) {
      canStep = false;
    }
  }
  
  if (canStep) {
    currDot.stalled = 0;
    if (currDot.x <= currDot.aim) return DIR_RIGHT;
    if (currDot.aim <= currDot.x) return DIR_LEFT;
  } else {
    var randomDirSeed = Math.random();
    var deltaY = 0;
    var dir;
    deltaX = 0;
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

    if (Math.random() <= 0.5) {
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
}

function updateQuad() {
  var allDots = stage.redDots.concat(stage.blueDots);
  var currDot;
  for (i = 0; i < allDots.length; i++) {
    currDot = allDots[i];
    quad.insert(currDot);
  }
}

function draw() {
  spawn();
  stage.clear();
  stage.draw();
  stage.step();
  quad.clear();
  updateQuad();
  window.requestAnimationFrame(draw);
}

function reset() {
  population = 0;
  dotId = 0;
  stage = Stage(scene.stageWidth(), scene.stageHeight());
  canvas.width = stage.size.w;
  canvas.height = stage.size.h;
  quad = new QuadTree({x:0, y:0, width:stage.size.w, height:stage.size.h});
}

draw();
