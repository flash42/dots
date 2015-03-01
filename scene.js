
var Scene = function(w, h) {
  var scene = {};
  scene.dotColor = "red";
  scene.size = {w: w, h: h};
  scene.dots = [];
    
  scene.step = function () {
    var currDot;
    var toDir;
    
    for (i = 0; i < scene.dots.length; i++) {
      currDot = scene.dots[i];
      toDir = calcDir(currDot);
      stepDot(currDot, toDir);
    }
  };
    
  scene.fieldDraw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = "1";
    ctx.rect(0, 0, scene.size.w, scene. size.h);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
    
  scene.dotsDraw = function() {
    var currDot;
    for (i = 0; i < scene.dots.length; i++) {
      currDot = scene.dots[i];
      // if (scene.highlightID() == currDot.id) ctx.fillStyle = "green";
      ctx.fillStyle = scene.dotColor;
      scene.dots[i].draw();
      ctx.fill();
    }
  };
    
  scene.clear = function() {
    ctx.save();
    ctx.clearRect(0, 0, scene.size.w, scene.size.h);
    ctx.fill();
    ctx.restore(); 
  };

  scene.draw = function() {
    scene.clear();
    scene.fieldDraw();
    scene.dotsDraw();
  };
    
  return scene;
};
