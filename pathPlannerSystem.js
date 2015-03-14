var zeroV = new Victor(0, 0);

var PathPlannerSystem = function(options, quadTree, manualControl) {
    var planner = {};
    planner.mc = manualControl;
    planner.quadTree = quadTree;


    planner.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            entity.acc = planner.calcAccel(entity);
        }

        planner.mc.reset()
    };
    planner.calcAccel = function (entity) { // TODO calc acceleration instead.
        return zeroV.clone()
                .add(planner.mc.leftV)
                .add(planner.mc.rightV)
                .add(planner.mc.upV)
                .add(planner.mc.downV).limitMag(entity.maxForce);
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
        mc.downV = zeroV;
        mc.upV = zeroV;
        mc.leftV = zeroV;
        mc.rightV = zeroV;
    }
    
    mc.reset();

    return mc;
};
