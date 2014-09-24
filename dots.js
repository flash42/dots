var canvas = document.getElementById('canv-1');
var ctx = canvas.getContext('2d');

var Dot = function(color, startX, startY) {
    var dot = {};
    dot.size = 12;
    dot.pos = {x: startX, y: startY};
    dot.aim = color === "red" ? 494 : 1;
    dot.move = function(toX, toY) {
        dot.pos.x = toX;
        dot.pos.y = toY;
    };
    dot.intersects = function(otherDot) {
        var intersX = false;
        var intersY = false;
        if (dot.pos.x < otherDot.pos.x && otherDot.pos.x <= dot.pos.x + dot.size) {
            intersX = true; 
        }
        if (otherDot.pos.x < dot.pos.x && dot.pos.x <= otherDot.pos.x + otherDot.size ) {
            intersX = true; 
        }
        if (dot.pos.y <= otherDot.pos.y && otherDot.pos.y <= dot.pos.y + dot.size) {
            intersY = true; 
        }
        if (otherDot.pos.y <= dot.pos.y && dot.pos.y <= otherDot.pos.y + otherDot.size ) {
            intersY = true;
        }
        
        return intersX && intersY;
    };  
    dot.draw = function() {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(dot.pos.x, dot.pos.y, dot.size, dot.size);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };
    return dot;
};

var stepDot = function(dotToStep, dir) {
    if (dir === 1) {
        dotToStep.move(dotToStep.pos.x, dotToStep.pos.y + 1);
    }
    if (dir === 2) {
        dotToStep.move(dotToStep.pos.x + 1, dotToStep.pos.y);
    }
    if (dir === 3) {
        dotToStep.move(dotToStep.pos.x, dotToStep.pos.y - 1);
    }
    if (dir === 4) {
        dotToStep.move(dotToStep.pos.x - 1, dotToStep.pos.y);
    }
    
    // Move out to after-step-logic
    if (dotToStep.aim === dotToStep.pos.x) {
        dotToStep.aim = dotToStep.aim === 1 ? 494 : 1;
    }
    
};

var calcDir = function(currDot, otherDots) {
    var chck;
    var toDir = 0;
    // TODO increase to dir
    var steppedDot = {size: currDot.size, pos: {x: currDot.pos.x, y: currDot.pos.y}};
    for (j = 0; j < otherDots.length; j++) {
        chck = otherDots[j];
        
        if (chck.intersects(steppedDot)) {
            
            return Math.random() <= 0.5 ? 1 : 3;
        }
        
    }
    if (currDot.pos.x <= currDot.aim) return 2;
    if (currDot.aim <= currDot.pos.x) return 4;
};

var Stage = function(w, h) {
    var stage = {};
    stage.size = {w: w, h: h};
    stage.redBase = 1;
    stage.blueBase = 494;
    stage.redDots = [];
    stage.blueDots = [];
    
    stage.step = function () {
        var currDot;
        var toDir;
        var chck;
        var steppedDot;
        
        for (i = 0; i < stage.redDots.length; i++) {
            currDot = stage.redDots[i];
            toDir = calcDir(currDot, stage.blueDots);
            stepDot(currDot, toDir);
        }
        
        for (i = 0; i < stage.blueDots.length; i++) {
            currDot = stage.blueDots[i];
            toDir = calcDir(currDot, stage.redDots);
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
        for (i = 0; i < stage.redDots.length; i++) {
            stage.redDots[i].draw();
        }
        for (i = 0; i < stage.blueDots.length; i++) {
            stage.blueDots[i].draw();
        }
    };
    
    stage.clear = function() {
        ctx.save();
        ctx.clearRect(0, 0, stage.size.w, stage.size.h);
        ctx.fill();
        ctx.restore(); 
    };

    stage.draw = function() {
        stage.fieldDraw();
        stage.dotsDraw();
    };
    
    return stage;
};
var stage = Stage(500, 500);

stage.redDots = [Dot("red", stage.redBase, 0), Dot("red", stage.redBase, 30), Dot("red", stage.redBase, 33), Dot("red", stage.redBase, 58)];
stage.blueDots = [Dot("blue", stage.blueBase, 0), Dot("blue", stage.blueBase, 3), Dot("blue", stage.blueBase, 3), Dot("blue", stage.blueBase, 27), Dot("blue", stage.blueBase, 30), Dot("blue", stage.blueBase, 60)];


var MAX_POPULATION = 150;
var pupulation = 0;
function spawn() {
    if (MAX_POPULATION <= pupulation) return;
    if (Math.random() <= 0.05) {
        pupulation++;
        if (Math.random() <= 0.5) {
            stage.redDots.push(Dot("red", stage.redBase, Math.round(Math.round(Math.random() * 1000) / 2) - 1));  
        }
        else {
            stage.blueDots.push(Dot("blue", stage.blueBase, Math.round(Math.round(Math.random() * 1000) / 2) - 1));
        }
    }
}

function draw() {
    spawn();
    stage.clear();
    stage.draw();
    stage.step();
    
    window.requestAnimationFrame(draw);
}

draw();

