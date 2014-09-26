
var Stage = function(w, h) {
  var stage = {};
  stage.size = {w: w, h: h};
  stage.redBase = 1;
  stage.blueBase = (scene.stageWidth() - scene.dotWidth());
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
      toDir = calcDir(currDot);
      stepDot(currDot, toDir);
    }
        
    for (i = 0; i < stage.blueDots.length; i++) {
      currDot = stage.blueDots[i];
      toDir = calcDir(currDot);
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
    var currDot;
    for (i = 0; i < stage.redDots.length; i++) {
      currDot = stage.redDots[i];
      if (scene.highlightID() == currDot.id) ctx.fillStyle = "black";
      else ctx.fillStyle = "red";
      stage.redDots[i].draw();
      ctx.fill();
    }
    for (i = 0; i < stage.blueDots.length; i++) {
      currDot = stage.blueDots[i];
      if (scene.highlightID() == currDot.id) ctx.fillStyle = "black";
      else ctx.fillStyle = "blue";
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
    stage.clear();
    stage.fieldDraw();
    stage.dotsDraw();
  };
    
  return stage;
};
