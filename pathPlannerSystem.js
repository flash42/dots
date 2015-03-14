var PathPlannerSystem = function(options, quadTree, manualControl) {
    var planner = {};
    planner.mc = manualControl;
    planner.quadTree = quadTree;


    planner.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.acc = planner.calcAccel(entity, scene).limitMag(entity.maxForce);
        }

        planner.mc.reset()
    };

    planner.calcAccel = function (entity, scene) { 
        var pathSteeringAcc = planner.pathSteering(entity, scene); 
        if (pathSteeringAcc) {
            return pathSteeringAcc;
        }
        else {
            return Victor.zeroV()
                .add(planner.mc.leftV)
                .add(planner.mc.rightV)
                .add(planner.mc.upV)
                .add(planner.mc.downV);    
        }

    }
    var predLen = 25; // TODO magic number
    planner.pathSteering = function (entity, scene) {
        var path = scene.path;
        var moveVec = Victor.v(entity.vel).normalize().mulScalar(predLen);
        var predictLoc = Victor.v(entity.pos).add(moveVec);
        var a = Victor.v(predictLoc).subtract(path.start);
        var b = Victor.v(path.end).subtract(path.start).normalize();
        b.mulScalar(a.dot(b));
        var normalPoint = Victor.v(path.start).add(b);
        
        var distance = predictLoc.distance(normalPoint);
        if (distance > path.radius) {
            var bNorm = Victor.v(b).normalize()
            var target = Victor.v(normalPoint).add(bNorm.mulScalar(path.end.distance(b) / 3)); // TODO magic number 

            return planner.seek(entity, target);
        }    
    }
    
    planner.seek = function (entity, target) {
        var desired = Victor.v(target).subtract(entity.pos);
        desired.normalize().mulScalar(entity.maxVel);
        return desired.subtract(entity.vel);
    }

    planner.setQuadTree = function(quadTree) {
        planner.quadTree = quadTree;
    }

    return planner;
};

var ManualControl = function() {
    var mc = {};
    var leftV = new Victor(-1, 0);
    var rightV = new Victor(1, 0);
    var upV = new Victor(0, -1);
    var downV = new Victor(0, 1);
    mc.left = function () {
        mc.leftV = leftV;
    }
    mc.up = function () {
        mc.upV = upV;
    }
    mc.right = function () {
        mc.rightV = rightV;
    }
    mc.down = function () {
        mc.downV = downV;
    }
    mc.reset = function () {
        mc.downV = Victor.zeroV();
        mc.upV = Victor.zeroV();
        mc.leftV = Victor.zeroV();
        mc.rightV = Victor.zeroV();
    }

    mc.reset();

    return mc;
};
