var container, stats;
var camera, controls, scene, renderer, sphere;
var brickArray = [];
var topPosition = 165;
var xPadding = 46;
init();
animate();


function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // Create the scene and set the scene size
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  // Create a camera, zoom it out from the model a bit
  camera = new THREE.PerspectiveCamera( 90, WIDTH / HEIGHT, 1, 10000 );
  camera.position.z = 200;
  camera.position.y = -35;

  // Create and ambient light
  ambLight = new THREE.AmbientLight( 0xcd950c )
  scene.add( ambLight );

  // Create a spot light
  var sptlight = new THREE.SpotLight( 0xffffff, 0.85 );
  sptlight.position.set( 0, -2500, 10000 );
  sptlight.castShadow = true;
  sptlight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
  sptlight.shadow.bias = - 0.00022;
  sptlight.shadow.mapSize.width = 2048;
  sptlight.shadow.mapSize.height = 2048;
  scene.add( sptlight );

  // This allows the user to move the camera with the mouse
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  // Create a sphere geometry with materials and Mesh
  // var geometry = new THREE.TetrahedronGeometry( 95, 3);
  var geometry = new THREE.TetrahedronGeometry(13, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0x33d6ff,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  sphere = new THREE.Mesh( geometry, material );
  sphere.position.x = 0
  sphere.position.z = 0
  sphere.position.y = 120
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add( sphere );

  // Create a rectangle geometry
  var geometry = new THREE.BoxGeometry(40, 10, 8);

  // For loop that creates each object on the first row with a random color
  for ( var i = 0; i < 12; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -252 + (i*xPadding);
    object.position.y = topPosition + 60;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    object.status = 1;
    object.row = 1;
    scene.add( object );
    brickArray.push( object );
  }

  // For loop that creates each object on the second row with a random color
  for ( var i = 0; i < 10; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -205 + (i*xPadding);
    object.position.y = topPosition+30;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    object.status = 1;
    object.row = 2;
    scene.add( object );
    brickArray.push( object );
  }

  // For loop that creates each object on the third row with a random color
  for ( var i = 0; i < 11; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -238 + (i*(xPadding+1));
    object.position.y = topPosition;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    object.status = 1;
    object.row = 3;
    scene.add( object );
    brickArray.push( object );
  }

  // Renders everything

  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setClearColor( 0xb8e9f2, 0);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT ); //set the width and height of rendered
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );


  window.addEventListener( 'resize', onWindowResize, false );

}
// END OF INIT FUNCTION

// RESIZES THE RENDERER WITH THE BROWSER WINDOW
function onWindowResize() {
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize( WIDTH, HEIGHT );
}

// Create the animate function
function animate() {
  requestAnimationFrame( animate )
  render();
}

// Create the render function
function render() {
  controls.update();
  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.01;
  sphere.position.x = -(ball_x_position - 500)/1.9
  sphere.position.y = -(ball_y_position - 460)/1.9
  renderer.render( scene, camera );
}
