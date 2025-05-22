"use client"

import { useRef } from "react"
import { View, Button, StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"

const VelocityFormulas = () => {
  const webViewRef = useRef(null)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Velocity Formulas with Matter.js</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
        <style>
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                font-family: Arial, sans-serif;
                background-color: #f0f8ff;
            }
            canvas {
                display: block;
            }
            .info-panel {
                position: absolute;
                top: 20px;
                margin: 0px 10px;
                background: rgba(255, 255, 255, 0.95);
                padding: 18px;
                border-radius: 12px;
                max-width: 350px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border: 1px solid #A8E2D0;
            }
            h2 {
                margin-top: 0;
                color: #20B486;
                font-size: 20px;
                margin-bottom: 15px;
            }
            .formula {
                font-family: 'Courier New', monospace;
                margin: 10px 0;
                padding: 10px;
                background: #f5f9f7;
                border-radius: 8px;
                font-size: 16px;
                border-left: 3px solid #20B486;
                color: #1C9777;
            }
            .car-info {
                margin-top: 15px;
                border-top: 1px solid #A8E2D0;
                padding-top: 15px;
            }
            .car-info p {
                margin: 8px 0;
                color: #333;
            }
            .car-info strong {
                color: #20B486;
            }
            .car-info span {
                font-weight: bold;
                color: #1C9777;
            }
            .controls {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 15px;
            }
            button {
                padding: 10px 20px;
                background: #17A97B;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                min-width: 120px;
                transition: background 0.2s;
            }
            button:hover {
                background: #20B486;
            }
            .track {
                position: absolute;
                bottom: 100px;
                width: 100%;
                height: 20px;
                background: #1C9777;
            }
        </style>
    </head>
    <body>
        <div class="info-panel">
            <h2>Velocity Formulas Demonstration</h2>
            
            <div class="formula">1. s = vt (Constant velocity)</div>
            <div class="formula">2. s = ut + ½at² (Constant acceleration)</div>
            <div class="formula">3. v = u + at (Velocity with acceleration)</div>
            
            <div class="car-info">
                <p><strong>Car 1 (Green):</strong> Constant velocity (s=vt)</p>
                <p>Displacement: <span id="car1-displacement">0</span> m</p>
                <p>Velocity: <span id="car1-velocity">5</span> m/s</p>
            </div>
            
            <div class="car-info">
                <p><strong>Car 2 (Teal):</strong> Constant acceleration (s=ut+½at², v=u+at)</p>
                <p>Displacement: <span id="car2-displacement">0</span> m</p>
                <p>Velocity: <span id="car2-velocity">0</span> m/s</p>
                <p>Acceleration: <span id="car2-acceleration">2</span> m/s²</p>
            </div>
        </div>
        
        <div class="track"></div>
        <canvas id="canvas"></canvas>
        
        
        <script>
            // Matter.js module aliases
            const Engine = Matter.Engine,
                  Render = Matter.Render,
                  Runner = Matter.Runner,
                  Bodies = Matter.Bodies,
                  Body = Matter.Body,
                  Composite = Matter.Composite;
            
            // Create engine
            const engine = Engine.create({
                gravity: { x: 0, y: 0 } // No gravity
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
                    background: '#f0f8ff'
                }
            });
            
            // Create cars
            const carWidth = 60;
            const carHeight = 30;
            const groundY = window.innerHeight - 100;
            
            // Car 1 - Constant velocity (s = vt)
            const car1 = Bodies.rectangle(100, groundY - carHeight/2, carWidth, carHeight, {
                friction: 0,
                restitution: 0,
                render: { 
                    fillStyle: '#20B486',
                    strokeStyle: '#A8E2D0',
                    lineWidth: 2
                }
            });
            
            // Car 2 - Constant acceleration (s = ut + ½at², v = u + at)
            const car2 = Bodies.rectangle(100, groundY - carHeight/2 - 50, carWidth, carHeight, {
                friction: 0,
                restitution: 0,
                render: { 
                    fillStyle: '#17A97B',
                    strokeStyle: '#A8E2D0',
                    lineWidth: 2
                }
            });
            
            // Ground
            const ground = Bodies.rectangle(window.innerWidth/2, groundY, window.innerWidth, 10, {
                isStatic: true,
                render: { fillStyle: '#1C9777' }
            });
            
            // Add all to the world
            Composite.add(engine.world, [car1, car2, ground]);
            
            // Run the renderer
            Render.run(render);
            
            // Create runner
            const runner = Runner.create();
            Runner.run(runner, engine);
            
            // Simulation variables
            let lastTime = 0;
            let simulationTime = 0;
            let isRunning = false;
            
            // Car properties
            const car1Velocity = 5; // m/s (constant)
            const car2InitialVelocity = 0; // m/s
            const car2Acceleration = 2; // m/s²
            
            // Start simulation
            function startSimulation() {
                isRunning = true;
                lastTime = Date.now();
                simulationTime = 0;
                
                // Reset car positions
                Body.setPosition(car1, { x: 100, y: groundY - carHeight/2 });
                Body.setPosition(car2, { x: 100, y: groundY - carHeight/2 - 50 });
                
                // Reset velocities
                Body.setVelocity(car1, { x: car1Velocity, y: 0 });
                Body.setVelocity(car2, { x: car2InitialVelocity, y: 0 });
                
                // Start animation loop
                requestAnimationFrame(updateSimulation);
            }
            
            // Reset simulation
            function resetSimulation() {
                isRunning = false;
                simulationTime = 0;
                
                Body.setPosition(car1, { x: 100, y: groundY - carHeight/2 });
                Body.setPosition(car2, { x: 100, y: groundY - carHeight/2 - 50 });
                
                Body.setVelocity(car1, { x: 0, y: 0 });
                Body.setVelocity(car2, { x: 0, y: 0 });
                
                // Update displays
                document.getElementById('car1-displacement').textContent = '0';
                document.getElementById('car1-velocity').textContent = car1Velocity.toFixed(1);
                document.getElementById('car2-displacement').textContent = '0';
                document.getElementById('car2-velocity').textContent = '0';
                document.getElementById('car2-acceleration').textContent = car2Acceleration.toFixed(1);
            }
            
            // Update simulation
            function updateSimulation() {
                if (!isRunning) return;
                
                const currentTime = Date.now();
                const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
                lastTime = currentTime;
                
                simulationTime += deltaTime;
                
                // Car 1 - Constant velocity (s = vt)
                const car1Displacement = car1Velocity * simulationTime;
                Body.setPosition(car1, { x: 100 + car1Displacement, y: groundY - carHeight/2 });
                
                // Car 2 - Constant acceleration (s = ut + ½at², v = u + at)
                const car2Velocity = car2InitialVelocity + car2Acceleration * simulationTime;
                const car2Displacement = car2InitialVelocity * simulationTime + 0.5 * car2Acceleration * Math.pow(simulationTime, 2);
                Body.setPosition(car2, { x: 100 + car2Displacement, y: groundY - carHeight/2 - 50 });
                Body.setVelocity(car2, { x: car2Velocity, y: 0 });
                
                // Update displays
                document.getElementById('car1-displacement').textContent = car1Displacement.toFixed(1);
                document.getElementById('car1-velocity').textContent = car1Velocity.toFixed(1);
                document.getElementById('car2-displacement').textContent = car2Displacement.toFixed(1);
                document.getElementById('car2-velocity').textContent = car2Velocity.toFixed(1);
                
                // Check if cars reached the end
                if (car1.position.x > window.innerWidth - 50 || car2.position.x > window.innerWidth - 50) {
                    isRunning = false;
                    return;
                }
                
                requestAnimationFrame(updateSimulation);
            }
            
            // Handle resize
            window.addEventListener('resize', function() {
                render.options.width = window.innerWidth;
                render.options.height = window.innerHeight;
                Render.setPixelRatio(render, window.devicePixelRatio);
            });
            
            // Initialize
            resetSimulation();
        </script>
    </body>
    </html>
  `

  const startSimulation = () => {
    webViewRef.current?.injectJavaScript(`
      startSimulation();
      true;
    `)
  }

  const resetSimulation = () => {
    webViewRef.current?.injectJavaScript(`
      resetSimulation();
      true;
    `)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Physics Velocity Formulas</Text>
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
        <Button  title="Start Simulation" onPress={startSimulation} color="#20B486" />
        <View style={styles.buttonSpacer} />
        <Button title="Reset" onPress={resetSimulation} color="#17A97B" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#20B486",
    paddingHorizontal: 20,
  },
  webview: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#A8E2D0",
  },
  buttonSpacer: {
    width: 20,
  },
})

export default VelocityFormulas
