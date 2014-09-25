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
  if (dir === DIR_UP && scene.dotWidth() + 1 < dotToStep.y) {
    dotToStep.move(dotToStep.x, dotToStep.y - dotToStep.speed);
  }
  if (dir === DIR_LEFT) {
    dotToStep.move(dotToStep.x - dotToStep.speed, dotToStep.y);
  }
    
  // Move out to after-step-logic
  if (dotToStep.aim === 1 && dotToStep.x <= 1) {
    dotToStep.aim = scene.stageWidth() - scene.dotWidth();
  }
  if (dotToStep.aim === (scene.stageWidth() - scene.dotWidth()) && (scene.stageWidth() - scene.dotWidth()) <= dotToStep.x) {
    dotToStep.aim = 1;
  }
};

var calcDir = function(currDot, otherDots) {
  var chck;
  var toDir = 0;

  var candidateDots = quad.retrieve(currDot);
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];
        
    if (chck.intersects(currDot)) {
      
      var randomDirSeed = Math.random();
      if (randomDirSeed < 0.04) currDot.aim === (scene.stageWidth() - scene.dotWidth()) ? currDot.aim = 1 : currDot.aim = (scene.stageWidth() - scene.dotWidth());
      if (randomDirSeed < 0.33) return DIR_DOWN;
      if (randomDirSeed < 0.66) return DIR_UP;
      return 0;
    }
  }
  
  if (currDot.x <= currDot.aim) return DIR_RIGHT;
  if (currDot.aim <= currDot.x) return DIR_LEFT;
};

function spawn() {
  if (scene.maxPopulation() <= population) return;
  if (Math.random() <= 1) {
    population++;
    var startY = Math.round(Math.random() * 1000) * scene.stageHeight() / 1000
    var newDot;

    if (Math.random() <= 0.5) {
      newDot = Dot("red", stage.redBase, startY);
      stage.redDots.push(newDot);  
    } else {
      newDot = Dot("blue", stage.blueBase, startY);
      stage.blueDots.push(newDot);
    }
    
    quad.insert(newDot);
  }
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
