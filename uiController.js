

var UIController = function(max_population, stage_width, stage_height, dot_radius, resetHandler, pauseHandler) {
    var optionController = {};

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

    optionController.changeHandler = function(newValue) {
        resetHandler();
    }
    optionController.highlightID = ko.numericObservable(-1);
    optionController.population = ko.observable(0);
    optionController.pause = pauseHandler;
    optionController.stageWidth = function () { return stage_width; };
    optionController.stageHeight = function () { return stage_height; };
    optionController.maxPopulation = function () { return max_population; };
    optionController.dotRadius = function () { return dot_radius; };
    
    return optionController;
};

