
var Dot = function(color, startX, startY, options, dotId) {
    var dot = {};
    dot.speed = 1;
    dot.id = dotId;
    dot.radius = options.dotRadius();
    dot.width = options.dotRadius();
    dot.height = options.dotRadius();
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
    
    dot.drawIndicator = function(ctx) {
        var indicatorLength = dot.radius;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(dot.x + dot.dir.x * indicatorLength, dot.y + dot.dir.y * indicatorLength);
        ctx.closePath();
    };

    return dot;
};
