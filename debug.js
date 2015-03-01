
var Debug = function(canvas, scene) {
    var debug = {};
    debug.scene = scene;

    debug.setScene = function(scene) {
        debug.scene = scene;
    }
    
    debug.dotUnderPoint = function(x, y) {
        var rect = canvas.getBoundingClientRect()

        var offset = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
        var dotX = x - offset.left;
        var dotY = y - offset.top;
        for (i = 0; i < scene.entities.length; i++) {
            currDot = scene.entities[i];
            if (currDot.contains(dotX, dotY)) return currDot;
        }
        return null;
    }
    
    debug._bindEvent = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on'+type, handler);
        }
    }
    
    debug._bindEvent(canvas, "click", function (e) { console.log(debug.dotUnderPoint(e.clientX, e.clientY)) });

    return debug;
};


