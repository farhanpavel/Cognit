"use client"

import { useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import { Button, Surface, Text, IconButton } from "react-native-paper"
import { ArrowUp } from "lucide-react-native"

const Light = () => {
  const webViewRef = useRef(null)
  const [isControlsExpanded, setIsControlsExpanded] = useState(false)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
  <style>
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
      overflow: auto;
    }

    #canvas-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      min-height: 600px;
      min-width: 320px;
      overflow: auto;
      box-sizing: border-box;
    }

    canvas {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .control-panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.9);
      padding: 0px 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 100;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }

    .control-panel.expanded {
      max-height: 300px;
      overflow-y: auto;
    }

    .info-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.9);
      padding: 0px 15px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
      z-index: 100;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }

    .info-panel.expanded {
      max-height: 300px;
      overflow-y: auto;
    }

    h2 {
      margin-top: 0;
      color: #20B486;
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
      color: #1C9777;
    }

    input[type="range"] {
      width: 100%;
      margin-bottom: 5px;
      accent-color: #20B486;
    }

    .current-value {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #1C9777;
    }

    .formula-section {
      margin-top: 15px;
      padding: 10px;
      background: #f5f9f7;
      border-radius: 5px;
      border-left: 4px solid #20B486;
    }

    .formula {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      margin-bottom: 5px;
      color: #17A97B;
    }

    .result-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      color: #333;
    }

    .result-row span:first-child {
      color: #1C9777;
      font-weight: bold;
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
      background-color: #20B486;
      border-radius: 50%;
      z-index: 5;
    }

    button {
      background: #20B486;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 10px;
    }

    button:hover {
      background: #17A97B;
    }

    .panel-toggle {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background: #20B486;
      color: white;
      border: none;
      border-radius: 0 0 8px 8px;
      padding: 5px 15px;
      font-size: 12px;
      cursor: pointer;
      z-index: 101;
    }

    .top-toggle {
      top: 0;
    }

    .bottom-toggle {
      bottom: 0;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <div class="light-overlay" id="light-effect"></div>
    <div id="electrons-container"></div>
    
    <div class="control-panel" id="control-panel">
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
    
    
    <div class="info-panel" id="info-panel">

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
        background: '#f0f8ff',
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
          fillStyle: '#20B486',
          strokeStyle: '#17A97B',
          lineWidth: 2
        }
      });
      
      // Create positive terminal
      const positiveTerminal = Bodies.rectangle(300, window.innerHeight / 2 - 70, 20, 20, {
        isStatic: true,
        render: {
          fillStyle: '#20B486',
          strokeStyle: '#17A97B',
          lineWidth: 2
        }
      });
      
      // Create negative terminal
      const negativeTerminal = Bodies.rectangle(300, window.innerHeight / 2 + 70, 60, 10, {
        isStatic: true,
        render: {
          fillStyle: '#1C9777',
          strokeStyle: '#1C9777',
          lineWidth: 2
        }
      });
      
      // Create light bulb
      bulb = Bodies.circle(window.innerWidth - 300, window.innerHeight / 2, 40, {
        isStatic: true,
        render: {
          fillStyle: '#f5f5f5',
          strokeStyle: '#A8E2D0',
          lineWidth: 2
        }
      });
      
      // Create bulb base
      const bulbBase = Bodies.trapezoid(window.innerWidth - 300, window.innerHeight / 2 + 50, 50, 30, 0.5, {
        isStatic: true,
        render: {
          fillStyle: '#1C9777',
          strokeStyle: '#1C9777',
          lineWidth: 1
        }
      });
      
      // Create wires
      wireTop = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 - 100, window.innerWidth - 600, 5, {
        isStatic: true,
        render: {
          fillStyle: '#20B486',
          strokeStyle: '#17A97B',
          lineWidth: 1
        }
      });
      
      wireBottom = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2 + 100, window.innerWidth - 600, 5, {
        isStatic: true,
        render: {
          fillStyle: '#20B486',
          strokeStyle: '#17A97B',
          lineWidth: 1
        }
      });
      
      // Create switch
      const switchBase = Bodies.rectangle(500, window.innerHeight / 2 - 100, 20, 20, {
        isStatic: true,
        render: {
          fillStyle: '#1C9777',
          strokeStyle: '#1C9777',
          lineWidth: 1
        }
      });
      
      const switchLever = Bodies.rectangle(530, window.innerHeight / 2 - 100, 60, 10, {
        isStatic: true,
        angle: Math.PI / 4,
        render: {
          fillStyle: '#20B486',
          strokeStyle: '#17A97B',
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
    
    // Toggle control panel
    function toggleControlPanel() {
      const controlPanel = document.getElementById('control-panel');
      
      if (controlPanel.classList.contains('expanded')) {
        controlPanel.classList.remove('expanded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'CONTROLS_COLLAPSED'
        }));
      } else {
        controlPanel.classList.add('expanded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'CONTROLS_EXPANDED'
        }));
      }
    }
    
    // Toggle info panel
    function toggleInfoPanel() {
      const infoPanel = document.getElementById('info-panel');
      
      if (infoPanel.classList.contains('expanded')) {
        infoPanel.classList.remove('expanded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'INFO_COLLAPSED'
        }));
      } else {
        infoPanel.classList.add('expanded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'INFO_EXPANDED'
        }));
      }
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
          bulb.render.strokeStyle = '#A8E2D0';
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
  `

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === "CONTROLS_EXPANDED") {
        setIsControlsExpanded(true)
      } else if (data.type === "CONTROLS_COLLAPSED") {
        setIsControlsExpanded(false)
      } else if (data.type === "INFO_EXPANDED") {
        setIsInfoExpanded(true)
      } else if (data.type === "INFO_COLLAPSED") {
        setIsInfoExpanded(false)
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

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
    `)
  }

  const handleToggle = () => {
    webViewRef.current?.injectJavaScript(`
      toggleCircuit();
      const controlPanel = document.getElementById('control-panel');
      controlPanel.classList.remove('expanded');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CONTROLS_COLLAPSED' }));
      const infoPanel = document.getElementById('info-panel');
      infoPanel.classList.remove('expanded');
      true;
    `)
  }

  const toggleControlPanel = () => {
    webViewRef.current?.injectJavaScript(`
      toggleControlPanel();
      true;
    `)
  }

  const toggleInfoPanel = () => {
    webViewRef.current?.injectJavaScript(`
      toggleInfoPanel();
      true;
    `)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.title}>Light Bulb Simulator</Text>
        <IconButton
          icon={isControlsExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          onPress={toggleControlPanel}
          iconColor="white"
        />
      </Surface>

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={handleMessage}
        />
      </View>

      <Surface style={styles.controls} elevation={2}>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleToggle} style={styles.button} buttonColor="#FFFFFF" icon="power">
            Toggle Switch
          </Button>
          <Button mode="outlined" className="border-white" onPress={handleReset} style={styles.button} textColor="#FFFFFF" icon="refresh">
            Reset
          </Button>
          <Button mode="contained" onPress={toggleInfoPanel} className="rounded-md" buttonColor="#FFFFFF"> 
            <ArrowUp size={10} color="#20B486" strokeWidth={2} />           
          </Button>
        </View>
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#20B486",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  webViewContainer: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  controls: {
    padding: 10,
    backgroundColor: "#20B486",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 5,
  },
  button: {
    borderRadius: 8,
    minWidth: 100,
    marginRight: 10,
  },
})

export default Light
