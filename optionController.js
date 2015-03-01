
var OptionController = function(max_population, stage_width, stage_height, dot_radius, resetHandler) {
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
        reset();
    }
    optionController.highlightID = ko.numericObservable(-1);
    optionController.maxPopulation = ko.numericObservable(max_population);
    optionController.stageWidth = ko.numericObservable(stage_width);
    optionController.stageHeight = ko.numericObservable(stage_height);
    optionController.dotRadius = ko.numericObservable(dot_radius);
    optionController.maxPopulation.subscribe(optionController.changeHandler);
    optionController.stageWidth.subscribe(optionController.changeHandler);
    optionController.stageHeight.subscribe(optionController.changeHandler);
    optionController.dotRadius.subscribe(optionController.changeHandler);

    return optionController;
};

