var Debug = function(canvas, scene) {
    var debug = {};
    debug.scene = scene;
    
    debug.entityUnderPoint = function(x, y) {
        var rect = canvas.getBoundingClientRect()

        var offset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
        var entityX = x - offset.left;
        var entityY = y - offset.top;
        for (i = 0; i < debug.scene.entities.length; i++) {
            entity = debug.scene.entities[i];
            if (entity.contains(entityX, entityY)) return entity;
        }
        return null;
    }
    
    debug.setScene = function (scene) {
        debug.scene = scene;
    }
    
    debug._bindEvent = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on'+type, handler);
        }
    }
    
    debug._bindEvent(canvas, "click", function (e) { console.log(debug.entityUnderPoint(e.clientX, e.clientY)) });

    return debug;
};


