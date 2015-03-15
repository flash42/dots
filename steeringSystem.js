var SteeringSystem = function(options, quadTree, manualControl) {
    var steering = {};
    steering.mc = manualControl;
    steering.quadTree = quadTree;


    steering.update = function (scene) {
        var entity;
        var toDir;

        for (i = 0; i < scene.entities.length; i++) {
            entity = scene.entities[i];
            var pathSteering = steering.pathSteering(entity, scene)
            .mulScalar(1);
            
            var separationSteering = steering.separationSteering(entity)
            .mulScalar(1.5);

            var acc = Victor.zeroV().add(pathSteering).add(separationSteering);
            if (acc.isEqualTo(zeroV)) {
                acc = steering.manualSteering(entity);
            }
            entity.acc = acc.limitMag(entity.maxForce);
        }

        steering.mc.reset()
    };
    
    steering.getNearbyEntities = function (entity) {
        var notMeFilter = function(e) { return e.id != entity.id; };
        return steering.quadTree.retrieve(entity).filter(notMeFilter);
    }

    var zeroV = Victor.zeroV();
    steering.manualSteering = function (entity) {
        return Victor.zeroV()
            .add(steering.mc.leftV)
            .add(steering.mc.rightV)
            .add(steering.mc.upV)
            .add(steering.mc.downV);    
    }

    steering.pathSteering = function (entity, scene) {
        var predLen = 25; // TODO magic number

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

            return steering.seek(entity, target);
        } 
        return zeroV;
    }

    steering.seek = function (entity, target) {
        var desired = Victor.v(target).subtract(entity.pos);
        desired.normalize().mulScalar(entity.maxVel);
        return desired.subtract(entity.vel);
    } 

    steering.separationSteering = function (entity) {
        var sepDistance = 25; // TODO magic number
        var nearbyEntities = steering.getNearbyEntities(entity);

        var separate = new Victor();
        var count = 0;
        for (var i = 0; i < nearbyEntities.length; i++) {
            var other = nearbyEntities[i];
            var d = entity.pos.distance(other.pos);
            if ((d > 0) && (d < sepDistance)) {
                var diff = Victor.v(entity.pos).subtract(other.pos).normalize();
                separate.add(diff);
                count++;
            }
        }
        if (count > 0) {
            separate.mulScalar(1 / count);
            separate.mulScalar(entity.maxVel);
            return separate.subtract(entity.vel);
        }
        return zeroV;
    }

    steering.setQuadTree = function(quadTree) {
        steering.quadTree = quadTree;
    }

    return steering;
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
