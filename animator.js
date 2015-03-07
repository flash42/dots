var Animator = function(options, quadTree) {
    var animator = {};
    animator.quadTree = quadTree;
    
    animator.stepEntity = function(entity) {
        entity.x += entity.dir.x;
        entity.y += entity.dir.y; 
    };
    
    animator.calcDir = function(entity) {
        if (animator.isHitWall(entity)) {
            return {x: -entity.dir.x, y: -entity.dir.y};
        }

        return entity.dir;
    };

    animator.isHitWall = function (entity) {
        return options.stageWidth() <= entity.x + entity.dir.x * entity.speed ||
        options.stageHeight() <= entity.y + entity.dir.y * entity.speed || 
        0 >= entity.x + entity.dir.x * entity.speed ||
        0 >= entity.y + entity.dir.y * entity.speed   
    };

    animator.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.dir = animator.calcDir(entity);
            animator.stepEntity(entity);
        }
    };
    
    animator.setQuadTree = function(quadTree) {
        animator.quadTree = quadTree;
    }

    return animator;
};
