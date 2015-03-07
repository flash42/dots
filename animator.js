var Animator = function(options, quadTree) {
    var animator = {};
    animator.quadTree = quadTree;

    animator.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            animator.stepEntity(entity);
        }
    };
    
    animator.stepEntity = function(entity) {
        entity.x += entity.dir.x;
        entity.y += entity.dir.y; 
    };
    
    animator.setQuadTree = function(quadTree) {
        animator.quadTree = quadTree;
    }

    return animator;
};
