var CollisionSystem = function(options, quadTree) {
    var collisionSystem = {};
    collisionSystem.quadTree = quadTree;

    
    collisionSystem.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            collisionSystem.checkCollision(entity, scene);
        }
    };
    
    collisionSystem.checkCollision = function(entity, scene) {
        entity.wallHit = collisionSystem.isHitWall(entity);
        entity.collision = collisionSystem.isCollision(entity, scene);
    };

    collisionSystem.isHitWall = function (entity) {
        return options.stageWidth() <= entity.pos.x + entity.vel.x * entity.speed ||
        options.stageHeight() <= entity.pos.y + entity.vel.y * entity.speed || 
        0 >= entity.pos.x + entity.vel.x * entity.speed ||
        0 >= entity.pos.y + entity.vel.y * entity.speed   
    };
    
    collisionSystem.isCollision = function (entityToCheck, scene) {
        var entitiesInQuadrant = collisionSystem.quadTree.retrieve(entityToCheck);
        var candidateEntities = entitiesInQuadrant.filter(function(e) { return e.id != entityToCheck.id; });
        
        for (j = 0; j < candidateEntities.length; j++) {
            currEntity = candidateEntities[j];

            if (currEntity.intersects(entityToCheck)) {
                return true;
            }
        }
        return false;   
    };
    
    collisionSystem.setQuadTree = function(quadTree) {
        collisionSystem.quadTree = quadTree;
    }

    return collisionSystem;
};
