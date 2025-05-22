"use client"

import { useRef, useState } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import { Button, Surface, Text, IconButton, Card, Title, Paragraph } from "react-native-paper"
const { height: screenHeight } = Dimensions.get("window");

const PendulumSwing = () => {
  const webViewRef = useRef(null)
  const pendulumLength = 300 // Define pendulumLength at the component level
  const [infoExpanded, setInfoExpanded] = useState(false)
  const [angle, setAngle] = useState("0.0")
  const [velocity, setVelocity] = useState("0.00")


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
                    background-color: #f0f8ff;
                }
                canvas {
                    display: block;
                }
                .info-panel {
                    display: none; /* Hide the HTML panel - we'll use React Native UI instead */
                }
            </style>
        </head>
        <body>
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
                        background: '#f0f8ff'
                    }
                });

                // Create pendulum components
                const pendulumLength = 300;
                const bobRadius = 30;
                const anchor = Bodies.circle(window.innerWidth / 2, 100, 10, {
                    isStatic: true,
                    render: { fillStyle: '#20B486' }
                });
                
                const bob = Bodies.circle(window.innerWidth / 2, 100 + pendulumLength, bobRadius, {
                    restitution: 0.8,
                    friction: 0.005,
                    render: { fillStyle: '#17A97B' }
                });

                // Create constraint (the pendulum string)
                const constraint = Matter.Constraint.create({
                    pointA: { x: anchor.position.x, y: anchor.position.y },
                    bodyB: bob,
                    stiffness: 1,
                    render: {
                        type: 'line',
                        strokeStyle: '#1C9777',
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
                    
                    // Send data to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        angle: angle.toFixed(1),
                        velocity: velocity
                    }));
                    
                    requestAnimationFrame(updateInfo);
                }
                
                updateInfo();
            </script>
        </body>
        </html>
    `

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      setAngle(data.angle)
      setVelocity(data.velocity)
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

  const swingPendulum = () => {
    webViewRef.current?.injectJavaScript(`
      swingPendulum();
      true;
    `)
  }

  const fastSwingPendulum = () => {
    webViewRef.current?.injectJavaScript(`
      fastSwingPendulum();
      true;
    `)
  }

  const resetPendulum = () => {
    webViewRef.current?.injectJavaScript(`
      resetPendulum();
      true;
    `)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Info Panel */}
      <Surface style={styles.infoPanel} elevation={3}>
        <View style={styles.infoHeader}>
          <Title style={styles.infoTitle}>Pendulum Physics</Title>
          <IconButton
            icon={infoExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            onPress={() => setInfoExpanded(!infoExpanded)}
            iconColor="#20B486"
          />
        </View>

        {infoExpanded && (
          <View style={styles.infoContent}>
            <Paragraph style={styles.infoParagraph}>Period (T) of a simple pendulum:</Paragraph>
            <Card style={styles.formulaCard}>
              <Card.Content>
                <Text style={styles.formula}>T = 2π√(L/g)</Text>
              </Card.Content>
            </Card>
            <Paragraph style={styles.infoParagraph}>Where:</Paragraph>
            <View style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>T = Period (seconds)</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>L = Length of pendulum (meters)</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.listText}>g = Acceleration due to gravity (9.81 m/s²)</Text>
            </View>
          </View>
        )}

        <View style={styles.liveData}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Current angle:</Text>
            <Text style={styles.dataValue}>{angle}°</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Angular velocity:</Text>
            <Text style={styles.dataValue}>{velocity} rad/s</Text>
          </View>
        </View>
      </Surface>

      {/* WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onMessage={handleMessage}
        />
      </View>

      {/* Controls */}
      <Surface style={styles.controls} elevation={3}>
        <Button mode="contained" onPress={swingPendulum} style={styles.button} buttonColor="#20B486" icon="play">
          Swing
        </Button>
        <Button
          mode="contained"
          onPress={fastSwingPendulum}
          style={styles.button}
          buttonColor="#17A97B"
          icon="fast-forward"
        >
          Fast Swing
        </Button>
        <Button mode="outlined" onPress={resetPendulum} style={styles.button} textColor="#20B486" icon="refresh">
          Reset
        </Button>
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
infoPanel: {
  backgroundColor: "white",
  margin: 10,
  borderRadius: 8,
  overflow: "hidden",
  zIndex: 1,
}
,
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#20B486",
  },
  infoContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  infoParagraph: {
    fontSize: 14,
    marginBottom: 8,
  },
  formulaCard: {
    backgroundColor: "#f5f9f7",
    marginVertical: 8,
  },
  formula: {
    fontFamily: "monospace",
    fontSize: 16,
    textAlign: "center",
    color: "#1C9777",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 8,
  },
  bulletPoint: {
    marginRight: 8,
    color: "#20B486",
  },
  listText: {
    fontSize: 14,
  },
  liveData: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  dataItem: {
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#20B486",
  },
webviewContainer: {
  position: 'absolute',
  top: screenHeight * 0.25, // 25% from top
  left: 0,
  right: 0,
  bottom: 80, // leave space for controls
  zIndex: 0,
},
  webview: {
    flex: 1,
  },
controls: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: 16,
  backgroundColor: 'white',
  borderTopWidth: 1,
  borderTopColor: '#ddd',
  zIndex: 2,
},

  button: {
    borderRadius: 8,
  },
})

export default PendulumSwing
