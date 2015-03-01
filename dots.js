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


quad = new QuadTree({x:0, y:0, width:scene.size.w, height:scene.size.h});







function spawn() {
  if (options.maxPopulation() <= population) return;
  if (Math.random() <= 0.3) {
    population++;
    var startY = Math.round(Math.random() * 1000) * options.stageHeight() / 1000
    var newDot;
    newDot = Dot(scene.dotColor, 1, startY, options);
    if (! checkIfEmpty(newDot)) return;
    scene.entities.push(newDot);
    
    quad.insert(newDot);
  }
}

function checkIfEmpty(currDot) {
  var candidateDots = quad.retrieve(currDot);
  for (j = 0; j < candidateDots.length; j++) {
    chck = candidateDots[j];
        
    if (chck.intersects(currDot)) {
      return false;
    }
  }
  return true;
};

function updateQuad() {
  quad.clear();
  var currDot;
  for (i = 0; i < scene.entities.length; i++) {
    currDot = scene.entities[i];
    quad.insert(currDot);
  }
}



function updateWorld() {
  spawn();
  var currDot;
  for (i = 0; i < scene.entities.length; i++) {
    currDot = scene.entities[i];
    handleWallHit(currDot);
  }
};

function handleWallHit(currDot) {
  if (currDot.aim === 1 && currDot.x <= 1) {
    currDot.aim = options.stageWidth() - options.dotRadius();
  }
  if (currDot.aim === (options.stageWidth() - options.dotRadius()) && (options.stageWidth() - options.dotRadius()) <= currDot.x) {
    currDot.aim = 1;
  }
};

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
}


function update() {
  animator.update();
  updateWorld();
  updateQuad();
  renderer.render();

  window.requestAnimationFrame(update);
}
update();
