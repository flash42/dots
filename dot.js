
var Dot = function(color, startVel, startPos, options, dotId, path) {
    var dot = {};
    dot.id = dotId;
    dot.radius = options.dotRadius();
    dot.width = options.dotRadius();
    dot.height = options.dotRadius();
   
    dot.color = color;
    dot.baseColor = color;
    dot.aim = {x: 400, y: 400};
    dot.collision = false;
    dot.out = false;
    dot.maxVel = 0.6;
    dot.maxForce = 0.11;
    dot.path = path;

    // TODO Move out values to components and add them from director
    
    // Physics 
    var random = function (min,max) {
        var val = Math.floor(Math.random()*(max-min+1)+min);
        if (val === 0) return 1;
        return val;
    }
    
    dot.mass = options.dotRadius();
    dot.energy = 10 * random(5, 10);
    dot.pos = Victor.v(startPos);
    dot.vel = startVel;//new Victor(0, 0); // random(0, 5), random(-5, 5)
    dot.acc = new Victor();

    dot.intersects = function(otherDot) {
        if (dot.id === otherDot.id) return false;  

        return dot.pos.distance(otherDot.pos) < (dot.radius + otherDot.radius);
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
