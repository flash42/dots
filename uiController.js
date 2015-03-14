

var UIController = function(max_population, stage_width, stage_height, dot_radius, resetHandler, pauseHandler, keyboard) {
    var ui = {};

    ko.numericObservable = function(initialValue) {
        var _actual = ko.observable(initialValue);

        var result = ko.dependentObservable({
            read: function() {
                return _actual();
            },
            write: function(newValue) {
                var parsedValue = parseFloat(newValue);
                _actual(isNaN(parsedValue) ? newValue : parsedValue);
            }
        });

        return result;
    };

    ui.changeHandler = function(newValue) {
        resetHandler();
    }
    ui.highlightID = ko.numericObservable(-1);
    ui.population = ko.observable(0);
    ui.pause = pauseHandler;
    ui.stageWidth = function () { return stage_width; };
    ui.stageHeight = function () { return stage_height; };
    ui.maxPopulation = function () { return max_population; };
    ui.dotRadius = function () { return dot_radius; };

    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: // left
                keyboard.left();
                break;

            case 38: // up
                keyboard.up();
                break;

            case 39: // right
                keyboard.right();
                break;

            case 40: // down
                keyboard.down();
                break;

            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    return ui;
};

