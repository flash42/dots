var Renderer = function(scene) {
    var renderer = {};
    renderer.scene = scene;

    renderer.fieldDraw = function() {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = "1";
        ctx.rect(0, 0, renderer.scene.size.w, renderer.scene.size.h);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    renderer.dotsDraw = function() {
        var currDot;
        for (i = 0; i < renderer.scene.entities.length; i++) {
            currDot = renderer.scene.entities[i];
            // if (scene.highlightID() == currDot.id) ctx.fillStyle = "green";
            ctx.fillStyle = renderer.scene.dotColor;
            renderer.scene.entities[i].draw();
            ctx.fill();
        }
    };

    renderer.clear = function() {
        ctx.save();
        ctx.clearRect(0, 0, renderer.scene.size.w, renderer.scene.size.h);
        ctx.fill();
        ctx.restore(); 
    };

    renderer.setScene = function(scene) {
        renderer.scene = scene;
    }

    renderer.render = function() {
        renderer.clear();
        renderer.fieldDraw();
        renderer.dotsDraw();
    };

    return renderer;
};

