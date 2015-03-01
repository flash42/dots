
var Dot = function(color, startX, startY, options, dotId) {
  var dot = {};
  var sgn = Math.round(Math.random() * 10) % 2 == 1 ? 1 : -1;
  dot.speed = 1 + Math.round(Math.random() * 10) * 0.04 * sgn;
  dot.id = dotId;
  dot.radius = options.dotRadius();
  dot.x = startX;
  dot.found = 0;
  dot.y = startY
  dot.color = color;
  dot.aim = options.stageWidth() - options.dotRadius();
  
  dot.move = function(toX, toY) {
    dot.x = toX;
    dot.y = toY;
  };
  
  dot.contains = function(x, y) {
    return dot.x <= x && x <= dot.x + dot.radius && dot.y <= y && y <= dot.y + dot.radius
  };
  
  dot.intersects = function(otherDot) {
    if (dot.id === otherDot.id) return false;  
        
    return Math.abs(dot.x - otherDot.x) < dot.radius 
        && Math.abs(dot.y - otherDot.y) < dot.radius;
  };
    
  dot.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius / 2, 0, 2*Math.PI);
    ctx.closePath();
  };
    
  return dot;
};
