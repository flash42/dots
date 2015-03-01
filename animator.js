var DIR_DOWN = 1;
var DIR_RIGHT = 2;
var DIR_UP = 3;
var DIR_LEFT = 4;

var Animator = function(options, quadTree) {
    var animator = {};
    animator.quadTree = quadTree;
    
    animator.stepDot = function(entity, dir) {
        if (dir === DIR_DOWN && entity.y < options.stageWidth() - options.
            dotRadius()) {
            entity.move(entity.x, entity.y + entity.speed);
        }
        if (dir === DIR_RIGHT) {
            entity.move(entity.x + entity.speed, entity.y);
        }
        if (dir === DIR_UP && options.dotRadius() + entity.speed < entity.y) {
            entity.move(entity.x, entity.y - entity.speed);
        }
        if (dir === DIR_LEFT) {
            entity.move(entity.x - entity.speed, entity.y);
        }
    };
    animator.calcDir = function(entity) {
        var chck;
        var toDir = 0;

        // TODO fix and use QuadTree - overlapping can happen
        var candidateDots = animator.quadTree.retrieve(entity);
        //var candidateDots = stage.blueDots.concat(stage.dots);
        var canStep = true;
        var deltaX = entity.x <= entity.aim ? entity.speed : -entity.speed;

        var bestDot = {found: 0, color: entity.color};
        for (j = 0; j < candidateDots.length; j++) {
            chck = candidateDots[j];
            if (bestDot.found < chck.found && entity.aim === chck.aim && entity.color === chck.color) bestDot = chck;
            if (chck.intersects({id: entity.id, x: entity.x + deltaX, y: entity.y, width: entity.width, height: entity.height})) {
                canStep = false;
            }
        }

        if (canStep) {
            entity.found++;
            entity.stalled = 0;
            if (entity.x <= entity.aim) return DIR_RIGHT;
            if (entity.aim <= entity.x) return DIR_LEFT;
        } else {
            if (0 < entity.found) entity.found = 0;
            else entity.found--;
            var deltaY = 0;
            var dir;
            deltaX = 0;
            if (entity.found < -30 && 10 < bestDot.found) {
                if (entity.y < bestDot.y) {
                    deltaY = entity.speed;
                    dir = DIR_DOWN;
                }
                else {
                    deltaY = -entity.speed;
                    dir = DIR_UP
                }
            }
            else {
                var randomDirSeed = Math.random();

                if (randomDirSeed < 0.04) {
                    if (entity.x <= entity.aim) {
                        deltaX = -entity.speed;
                        dir = DIR_LEFT;
                    }
                    else {
                        deltaX = entity.speed;
                        dir = DIR_RIGHT;
                    }
                }
                else if (randomDirSeed < 0.50) {
                    deltaY = entity.speed;
                    dir = DIR_DOWN;
                }
                else {
                    deltaY = -entity.speed;
                    dir = DIR_UP
                }
            }
            canStep = true;
            for (j = 0; j < candidateDots.length; j++) {
                chck = candidateDots[j];

                if (chck.intersects({id: entity.id, x: entity.x + deltaX, y: entity.y + deltaY, width: entity.width, height: entity.height})) {
                    canStep = false;
                }
            }
            if (canStep) {
                entity.stalled = 0;
                return dir;
            }
            entity.stalled++;
            return 0;
        }
    };

    animator.handleWallHit = function (currDot) {
        if (currDot.aim === 1 && currDot.x <= 1) {
            currDot.aim = options.stageWidth() - options.dotRadius();
        }
        if (currDot.aim === (options.stageWidth() - options.dotRadius()) && (options.stageWidth() - options.dotRadius()) <= currDot.x) {
            currDot.aim = 1;
        }
    };

    animator.update = function (scene) {
        var currDot;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            currDot = scene.entities[i];
            toDir = animator.calcDir(currDot);
            animator.stepDot(currDot, toDir);
            animator.handleWallHit(currDot);
        }
    };
    
    animator.setQuadTree = function(quadTree) {
        animator.quadTree = quadTree;
    }

    return animator;
};
