var Director = function(quadTree, options) {
    var director = {};
    director.quadTree = quadTree;
    director.population = 0;
    director.entityId = 0;
    var random = function (min,max) {
        var val = Math.floor(Math.random()*(max-min+1)+min);
        if (val === 0) return 1;
        return val;
    }
    director.spawn = function (scene) {
        if (options.maxPopulation() <= director.population) return;

        if (Math.random() <= 0.35) {
            var orientation = Math.random() <= 0.66 ? "horizontal" : "vertical";
            var startPos;
            if (orientation === "horizontal") {
                var startX = Math.random() <= 0.5 ? 1 : options.stageWidth() - 1;
                startPos = new Victor(startX, 0);    
            } else {
                var startY = 1;
                var startX = random(0, options.stageWidth()); 
                startPos = new Victor(startX, startY);    
            }

            var closestPath;
            if (startPos.x === 1) closestPath = scene.paths[0];
            else if (startPos.x === (options.stageWidth() - 1)) closestPath = scene.paths[1];
            else closestPath = scene.paths[2];
            
            if (orientation === "horizontal") {
                var corrY;
                if (startPos.x === 1) {
                    corrY = random(0, options.stageHeight());
                } else {
                    corrY = random(options.stageHeight() * 0.4, options.stageHeight());
                }
                
                startPos = new Victor(startPos.x, corrY)
            }

            newDot = Dot(scene.dotColor, Victor.v(closestPath.end).subtract(startPos), startPos, options, director.entityId, closestPath);

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
        if (! scene.paths) { 
            scene.paths = [];
            scene.paths.push(new LeftToRightPath(options, 40, options.stageHeight() / 2, options.stageHeight() / 2));
            scene.paths.push(new RightToLeftPath(options, 40, 100, options.stageHeight() - 150));
            scene.paths.push(new TopToBottomPath(options, 40, 100, options.stageWidth() / 2));
        }
        director.retire(scene);  
        director.spawn(scene);  
    }

    return director;
};


var LeftToRightPath = function(options, radius, distanceFromStage, yCoord) {
    path = {};

    path.radius = radius;
    path.start = new Victor(-100, yCoord);
    path.end = new Victor(options.stageWidth() + 400, yCoord);

    return path;
}
var TopToBottomPath = function(options, radius, distanceFromStage, xCoord) {
    path = {};

    path.radius = radius;
    path.start = new Victor(xCoord, -150);
    path.end = new Victor(xCoord, options.stageHeight() + 400);

    return path;
}

var RightToLeftPath = function(options, radius, distanceFromStage, yCoord) {
    path = {};

    path.radius = radius;
    path.end = new Victor(-200, -20);
    path.start = new Victor(options.stageWidth() + distanceFromStage, options.stageHeight() * 0.7);

    return path;
}

