import logo from "./logo.jpeg";

var createScene = async function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 4,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  var box = BABYLON.MeshBuilder.CreateBox(
    "box",
    { diameter: 2, segments: 32 },
    scene
  );
  // Move the sphere upward 1/2 its height
  box.position.y = 1;
  box.position.x = -2;

  // texture box with an image
  var material = new BABYLON.StandardMaterial("standardMaterial", scene);
  material.diffuseTexture = new BABYLON.Texture(logo, scene);
  box.material = material;

  box.actionManager = new BABYLON.ActionManager(scene);
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger,
      function (evt) {
        // Action to be performed when the box is clicked
        box.scaling.x *= 1.1;
        box.scaling.y *= 1.1;
        box.scaling.z *= 1.1;
      }
    )
  );

  var dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
  });
  box.addBehavior(dragBehavior);

  await BABYLON.SceneLoader.ImportMeshAsync(
    "semi_house",
    "https://assets.babylonjs.com/meshes/",
    "both_houses_scene.babylon"
  ).then(function (result) {
    result.meshes[0].position = new BABYLON.Vector3(2, 0, 0);

    // add drag behavior to the house
    var dragBehavior = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
    });
    result.meshes[0].addBehavior(dragBehavior);
  });

  await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "HVGirl.glb"
  ).then(function (result) {
    var hero = result.meshes[0];

    // Scale the model down
    hero.scaling.scaleInPlace(0.1);
    hero.position.z = 2;

    // Retrieve a specific animation group by name; in this case, 'Samba'
    const sambaAnim = scene.getAnimationGroupByName("Samba");

    // Play the 'Samba' animation
    sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);

    // Add a behavior to the hero
    var dragBehavior = new BABYLON.PointerDragBehavior({
      dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
    });
    hero.addBehavior(dragBehavior);
  });

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 6 },
    scene
  );

  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        console.log("KEY DOWN: ", kbInfo.event.key);
        // Move forward
        if (kbInfo.event.key === "w" || kbInfo.event.key === "W") {
          box.position.z += 0.1;
        }
        // Move backward
        if (kbInfo.event.key === "s" || kbInfo.event.key === "S") {
          box.position.z -= 0.1;
        }
        // Move left
        if (kbInfo.event.key === "a" || kbInfo.event.key === "A") {
          box.position.x -= 0.1;
        }
        // Move right
        if (kbInfo.event.key === "d" || kbInfo.event.key === "D") {
          box.position.x += 0.1;
        }
      case BABYLON.KeyboardEventTypes.KEYUP:
        console.log("KEY UP: ", kbInfo.event.key);
        break;
    }
  });

  var xr = await scene.createDefaultXRExperienceAsync({
    // ask for an ar-session
    uiOptions: {
      sessionMode: "immersive-ar",
    },
    optionalFeatures: true,
  });

  return scene;
};

var canvas = document.getElementById("main"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const main = async () => {
  // Render the scene
  var scene = await createScene(); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    if (!scene.getMeshByName) return;
    // spin the box around the y-axis
    scene.getMeshByName("box").rotation.y += 0.01;

    // make the house models rotate	on the y-axis
    scene.getMeshByName("semi_house").rotation.y -= 0.01;
    scene.render();
  });
};

main();

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
