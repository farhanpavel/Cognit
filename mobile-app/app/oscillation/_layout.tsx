"use client";

import { useRef } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import WebView from "react-native-webview";

const PendulumSwing = () => {
  const webViewRef = useRef(null);
  const pendulumLength = 300; // Define pendulumLength at the component level

  const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pendulum with Matter.js</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    font-family: Arial, sans-serif;
                }
                canvas {
                    display: block;
                }
                .info-panel {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 10px;
                    border-radius: 5px;
                    max-width: 300px;
                }
                .formula {
                    font-family: 'Courier New', monospace;
                    margin: 5px 0;
                    padding: 5px;
                    background: #f0f0f0;
                    border-radius: 3px;
                }
                .controls {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                }
                button {
                    padding: 8px 12px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="info-panel">
                <h3>Pendulum Physics</h3>
                <p>Period (T) of a simple pendulum:</p>
                <div class="formula">T = 2π√(L/g)</div>
                <p>Where:</p>
                <ul>
                    <li>T = Period (seconds)</li>
                    <li>L = Length of pendulum (meters)</li>
                    <li>g = Acceleration due to gravity (9.81 m/s²)</li>
                </ul>
                <p>Current angle: <span id="angle">0</span>°</p>
                <p>Angular velocity: <span id="velocity">0</span> rad/s</p>
            </div>
            <canvas id="canvas"></canvas>
            <script>
                // Matter.js module aliases
                const Engine = Matter.Engine,
                      Render = Matter.Render,
                      Runner = Matter.Runner,
                      Bodies = Matter.Bodies,
                      Body = Matter.Body,
                      Composite = Matter.Composite,
                      Mouse = Matter.Mouse,
                      MouseConstraint = Matter.MouseConstraint;

                // Create engine
                const engine = Engine.create({
                    gravity: { x: 0, y: 1 } // Standard gravity
                });

                // Create renderer
                const canvas = document.getElementById('canvas');
                const render = Render.create({
                    canvas: canvas,
                    engine: engine,
                    options: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        wireframes: false,
                        background: '#f5f5f5'
                    }
                });

                // Create pendulum components
                const pendulumLength = 300;
                const bobRadius = 30;
                const anchor = Bodies.circle(window.innerWidth / 2, 100, 10, {
                    isStatic: true,
                    render: { fillStyle: '#333333' }
                });
                
                const bob = Bodies.circle(window.innerWidth / 2, 100 + pendulumLength, bobRadius, {
                    restitution: 0.8,
                    friction: 0.005,
                    render: { fillStyle: '#FF5722' }
                });

                // Create constraint (the pendulum string)
                const constraint = Matter.Constraint.create({
                    pointA: { x: anchor.position.x, y: anchor.position.y },
                    bodyB: bob,
                    stiffness: 1,
                    render: {
                        type: 'line',
                        strokeStyle: '#333333',
                        lineWidth: 2
                    }
                });

                // Add all to the world
                Composite.add(engine.world, [anchor, bob, constraint]);

                // Run the renderer
                Render.run(render);

                // Create runner
                const runner = Runner.create();
                Runner.run(runner, engine);

                // Mouse control
                const mouse = Mouse.create(render.canvas);
                const mouseConstraint = MouseConstraint.create(engine, {
                    mouse: mouse,
                    constraint: {
                        stiffness: 0.2,
                        render: {
                            visible: false
                        }
                    }
                });
                Composite.add(engine.world, mouseConstraint);
                render.mouse = mouse;

                // Handle resize
                window.addEventListener('resize', function() {
                    render.options.width = window.innerWidth;
                    render.options.height = window.innerHeight;
                    Render.setPixelRatio(render, window.devicePixelRatio);
                    Body.setPosition(anchor, { x: window.innerWidth / 2, y: 100 });
                    Body.setPosition(bob, { x: window.innerWidth / 2, y: 100 + pendulumLength });
                    constraint.pointA = { x: window.innerWidth / 2, y: 100 };
                });

                // Swing functions
                function swingPendulum() {
                    Body.setPosition(bob, { x: window.innerWidth / 2 + 200, y: 100 + pendulumLength });
                    Body.setVelocity(bob, { x: 0, y: 0 });
                    Body.setAngularVelocity(bob, 0);
                }

                function fastSwingPendulum() {
                    Body.setPosition(bob, { x: window.innerWidth / 2 + 300, y: 100 + pendulumLength });
                    Body.setVelocity(bob, { x: 0, y: 0 });
                    Body.setAngularVelocity(bob, -2); // Add initial angular velocity for faster swing
                }

                function resetPendulum() {
                    Body.setPosition(bob, { x: window.innerWidth / 2, y: 100 + pendulumLength });
                    Body.setVelocity(bob, { x: 0, y: 0 });
                    Body.setAngularVelocity(bob, 0);
                }

                // Update info panel
                function updateInfo() {
                    // Calculate angle
                    const dx = bob.position.x - anchor.position.x;
                    const dy = bob.position.y - anchor.position.y;
                    const angle = Math.atan2(dx, dy) * (180 / Math.PI);
                    
                    // Get angular velocity
                    const velocity = bob.angularVelocity.toFixed(2);
                    
                    // Update DOM
                    document.getElementById('angle').textContent = angle.toFixed(1);
                    document.getElementById('velocity').textContent = velocity;
                    
                    requestAnimationFrame(updateInfo);
                }
                
                updateInfo();
            </script>
        </body>
        </html>
    `;

  const swingPendulum = () => {
    webViewRef.current.injectJavaScript(`
      swingPendulum();
      true;
    `);
  };

  const fastSwingPendulum = () => {
    webViewRef.current.injectJavaScript(`
      fastSwingPendulum();
      true;
    `);
  };

  const resetPendulum = () => {
    webViewRef.current.injectJavaScript(`
      resetPendulum();
      true;
    `);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pendulum Physics Simulation</Text>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
      <View style={styles.controls}>
        <Button title="Swing" onPress={swingPendulum} />
        <Button title="Fast Swing" onPress={fastSwingPendulum} />
        <Button title="Reset" onPress={resetPendulum} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10
  },
  webview: {
    flex: 1
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    gap: 10
  }
});

export default PendulumSwing;
