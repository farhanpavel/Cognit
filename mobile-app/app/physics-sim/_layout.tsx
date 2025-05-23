"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const PhysicsSimulator = () => {
  const webViewRef = useRef<WebView>(null);
  const shakeCountRef = useRef(0);
  const shakeTimeoutRef = useRef(null);
  const accelerometerSubscriptionRef = useRef(null);
  const isMountedRef = useRef(true);
  const handleShakeSpeak = useCallback(() => {
    if (!isMountedRef.current) return;

    // First stop any ongoing speech from other components
    Speech.stop();

    // Then speak this component's message
    Speech.speak(
      "This part demonstrate all the neuton law from first to third",
      {
        language: "en",
        onDone: () => console.log("Finished speaking"),
        onError: (e) => console.log("Speech error:", e)
      }
    );
  }, []);
  useEffect(() => {
    isMountedRef.current = true;

    const handleShake = ({ x, y, z }) => {
      if (!isMountedRef.current) return;

      const acceleration = Math.sqrt(x * x + y * y + z * z);
      if (acceleration > 1.5) {
        shakeCountRef.current += 1;

        if (shakeTimeoutRef.current) {
          clearTimeout(shakeTimeoutRef.current);
        }

        shakeTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            shakeCountRef.current = 0;
          }
        }, 1500);

        if (shakeCountRef.current >= 2) {
          shakeCountRef.current = 0;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleShakeSpeak();
        }
      }
    };

    // Setup accelerometer
    accelerometerSubscriptionRef.current =
      Accelerometer.addListener(handleShake);

    return () => {
      isMountedRef.current = false;

      // Cleanup accelerometer
      if (accelerometerSubscriptionRef.current) {
        accelerometerSubscriptionRef.current.remove();
      }

      // Clear any pending timeouts
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }

      // Stop any ongoing speech
      Speech.stop();
    };
  }, [handleShakeSpeak]);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
  <style>
    body { 
      margin: 0; 
      overflow: hidden; 
      touch-action: none;
      font-family: Arial;
    }
    #canvas { 
      display: block; 
      background: #f0f8ff;
    }
    .law-panel {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      max-width: 300px;
    }
    .law-title {
      font-weight: bold;
      color: #20B486;
      margin-bottom: 5px;
    }
    .law-description {
      font-size: 14px;
      color: #1C9777;
    }
    .controls {
      position: absolute;
      bottom: 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    button {
      padding: 8px 15px;
      background: #20B486;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #17A97B;
    }
    .force-indicator {
      position: absolute;
      color: #20B486;
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
    }
    .mass-indicator {
      position: absolute;
      bottom: 80px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .mass-control {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    .mass-control button {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .mass-value {
      margin: 0 10px;
      width: 40px;
      text-align: center;
      color: #1C9777;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="law-panel">
    <div class="law-title" id="lawTitle">Newton's First Law</div>
    <div class="law-description" id="lawDesc">
      An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.
    </div>
  </div>
  
  <div class="mass-indicator">
    <div style="color: #20B486; font-weight: bold;">Mass Control</div>
    <div class="mass-control">
      <button onclick="decreaseMass()">-</button>
      <span class="mass-value" id="massValue">1</span>
      <button onclick="increaseMass()">+</button>
    </div>
    <div style="color: #1C9777;">Force: <span id="forceValue" style="font-weight: bold;">0</span></div>
    <div style="color: #1C9777;">Acceleration: <span id="accelerationValue" style="font-weight: bold;">0</span></div>
  </div>
  
  <canvas id="canvas"></canvas>
  
  <div class="controls">
    <button onclick="applyForce('small')">Small Force</button>
    <button onclick="applyForce('medium')">Medium Force</button>
    <button onclick="applyForce('large')">Large Force</button>
    <button onclick="resetSimulation()">Reset</button>
  </div>

  <script>
    const { Engine, Render, Bodies, World, Body, Composite, Vector } = Matter;

    // Physics engine setup
    const engine = Engine.create({
      gravity: { x: 0, y: 0 } // No gravity to better demonstrate Newton's laws
    });
    const world = engine.world;
    const canvas = document.getElementById('canvas');
    
    // Responsive canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Renderer
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false,
        background: '#f0f8ff',
        showVelocity: true
      }
    });

    // Variables for simulation
    let block;
    let blockMass = 1;
    let lastForce = { x: 0, y: 0 };
    let forceIndicator = document.createElement('div');
    forceIndicator.className = 'force-indicator';
    document.body.appendChild(forceIndicator);

    // Create physics objects
    function createBlock() {
      return Bodies.rectangle(canvas.width/2, canvas.height/2, 80, 40, { 
        restitution: 0.7,
        friction: 0.005,
        frictionAir: 0.001, // Low air friction to demonstrate first law
        mass: blockMass,
        render: { 
          fillStyle: '#20B486',
          strokeStyle: '#A8E2D0',
          lineWidth: 2
        }
      });
    }

    const floor = Bodies.rectangle(canvas.width/2, canvas.height-30, canvas.width, 60, { 
      isStatic: true,
      render: { fillStyle: '#1C9777' }
    });

    const leftWall = Bodies.rectangle(0, canvas.height/2, 40, canvas.height, { 
      isStatic: true,
      render: { fillStyle: '#1C9777' }
    });

    const rightWall = Bodies.rectangle(canvas.width, canvas.height/2, 40, canvas.height, { 
      isStatic: true,
      render: { fillStyle: '#1C9777' }
    });

    const topWall = Bodies.rectangle(canvas.width/2, 0, canvas.width, 40, { 
      isStatic: true,
      render: { fillStyle: '#1C9777' }
    });

    // Initialize simulation
    function initSimulation() {
      block = createBlock();
      World.add(world, [block, floor, leftWall, rightWall, topWall]);
    }

    // Mass control functions
    function increaseMass() {
      blockMass += 0.5;
      updateMassDisplay();
      resetSimulation();
    }

    function decreaseMass() {
      if (blockMass > 0.5) {
        blockMass -= 0.5;
        updateMassDisplay();
        resetSimulation();
      }
    }

    function updateMassDisplay() {
      document.getElementById('massValue').textContent = blockMass.toFixed(1);
    }

    // Apply force (Second Law demo)
    function applyForce(magnitude) {
      let forceX, forceY;
      
      switch(magnitude) {
        case 'small':
          forceX = 0.01;
          break;
        case 'medium':
          forceX = 0.03;
          break;
        case 'large':
          forceX = 0.06;
          break;
        default:
          forceX = 0.01;
      }
      
      // Random direction
      forceX *= (Math.random() > 0.5 ? 1 : -1);
      forceY = -0.01 * (Math.random() > 0.5 ? 1 : -1);
      
      lastForce = { x: forceX, y: forceY };
      Body.applyForce(block, block.position, { x: forceX, y: forceY });
      
      // Calculate and display acceleration (F = ma, so a = F/m)
      const forceValue = Math.sqrt(forceX * forceX + forceY * forceY);
      const accelerationValue = forceValue / blockMass;
      
      document.getElementById('forceValue').textContent = forceValue.toFixed(4);
      document.getElementById('accelerationValue').textContent = accelerationValue.toFixed(4);
      
      updateLawDisplay("SECOND");
      
      // Show force vector
      showForceIndicator(block.position, { x: forceX * 2000, y: forceY * 2000 });
    }

    // Show force indicator arrow
    function showForceIndicator(position, force) {
      const scale = 5000; // Scale to make the force visible
      const endX = position.x + force.x * scale;
      const endY = position.y + force.y * scale;
      
      forceIndicator.style.left = position.x + 'px';
      forceIndicator.style.top = position.y + 'px';
      forceIndicator.textContent = '→ Force';
      
      // Hide after 2 seconds
      setTimeout(() => {
        forceIndicator.textContent = '';
      }, 2000);
    }

    // Reset simulation (First Law demo)
    function resetSimulation() {
      Composite.clear(world);
      initSimulation();
      updateLawDisplay("FIRST");
      document.getElementById('forceValue').textContent = '0';
      document.getElementById('accelerationValue').textContent = '0';
    }

    // Update educational content
    function updateLawDisplay(law) {
      const titleEl = document.getElementById('lawTitle');
      const descEl = document.getElementById('lawDesc');
      
      switch(law) {
        case "FIRST":
          titleEl.textContent = "Newton's First Law (Inertia)";
          descEl.textContent = "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. The block will remain stationary until a force is applied.";
          break;
        case "SECOND":
          titleEl.textContent = "Newton's Second Law (F=ma)";
          descEl.textContent = "Force equals mass times acceleration (F=ma). With the same force, a more massive object accelerates less. Try changing the mass and applying the same force to see the difference in acceleration.";
          break;
        case "THIRD":
          titleEl.textContent = "Newton's Third Law (Action-Reaction)";
          descEl.textContent = "For every action, there is an equal and opposite reaction. When the block collides with a wall, both the block and wall experience equal and opposite forces.";
          break;
      }
    }

    // Detect collisions for Third Law demo
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair.bodyA === block || pair.bodyB === block) {
          updateLawDisplay("THIRD");
          
          // Show reaction force
          const velocity = block.velocity;
          const reactionForce = { 
            x: -velocity.x * block.mass * 0.1, 
            y: -velocity.y * block.mass * 0.1 
          };
          
          // Update force and acceleration displays for the collision
          const forceValue = Math.sqrt(reactionForce.x * reactionForce.x + reactionForce.y * reactionForce.y);
          const accelerationValue = forceValue / blockMass;
          
          document.getElementById('forceValue').textContent = forceValue.toFixed(4);
          document.getElementById('accelerationValue').textContent = accelerationValue.toFixed(4);
        }
      }
    });

    // Start the engine
    Engine.run(engine);
    Render.run(render);

    // Initial setup
    initSimulation();
    updateMassDisplay();
  </script>
</body>
</html>
  `;

  const handleReset = () => {
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff"
  },
  webview: {
    flex: 1
  }
});

export default PhysicsSimulator;
