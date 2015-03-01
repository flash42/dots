var Director = function(quadTree) {
    var director = {};
    director.quadTree = quadTree;
    
    director.spawn = function () {
        if (options.maxPopulation() <= population) return;
        if (Math.random() <= 0.3) {
            population++;
            var startY = Math.round(Math.random() * 1000) * options.stageHeight() / 1000
            var newDot;
            newDot = Dot(scene.dotColor, 1, startY, options);
            if (! director.checkIfEmpty(newDot)) return;
            scene.entities.push(newDot);

            director.quadTree.insert(newDot);
        }
    }

    director.checkIfEmpty = function (currDot) {
        var candidateDots = director.quadTree.retrieve(currDot);
        for (j = 0; j < candidateDots.length; j++) {
            chck = candidateDots[j];

            if (chck.intersects(currDot)) {
                return false;
            }
        }
        return true;
    };
    
    director.setQuadTree = function(quadTree) {
        director.quadTree = quadTree;
    }

    director.update = function(scene) {
        director.spawn();  
    }

    return director;
};

