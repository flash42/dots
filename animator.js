var Animator = function(options, quadTree) {
    var animator = {};
    animator.quadTree = quadTree;

    animator.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            animator.stepEntity(entity);
            animator.setupStyle(entity);
        }
    };

    animator.stepEntity = function(entity) {
        entity.x += entity.dir.x;
        entity.y += entity.dir.y; 
    };    

    animator.setupStyle = function(entity) {
        var currMillis = new Date().getTime();
        if (entity.collision || entity.wallHit) {
            entity.color = "#A9D0F5";
            entity.colorAnimationStart = currMillis;
            return;
        }
        if (entity.colorAnimationStart && entity.colorAnimationStart + 70 < currMillis) {
            entity.colorAnimationStart = null;
            return;
        }
        if (! entity.colorAnimationStart)
            entity.color = entity.baseColor;
    };

    animator.setQuadTree = function(quadTree) {
        animator.quadTree = quadTree;
    }

    return animator;
};
