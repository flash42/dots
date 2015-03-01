var QuadTreeSystem = function(quadTree, scene) {
    var quadTreeSystem = {};
    quadTreeSystem.quadTree = quadTree;
    quadTreeSystem.scene = scene;

    quadTreeSystem.update = function(scene) {
        quadTreeSystem.quadTree.clear();
        var currDot;
        for (i = 0; i < quadTreeSystem.scene.entities.length; i++) {
            currDot = quadTreeSystem.scene.entities[i];
            quadTreeSystem.quadTree.insert(currDot);
        }  
    }

    quadTreeSystem.setQuadTree = function (quadTree) {
        quadTreeSystem.quadTree = quadTree;
    }
    
    quadTreeSystem.setScene = function (scene) {
        quadTreeSystem.scene = scene;
    }

    return quadTreeSystem;
};
