"use client"

import { useRef, useState } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import { Button, Surface, Text, IconButton } from "react-native-paper"

const Chemistry = () => {
  const webViewRef = useRef(null)
  const [infoExpanded, setInfoExpanded] = useState(true)
  const [controlExpanded, setControlExpanded] = useState(false)

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Chemistry Lab</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js"></script>
  <script src="https://unpkg.com/d3@7.8.5/dist/d3.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
      background-color: #f0f8ff;
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
      display: none; /* Hide the HTML panels - we'll use React Native UI instead */
    }
    
    .info-panel {
      display: none; /* Hide the HTML panels - we'll use React Native UI instead */
    }
    
    .tooltip {
      position: absolute;
      background: rgba(32, 180, 134, 0.9);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
      display: none;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <div class="tooltip" id="tooltip"></div>
  </div>

  <script>
    // Matter.js setup
    const { Engine, Render, Bodies, World, Body, Composite, Constraint, Mouse, MouseConstraint, Events } = Matter;
    
    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.2 } // Reduced gravity
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
    let currentMolecule = null;
    let currentReaction = null;
    let moleculeBodies = [];
    let bondConstraints = [];
    
    // Molecule definitions
    const molecules = {
      H2O: {
        name: "Water",
        formula: "H₂O",
        atoms: [
          { element: "O", x: 0, y: 0, radius: 16, color: "#FF0000" },
          { element: "H", x: -20, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 20, y: -15, radius: 8, color: "#FFFFFF" }
        ],
        bonds: [
          { from: 0, to: 1 },
          { from: 0, to: 2 }
        ],
        properties: {
          "Molecular Weight": "18.02 g/mol",
          "Density": "1 g/cm³ (liquid)",
          "Melting Point": "0°C (273.15 K)",
          "Boiling Point": "100°C (373.15 K)",
          "Bond Angle": "104.5°"
        },
        description: "Water is a polar molecule with a bent shape due to the oxygen atom's two lone pairs of electrons. It has unique properties like high surface tension and the ability to dissolve many substances."
      },
      CO2: {
        name: "Carbon Dioxide",
        formula: "CO₂",
        atoms: [
          { element: "C", x: 0, y: 0, radius: 14, color: "#808080" },
          { element: "O", x: -25, y: 0, radius: 16, color: "#FF0000" },
          { element: "O", x: 25, y: 0, radius: 16, color: "#FF0000" }
        ],
        bonds: [
          { from: 0, to: 1, double: true },
          { from: 0, to: 2, double: true }
        ],
        properties: {
          "Molecular Weight": "44.01 g/mol",
          "Density": "1.98 g/L (gas at STP)",
          "Melting Point": "-56.6°C (216.6 K) at 5.2 atm",
          "Boiling Point": "-78.5°C (194.7 K) sublimates",
          "Bond Angle": "180° (linear)"
        },
        description: "Carbon dioxide is a linear molecule with two double bonds between the carbon and oxygen atoms. It's a greenhouse gas and is used by plants in photosynthesis."
      },
      O2: {
        name: "Oxygen",
        formula: "O₂",
        atoms: [
          { element: "O", x: -15, y: 0, radius: 16, color: "#FF0000" },
          { element: "O", x: 15, y: 0, radius: 16, color: "#FF0000" }
        ],
        bonds: [
          { from: 0, to: 1, double: true }
        ],
        properties: {
          "Molecular Weight": "32.00 g/mol",
          "Density": "1.429 g/L (gas at STP)",
          "Melting Point": "-218.8°C (54.4 K)",
          "Boiling Point": "-183.0°C (90.2 K)",
          "Bond Length": "121 pm"
        },
        description: "Oxygen is a diatomic molecule with a double bond. It's paramagnetic due to unpaired electrons and is essential for respiration in many organisms."
      },
      NH3: {
        name: "Ammonia",
        formula: "NH₃",
        atoms: [
          { element: "N", x: 0, y: 0, radius: 14, color: "#3050F8" },
          { element: "H", x: -15, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 15, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 0, y: 15, radius: 8, color: "#FFFFFF" }
        ],
        bonds: [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 0, to: 3 }
        ],
        properties: {
          "Molecular Weight": "17.03 g/mol",
          "Density": "0.73 g/L (gas at STP)",
          "Melting Point": "-77.7°C (195.5 K)",
          "Boiling Point": "-33.3°C (239.8 K)",
          "Bond Angle": "107.3°"
        },
        description: "Ammonia has a trigonal pyramidal shape with the nitrogen atom at the apex. It's a common refrigerant and is used in fertilizer production."
      },
      CH4: {
        name: "Methane",
        formula: "CH₄",
        atoms: [
          { element: "C", x: 0, y: 0, radius: 14, color: "#808080" },
          { element: "H", x: -15, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 15, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: -15, y: 15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 15, y: 15, radius: 8, color: "#FFFFFF" }
        ],
        bonds: [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 0, to: 3 },
          { from: 0, to: 4 }
        ],
        properties: {
          "Molecular Weight": "16.04 g/mol",
          "Density": "0.657 g/L (gas at STP)",
          "Melting Point": "-182.5°C (90.7 K)",
          "Boiling Point": "-161.5°C (111.7 K)",
          "Bond Angle": "109.5°"
        },
        description: "Methane has a tetrahedral shape with four hydrogen atoms bonded to a central carbon atom. It's the main component of natural gas and a potent greenhouse gas."
      },
      C2H6: {
        name: "Ethane",
        formula: "C₂H₆",
        atoms: [
          { element: "C", x: -15, y: 0, radius: 14, color: "#808080" },
          { element: "C", x: 15, y: 0, radius: 14, color: "#808080" },
          { element: "H", x: -25, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: -25, y: 15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: -5, y: 0, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 25, y: -15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 25, y: 15, radius: 8, color: "#FFFFFF" },
          { element: "H", x: 5, y: 0, radius: 8, color: "#FFFFFF" }
        ],
        bonds: [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 0, to: 3 },
          { from: 0, to: 4 },
          { from: 1, to: 5 },
          { from: 1, to: 6 },
          { from: 1, to: 7 }
        ],
        properties: {
          "Molecular Weight": "30.07 g/mol",
          "Density": "1.356 g/L (gas at STP)",
          "Melting Point": "-183.3°C (89.9 K)",
          "Boiling Point": "-88.6°C (184.6 K)",
          "Bond Angle": "109.5°"
        },
        description: "Ethane consists of two carbon atoms bonded together, each with three hydrogen atoms attached. It's found in natural gas and is used in petrochemical manufacturing."
      }
    };
    
    // Chemical reactions
    const reactions = {
      combustion: {
        name: "Combustion of Methane",
        equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
        reactants: ["CH4", "O2"],
        products: ["CO2", "H2O"],
        description: "Combustion is an exothermic reaction where a fuel (like methane) reacts with oxygen to produce carbon dioxide, water, and heat energy. This is the reaction that occurs in natural gas stoves and furnaces.",
        energyChange: "Exothermic (releases heat)",
        reactionType: "Oxidation-Reduction"
      },
      synthesis: {
        name: "Haber Process",
        equation: "N₂ + 3H₂ → 2NH₃",
        reactants: ["N2", "H2"],
        products: ["NH3"],
        description: "The Haber process is used to synthesize ammonia from nitrogen and hydrogen gases. This industrial process is crucial for fertilizer production and requires high pressure and temperature with an iron catalyst.",
        energyChange: "Exothermic (releases heat)",
        reactionType: "Synthesis"
      },
      decomposition: {
        name: "Electrolysis of Water",
        equation: "2H₂O → 2H₂ + O₂",
        reactants: ["H2O"],
        products: ["H2", "O2"],
        description: "Electrolysis uses electrical energy to split water molecules into hydrogen and oxygen gases. This process is important for hydrogen fuel production and various industrial applications.",
        energyChange: "Endothermic (requires energy)",
        reactionType: "Decomposition"
      },
      "acid-base": {
        name: "Neutralization",
        equation: "HCl + NaOH → NaCl + H₂O",
        reactants: ["HCl", "NaOH"],
        products: ["NaCl", "H2O"],
        description: "Acid-base neutralization occurs when an acid (HCl) reacts with a base (NaOH) to form a salt (NaCl) and water. This type of reaction is used in antacids to neutralize stomach acid.",
        energyChange: "Exothermic (releases heat)",
        reactionType: "Double Displacement"
      }
    };
    
    // Run the renderer
    Render.run(render);
    
    // Create runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    
    // Add mouse control
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
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    
    // Create a molecule in the simulation
    function createMolecule(moleculeType, centerX, centerY) {
      if (!molecules[moleculeType]) return;
      
      const molecule = molecules[moleculeType];
      const atomBodies = [];
      
      // Clear existing molecules if needed
      if (moleculeBodies.length > 0) {
        clearMolecules();
      }
      
      // Create atoms
      molecule.atoms.forEach((atom, index) => {
        const atomBody = Bodies.circle(
          centerX + atom.x,
          centerY + atom.y,
          atom.radius,
          {
            render: {
              fillStyle: atom.color,
              strokeStyle: '#000',
              lineWidth: 1
            },
            friction: 0.05,
            frictionAir: 0.005,
            restitution: 0.8
          }
        );
        
        // Add label to atom
        atomBody.label = atom.element;
        atomBody.moleculeType = moleculeType;
        
        atomBodies.push(atomBody);
        moleculeBodies.push(atomBody);
      });
      
      // Create bonds
      molecule.bonds.forEach(bond => {
        const atomA = atomBodies[bond.from];
        const atomB = atomBodies[bond.to];
        
        const constraint = Constraint.create({
          bodyA: atomA,
          bodyB: atomB,
          stiffness: 0.8,
          render: {
            type: 'line',
            strokeStyle: '#666',
            lineWidth: bond.double ? 3 : 2,
            anchors: false
          }
        });
        
        bondConstraints.push(constraint);
      });
      
      // Add atoms and bonds to world
      World.add(engine.world, [...atomBodies, ...bondConstraints]);
      
      // Apply a small random force to make the molecule move slightly
      atomBodies.forEach(atom => {
        Body.applyForce(atom, atom.position, {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001
        });
      });
      
      // Update current molecule
      currentMolecule = moleculeType;
      
      // Send message to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'moleculeSelected',
        molecule: molecule
      }));
    }
    
    // Clear all molecules from the simulation
    function clearMolecules() {
      // Remove all bodies and constraints
      moleculeBodies.forEach(body => {
        World.remove(engine.world, body);
      });
      
      bondConstraints.forEach(constraint => {
        World.remove(engine.world, constraint);
      });
      
      moleculeBodies = [];
      bondConstraints = [];
      currentMolecule = null;
      
      // Send message to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'moleculesCleared'
      }));
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
    });
    
    // Set up tooltip for atoms
    const tooltip = document.getElementById('tooltip');
    
    Events.on(mouseConstraint, 'mousemove', function(event) {
      const mousePosition = event.mouse.position;
      const hoveredBody = Matter.Query.point(moleculeBodies, mousePosition)[0];
      
      if (hoveredBody) {
        tooltip.style.display = 'block';
        tooltip.style.left = mousePosition.x + 10 + 'px';
        tooltip.style.top = mousePosition.y + 10 + 'px';
        tooltip.textContent = hoveredBody.label;
      } else {
        tooltip.style.display = 'none';
      }
    });
    
    // Initialize when page loads
    window.addEventListener('load', function() {
      // Show water molecule by default
      setTimeout(() => {
        createMolecule('H2O', window.innerWidth / 2, window.innerHeight / 2);
      }, 500);
    });
  </script>
