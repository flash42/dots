var Director = function(quadTree, options) {
    var director = {};
    director.quadTree = quadTree;
    director.population = 0;
    director.entityId = 0;
    
    director.spawn = function (scene) {
        // TODO set path to entity itself.
        if (options.maxPopulation() <= director.population) return;

        if (Math.random() <= 0.3) {
            var startY = Math.round(Math.random() * 1000) * options.stageHeight() / 1000
            var newDot;
            newDot = Dot(scene.dotColor, 1, startY, options, director.entityId);

            if (! director.checkIfEmpty(newDot)) return;

            director.population++;
            director.entityId++;
            scene.entities.push(newDot);
            director.quadTree.insert(newDot);
        }
    }

    director.checkIfEmpty = function (entity) {
        var candidateDots = director.quadTree.retrieve(entity);
        for (j = 0; j < candidateDots.length; j++) {
            chck = candidateDots[j];

            if (chck.intersects(entity)) {
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
        director.entityId = 0;
    }

    director.retire = function(scene) {
        for (i = scene.entities.length - 1; 0 <= i; i--) {
            entity = scene.entities[i];

            if (entity.out) {
                scene.entities.splice(i, 1);
                director.population--;
            }
        }
    }

    director.update = function(scene) {
        if (! scene.path) scene.path = new Path(options, 100);

        director.retire(scene);  
        director.spawn(scene);  
    }

    return director;
};

var Path = function(options, radius) {
    path = {};
    path.radius = radius;
    path.start = new Victor(0, options.stageHeight() / 2);

    path.end = new Victor(options.stageWidth() + radius, options.stageHeight() / 2);
    
    return path;
  }

