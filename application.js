var Application = function() {
    var application = {};
    application.paused = false;

    application.pause = function() {
        application.paused = !application.paused;
        if (! application.paused)
            window.requestAnimationFrame(application.update);
    }
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    //window.document.body.appendChild(stats.domElement);

    application.reset = function () {

        application.scene = new Scene(application.uiController.stageWidth(), application.uiController.stageHeight());
        application.canvas.width = application.uiController.stageWidth();
        application.canvas.height = application.uiController.stageHeight(); 

        application.debug.setScene(application.scene);
        application.quadTree = new QuadTree({x:0, y:0, width:application.uiController.stageWidth(), height:application.uiController.stageHeight()}, 15, 100);

        application.director.setQuadTree(application.quadTree);
        application.collisionSystem.setQuadTree(application.quadTree);
        application.steeringSystem.setQuadTree(application.quadTree);
        application.director.reset()

        application.animator.setQuadTree(application.quadTree);
        application.quadTreeSystem.setQuadTree(application.quadTree);
    }


    application.update = function update() {
        stats.begin();

        application.director.update(application.scene);
        // Update UI
        application.uiController.population(application.director.population);
        
        application.collisionSystem.update(application.scene);
        application.steeringSystem.update(application.scene);

        application.animator.update(application.scene);
        application.quadTreeSystem.update(application.scene);
        application.renderer.render(application.scene, application.canvas.getContext('2d'));

        
        
        stats.end();
        
        if (! application.paused)
            window.requestAnimationFrame(application.update);
    }
    var stageHeight = 500;
    var stageWidht = 700;
    var dotRadius = 7;
    var dotDiam = dotRadius * 2;
    var totalFillNumber = (stageHeight * stageWidht) / (dotDiam * dotDiam)
    var fillPercentage = 0.18;
    var maxPopulation = 330; // Math.round(totalFillNumber * fillPercentage);
    
    var mc = new ManualControl()
    application.uiController = new UIController(maxPopulation, stageWidht, stageHeight, dotRadius, application.reset, application.pause, mc);
    ko.applyBindings(application.uiController);

    application.scene = new Scene(application.uiController.stageWidth(), application.uiController.stageHeight());
    application.quadTree = new QuadTree({x:0, y:0, width:application.uiController.stageWidth(), height:application.uiController.stageHeight()}, 15, 100);

    application.canvas = document.getElementById('canv-1');
    application.renderer = new Renderer();
    application.animator = new Animator(application.uiController, application.quadTree);
    application.collisionSystem = new CollisionSystem(application.uiController, application.quadTree);
    application.steeringSystem = new SteeringSystem(application.uiController, application.quadTree, mc);
    application.debug = new Debug(application.canvas, application.scene);
    application.quadTreeSystem = new QuadTreeSystem(application.quadTree);
    application.director = new Director(application.quadTree, application.uiController);

    application.run = function () {
        application.update();
    }

    return application;
};
