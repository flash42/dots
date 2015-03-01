var Renderer = function() {
    var renderer = {};

    renderer.fieldDraw = function(scene, ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = "1";
        ctx.rect(0, 0, scene.size.w, scene.size.h);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    renderer.drawScene = function(scene, ctx) {
        var entity;
        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            // if (scene.highlightID() == currDot.id) ctx.fillStyle = "green";
            ctx.fillStyle = entity.color;
            scene.entities[i].draw(ctx);
            ctx.fill();
        }
    };

    renderer.clear = function(scene, ctx) {
        ctx.save();
        ctx.clearRect(0, 0, scene.size.w, scene.size.h);
        ctx.fill();
        ctx.restore(); 
    };

    renderer.setScene = function(scene) {
        renderer.scene = scene;
    }

    renderer.render = function(scene, ctx) {
        renderer.clear(scene, ctx);
        renderer.fieldDraw(scene, ctx);
        renderer.drawScene(scene, ctx);
    };

    return renderer;
};


