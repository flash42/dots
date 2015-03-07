var PathPlannerSystem = function(options, quadTree) {
    var pathPlannerSystem = {};
    pathPlannerSystem.quadTree = quadTree;


    pathPlannerSystem.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.dir = pathPlannerSystem.calcDir(entity);
        }
    };
    
    pathPlannerSystem.calcDir = function (entity) {
        if (! entity.collision && !entity.wallHit) {
             return entity.dir;
        } 
        return {x: -entity.dir.x, y: -entity.dir.y};
    }
    
    pathPlannerSystem.setQuadTree = function(quadTree) {
        collisionSystem.quadTree = quadTree;
    }

    return pathPlannerSystem;
};
