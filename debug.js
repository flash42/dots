var Debug = function(canvas, scene) {
    var debug = {};
    debug.scene = scene;
    
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
    
    debug._bindEvent(canvas, "click", function (e) {});

    return debug;
};


