
var Dot = function(color, startX, startY) {
  var dot = {};
  var sgn = Math.round(Math.random() * 10) % 2 == 1 ? 1 : -1;
  dot.speed = 1 + Math.round(Math.random() * 10) * 0.04 * sgn;
  dot.id = dotId;
  dotId++;
  dot.width = scene.dotWidth();
  dot.height = scene.dotHeight();
  dot.x = startX;
  dot.y = startY
  dot.color = color;
  dot.aim = color === "red" ? scene.stageWidth() - scene.dotWidth() : 1;
  dot.move = function(toX, toY) {
    dot.x = toX;
    dot.y = toY;
  };
  dot.intersects = function(otherDot) {
    if (dot.id === otherDot.id) return false;  
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
