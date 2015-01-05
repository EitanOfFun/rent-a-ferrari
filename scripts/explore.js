
// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, controls, mesh,
    materialColor = getPaintColor();

// Sets up the scene.
function init(){
  'use strict';
  // Create the scene and set the scene size.
  scene = new THREE.Scene();
  var wrapper = document.getElementById("explore"),
      WIDTH = wrapper.offsetWidth,
      HEIGHT = wrapper.offsetHeight;


  // Create a renderer and add it to the DOM.
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  wrapper.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
  camera = new THREE.PerspectiveCamera(20, WIDTH / HEIGHT, 0.01, 5000);
  camera.position.set(8, 1, 25);
  scene.add(camera);

  // Create an event listener that resizes the renderer with the browser window.
  window.addEventListener('resize', function() {
    var WIDTH = wrapper.offsetWidth,
        HEIGHT = wrapper.offsetHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  });

  // Set the background color of the scene.
  renderer.setClearColor(0x333F47, 1);

  // Create a light, set its position, and add it to the scene.
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,100);
  scene.add(light);
  
  // Load in the mesh and add it to the scene.
  var loader = new THREE.JSONLoader();
  loader.load( "ferrari/exports/ferrari.json", function(geometry){
    var material = new THREE.MeshLambertMaterial({color: getPaintColor()});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
  
  // Add OrbitControls so that we can pan around with the mouse.
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}

// Renders the scene and updates the render as needed.
function animate() {
  requestAnimationFrame(animate);

  // Render the scene.
  renderer.render(scene, camera);
  controls.update();
}

$(function() {
    $('#threeD-btn').click(function(){
        $('#overlay').fadeIn(200,function(){
            $('#box').animate({'top':'20px'},200);
              changeMeshMaterialColor();
        });
        return false;
    });
    $('#boxclose').click(function(){
        $('#box').animate({'top':'-500px'},500,function(){
            $('#overlay').fadeOut('fast');
        });
    });
 
});

function getPaintColor(){
  return document.getElementById("paint-color").value;
}

function changeMeshMaterialColor() {
  var paintColor = getPaintColor();
  if (paintColor !== materialColor) {
    materialColor = paintColor;
    mesh.material.color.setStyle(materialColor);
  }
}

init();
animate();
