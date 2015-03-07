var CollisionSystem = function(options, quadTree) {
    var collisionSystem = {};
    collisionSystem.quadTree = quadTree;

    
    collisionSystem.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            collisionSystem.checkCollision(entity);
        }
    };
    
    collisionSystem.checkCollision = function(entity) {
        entity.wallHit = collisionSystem.isHitWall(entity);
        entity.collision = collisionSystem.isCollision(entity);
    };

    collisionSystem.isHitWall = function (entity) {
        return options.stageWidth() <= entity.x + entity.dir.x * entity.speed ||
        options.stageHeight() <= entity.y + entity.dir.y * entity.speed || 
        0 >= entity.x + entity.dir.x * entity.speed ||
        0 >= entity.y + entity.dir.y * entity.speed   
    };
    
    collisionSystem.isCollision = function (entity) {
        return false;   
    };
    
    collisionSystem.setQuadTree = function(quadTree) {
        collisionSystem.quadTree = quadTree;
    }

    return collisionSystem;
};
