
var Dot = function(color, startX, startY, options, dotId) {
    var dot = {};
    dot.speed = 1;
    dot.id = dotId;
    dot.radius = options.dotRadius();
    dot.width = options.dotRadius();
    dot.height = options.dotRadius();
   
    dot.color = color;
    dot.baseColor = color;
    dot.aim = {x: 400, y: 400};
    dot.collision = false;
    dot.out = false;
    dot.maxVel = 2;
    dot.maxForce = 0.7;
    dot.action = 0;

    // TODO Move out values to components and add them from director
    
    // Physics 
    var random = function (min,max) {
        var val = Math.floor(Math.random()*(max-min+1)+min);
        if (val === 0) return 1;
        return val;
    }
    
    dot.mass = options.dotRadius();
    dot.energy = 10 * random(5, 10);
    dot.pos = new Victor(startX, startY);
    dot.vel = new Victor(random(0, 5), random(-5, 5));
    dot.acc = new Victor();
    dot.wdelta = 0.0;
    dot.action = 0;

    dot.contains = function(x, y) {
        return dot.pos.x <= x && x <= dot.pos.x + dot.radius && dot.pos.y <= y && y <= dot.pos.y + dot.radius
    };

    dot.intersects = function(otherDot) {
        if (dot.id === otherDot.id) return false;  

        return Math.abs(dot.pos.x - otherDot.pos.x) < dot.radius 
            && Math.abs(dot.pos.y - otherDot.pos.y) < dot.radius;
    };

    dot.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(dot.pos.x, dot.pos.y, dot.radius, 0, 2*Math.PI);
        ctx.closePath();
    };
    
    dot.drawIndicator = function(ctx) {
        var indicatorLength = dot.radius / 2;
        ctx.beginPath();
        ctx.moveTo(dot.pos.x, dot.pos.y);
        ctx.lineTo(dot.pos.x + dot.vel.x * indicatorLength, dot.pos.y + dot.vel.y * indicatorLength);
        ctx.closePath();
    };
    
    

    return dot;
};
