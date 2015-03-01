var QuadTreeSystem = function(quadTree) {
    var quadTreeSystem = {};
    quadTreeSystem.quadTree = quadTree;

    quadTreeSystem.update = function(scene) {
        quadTreeSystem.quadTree.clear();
        var currDot;
        for (i = 0; i < scene.entities.length; i++) {
            currDot = scene.entities[i];
            quadTreeSystem.quadTree.insert(currDot);
        }  
    }

    quadTreeSystem.setQuadTree = function (quadTree) {
        quadTreeSystem.quadTree = quadTree;
    }

    return quadTreeSystem;
};
