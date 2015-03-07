
var Dot = function(color, startX, startY, options, dotId) {
    var dot = {};
    dot.speed = 1;
    dot.id = dotId;
    dot.radius = options.dotRadius();
    dot.x = startX;
    dot.y = startY
    dot.color = color;
    dot.aim = {x: 400, y: 400};
    dot.dir = {x: 1, y: 0};
    dot.collision = false;
    dot.wallHit = false;

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
