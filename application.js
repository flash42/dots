
var Application = function() {
    var application = {};

    application.reset = function () {
        
        application.scene = new Scene(application.options.stageWidth(), application.options.stageHeight());
        application.canvas.width = application.options.stageWidth();
        application.canvas.height = application.options.stageHeight();
        
        application.quadTree = new QuadTree({x:0, y:0, width:application.options.stageWidth(), height:application.options.stageHeight()});

        application.renderer.setScene(application.scene);
        application.debug.setScene(application.scene);
        application.animator.setScene(application.scene);
        application.director.setScene(application.scene);
        application.quadTreeSystem.setScene(application.scene);

        
        application.director.setQuadTree(application.quadTree)
        application.animator.setQuadTree(application.quadTree)
        application.quadTreeSystem.setQuadTree(application.quadTree);
    }


    application.update = function update() {
        application.director.update();
        application.animator.update();
        application.quadTreeSystem.update();
        application.renderer.render(application.canvas.getContext('2d'));

        window.requestAnimationFrame(application.update);
    }

    application.options = new OptionController(250, 700, 500, 12, application.reset);
    ko.applyBindings(application.options);

    application.scene = new Scene(application.options.stageWidth(), application.options.stageHeight());
    application.quadTree = new QuadTree({x:0, y:0, width:application.options.stageWidth(), height:application.options.stageHeight()});

    application.canvas = document.getElementById('canv-1');
    application.renderer = new Renderer(application.scene);
    application.animator = new Animator(application.options, application.quadTree, application.scene);
    application.debug = new Debug(application.canvas, application.scene);
    application.quadTreeSystem = new QuadTreeSystem(application.quadTree, application.scene);
    application.director = new Director(application.quadTree, application.options, application.scene);

    application.run = function () {
        application.update();
    }

    return application;
};
