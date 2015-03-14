var PathPlannerSystem = function(options, quadTree) {
    var pathPlannerSystem = {};
    pathPlannerSystem.quadTree = quadTree;


    pathPlannerSystem.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.acc = pathPlannerSystem.calcAccel(entity);
        }
    };
    var zeroAcc = new Victor(0, 0);
    pathPlannerSystem.calcAccel = function (entity) { // TODO calc acceleration instead.
        if (! entity.collision && !entity.wallHit) {
             return zeroAcc;
        } 
        return entity.vel
            .clone()
            .invert()
            .mulScalar(2, 2)
            .limitMag(entity.maxForce);
    }
    
    pathPlannerSystem.setQuadTree = function(quadTree) {
        pathPlannerSystem.quadTree = quadTree;
    }

    return pathPlannerSystem;
};
