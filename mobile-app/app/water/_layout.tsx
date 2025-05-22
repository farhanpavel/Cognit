"use client";

import { useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import WebView from "react-native-webview";

const Chemistry = () => {
  const webViewRef = useRef(null);

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
      background-color: #f5f5f5;
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
      background: rgba(255, 255, 255, 0.95);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      width: 280px;
      z-index: 100;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .info-panel {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      width: 280px;
      z-index: 100;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
      margin-bottom: 15px;
    }
    
    .section {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ddd;
    }
    
    .section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .molecule-btn {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 8px 12px;
      background: #e0e0e0;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    
    .molecule-btn:hover {
      background: #d0d0d0;
    }
    
    .molecule-btn.active {
      background: #4a90e2;
      color: white;
      border-color: #3a80d2;
    }
    
    .reaction-btn {
      display: block;
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
    }
    
    .reaction-btn:hover {
      background: #43A047;
    }
    
    .property {
      margin-bottom: 10px;
    }
    
    .property-name {
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .property-value {
      color: #666;
    }
    
    .element {
      display: inline-block;
      width: 60px;
      height: 60px;
      margin: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      text-align: center;
      padding: 5px;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .element:hover {
      transform: scale(1.05);
      z-index: 10;
    }
    
    .element-symbol {
      font-size: 20px;
      font-weight: bold;
      margin-top: 5px;
    }
    
    .element-name {
      font-size: 10px;
      margin-top: 2px;
    }
    
    .element-number {
      position: absolute;
      top: 2px;
      left: 5px;
      font-size: 10px;
    }
    
    .nonmetal { background-color: #FFEB3B; }
    .noble-gas { background-color: #81D4FA; }
    .alkali-metal { background-color: #FF9E80; }
    .alkaline-earth { background-color: #FFCC80; }
    .metalloid { background-color: #A5D6A7; }
    .halogen { background-color: #B2EBF2; }
    .metal { background-color: #BDBDBD; }
    .transition-metal { background-color: #F8BBD0; }
    
    .bond {
      position: absolute;
      background-color: #666;
      height: 5px;
      transform-origin: left center;
      z-index: 1;
    }
    
    .atom {
      position: absolute;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      z-index: 2;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    .reaction-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    
    .reaction-arrow {
      font-size: 24px;
      margin: 0 10px;
      color: #666;
    }
    
    .molecule-display {
      text-align: center;
      flex: 1;
    }
    
    .molecule-formula {
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .tabs {
      display: flex;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
    }
    
    .tab {
      padding: 8px 15px;
      cursor: pointer;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-bottom: none;
      border-radius: 5px 5px 0 0;
      margin-right: 5px;
    }
    
    .tab.active {
      background: white;
      border-bottom: 1px solid white;
      margin-bottom: -1px;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .legend {
      margin-top: 15px;
      padding: 10px;
      background: #f0f0f0;
      border-radius: 5px;
      font-size: 12px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .legend-color {
      width: 15px;
      height: 15px;
      margin-right: 5px;
      border-radius: 3px;
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
    
    .tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
      display: none;
    }
    
    .molecule-3d {
      width: 100%;
      height: 200px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="canvas-container">
    <div class="tooltip" id="tooltip"></div>
    
    <div class="control-panel">
      <div class="tabs">
        <div class="tab active" data-tab="molecules">Molecules</div>
        <div class="tab" data-tab="reactions">Reactions</div>
        <div class="tab" data-tab="periodic">Periodic Table</div>
      </div>
      
      <div class="tab-content active" id="molecules-tab">
        <h2>Interactive Molecules</h2>
        
        <div class="section">
          <h3>Common Molecules</h3>
          <div class="molecule-btn" data-molecule="H2O">H₂O</div>
          <div class="molecule-btn" data-molecule="CO2">CO₂</div>
          <div class="molecule-btn" data-molecule="O2">O₂</div>
          <div class="molecule-btn" data-molecule="NH3">NH₃</div>
          <div class="molecule-btn" data-molecule="CH4">CH₄</div>
          <div class="molecule-btn" data-molecule="C2H6">C₂H₆</div>
        </div>
        
        <div class="section">
          <h3>Molecular Properties</h3>
          <div id="molecule-properties">
            <p>Select a molecule to view its properties</p>
          </div>
        </div>
        
        <div class="section">
          <h3>Molecular Structure</h3>
          <div id="molecule-structure">
            <p>Select a molecule to view its structure</p>
          </div>
        </div>
        
        <button id="clear-btn">Clear Simulation</button>
      </div>
      
      <div class="tab-content" id="reactions-tab">
        <h2>Chemical Reactions</h2>
        
        <div class="section">
          <h3>Common Reactions</h3>
          <button class="reaction-btn" data-reaction="combustion">Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O</button>
          <button class="reaction-btn" data-reaction="synthesis">Synthesis: N₂ + 3H₂ → 2NH₃</button>
          <button class="reaction-btn" data-reaction="decomposition">Decomposition: 2H₂O → 2H₂ + O₂</button>
          <button class="reaction-btn" data-reaction="acid-base">Acid-Base: HCl + NaOH → NaCl + H₂O</button>
        </div>
        
        <div class="section">
          <h3>Reaction Details</h3>
          <div id="reaction-details">
            <p>Select a reaction to view details</p>
          </div>
        </div>
        
        <div class="reaction-container" id="reaction-display">
          <div class="molecule-display">
            <p class="molecule-formula">Reactants</p>
            <div id="reactants-display"></div>
          </div>
          <div class="reaction-arrow">→</div>
          <div class="molecule-display">
            <p class="molecule-formula">Products</p>
            <div id="products-display"></div>
          </div>
        </div>
      </div>
      
      <div class="tab-content" id="periodic-tab">
        <h2>Periodic Table</h2>
        
        <div class="section">
          <div id="periodic-table-mini"></div>
          
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color nonmetal"></div>
              <span>Nonmetal</span>
            </div>
            <div class="legend-item">
              <div class="legend-color noble-gas"></div>
              <span>Noble Gas</span>
            </div>
            <div class="legend-item">
              <div class="legend-color alkali-metal"></div>
              <span>Alkali Metal</span>
            </div>
            <div class="legend-item">
              <div class="legend-color alkaline-earth"></div>
              <span>Alkaline Earth</span>
            </div>
            <div class="legend-item">
              <div class="legend-color metalloid"></div>
              <span>Metalloid</span>
            </div>
            <div class="legend-item">
              <div class="legend-color halogen"></div>
              <span>Halogen</span>
            </div>
            <div class="legend-item">
              <div class="legend-color transition-metal"></div>
              <span>Transition Metal</span>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Element Details</h3>
          <div id="element-details">
            <p>Click on an element to view details</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-panel">
      <h2>Chemistry Concepts</h2>
      
      <div class="section" id="concept-info">
        <h3>Welcome to Chemistry Lab</h3>
        <p>This interactive simulation helps you learn about molecules, chemical reactions, and the periodic table.</p>
        <p>Select a molecule or reaction to get started!</p>
      </div>
      
      <div class="section">
        <h3>Did You Know?</h3>
        <div id="fun-fact">
          <p>Water (H₂O) is one of the few substances that expands when it freezes, which is why ice floats on water.</p>
        </div>
      </div>
    </div>
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
        background: '#f5f5f5',
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
    
    // Periodic table data (simplified)
    const elements = [
      { number: 1, symbol: "H", name: "Hydrogen", category: "nonmetal" },
      { number: 2, symbol: "He", name: "Helium", category: "noble-gas" },
      { number: 3, symbol: "Li", name: "Lithium", category: "alkali-metal" },
      { number: 4, symbol: "Be", name: "Beryllium", category: "alkaline-earth" },
      { number: 5, symbol: "B", name: "Boron", category: "metalloid" },
      { number: 6, symbol: "C", name: "Carbon", category: "nonmetal" },
      { number: 7, symbol: "N", name: "Nitrogen", category: "nonmetal" },
      { number: 8, symbol: "O", name: "Oxygen", category: "nonmetal" },
      { number: 9, symbol: "F", name: "Fluorine", category: "halogen" },
      { number: 10, symbol: "Ne", name: "Neon", category: "noble-gas" },
      { number: 11, symbol: "Na", name: "Sodium", category: "alkali-metal" },
      { number: 12, symbol: "Mg", name: "Magnesium", category: "alkaline-earth" },
      { number: 13, symbol: "Al", name: "Aluminum", category: "metal" },
      { number: 14, symbol: "Si", name: "Silicon", category: "metalloid" },
      { number: 15, symbol: "P", name: "Phosphorus", category: "nonmetal" },
      { number: 16, symbol: "S", name: "Sulfur", category: "nonmetal" },
      { number: 17, symbol: "Cl", name: "Chlorine", category: "halogen" },
      { number: 18, symbol: "Ar", name: "Argon", category: "noble-gas" },
      { number: 19, symbol: "K", name: "Potassium", category: "alkali-metal" },
      { number: 20, symbol: "Ca", name: "Calcium", category: "alkaline-earth" }
    ];
    
    // Element details
    const elementDetails = {
      H: {
        name: "Hydrogen",
        atomicNumber: 1,
        atomicWeight: "1.008",
        electronConfig: "1s¹",
        category: "Nonmetal",
        state: "Gas",
        description: "Hydrogen is the lightest and most abundant element in the universe. It has one proton and one electron, and is highly flammable when mixed with oxygen."
      },
      C: {
        name: "Carbon",
        atomicNumber: 6,
        atomicWeight: "12.011",
        electronConfig: "1s² 2s² 2p²",
        category: "Nonmetal",
        state: "Solid",
        description: "Carbon is the basis of organic chemistry and can form four covalent bonds, allowing it to create complex molecules essential for life."
      },
      O: {
        name: "Oxygen",
        atomicNumber: 8,
        atomicWeight: "15.999",
        electronConfig: "1s² 2s² 2p⁴",
        category: "Nonmetal",
        state: "Gas",
        description: "Oxygen is essential for respiration in most living organisms. It makes up about 21% of Earth's atmosphere and is highly reactive."
      },
      N: {
        name: "Nitrogen",
        atomicNumber: 7,
        atomicWeight: "14.007",
        electronConfig: "1s² 2s² 2p³",
        category: "Nonmetal",
        state: "Gas",
        description: "Nitrogen makes up about 78% of Earth's atmosphere. It's relatively inert and is used in many industrial processes and fertilizers."
      }
    };
    
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
      "The noble gases were once called 'inert gases' because scientists thought they couldn't react with anything."
    ];
    
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
      updateMoleculeInfo(moleculeType);
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
    }
    
    // Update molecule information in the info panel
    function updateMoleculeInfo(moleculeType) {
      if (!molecules[moleculeType]) return;
      
      const molecule = molecules[moleculeType];
      
      // Update properties
      const propertiesDiv = document.getElementById('molecule-properties');
      let propertiesHTML = \`<h4>\${molecule.name} (\${molecule.formula})</h4>\`;
      
      for (const [key, value] of Object.entries(molecule.properties)) {
        propertiesHTML += \`<div class="property">
          <div class="property-name">\${key}:</div>
          <div class="property-value">\${value}</div>
        </div>\`;
      }
      
      propertiesDiv.innerHTML = propertiesHTML;
      
      // Update structure info
      const structureDiv = document.getElementById('molecule-structure');
      structureDiv.innerHTML = \`
        <p>\${molecule.description}</p>
      \`;
      
      // Update concept info
      const conceptDiv = document.getElementById('concept-info');
      conceptDiv.innerHTML = \`
        <h3>\${molecule.name} (\${molecule.formula})</h3>
        <p>\${molecule.description}</p>
        <p>This molecule contains \${molecule.atoms.length} atoms and \${molecule.bonds.length} bonds.</p>
      \`;
      
      // Show a random fun fact
      updateFunFact();
    }
    
    // Update reaction information
    function updateReactionInfo(reactionType) {
      if (!reactions[reactionType]) return;
      
      const reaction = reactions[reactionType];
      
      // Update reaction details
      const detailsDiv = document.getElementById('reaction-details');
      detailsDiv.innerHTML = \`
        <h4>\${reaction.name}</h4>
        <p>\${reaction.description}</p>
        <div class="property">
          <div class="property-name">Energy Change:</div>
          <div class="property-value">\${reaction.energyChange}</div>
        </div>
        <div class="property">
          <div class="property-name">Reaction Type:</div>
          <div class="property-value">\${reaction.reactionType}</div>
        </div>
      \`;
      
      // Update concept info
      const conceptDiv = document.getElementById('concept-info');
      conceptDiv.innerHTML = \`
        <h3>\${reaction.name}</h3>
        <p>\${reaction.equation}</p>
        <p>\${reaction.description}</p>
      \`;
      
      // Update reactants and products display
      const reactantsDiv = document.getElementById('reactants-display');
      const productsDiv = document.getElementById('products-display');
      
      reactantsDiv.innerHTML = reaction.reactants.map(r => formatFormula(r)).join(" + ");
      productsDiv.innerHTML = reaction.products.map(p => formatFormula(p)).join(" + ");
      
      // Show a random fun fact
      updateFunFact();
    }
    
    // Format chemical formulas with subscripts
    function formatFormula(formula) {
      // Replace numbers with subscripts
      return formula.replace(/([A-Z][a-z]?)(\d+)/g, '$1<sub>$2</sub>');
    }
    
    // Update element information
    function updateElementInfo(element) {
      if (!elementDetails[element]) return;
      
      const details = elementDetails[element];
      
      // Update element details
      const detailsDiv = document.getElementById('element-details');
      detailsDiv.innerHTML = \`
        <h4>\${details.name} (\${element})</h4>
        <div class="property">
          <div class="property-name">Atomic Number:</div>
          <div class="property-value">\${details.atomicNumber}</div>
        </div>
        <div class="property">
          <div class="property-name">Atomic Weight:</div>
          <div class="property-value">\${details.atomicWeight} u</div>
        </div>
        <div class="property">
          <div class="property-name">Electron Configuration:</div>
          <div class="property-value">\${details.electronConfig}</div>
        </div>
        <div class="property">
          <div class="property-name">Category:</div>
          <div class="property-value">\${details.category}</div>
        </div>
        <div class="property">
          <div class="property-name">State at STP:</div>
          <div class="property-value">\${details.state}</div>
        </div>
        <p>\${details.description}</p>
      \`;
      
      // Update concept info
      const conceptDiv = document.getElementById('concept-info');
      conceptDiv.innerHTML = \`
        <h3>\${details.name} (\${element})</h3>
        <p>\${details.description}</p>
      \`;
      
      // Show a random fun fact
      updateFunFact();
    }
    
    // Show a random fun fact
    function updateFunFact() {
      const factDiv = document.getElementById('fun-fact');
      const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
      factDiv.innerHTML = \`<p>\${randomFact}</p>\`;
    }
    
    // Create a mini periodic table
    function createPeriodicTable() {
      const tableDiv = document.getElementById('periodic-table-mini');
      let tableHTML = '';
      
      elements.forEach(element => {
        tableHTML += \`
          <div class="element \${element.category}" data-element="\${element.symbol}">
            <div class="element-number">\${element.number}</div>
            <div class="element-symbol">\${element.symbol}</div>
            <div class="element-name">\${element.name}</div>
          </div>
        \`;
      });
      
      tableDiv.innerHTML = tableHTML;
      
      // Add click event listeners
      document.querySelectorAll('.element').forEach(el => {
        el.addEventListener('click', function() {
          const element = this.getAttribute('data-element');
          if (elementDetails[element]) {
            updateElementInfo(element);
          }
        });
      });
    }
    
    // Handle tab switching
    function setupTabs() {
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          
          // Update active tab
          document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
          });
          this.classList.add('active');
          
          // Show active content
          document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          document.getElementById(tabId + '-tab').classList.add('active');
        });
      });
    }
    
    // Initialize the simulation
    function init() {
      // Set up event listeners for molecule buttons
      document.querySelectorAll('.molecule-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const moleculeType = this.getAttribute('data-molecule');
          createMolecule(moleculeType, window.innerWidth / 2, window.innerHeight / 2);
          
          // Update active state
          document.querySelectorAll('.molecule-btn').forEach(b => {
            b.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
      
      // Set up event listeners for reaction buttons
      document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const reactionType = this.getAttribute('data-reaction');
          updateReactionInfo(reactionType);
          
          // Simulate the reaction (just visual for now)
          const reaction = reactions[reactionType];
          if (reaction.reactants.length > 0) {
            createMolecule(reaction.reactants[0], window.innerWidth / 3, window.innerHeight / 2);
          }
        });
      });
      
      // Set up clear button
      document.getElementById('clear-btn').addEventListener('click', function() {
        clearMolecules();
        
        // Reset active state
        document.querySelectorAll('.molecule-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        // Reset info panels
        document.getElementById('molecule-properties').innerHTML = '<p>Select a molecule to view its properties</p>';
        document.getElementById('molecule-structure').innerHTML = '<p>Select a molecule to view its structure</p>';
        document.getElementById('concept-info').innerHTML = \`
          <h3>Welcome to Chemistry Lab</h3>
          <p>This interactive simulation helps you learn about molecules, chemical reactions, and the periodic table.</p>
          <p>Select a molecule or reaction to get started!</p>
        \`;
      });
      
      // Create periodic table
      createPeriodicTable();
      
      // Set up tabs
      setupTabs();
      
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
      
      // Show water molecule by default
      setTimeout(() => {
        createMolecule('H2O', window.innerWidth / 2, window.innerHeight / 2);
        document.querySelector('[data-molecule="H2O"]').classList.add('active');
      }, 500);
    }
    
    // Initialize when page loads
    window.addEventListener('load', init);
  </script>
</body>
</html>
  `;

  const handleReset = () => {
    webViewRef.current?.injectJavaScript(`
      document.getElementById('clear-btn').click();
      true;
    `);
  };

  const handleShowWater = () => {
    webViewRef.current?.injectJavaScript(`
      createMolecule('H2O', window.innerWidth / 2, window.innerHeight / 2);
      document.querySelector('[data-molecule="H2O"]').classList.add('active');
      true;
    `);
  };

  const handleShowMethane = () => {
    webViewRef.current?.injectJavaScript(`
      createMolecule('CH4', window.innerWidth / 2, window.innerHeight / 2);
      document.querySelector('[data-molecule="CH4"]').classList.add('active');
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
        <Button
          title="Show Water (H₂O)"
          onPress={handleShowWater}
          color="#4a90e2"
        />
        <Button
          title="Show Methane (CH₄)"
          onPress={handleShowMethane}
          color="#4CAF50"
        />
        <Button title="Clear" onPress={handleReset} color="#F44336" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  webview: {
    flex: 1
  },
  controls: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  }
});

export default Chemistry;
