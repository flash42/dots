var PathPlannerSystem = function(options, quadTree) {
    var pathPlannerSystem = {};
    pathPlannerSystem.quadTree = quadTree;


    pathPlannerSystem.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.vel = pathPlannerSystem.calcVel(entity);
        }
    };
    
    pathPlannerSystem.calcVel = function (entity) { // TODO calc acceleration instead.
        if (! entity.collision && !entity.wallHit) {
             return entity.vel;
        } 
        return entity.vel.invert();
    }
    
    pathPlannerSystem.setQuadTree = function(quadTree) {
        pathPlannerSystem.quadTree = quadTree;
    }

    return pathPlannerSystem;
};
