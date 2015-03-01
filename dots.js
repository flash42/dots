var DIR_DOWN = 1;
var DIR_RIGHT = 2;
var DIR_UP = 3;
var DIR_LEFT = 4;


var options = new OptionController(250, 700, 500, 12);
ko.applyBindings(options);

// ++++++++++++++
// Initialization +
// ++++++++++++++
 
var scene = new Scene(options.stageWidth(), options.stageHeight());
var renderer = new Renderer(scene);
var animator = new Animator(options, scene);
var canvas = document.getElementById('canv-1');
var debug = new Debug(canvas, scene);
var ctx = canvas.getContext('2d');
var dotId = 0;
var population = 0;

var quad = new QuadTree({x:0, y:0, width:scene.size.w, height:scene.size.h});
var director = new Director(quad);


function updateQuad() {
  quad.clear();
  var currDot;
  for (i = 0; i < scene.entities.length; i++) {
    currDot = scene.entities[i];
    quad.insert(currDot);
  }
}

function reset() {
  population = 0;
  dotId = 0;
  scene = new Scene(options.stageWidth(), options.stageHeight());
  renderer.setScene(scene);
  debug.setScene(scene);
  animator = new Animator(options, scene);
  canvas.width = scene.size.w;
  canvas.height = scene.size.h;
  quad = new QuadTree({x:0, y:0, width:scene.size.w, height:scene.size.h});
  director.setQuadTree(quad)
}


function update() {
  director.update();
  animator.update();
  updateQuad();
  renderer.render();

  window.requestAnimationFrame(update);
}
update();
