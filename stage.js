
var Stage = function(w, h) {
  var stage = {};
  stage.dotColor = "red";
  stage.size = {w: w, h: h};
  stage.dots = [];
    
  stage.step = function () {
    var currDot;
    var toDir;
    
    for (i = 0; i < stage.dots.length; i++) {
      currDot = stage.dots[i];
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
    for (i = 0; i < stage.dots.length; i++) {
      currDot = stage.dots[i];
      if (scene.highlightID() == currDot.id) ctx.fillStyle = "green";
      else ctx.fillStyle = stage.dotColor;
      stage.dots[i].draw();
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
