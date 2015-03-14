
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
    dot.maxVel = 8;
    dot.maxForce = 3;
    dot.action = 0;
    // Weights
    dot.wArr = 1;
    dot.wDep = 1;
    dot.wPur = 1;
    dot.wEva = 1;
    dot.wWan = 1;
    dot.wAvo = 5;
    dot.wFlo = 1;
    dot.wCoh = 1;
    dot.wSep = 2;
    dot.wAli = 1;
    // Physics 
    var random = function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    dot.mass = options.dotRadius();
    dot.energy = 10 * random(5, 10);
    dot.pos = new Victor(startX, startY);
    dot.vel = new Victor(random(0.5, 5), random(-5, 5));
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
