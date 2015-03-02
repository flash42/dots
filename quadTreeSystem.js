var QuadTreeSystem = function(quadTree) {
    var quadTreeSystem = {};
    quadTreeSystem.quadTree = quadTree;

    quadTreeSystem.update = function(scene) {
        quadTreeSystem.quadTree.clear();
        var entity;
        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            quadTreeSystem.quadTree.insert(entity);
        }  
    }

    quadTreeSystem.setQuadTree = function (quadTree) {
        quadTreeSystem.quadTree = quadTree;
    }

    return quadTreeSystem;
};
