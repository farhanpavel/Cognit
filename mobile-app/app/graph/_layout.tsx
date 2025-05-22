"use client"

import { useRef, useState } from "react"
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import { Button, Surface, Text, IconButton } from "react-native-paper"

const Graph = () => {
  const webViewRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mathematical Graph Displayer</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f8ff;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #20B486;
      margin-bottom: 10px;
    }
    
    .input-section {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      border: 1px solid #A8E2D0;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #1C9777;
    }
    
    input[type="text"], input[type="number"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #A8E2D0;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    input[type="text"]:focus, input[type="number"]:focus {
      outline: none;
      border-color: #20B486;
      box-shadow: 0 0 0 2px rgba(32, 180, 134, 0.2);
    }
    
    .range-inputs {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }
    
    .range-inputs .form-group {
      flex: 1;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    button {
      padding: 12px 15px;
      background-color: #20B486;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      flex: 1;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #17A97B;
    }
    
    button.secondary {
      background-color: #1C9777;
    }
    
    button.secondary:hover {
      background-color: #17A97B;
    }
    
    .graph-container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      position: relative;
      border: 1px solid #A8E2D0;
    }
    
    .canvas-container {
      width: 100%;
      height: 400px;
      position: relative;
    }
    
    .values-table {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow-x: auto;
      border: 1px solid #A8E2D0;
    }
    
    .values-table h2 {
      color: #20B486;
      margin-top: 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 12px 15px;
      text-align: center;
      border-bottom: 1px solid #A8E2D0;
    }
    
    th {
      background-color: #f5f9f7;
      font-weight: bold;
      color: #1C9777;
    }
    
    tr:hover {
      background-color: #f5f9f7;
    }
    
    .error-message {
      color: #e74c3c;
      margin-top: 5px;
      font-size: 14px;
      display: none;
    }
    
    .examples {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .example-btn {
      display: inline-block;
      padding: 8px 12px;
      background-color: #f5f9f7;
      border: 1px solid #A8E2D0;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #1C9777;
      transition: all 0.2s;
    }
    
    .example-btn:hover {
      background-color: #A8E2D0;
      color: #17A97B;
    }
    
    .function-info {
      margin-top: 15px;
      padding: 12px;
      background-color: #f5f9f7;
      border-radius: 8px;
      font-size: 14px;
      border-left: 4px solid #20B486;
    }
    
    .function-info strong {
      color: #1C9777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mathematical Graph Displayer</h1>
      <p>Enter a mathematical equation to visualize it and see coordinate values</p>
    </div>
    
    <div class="input-section">
      <div class="form-group">
        <label for="equation">Enter Equation (in terms of x):</label>
        <input type="text" id="equation" placeholder="e.g., x^2 + 2*x - 1" value="x^2">
        <div class="error-message" id="error-message">Invalid equation. Please check your syntax.</div>
      </div>
      
      <div class="examples">
        <label>Examples:</label>
        <div class="example-btn" onclick="setExample('x^2')">x²</div>
        <div class="example-btn" onclick="setExample('sin(x)')">sin(x)</div>
        <div class="example-btn" onclick="setExample('x^3 - 2*x')">x³ - 2x</div>
        <div class="example-btn" onclick="setExample('exp(x)')">e^x</div>
        <div class="example-btn" onclick="setExample('log(x)')">log(x)</div>
      </div>
      
      <div class="function-info">
        <strong>Supported functions:</strong> sin, cos, tan, asin, acos, atan, sqrt, log, exp, abs
      </div>
      
      <div class="range-inputs">
        <div class="form-group">
          <label for="x-min">X Minimum:</label>
          <input type="number" id="x-min" value="-10" step="1">
        </div>
        <div class="form-group">
          <label for="x-max">X Maximum:</label>
          <input type="number" id="x-max" value="10" step="1">
        </div>
      </div>
      
      <div class="button-group">
        <button id="plot-btn">Plot Graph</button>
        <button id="clear-btn" class="secondary">Clear</button>
      </div>
    </div>
    
    <div class="graph-container">
      <div class="canvas-container">
        <canvas id="graph-canvas"></canvas>
      </div>
    </div>
    
    <div class="values-table">
      <h2>Coordinate Values</h2>
      <table>
        <thead>
          <tr>
            <th>Point</th>
            <th>X Value</th>
            <th>Y Value</th>
            <th>Equation</th>
          </tr>
        </thead>
        <tbody id="values-body">
          <!-- Values will be inserted here -->
        </tbody>
      </table>
    </div>
  </div>

  <script>
    // Global variables
    let chart;
    let currentEquation = 'x^2';
    
    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      // Set up event listeners
      document.getElementById('plot-btn').addEventListener('click', plotGraph);
      document.getElementById('clear-btn').addEventListener('click', clearGraph);
      document.getElementById('equation').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          plotGraph();
        }
      });
      
      // Initial plot
      plotGraph();
      
      // Notify React Native that the page is loaded
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('loaded');
      }
    });
    
    // Set example equation
    function setExample(example) {
      document.getElementById('equation').value = example;
      plotGraph();
    }
    
    // Plot the graph
    function plotGraph() {
      try {
        // Get input values
        const equationInput = document.getElementById('equation').value.trim();
        const xMin = parseFloat(document.getElementById('x-min').value);
        const xMax = parseFloat(document.getElementById('x-max').value);
        
        // Validate input
        if (!equationInput) {
          showError('Please enter an equation');
          return;
        }
        
        if (xMin >= xMax) {
          showError('X Minimum must be less than X Maximum');
          return;
        }
        
        // Hide any previous error
        hideError();
        
        // Save current equation
        currentEquation = equationInput;
        
        // Generate data points
        const points = generatePoints(equationInput, xMin, xMax);
        
        // Create or update chart
        createChart(points, equationInput, xMin, xMax);
        
        // Update values table
        updateValuesTable(points, equationInput);
      } catch (error) {
        showError('Error: ' + error.message);
        console.error(error);
      }
    }
    
    // Generate data points for the graph
    function generatePoints(equation, xMin, xMax) {
      const points = [];
      const step = (xMax - xMin) / 500; // 500 points for smooth curve
      
      // Compile the expression for better performance
      const expr = math.compile(equation);
      
      for (let x = xMin; x <= xMax; x += step) {
        try {
          // Evaluate the expression at x
          const scope = { x: x };
          const y = expr.evaluate(scope);
          
          // Only add finite values
          if (isFinite(y)) {
            points.push({ x, y });
          }
        } catch (error) {
          console.error('Error evaluating at x =', x, error);
        }
      }
      
      return points;
    }
    
    // Create or update the chart
    function createChart(points, equation, xMin, xMax) {
      const ctx = document.getElementById('graph-canvas').getContext('2d');
      
      // Destroy previous chart if it exists
      if (chart) {
        chart.destroy();
      }
      
      // Prepare data for Chart.js
      const data = points.map(point => ({
        x: point.x,
        y: point.y
      }));
      
      // Calculate y-axis limits with some padding
      let yMin = Math.min(...points.map(p => p.y));
      let yMax = Math.max(...points.map(p => p.y));
      
      // Add padding to y-axis
      const yPadding = (yMax - yMin) * 0.1;
      yMin -= yPadding;
      yMax += yPadding;
      
      // Create new chart
      chart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'y = ' + equation,
            data: data,
            showLine: true,
            borderColor: '#20B486',
            backgroundColor: 'rgba(32, 180, 134, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'center',
              min: xMin,
              max: xMax,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              title: {
                display: true,
                text: 'X',
                color: '#1C9777'
              },
              ticks: {
                color: '#1C9777'
              }
            },
            y: {
              type: 'linear',
              position: 'center',
              min: yMin,
              max: yMax,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              title: {
                display: true,
                text: 'Y',
                color: '#1C9777'
              },
              ticks: {
                color: '#1C9777'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return \`(\${context.parsed.x.toFixed(2)}, \${context.parsed.y.toFixed(2)})\`;
                }
              },
              backgroundColor: '#17A97B',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: '#A8E2D0',
              borderWidth: 1,
              displayColors: false,
              padding: 10,
              cornerRadius: 8
            },
            legend: {
              labels: {
                color: '#1C9777',
                font: {
                  weight: 'bold'
                }
              }
            }
          }
        }
      });
    }
    
    // Update the values table with 5 key points
    function updateValuesTable(points, equation) {
      const tableBody = document.getElementById('values-body');
      tableBody.innerHTML = '';
      
      // Get the x range
      const xMin = Math.min(...points.map(p => p.x));
      const xMax = Math.max(...points.map(p => p.x));
      const xRange = xMax - xMin;
      
      // Select 5 evenly spaced points
      const selectedPoints = [];
      for (let i = 0; i < 5; i++) {
        const x = xMin + (xRange * i / 4);
        
        // Find the closest point in our data
        let closestPoint = points[0];
        let minDistance = Math.abs(points[0].x - x);
        
        for (const point of points) {
          const distance = Math.abs(point.x - x);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        }
        
        selectedPoints.push(closestPoint);
      }
      
      // Add rows to the table
      selectedPoints.forEach((point, index) => {
        const row = document.createElement('tr');
        
        const pointCell = document.createElement('td');
        pointCell.textContent = index + 1;
        
        const xCell = document.createElement('td');
        xCell.textContent = point.x.toFixed(2);
        
        const yCell = document.createElement('td');
        yCell.textContent = point.y.toFixed(2);
        
        const equationCell = document.createElement('td');
        equationCell.textContent = \`\${equation} = \${point.y.toFixed(2)}\`;
        
        row.appendChild(pointCell);
        row.appendChild(xCell);
        row.appendChild(yCell);
        row.appendChild(equationCell);
        
        tableBody.appendChild(row);
      });
    }
    
    // Clear the graph and inputs
    function clearGraph() {
      document.getElementById('equation').value = '';
      document.getElementById('x-min').value = '-10';
      document.getElementById('x-max').value = '10';
      
      if (chart) {
        chart.destroy();
        chart = null;
      }
      
      document.getElementById('values-body').innerHTML = '';
      hideError();
    }
    
    // Show error message
    function showError(message) {
      const errorElement = document.getElementById('error-message');
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    // Hide error message
    function hideError() {
      document.getElementById('error-message').style.display = 'none';
    }
  </script>
</body>
</html>
  `

  const handleRefresh = () => {
    webViewRef.current?.reload()
    setIsLoading(true)
  }

  const handleMessage = (event) => {
    if (event.nativeEvent.data === "loaded") {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.title}>Mathematical Graph Displayer</Text>
      </Surface>

      <View style={styles.webviewContainer}>
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
        <Button
          mode="contained"
          onPress={handleRefresh}
          style={styles.button}
          buttonColor="#20B486"
          icon="refresh"
          loading={isLoading}
        >
          Refresh Graph
        </Button>
        <IconButton
          icon="help-circle"
          size={24}
          iconColor="#20B486"
          style={styles.helpButton}
          onPress={() => {
            webViewRef.current?.injectJavaScript(`
              alert('Mathematical Graph Displayer Help\\n\\n• Enter a mathematical equation in terms of x\\n• Set the X-axis range\\n• Click "Plot Graph" to visualize\\n• Use example equations for quick testing\\n• View coordinate values in the table below');
              true;
            `)
          }}
        />
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
    padding: 15,
    backgroundColor: "#20B486",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  webviewContainer: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  controls: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#A8E2D0",
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  helpButton: {
    marginLeft: 10,
  },
})

export default Graph
