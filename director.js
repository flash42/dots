var Director = function(quadTree, options) {
    var director = {};
    director.quadTree = quadTree;
    population = 0;
    dotId = 0;
    
    director.spawn = function (scene) {
        if (options.maxPopulation() <= director.population) return;
        if (Math.random() <= 0.3) {
            director.population++;
            var startY = Math.round(Math.random() * 1000) * options.stageHeight() / 1000
            var newDot;
            newDot = Dot(scene.dotColor, 1, startY, options);
            director.dotId++;
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

    director.reset = function() {
        director.population = 0;
        director.dotId = 0;
    }

    director.update = function(scene) {
        director.spawn(scene);  
    }

    return director;
};

