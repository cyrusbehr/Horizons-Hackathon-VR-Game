var container, stats;
var camera, scene, renderer;
var objects = [];

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
  camera.position.z = 800;



  // Create and ambient light
  ambLight = new THREE.AmbientLight( 0xcd950c )
  scene.add( ambLight );

  // Create a spot light
  var sptlight = new THREE.SpotLight( 0xffffff, 0.85 );
  sptlight.position.set( -800, 500, 2000 );
  sptlight.castShadow = true;
  sptlight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
  sptlight.shadow.bias = - 0.00022;
  sptlight.shadow.mapSize.width = 2048;
  sptlight.shadow.mapSize.height = 2048;
  scene.add( sptlight );


  // // This allows the user to move the camera with the mouse
  // controls = new THREE.TrackballControls( camera );
  // controls.rotateSpeed = 1.0;
  // controls.zoomSpeed = 1.2;
  // controls.panSpeed = 0.8;
  // controls.noZoom = false;
  // controls.noPan = false;
  // controls.staticMoving = true;
  // controls.dynamicDampingFactor = 0.3;



  // Create a sphere geometry with materials and Mesh
  // var geometry = new THREE.TetrahedronGeometry( 95, 3);
  var geometry = new THREE.SphereGeometry(100, 17, 8, 0);
  var material = new THREE.MeshPhongMaterial({
    color: 0xf25346,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  var sphere = new THREE.Mesh( geometry, material );
  sphere.position.z = 0
  sphere.position.y = -525
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add( sphere );

  // Create a rectangle geometry
  var geometry = new THREE.BoxGeometry( 200, 25, 40 );

  // For loop that creates each object on the first row with a random color
  for ( var i = 0; i < 12; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -1250 + (i*215);
    object.position.y = 625;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );
    objects.push( object );
  }

  // For loop that creates each object on the second row with a random color
  for ( var i = 0; i < 10; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -1100 + (i*215);
    object.position.y = 500;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );
    objects.push( object );
  }

  // For loop that creates each object on the third row with a random color
  for ( var i = 0; i < 12; i ++ ) {
    var material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xffffff } )
    var object = new THREE.Mesh( geometry, material);
    object.position.x = -1250 + (i*215);
    object.position.y = 375;
    object.position.z = 0;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add( object );
    objects.push( object );
  }

  // Renders everything

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xb8e9f2);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );
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
  requestAnimationFrame( animate );
  render();
}

// Create the render function
function render() {
  // controls.update();
  renderer.render( scene, camera );
}
