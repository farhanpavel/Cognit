"use client";

import { useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import WebView from "react-native-webview";

const Light = () => {
  const webViewRef = useRef(null);

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
      padding: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
      background-color: #1a1a2e;
    }
    
    #canvas-container {
      position: relative;
      width: 100%;
      height: 100vh;
    }
    
    canvas {
      display: block;
    }
    
    .control-panel {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      width: 280px;
      z-index: 100;
    }
    
    .info-panel {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      width: 280px;
      z-index: 100;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
      margin-bottom: 15px;
    }
    
    .input-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input[type="range"] {
      width: 100%;
      margin-bottom: 5px;
    }
    
    .current-value {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .formula-section {
      margin-top: 15px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 5px;
      border-left: 4px solid #4a90e2;
    }
    
    .formula {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .result-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    
    .light-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(255, 255, 100, 0) 0%, rgba(255, 255, 100, 0) 100%);
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .electron {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #4a90e2;
      border-radius: 50%;
      z-index: 5;
    }
    
    button {
      background: #4a90e2;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 10px;
    }
    
    button:hover {
      background: #3a80d2;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <div class="light-overlay" id="light-effect"></div>
    <div id="electrons-container"></div>
    
    <div class="control-panel">
      <h2>Light Bulb Current Control</h2>
      
      <div class="input-group">
        <label for="current-slider">Current (Amperes):</label>
        <input type="range" id="current-slider" min="0" max="10" step="0.1" value="0">
        <div class="current-value">
          <span>0 A</span>
          <span id="current-value-display">0 A</span>
          <span>10 A</span>
        </div>
      </div>
      
      <div class="input-group">
        <label for="voltage-slider">Voltage (Volts):</label>
        <input type="range" id="voltage-slider" min="0" max="220" step="1" value="0">
        <div class="current-value">
          <span>0 V</span>
          <span id="voltage-value-display">0 V</span>
          <span>220 V</span>
        </div>
      </div>
      
      <div class="formula-section">
        <div class="formula">P = I × V</div>
        <p>Power (Watts) = Current (Amperes) × Voltage (Volts)</p>
        <div class="result-row">
          <span>Power:</span>
          <span id="power-value">0 W</span>
        </div>
      </div>
      
      <button id="toggle-switch">Turn On/Off</button>
    </div>
    
    <div class="info-panel">
      <h2>Electrical Information</h2>
      
      <div class="result-row">
        <span>Bulb Status:</span>
        <span id="bulb-status">Off</span>
      </div>
      
      <div class="result-row">
        <span>Current Flow:</span>
        <span id="current-flow">0 A</span>
      </div>
      
      <div class="result-row">
        <span>Voltage:</span>
        <span id="voltage-display">0 V</span>
      </div>
      
      <div class="result-row">
        <span>Power:</span>
        <span id="power-display">0 W</span>
      </div>
      
      <div class="result-row">
        <span>Resistance:</span>
        <span id="resistance-display">100 Ω</span>
      </div>
      
      <div class="formula-section">
        <div class="formula">I = V / R</div>
        <p>Current (Amperes) = Voltage (Volts) / Resistance (Ohms)</p>
      </div>
      
      <div class="formula-section">
        <div class="formula">Brightness ∝ Power</div>
        <p>Light intensity is proportional to the power consumed by the bulb</p>
      </div>
    </div>
  </div>

  <script>
    // Matter.js setup
    const { Engine, Render, Bodies, World, Body, Composite, Constraint } = Matter;
    
    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0 } // No gravity
    });
    
    // Create renderer
    const render = Render.create({
      element: document.getElementById('canvas-container'),
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#1a1a2e',
        showAngleIndicator: false
      }
    });
    
    // Variables for simulation
    let battery, bulb, wireTop, wireBottom;
    let isCircuitOn = false;
    let currentValue = 0;
    let voltageValue = 0;
    let electrons = [];
    let electronInterval;
    
    // Initialize simulation
    function initSimulation() {
      // Create battery (power source)
      battery = Bodies.rectangle(300, window.innerHeight / 2, 60, 120, {
        isStatic: true,
        render: {
          fillStyle: '#e74c3c',
          strokeStyle: '#c0392b',
          lineWidth: 2
        }
      });
      
      // Create positive terminal
      const positiveTerminal = Bodies.rectangle(300, window.innerHeight / 2 - 70, 20, 20, {
        isStatic: true,
        render: {
          fillStyle: '#e74c3c',
          strokeStyle: '#c0392b',
          lineWidth: 2
        }
      });
      
      // Create negative terminal
      const negativeTerminal = Bodies.rectangle(300, window.innerHeight / 2 + 70, 60, 10, {
        isStatic: true,
        render: {
          fillStyle: '#2c3e50',
          strokeStyle: '#2c3e50',
          lineWidth: 2
        }
      });
      
      // Create light bulb
      bulb = Bodies.circle(window.innerWidth - 300, window.innerHeight / 2, 40, {
        isStatic: true,
        render: {
          fillStyle: '#f5f5f5',
          strokeStyle: '#bdc3c7',
          lineWidth: 2
        }
      });
      
      // Create bulb base
      const bulbBase = Bodies.trapezoid(window.innerWidth - 300, window.innerHeight / 2 + 50, 50, 30, 0.5, {
        isStatic: true,
        render: {
          fillStyle: '#7f8c8d',
          strokeStyle: '#7f8c8d',
          lineWidth: 1
        }
      });
      
      // Create wires
      wireTop = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 - 100, window.innerWidth - 600, 5, {
        isStatic: true,
        render: {
          fillStyle: '#3498db',
          strokeStyle: '#2980b9',
          lineWidth: 1
        }
      });
      
      wireBottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 + 100, window.innerWidth - 600, 5, {
        isStatic: true,
        render: {
          fillStyle: '#3498db',
          strokeStyle: '#2980b9',
          lineWidth: 1
        }
      });
      
      // Create switch
      const switchBase = Bodies.rectangle(500, window.innerHeight / 2 - 100, 20, 20, {
        isStatic: true,
        render: {
          fillStyle: '#2c3e50',
          strokeStyle: '#2c3e50',
          lineWidth: 1
        }
      });
      
      const switchLever = Bodies.rectangle(530, window.innerHeight / 2 - 100, 60, 10, {
        isStatic: true,
        angle: Math.PI / 4,
        render: {
          fillStyle: '#e74c3c',
          strokeStyle: '#c0392b',
          lineWidth: 1
        }
      });
      
      // Add all objects to world
      World.add(engine.world, [
        battery, positiveTerminal, negativeTerminal,
        bulb, bulbBase,
        wireTop, wireBottom,
        switchBase, switchLever
      ]);
      
      // Run the engine
      Engine.run(engine);
      Render.run(render);
      
      // Set up event listeners
      document.getElementById('current-slider').addEventListener('input', updateCurrent);
      document.getElementById('voltage-slider').addEventListener('input', updateVoltage);
      document.getElementById('toggle-switch').addEventListener('click', toggleCircuit);
      
      // Handle window resize
      window.addEventListener('resize', handleResize);
    }
    
    // Handle window resize
    function handleResize() {
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      
      // Update positions of objects
      if (battery && bulb && wireTop && wireBottom) {
        Body.setPosition(battery, { x: 300, y: window.innerHeight / 2 });
        Body.setPosition(bulb, { x: window.innerWidth - 300, y: window.innerHeight / 2 });
        Body.setPosition(wireTop, { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 });
        Body.setPosition(wireBottom, { x: window.innerWidth / 2, y: window.innerHeight / 2 + 100 });
        
        // Update wire width
        Body.scale(wireTop, (window.innerWidth - 600) / wireTop.bounds.max.x - wireTop.bounds.min.x, 1);
        Body.scale(wireBottom, (window.innerWidth - 600) / wireBottom.bounds.max.x - wireBottom.bounds.min.x, 1);
      }
    }
    
    // Update current from slider
    function updateCurrent() {
      currentValue = parseFloat(this.value);
      document.getElementById('current-value-display').textContent = currentValue.toFixed(1) + ' A';
      
      // Update power calculation
      updatePower();
      
      // Update light effect
      updateLightEffect();
      
      // Update electron animation
      updateElectronAnimation();
    }
    
    // Update voltage from slider
    function updateVoltage() {
      voltageValue = parseFloat(this.value);
      document.getElementById('voltage-value-display').textContent = voltageValue.toFixed(0) + ' V';
      
      // Update power calculation
      updatePower();
      
      // Update light effect
      updateLightEffect();
    }
    
    // Update power calculation
    function updatePower() {
      const power = currentValue * voltageValue;
      document.getElementById('power-value').textContent = power.toFixed(1) + ' W';
      document.getElementById('power-display').textContent = power.toFixed(1) + ' W';
      document.getElementById('current-flow').textContent = currentValue.toFixed(1) + ' A';
      document.getElementById('voltage-display').textContent = voltageValue.toFixed(0) + ' V';
      
      // Calculate resistance using Ohm's Law (R = V/I)
      let resistance = 0;
      if (currentValue > 0) {
        resistance = voltageValue / currentValue;
      } else {
        resistance = 100; // Default resistance
      }
      document.getElementById('resistance-display').textContent = resistance.toFixed(1) + ' Ω';
    }
    
    // Update light effect based on power
    function updateLightEffect() {
      const lightEffect = document.getElementById('light-effect');
      
      if (!isCircuitOn || currentValue === 0 || voltageValue === 0) {
        lightEffect.style.opacity = '0';
        
        // Update bulb color
        if (bulb) {
          bulb.render.fillStyle = '#f5f5f5';
          bulb.render.strokeStyle = '#bdc3c7';
        }
        
        document.getElementById('bulb-status').textContent = 'Off';
        return;
      }
      
      // Calculate power
      const power = currentValue * voltageValue;
      
      // Map power to brightness (0-1)
      const maxPower = 2200; // 10A * 220V
      let brightness = power / maxPower;
      brightness = Math.min(brightness, 1); // Cap at 1
      
      // Update light effect
      const bulbX = window.innerWidth - 300;
      const bulbY = window.innerHeight / 2;
      
      // Calculate color based on brightness (yellow to white)
      const r = Math.min(255, 255);
      const g = Math.min(255, 200 + brightness * 55);
      const b = Math.min(255, 100 + brightness * 155);
      
      // Update radial gradient
      const radius = 300 + brightness * 700; // Larger radius for higher brightness
      lightEffect.style.background = \`radial-gradient(circle at \${bulbX}px \${bulbY}px, 
                                      rgba(\${r}, \${g}, \${b}, \${brightness * 0.8}) 0%, 
                                      rgba(\${r}, \${g}, \${b}, 0) \${radius}px)\`;
      lightEffect.style.opacity = '1';
      
      // Update bulb color
      if (bulb) {
        bulb.render.fillStyle = \`rgb(\${r}, \${g}, \${b})\`;
        bulb.render.strokeStyle = '#f39c12';
      }
      
      document.getElementById('bulb-status').textContent = 'On';
    }
    
    // Toggle circuit on/off
    function toggleCircuit() {
      isCircuitOn = !isCircuitOn;
      
      // Update switch appearance
      const switchLever = engine.world.bodies.find(body => body.position.x === 530 && body.position.y === window.innerHeight / 2 - 100);
      if (switchLever) {
        if (isCircuitOn) {
          Body.setAngle(switchLever, 0);
        } else {
          Body.setAngle(switchLever, Math.PI / 4);
        }
      }
      
      // Update light effect
      updateLightEffect();
      
      // Update electron animation
      updateElectronAnimation();
    }
    
    // Create electron animation
    function updateElectronAnimation() {
      // Clear existing electrons and interval
      clearElectrons();
      
      if (!isCircuitOn || currentValue === 0) {
        return;
      }
      
      // Calculate electron speed and frequency based on current
      const electronSpeed = 2 + currentValue * 0.8; // pixels per frame
      const electronFrequency = Math.max(50, 500 - currentValue * 40); // ms between electrons
      
      // Create electron animation
      electronInterval = setInterval(() => {
        createElectron();
      }, electronFrequency);
    }
    
    // Create a single electron
    function createElectron() {
      const electronsContainer = document.getElementById('electrons-container');
      
      // Create electron element
      const electron = document.createElement('div');
      electron.className = 'electron';
      
      // Set initial position (at battery positive terminal)
      electron.style.left = '300px';
      electron.style.top = (window.innerHeight / 2 - 100) + 'px';
      
      // Add to container
      electronsContainer.appendChild(electron);
      
      // Add to tracking array
      electrons.push({
        element: electron,
        position: 0,
        path: [
          { x: 300, y: window.innerHeight / 2 - 100 }, // Start at battery top
          { x: wireTop.position.x + (wireTop.bounds.max.x - wireTop.bounds.min.x) / 2, y: window.innerHeight / 2 - 100 }, // Right along top wire
          { x: window.innerWidth - 300, y: window.innerHeight / 2 - 100 }, // To bulb top
          { x: window.innerWidth - 300, y: window.innerHeight / 2 + 100 }, // Down through bulb
          { x: wireBottom.position.x - (wireBottom.bounds.max.x - wireBottom.bounds.min.x) / 2, y: window.innerHeight / 2 + 100 }, // Left along bottom wire
          { x: 300, y: window.innerHeight / 2 + 100 }, // To battery bottom
          { x: 300, y: window.innerHeight / 2 - 100 } // Up through battery
        ],
        pathIndex: 0,
        progress: 0,
        speed: 2 + currentValue * 0.8
      });
    }
    
    // Animate electrons
    function animateElectrons() {
      // Move each electron along its path
      for (let i = electrons.length - 1; i >= 0; i--) {
        const electron = electrons[i];
        
        // Get current and next points
        const currentPoint = electron.path[electron.pathIndex];
        const nextPoint = electron.path[(electron.pathIndex + 1) % electron.path.length];
        
        // Calculate direction and distance
        const dx = nextPoint.x - currentPoint.x;
        const dy = nextPoint.y - currentPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update progress
        electron.progress += electron.speed / distance;
        
        // If reached next point
        if (electron.progress >= 1) {
          electron.pathIndex = (electron.pathIndex + 1) % electron.path.length;
          electron.progress = 0;
        }
        
        // Calculate new position
        const newX = currentPoint.x + dx * electron.progress;
        const newY = currentPoint.y + dy * electron.progress;
        
        // Update electron position
        electron.element.style.left = newX + 'px';
        electron.element.style.top = newY + 'px';
        
        // Remove if too old (completed multiple circuits)
        if (electron.pathIndex > 10) {
          electron.element.remove();
          electrons.splice(i, 1);
        }
      }
      
      // Continue animation
      requestAnimationFrame(animateElectrons);
    }
    
    // Clear all electrons
    function clearElectrons() {
      if (electronInterval) {
        clearInterval(electronInterval);
      }
      
      const electronsContainer = document.getElementById('electrons-container');
      electronsContainer.innerHTML = '';
      electrons = [];
    }
    
    // Initialize when page loads
    window.addEventListener('load', () => {
      initSimulation();
      animateElectrons();
    });
  </script>
</body>
</html>
  `;

  const handleReset = () => {
    webViewRef.current?.injectJavaScript(`
      // Reset sliders
      document.getElementById('current-slider').value = 0;
      document.getElementById('voltage-slider').value = 0;
      
      // Update displays
      document.getElementById('current-value-display').textContent = '0 A';
      document.getElementById('voltage-value-display').textContent = '0 V';
      
      // Turn off circuit
      isCircuitOn = false;
      toggleCircuit();
      
      // Update calculations
      updatePower();
      updateLightEffect();
      updateElectronAnimation();
      
      true;
    `);
  };

  const handleToggle = () => {
    webViewRef.current?.injectJavaScript(`
      toggleCircuit();
      true;
    `);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
      <View style={styles.controls}>
        <Button title="Toggle Switch" onPress={handleToggle} color="#4a90e2" />
        <Button title="Reset" onPress={handleReset} color="#e74c3c" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e"
  },
  webview: {
    flex: 1
  },
  controls: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#0f3460"
  }
});

export default Light;
