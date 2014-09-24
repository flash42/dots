var canvas = document.getElementById('canv-1');
var ctx = canvas.getContext('2d');
var dotId = 0;

var Dot = function(color, startX, startY) {
  var dot = {};
  dot.speed = 1 + Math.round(Math.random() * 10) * 0.1;
  dot.id = dotId;
  dotId++;
  dot.width = 15;
  dot.height = 3;
  dot.x = startX;
  dot.y = startY

  dot.aim = color === "red" ? 494 : 1;
  dot.move = function(toX, toY) {
    dot.x = toX;
    dot.y = toY;
  };
  dot.intersects = function(otherDot) {
    var intersX = false;
    var intersY = false;
    if (dot.x < otherDot.x && otherDot.x <= dot.x + dot.width) {
      intersX = true; 
    }
    if (otherDot.x < dot.x && dot.x <= otherDot.x + otherDot.width ) {
      intersX = true; 
    }
    if (dot.y <= otherDot.y && otherDot.y <= dot.y + dot.height) {
      intersY = true; 
    }
    if (otherDot.y <= dot.y && dot.y <= otherDot.y + otherDot.height) {
      intersY = true;
    }
        
    return intersX && intersY;
  };  
  dot.draw = function() {
    ctx.beginPath();
    ctx.rect(dot.x, dot.y, dot.width, dot.height);
    ctx.closePath();
  };
  return dot;
};

var stepDot = function(dotToStep, dir) {
  if (dir === 1) {
    dotToStep.move(dotToStep.x, dotToStep.y + dotToStep.speed);
  }
  if (dir === 2) {
    dotToStep.move(dotToStep.x + dotToStep.speed, dotToStep.y);
  }
  if (dir === 3) {
    dotToStep.move(dotToStep.x, dotToStep.y - dotToStep.speed);
  }
  if (dir === 4) {
    dotToStep.move(dotToStep.x - dotToStep.speed, dotToStep.y);
  }
    
  // Move out to after-step-logic
  if (dotToStep.aim === 1 && dotToStep.x <= 1) {
    dotToStep.aim = 494;
  }
  if (dotToStep.aim === 494 && 494 <= dotToStep.x) {
    dotToStep.aim = 1;
  }
};

var calcDir = function(currDot, otherDots) {
  var chck;
  var toDir = 0;
  // TODO increase to dir

  var candidateDots = quad.retrieve(currDot);
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];
        
    if (chck.intersects(currDot)) {
      return Math.random() <= 0.5 ? 1 : 3;
    }
  }
  
  if (currDot.x <= currDot.aim) return 2;
  if (currDot.aim <= currDot.x) return 4;
};


var Stage = function(w, h) {
  var stage = {};
  stage.size = {w: w, h: h};
  stage.redBase = 1;
  stage.blueBase = 494;
  stage.redDots = [];
  stage.blueDots = [];
    
  stage.step = function () {
    var currDot;
    var toDir;
    var chck;
    var steppedDot;
    var allDots = stage.redDots.concat(stage.blueDots);
    
    for (i = 0; i < stage.redDots.length; i++) {
      currDot = stage.redDots[i];
      toDir = calcDir(currDot, allDots);
      stepDot(currDot, toDir);
    }
        
    for (i = 0; i < stage.blueDots.length; i++) {
      currDot = stage.blueDots[i];
      toDir = calcDir(currDot, allDots);
      stepDot(currDot, toDir);
    }     
  };
    
  stage.fieldDraw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = "1";
    ctx.rect(0, 0, stage.size.w, stage. size.h);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
    
  stage.dotsDraw = function() {
    
    for (i = 0; i < stage.redDots.length; i++) {
      ctx.fillStyle = "red";
      stage.redDots[i].draw();
      ctx.fill();
    }
    for (i = 0; i < stage.blueDots.length; i++) {
      ctx.fillStyle = "blue";
      stage.blueDots[i].draw();
      ctx.fill();
    }
  };
    
  stage.clear = function() {
    ctx.save();
    ctx.clearRect(0, 0, stage.size.w, stage.size.h);
    ctx.fill();
    ctx.restore(); 
  };

  stage.draw = function() {
    stage.fieldDraw();
    stage.dotsDraw();
  };
    
  return stage;
};
var stage = Stage(500, 500);


// ++++++++++++++
// Initialization +
// ++++++++++++++
var quad = new QuadTree({
    x:0,
    y:0,
    width:stage.size.w,
    height:stage.size.h
});

var MAX_POPULATION = 1200;
var pupulation = 0;

function spawn() {
  if (MAX_POPULATION <= pupulation) return;
  if (Math.random() <= 1) {
    pupulation++;
    var startY = Math.round(Math.round(Math.random() * 1000) / 2) - 1;
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

draw();