</body>
</html>
  `

  const [currentMolecule, setCurrentMolecule] = useState(null)
  const [funFact, setFunFact] = useState(
    "Water (H₂O) is one of the few substances that expands when it freezes, which is why ice floats on water.",
  )

  // Fun facts about chemistry
  const funFacts = [
    "Gold is so malleable that it can be hammered into sheets thin enough for light to pass through.",
    "A teaspoonful of neutron star material would weigh about 6 billion tons.",
    "The only letter not appearing on the periodic table is the letter J.",
    "Helium is the only element discovered outside of Earth before being found on Earth.",
    "Diamonds are not forever - they slowly convert to graphite over time.",
    "The human body contains enough carbon to make about 900 pencils.",
    "If you pour a handful of salt into a glass of water, the water level will actually go down.",
    "Lightning strikes produce ozone, which is why you can smell a sharp, clean scent after a thunderstorm.",
    "Coca-Cola was originally green before it was dyed brown.",
    "The noble gases were once called 'inert gases' because scientists thought they couldn't react with anything.",
  ]

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === "moleculeSelected") {
        setCurrentMolecule(data.molecule)
        setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)])
      } else if (data.type === "moleculesCleared") {
        setCurrentMolecule(null)
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

  const handleReset = () => {
    webViewRef.current?.injectJavaScript(`
      clearMolecules();
      true;
    `)
  }

  const handleShowMolecule = (molecule) => {
    webViewRef.current?.injectJavaScript(`
      createMolecule('${molecule}', window.innerWidth / 2, window.innerHeight / 2);
      true;
    `)
  }

  const screenHeight = Dimensions.get("window").height

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Control Panel Tab */}
      <Surface
        style={[styles.controlTab, controlExpanded ? { height: screenHeight * 0.31 } : { height: 50 }]}
        elevation={3}
      >
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Molecule Controls</Text>
          <IconButton
            icon={controlExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            onPress={() => setControlExpanded(!controlExpanded)}
            iconColor="#20B486"
          />
        </View>

        {controlExpanded && (
          <View style={styles.tabContent}>
            <View style={styles.buttonGrid}>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("H2O")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                H₂O
              </Button>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("CO2")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                CO₂
              </Button>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("O2")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                O₂
              </Button>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("NH3")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                NH₃
              </Button>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("CH4")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                CH₄
              </Button>
              <Button
                mode="contained"
                onPress={() => handleShowMolecule("C2H6")}
                style={styles.gridButton}
                buttonColor="#20B486"
                textColor="white"
                compact
              >
                C₂H₆
              </Button>
            </View>
            <Button mode="outlined" onPress={handleReset} style={styles.resetButton} textColor="#20B486">
              Clear Simulation
            </Button>
          </View>
        )}
      </Surface>

      {/* Info Panel Tab */}
      <Surface style={[styles.infoTab, infoExpanded ? { height: screenHeight * 0.31 } : { height: 50 }]} elevation={3}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Molecule Information</Text>
          <IconButton
            icon={infoExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            onPress={() => setInfoExpanded(!infoExpanded)}
            iconColor="#20B486"
          />
        </View>

        {infoExpanded && (
          <View style={styles.tabContent}>
            {currentMolecule ? (
              <View style={styles.infoContent}>
                <Text style={styles.moleculeName}>
                  {currentMolecule.name} ({currentMolecule.formula})
                </Text>
                <Text style={styles.moleculeDescription} numberOfLines={2}>
                  {currentMolecule.description}
                </Text>

                <View style={styles.propertiesGrid}>
                  {Object.entries(currentMolecule.properties).map(([key, value], index) => (
                    <View key={index} style={styles.propertyItem}>
                      <Text style={styles.propertyName}>{key}:</Text>
                      <Text style={styles.propertyValue}>{value}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.factBox}>
                  <Text style={styles.factTitle}>Did You Know?</Text>
                  <Text style={styles.factText}>{funFact}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.infoContent}>
                <Text style={styles.emptyStateText}>Select a molecule to view its properties</Text>
              </View>
            )}
          </View>
        )}
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  webviewContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  controlTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#A8E2D0",
    overflow: "hidden",
  },
  infoTab: {
  position: "absolute",
  top: 30, // Changed from bottom: 0
  left: 0,
  right: 0,
  backgroundColor: "white",
  borderBottomWidth: 1, // Changed from borderTop
  borderBottomColor: "#A8E2D0",
  overflow: "hidden",
},

  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#20B486",
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridButton: {
    width: "30%",
    marginBottom: 8,
    borderRadius: 4,
  },
  resetButton: {
    borderColor: "#20B486",
    marginTop: 5,
  },
  infoContent: {
    flex: 1,
  },
  moleculeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#20B486",
    marginBottom: 4,
  },
  moleculeDescription: {
    fontSize: 12,
    color: "#333",
    marginBottom: 8,
  },
  propertiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  propertyItem: {
    width: "48%",
    marginBottom: 6,
  },
  propertyName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1C9777",
  },
  propertyValue: {
    fontSize: 11,
    color: "#333",
  },
  factBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f0f8ff",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#20B486",
  },
  factTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#20B486",
    marginBottom: 2,
  },
  factText: {
    fontSize: 11,
    color: "#333",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
})

export default Chemistry
