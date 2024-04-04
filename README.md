# Crash course in BabylonJS

> There is an accompanying GitHub repository that you can use to hack along with this guide. You can find it [here](https://github.com/sytac-webpack-module-federation/augmented-reality). Play around with the [live app](https://sytac-webpack-module-federation.github.io/augmented-reality/) on Github-pages.

## What is Babylon.js?

Babylon.js is a powerful, open-source 3D engine that enables developers to render 3D graphics within a web browser in real-time, without the need for plugins. It leverages the capabilities of WebGL, WebXR, and other web standards to provide a rich, interactive, and immersive experience directly in the web environment. Babylon.js is designed to be accessible for beginners while still providing the depth and functionality needed for experienced developers to create complex and high-performance 3D applications. If at anypoint in the guide you want to dive deeper into the documentation, you can find it [here](https://doc.babylonjs.com/).

### Setting Up a Basic Development Environment

Creating immersive 3D applications with Babylon.js begins with setting up a proper development environment. This setup ensures that you have all the necessary tools and software to develop, test, and deploy your Babylon.js projects efficiently. Below, we cover the essentials to get you started.

Create a new folder to hold your source files. You can call it `src`. Add a `index.html` to that directory with the following content:

```html
<html>
    <head>
        <title>BabylonJS</title>
        <!-- import style -->
        <link rel="stylesheet" href="./index.css">
    </head>
    <body>
        <canvas  id="main"></div>
        <!-- import script -->
        <!-- dont forget to add the type="module" to the script tag -->
        <script type="module" src="./index.js"></script>
    </body>
</html>
```

Note: here we use the CDN distribution provided from BabylonJS. To install it from NPM you can run the command `npm install --save babylonjs` and then import it in you javascript file with `import * as BABYLON from 'babylonjs';`

Now, lets create a css file called `index.css` in the `src` directory with the following content (this file is optional, but help to keep the app looking clean by removing things like default padding and margins):

```css
html, body {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
#main {
    width: 100%;
    height: 100%;
}
```

Now the exciting part, lets create a `index.js` file to create a basic scene. Add the following content to the file to create a basic scene. (Right now we only want the scene to load so we can confirm it'ss working. We will dive into the details later.)

```javascript
var createScene = function () {
    // This creates a basic Babylon Scene object
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};

var canvas = document.getElementById("main"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var scene = createScene(); // Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

```

Now if you run the app with Parcel, `npx parcel src/index.html`, you should see a basic 3D environment with a sphere on top of a flat surface. Congratulations on creating your first BabylonJS application!

## Understanding the Babylon.js Application Structure

A Babylon.js application is structured around a few core concepts: the engine, scene, camera, lights, and meshes. Understanding these elements is crucial for navigating and mastering Babylon.js development. Lets dive deeper into how these components fit into the overall structure of a Babylon.js application.

### Engine
The engine is the heart of a Babylon.js application. It's responsible for rendering the graphics drawn on the canvas element in the browser. The engine takes care of the complex tasks of interfacing with WebGL and optimizing the rendering process.

### Scene
The scene is a container for all your objects, lights, cameras, and more. It represents the virtual space in which your 3D world exists. You can think of it as the stage upon which your 3D objects are placed and interact. Creating a scene in Babylon.js is straightforward. After initializing the engine, you create a new scene object which will hold all your cameras, lights, and objects.

```javascript
var scene = new BABYLON.Scene(engine);
```

The scene is where you'll add your objects, define physics, and set environmental conditions like fog or color background. It's the canvas on which you'll paint your 3D world. You can find out more about scenes in the Babylon.js documentation [here](https://doc.babylonjs.com/features/featuresDeepDive/scene).

### Camera
Cameras define the point of view from which the scene will be rendered. Babylon.js offers various types of cameras to cater to different requirements, such as free cameras for first-person perspectives or arc rotate cameras for orbiting around an object. Setting up a camera is essential for viewing your scene. A simple arc rotate camera allows users to orbit around a point:

```javascript
var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
```

This camera orbits around the center of the scene, with controls for user interaction. For more info see the documentation on cameras [here](https://doc.babylonjs.com/features/featuresDeepDive/cameras).

### Light
Lights illuminate the objects in your scene. A simple point light can be created and positioned like so:

```javascript
var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, 0), scene);
light.intensity = 0.95;
```

This light will cast light from a point in space, giving depth to your objects. You can find more information on lights in the Babylon.js documentation [here](https://doc.babylonjs.com/features/featuresDeepDive/lights).

### Render Loop
The render loop is what continuously updates and renders the scene. It's the game loop of your Babylon.js application, allowing animations and interactions to play out:

```javascript
engine.runRenderLoop(function () {
    // spin the box around the y-axis
    scene.getMeshByName("box").rotation.y += 0.01;
    scene.render();
});
```

## Working with Shapes and Models
Babylon.js provides a comprehensive set of features for working with 3D shapes and models, from basic geometric shapes to complex 3D models imported from various formats. This section will guide you through creating basic shapes, importing models, and applying transformations and animations.

Babylon.js includes a variety of predefined shapes, which can be easily added to your scene. You can find out more about these primitives in the Babylon.js documentation [here](https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation).

Here's how to create some basic shapes:

### Sphere:

```javascript
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position = new BABYLON.Vector3(0, 1, 0);
```

### Box:

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {height: 2, width: 2, depth: 2}, scene);
box.position = new BABYLON.Vector3(5, 1, 0);
```

### Cylinder:

```javascript
var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 3, diameter: 2}, scene);
cylinder.position = new BABYLON.Vector3(-5, 1.5, 0);
```

These shapes are positioned in the world space using the position property, which takes a BABYLON.Vector3 to specify their location in the X, Y, and Z axes.

To enrich your scene with complex models, you'll likely need to import them. Babylon.js supports asynchronous model loading to ensure smooth user experiences. You can import models in various formats, such as .glb, .gltf, .obj, and more. Find out more about importing models in the Babylon.js documentation [here](https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypess).

Here's how to import a model using ImportMeshAsync:

### Loading a Single Model:

```javascript
BABYLON.SceneLoader.ImportMeshAsync("", "/models/", "house.glb", scene).then((result) => {
    const house = result.meshes[0];
    house.position = new BABYLON.Vector3(0, 0, 0);
});
```

### Loading Multiple Models:

```javascript
BABYLON.SceneLoader.ImportMeshAsync(["model1", "model2"], "/models/", "town.glb", scene).then((result) => {
    result.meshes.forEach(mesh => {
        if (mesh.name === "model1") {
            mesh.position.x = 20;
        }
    });
    const model2 = scene.getMeshByName("model2");
    if (model2) {
        model2.rotation.y = Math.PI / 4;
    }
});
```

To manipulate a models position after its loaded in the example we use Promises to perform transformations. But if we want to make changes to the models in the renderloop, you will need to add check to see if a model has already been loaded before we make changes to it.

```javascript
var createScene = function () {
    …
    BABYLON.SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
    …
}

…

engine.runRenderLoop(function () {
    // make the house rotate on the y-axis
    if (scene.getMeshByName("semi_house")) {
        scene.getMeshByName("semi_house").rotation.y -= 0.01;
    }
    scene.render();
});
```

### Loading and Animating a Model

To incorporate complex models into your Babylon.js project, including animations, you may need to use additional loaders depending on the file format of your model. Babylon.js supports various file types, each potentially requiring its own loader. Detailed information on supported file types and how to use their respective loaders can be found in the Babylon.js documentation on importing models: Loading File Types.

To ensure your project can handle these models, include the necessary loader script in your HTML. For most 3D model formats, including .glb and .gltf, the general loaders script is required:


```html
<script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
```

With the appropriate loaders integrated, you can proceed to import and animate your model within your Babylon.js scene. The following example demonstrates how to load a .glb model, adjust its scale, and initiate a predefined animation.

The following example is based on the example provided in the Babylon.js documentation on importing models found [here](https://doc.babylonjs.com/features/featuresDeepDive/animation/animatedCharacter)

```javascript
BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
 var hero = newMeshes[0];

 // Scale the model down
 hero.scaling.scaleInPlace(0.1);

 // Optional: Lock camera on the character
 // If you have a camera named 'camera1' in your scene, you can uncomment the next line to focus it on the loaded model
 // camera1.target = hero;

 // Retrieve a specific animation group by name; in this case, 'Samba'
 const sambaAnim = scene.getAnimationGroupByName("Samba");

 // Play the 'Samba' animation
 sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
});
```

This snippet shows the process of loading a model named "HVGirl.glb" from the specified URL, scaling it down for appropriate scene sizing, and then finding and playing an animation group named "Samba". 
It's important to adapt the example to fit the specifics of your scene, including the camera setup and the names and types of animations associated with your model. Remember, the loading process is asynchronous, ensuring your application remains responsive as assets are loaded.

## Cameras and Lighting 

Understanding [cameras](https://doc.babylonjs.com/features/featuresDeepDive/cameras) and [lighting](https://doc.babylonjs.com/features/featuresDeepDive/lights) is crucial for creating immersive 3D scenes in Babylon.js. These elements control not only what the viewer sees but also how the scene is perceived. This section will introduce the different types of cameras and lights available in Babylon.js, along with techniques to implement shadows and reflections, enhancing the realism and depth of your scenes.

Different Types of Cameras and When to Use Them
1. FreeCamera: Ideal for first-person or exploration-based experiences, the FreeCamera allows users to navigate the scene freely, controlling the view with keyboard and mouse inputs.

```javascript
var camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 5, -10), scene);
camera.attachControl(canvas, true);
```

2. ArcRotateCamera: Best suited for orbiting around a specific point or object, the ArcRotateCamera is often used in product showcases or any scenario where the subject remains central, and the camera orbits around it.

```javascript
var camera = new BABYLON.ArcRotateCamera("arcCamera", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
```

3. UniversalCamera: Combining the features of FreeCamera and TouchCamera, the UniversalCamera is versatile, supporting multiple input methods (keyboard, mouse, touch) and is useful for a wide range of applications.

```javascript
var camera = new BABYLON.UniversalCamera("universalCamera", new BABYLON.Vector3(0, 5, -10), scene);
camera.attachControl(canvas, true);
```

4. FollowCamera: When you need the camera to follow a moving object while maintaining a consistent distance and angle, the FollowCamera is the perfect choice. It's great for third-person perspectives in games or simulations.

```javascript
var camera = new BABYLON.FollowCamera("followCamera", new BABYLON.Vector3(0, 5, -10), scene);
camera.lockedTarget = movingObject; // The object to follow
```

### Basic Lighting Techniques and Types of Lights

Lighting in Babylon.js can dramatically affect the mood, tone, and realism of your scene. Here are the primary types of lights you can utilize:

1. PointLight: Emits light in all directions from a single point. Useful for simulating light sources like bulbs or candles.

```javascript
var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, 0), scene);
```

2. DirectionalLight: Parallel light rays emitted in a specific direction. Ideal for simulating sunlight or other distant, directional light sources.

```javascript
var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, -1, 0), scene);
```

3. SpotLight: Emits a cone of light from a specific point in a specific direction. Perfect for focusing on specific scene elements like stage performances or highlighting objects.

```javascript
var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
```

4. HemisphericLight: Simulates ambient light by illuminating all objects equally from a given direction, as if the scene is lit by a sky.

```javascript
var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
```

With cameras, lighting you can create Babylon.js scenes that are not only visually appealing but also convey the right atmosphere and depth, making your 3D projects much more immersive and engaging.






## Materials and Textures 
Materials and textures are essential components in 3D graphics, adding realism and depth to your scenes. In Babylon.js, materials define the visual appearance of meshes in terms of color, shininess, transparency, and texture. Textures, on the other hand, are images mapped onto the surface of these materials to give them a detailed appearance, such as wood grain, metal, or fabric.

To find out more about materials and textures in Babylon.js, you can check out the documentation [here](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction).

## Applying Materials to Objects
Materials in Babylon.js are used to specify how objects reflect light and display color. The StandardMaterial is a versatile material type that allows for a wide range of visual effects. Here’s a breakdown of how to create a StandardMaterial and configure its properties:

```javascript
var material = new BABYLON.StandardMaterial("standardMaterial", scene);
material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color
material.specularColor = new BABYLON.Color3(0, 1, 0); // Green highlights
material.emissiveColor = new BABYLON.Color3(0, 0, 1); // Blue glow
material.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Medium gray ambient light
box.material = material;
```

- diffuseColor: Defines the basic color of the material when lit by a white light.
- specularColor: Determines the color and intensity of the highlights created when light reflects off the material.
- emissiveColor: Represents the color that the material appears to emit. This color adds to the material's overall color without being affected by lighting.
- ambientColor: Influences the material's color based on the ambient lighting in the scene, adding to its overall color.

### Applying Textures to Materials
Textures allow you to apply images to the surfaces of materials for added realism. Here's how to texture a material with an image:

```javascript
var material = new BABYLON.StandardMaterial("textureMaterial", scene);
material.diffuseTexture = new BABYLON.Texture("path/to/your/image.png", scene);
box.material = material;
```

In this example, a texture is applied as the diffuseTexture of the material, which affects the color and appearance of the material under direct light. This can be particularly useful for creating realistic surfaces or applying branding and decals to objects.

Textures are not limited to diffuse maps. Babylon.js supports a variety of texture types, including bump maps for simulating surface irregularities, opacity maps for transparency, and reflection maps for creating reflective surfaces, among others. Each texture type contributes to making the scene more dynamic and visually complex.



## Interactivity and User Input

Creating interactive 3D scenes involves responding to user inputs, such as keyboard presses and mouse clicks, to manipulate objects or navigate through the scene. Babylon.js provides a straightforward and powerful system for handling user inputs, enabling the creation of dynamic and interactive experiences. This section covers the basics of handling keyboard and mouse inputs and illustrates how to make objects interactive within your Babylon.js projects. You can add find out more in the docs [here](https://doc.babylonjs.com/features/featuresDeepDive/input).

### Handling Keyboard Inputs
To react to keyboard events, you can use the onKeyboardObservable event on the scene. This observable allows you to listen for keyboard events and execute code based on the key pressed or released. Here's an example of moving an object when specific keys are pressed:

```javascript
scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
            console.log("KEY DOWN: ", kbInfo.event.key);
            // Move forward
            if (kbInfo.event.key === "w" || kbInfo.event.key === "W") {
                box.position.z -= 0.1;
            }
            // Move backward
            if (kbInfo.event.key === "s" || kbInfo.event.key === "S") {
                box.position.z += 0.1;
            }
            // Move left
            if (kbInfo.event.key === "a" || kbInfo.event.key === "A") {
                box.position.x -= 0.1;
            }
            // Move right
            if (kbInfo.event.key === "d" || kbInfo.event.key === "D") {
                box.position.x += 0.1;
            }
            break;
        case BABYLON.KeyboardEventTypes.KEYUP:
            console.log("KEY UP: ", kbInfo.event.key);
            break;
    }
});
```


This snippet listens for arrow key presses and moves a box object in the direction of the WASD key pressed, demonstrating a simple way to create keyboard-driven navigation or movement within your scene.

### Handling Mouse Click
Mouse inputs can be captured to implement actions like selecting, dragging, or interacting with objects. Babylon.js scenes automatically capture mouse events on the canvas, and you can use these events to trigger interactions. For instance, to perform an action when a mesh is clicked, you can utilize the ActionManager and ExecuteCodeAction:

```javascript
box.actionManager = new BABYLON.ActionManager(scene);
box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
    // Action to be performed when the box is clicked
    box.scaling.x *= 1.1;
    box.scaling.y *= 1.1;
    box.scaling.z *= 1.1;
}));
```


### Handling Mouse Drag
To implement dragging functionality for a box (or any mesh) in Babylon.js, you can use the PointerDragBehavior. This behavior provides an easy way to make objects draggable within your scene with just a few lines of code. Here’s how you can do it:

Attach the PointerDragBehavior to Your Mesh:
First, you need to create an instance of PointerDragBehavior and attach it to your mesh. This behavior will handle all the necessary events and updates to move the mesh as you drag it with the mouse.

```javascript
var box = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene); // Create a box

var dragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
box.addBehavior(dragBehavior);
```

In this example, dragPlaneNormal is set to (0, 1, 0), which means the drag plane is perpendicular to the Y-axis, allowing you to drag the box along the ground plane. You can adjust this vector to change the dragging plane according to your needs.





## WebXR
WebXR is a cutting-edge technology that allows developers to create immersive VR (Virtual Reality) and AR (Augmented Reality) experiences directly in the web browser, without the need for external software or apps. Babylon.js provides comprehensive support for WebXR, making it straightforward to integrate immersive experiences into your 3D projects. This section explores how to set up a basic AR session in Babylon.js using WebXR. You can find out more in the docs [here](https://doc.babylonjs.com/features/featuresDeepDive/webXR).

### Setting Up a WebXR AR Session
To get started with WebXR in Babylon.js, you'll first need to ensure your project is running on a server due to browser security restrictions related to accessing VR/AR hardware. Then, you can initiate a WebXR experience using the createDefaultXRExperienceAsync method, which sets up the necessary components for WebXR in your scene.

The following example demonstrates how to start an immersive AR session:

```javascript
var xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: "immersive-ar",
    },
    optionalFeatures: true,
});
```

Using `createDefaultXRExperienceAsync` you can configure a WebXR experience with features an options that enhance the AR experience, such as hit testing and plane detection. The `sessionMode` is set to "immersive-ar" to request an AR session from the browser.

- uiOptions: Defines the user interface options for the WebXR session. Setting sessionMode to "immersive-ar" requests an AR session from the browser.
- optionalFeatures: Enabling this option allows Babylon.js to request additional WebXR features that enhance the AR experience, such as hit testing, plane detection, and more.
- Key Concepts of WebXR in Babylon.js
- Immersive AR: This mode provides a fully immersive AR experience by overlaying digital content onto the real world as seen through the device's camera.
- Session Management: Handling WebXR sessions is crucial. Babylon.js offers methods to easily start, manage, and end WebXR sessions.
- User Interaction: Interacting with virtual objects in AR requires different approaches compared to traditional 3D scenes. Babylon.js supports a variety of interaction models for WebXR.
- Performance Considerations: AR and VR experiences can be demanding. Optimizing your models and logic for performance is essential to ensure a smooth user experience.


## Continuing Your Journey
Congratulations on making it through this crash course on Babylon.js! By now, you've gained a solid foundation in creating 3D scenes, handling user inputs, integrating WebXR, and much more. However, the journey into 3D web development doesn't stop here. Babylon.js is a vast and versatile engine, offering many more features and capabilities that we couldn't cover in detail in this introductory course. To further enhance your projects and skills, it's crucial to explore additional aspects of Babylon.js. Here are some key areas to dive into next:

### Shadows and Reflections
Adding [shadows](https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows) and [reflections](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture) can dramatically increase the realism of your scenes. Babylon.js offers sophisticated tools to create dynamic shadows cast by lights onto objects, as well as realistic reflections on surfaces like water, mirrors, and polished metals. Mastering these features can take your visual presentations to the next level.

### Physics and Collisions
Integrating [physics](https://doc.babylonjs.com/communityExtensions/editor/physics/usingPhysics) into your Babylon.js scenes adds another layer of interactivity and realism. The engine supports advanced physics simulations, including gravity, collisions, and complex interactions between objects. Whether you're developing a game or an interactive simulation, understanding how to apply physics and manage collisions is essential.

### Performance Optimization
Creating visually stunning scenes is exciting, but ensuring they run smoothly across a wide range of devices requires careful attention to [performance optimization](https://doc.babylonjs.com/toolsAndResources/inspector/performanceProfiler). Babylon.js provides several tools and techniques to help optimize your scenes, such as [level of detail (LOD)](https://doc.babylonjs.com/features/featuresDeepDive/mesh/simplifyingMeshes), [mesh instancing](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies) and texture compression. Learning how to effectively use these tools will enable you to create complex scenes that are both beautiful and performant.

### Debugging and Tools
Babylon.js comes equipped with a powerful set of debugging and diagnostic tools to help you troubleshoot and fine-tune your projects. The [Babylon.js Inspector](https://doc.babylonjs.com/toolsAndResources/inspector), for example, is an invaluable tool for inspecting and modifying properties of your scene in real-time. Familiarizing yourself with these tools can greatly accelerate your development process and improve the quality of your projects.

## Wrapping Up
The official Babylon.js documentation is an excellent resource for exploring these advanced features and much more. It's regularly updated with tutorials, API references, and examples covering every aspect of the engine. The Babylon.js community is also an active and supportive space where you can share your projects, ask questions, and learn from other developers.

As you continue to build your skills and explore new features, remember that practice and experimentation are key. Try integrating new elements into your projects, challenge yourself with more complex scenes, and don't be afraid to push the boundaries of what you can create with Babylon.js.

Thank you for participating in this crash course. Your journey into the world of 3D web development with Babylon.js is just beginning, and the possibilities are as limitless as your imagination. Happy coding!
