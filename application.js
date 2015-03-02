var Application = function() {
    var application = {};

    application.reset = function () {
        
        application.scene = new Scene(application.options.stageWidth(), application.options.stageHeight());
        application.canvas.width = application.options.stageWidth();
        application.canvas.height = application.options.stageHeight(); 

        application.debug.setScene(application.scene);
        application.quadTree = new QuadTree({x:0, y:0, width:application.options.stageWidth(), height:application.options.stageHeight()});

        application.director.setQuadTree(application.quadTree);
        application.director.reset()

        application.animator.setQuadTree(application.quadTree);
        application.quadTreeSystem.setQuadTree(application.quadTree);
    }


    application.update = function update() {
        application.director.update(application.scene);
        application.animator.update(application.scene);
        application.quadTreeSystem.update(application.scene);
        application.renderer.render(application.scene, application.canvas.getContext('2d'));

        window.requestAnimationFrame(application.update);
    }

    application.options = new OptionController(250, 700, 500, 12, application.reset);
    ko.applyBindings(application.options);

    application.scene = new Scene(application.options.stageWidth(), application.options.stageHeight());
    application.quadTree = new QuadTree({x:0, y:0, width:application.options.stageWidth(), height:application.options.stageHeight()});

    application.canvas = document.getElementById('canv-1');
    application.renderer = new Renderer();
    application.animator = new Animator(application.options, application.quadTree);
    application.debug = new Debug(application.canvas, application.scene);
    application.quadTreeSystem = new QuadTreeSystem(application.quadTree);
    application.director = new Director(application.quadTree, application.options);

    application.run = function () {
        application.update();
    }

    return application;
};