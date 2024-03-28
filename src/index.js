import * as BABYLON from 'babylonjs';

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var box = BABYLON.MeshBuilder.CreateBox("box", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    box.position.y = 1;
    box.position.x = -1;

    BABYLON.SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon")
        .then(function (result) {
            result.meshes[0].position = new BABYLON.Vector3(1, 0, 0);
        });

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};

var canvas = document.getElementById("main"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    // spin the box around the y-axis
    scene.getMeshByName("box").rotation.y += 0.01;
    
    // make the house models rotate	on the y-axis
    if (scene.getMeshByName("semi_house")) {
        scene.getMeshByName("semi_house").rotation.y -= 0.01;
    }
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

