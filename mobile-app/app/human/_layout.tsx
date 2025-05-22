"use client";

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  TouchableOpacity
} from "react-native";
import WebView from "react-native-webview";

const HumanBodyExplorer = () => {
  const webViewRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [bodySystem, setBodySystem] = useState("all");

  // Organ information database
  const organInfo = {
    brain: {
      name: "Brain",
      system: "nervous",
      description:
        "The brain is the control center of the body. It processes sensory information, controls motor functions, and is responsible for cognition, emotions, and memory. The brain consists of the cerebrum, cerebellum, and brainstem.",
      functions: [
        "Controls thoughts, memory, and speech",
        "Processes sensory information",
        "Regulates body temperature and vital functions",
        "Controls movement and balance",
        "Enables reasoning, emotions, and behavior"
      ],
      facts:
        "The human brain contains approximately 86 billion neurons and weighs about 3 pounds (1.4 kg)."
    },
    heart: {
      name: "Heart",
      system: "circulatory",
      description:
        "The heart is a muscular organ that pumps blood throughout the body via the circulatory system. It is divided into four chambers: two atria and two ventricles. The heart beats approximately 100,000 times per day.",
      functions: [
        "Pumps oxygenated blood to the body",
        "Receives deoxygenated blood from the body",
        "Maintains blood pressure",
        "Circulates nutrients and hormones",
        "Removes waste products through circulation"
      ],
      facts:
        "Your heart will beat about 2.5 billion times during your lifetime."
    },
    lungs: {
      name: "Lungs",
      system: "respiratory",
      description:
        "The lungs are the primary organs of the respiratory system. They extract oxygen from the atmosphere and transfer it into the bloodstream, while removing carbon dioxide from the blood. The lungs are located on either side of the heart.",
      functions: [
        "Exchange oxygen and carbon dioxide",
        "Filter air contaminants",
        "Regulate blood pH",
        "Produce sounds through air movement",
        "Help maintain body temperature"
      ],
      facts:
        "The surface area of the lungs is roughly the same size as a tennis court."
    },
    liver: {
      name: "Liver",
      system: "digestive",
      description:
        "The liver is the largest internal organ and gland in the human body. It performs over 500 vital functions, including detoxification, protein synthesis, and the production of biochemicals necessary for digestion.",
      functions: [
        "Detoxifies blood",
        "Produces bile for digestion",
        "Stores vitamins and minerals",
        "Metabolizes carbohydrates, proteins, and fats",
        "Synthesizes blood proteins"
      ],
      facts:
        "The liver is the only organ that can regenerate itself. It can regrow to its original size even after 75% of it is removed."
    },
    stomach: {
      name: "Stomach",
      system: "digestive",
      description:
        "The stomach is a muscular, hollow organ that is part of the digestive system. It breaks down food using acid and enzymes, and prepares it for further digestion in the small intestine.",
      functions: [
        "Stores and mixes food with digestive enzymes",
        "Secretes hydrochloric acid to kill bacteria",
        "Produces intrinsic factor for vitamin B12 absorption",
        "Begins protein digestion",
        "Regulates food passage into the small intestine"
      ],
      facts:
        "Your stomach produces a new layer of mucus every two weeks to avoid digesting itself."
    },
    kidneys: {
      name: "Kidneys",
      system: "urinary",
      description:
        "The kidneys are bean-shaped organs that filter blood, remove waste, and control fluid balance. They are located on either side of the spine in the retroperitoneal space.",
      functions: [
        "Filter waste products from blood",
        "Regulate electrolyte levels",
        "Control blood pressure",
        "Produce hormones for red blood cell production",
        "Maintain acid-base balance"
      ],
      facts:
        "Your kidneys filter about 120-150 quarts of blood every day to produce 1-2 quarts of urine."
    },
    intestines: {
      name: "Intestines",
      system: "digestive",
      description:
        "The intestines consist of the small intestine and large intestine (colon). The small intestine absorbs nutrients from food, while the large intestine absorbs water and electrolytes, forming stool.",
      functions: [
        "Absorb nutrients from digested food",
        "Complete the digestion process",
        "Absorb water and electrolytes",
        "Host beneficial bacteria",
        "Eliminate waste products"
      ],
      facts:
        "The small intestine is about 20 feet (6 meters) long, while the large intestine is about 5 feet (1.5 meters) long."
    },
    pancreas: {
      name: "Pancreas",
      system: "digestive",
      description:
        "The pancreas is both an endocrine and exocrine gland. It produces digestive enzymes and hormones like insulin and glucagon that regulate blood sugar levels.",
      functions: [
        "Produces digestive enzymes",
        "Secretes insulin and glucagon",
        "Regulates blood sugar levels",
        "Neutralizes stomach acid",
        "Aids in nutrient absorption"
      ],
      facts:
        "The pancreas produces about 8 ounces (240 ml) of digestive juices daily."
    },
    spleen: {
      name: "Spleen",
      system: "lymphatic",
      description:
        "The spleen is an organ found in the upper left part of the abdomen. It filters blood, removes old red blood cells, and is part of the immune system.",
      functions: [
        "Filters blood and removes old red blood cells",
        "Stores platelets and white blood cells",
        "Produces antibodies",
        "Helps fight certain types of bacteria",
        "Recycles iron from hemoglobin"
      ],
      facts:
        "Unlike many other organs, a person can live without a spleen, although they become more susceptible to certain infections."
    },
    thyroid: {
      name: "Thyroid",
      system: "endocrine",
      description:
        "The thyroid is a butterfly-shaped gland located in the neck. It produces hormones that regulate metabolism, growth, and development.",
      functions: [
        "Regulates metabolism",
        "Controls heart rate and body temperature",
        "Influences growth and development",
        "Affects nervous system function",
        "Regulates calcium levels"
      ],
      facts:
        "The thyroid produces hormones that affect every cell in your body."
    }
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "ORGAN_SELECTED") {
        const organ = organInfo[data.organId];
        if (organ) {
          setSelectedOrgan(organ);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Change body system view
  const changeBodySystem = (system) => {
    setBodySystem(system);
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        changeBodySystem('${system}');
        true;
      `);
    }
  };

  // HTML content with Matter.js for the human body
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #f0f8ff;
          font-family: Arial, sans-serif;
          touch-action: none;
        }
        
        #canvas-container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        canvas {
          display: block;
        }
        
        .organ-label {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .info-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          background-color: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
          z-index: 100;
        }
        
        .loading-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #f0f8ff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .loading-text {
          margin-top: 20px;
          font-size: 18px;
          color: #3498db;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .help-text {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center;
          color: #7f8c8d;
          font-size: 14px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div id="canvas-container">
        <div class="loading-screen" id="loading-screen">
          <div class="spinner"></div>
          <div class="loading-text">Loading Human Body...</div>
        </div>
        <div class="help-text">Tap on an organ to learn more about it</div>
      </div>
      
      <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
      <script>
        // Matter.js setup
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const World = Matter.World;
        const Bodies = Matter.Bodies;
        const Body = Matter.Body;
        const Composite = Matter.Composite;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;
        
        // Create engine
        const engine = Engine.create({
          gravity: { x: 0, y: 0 }
        });
        const world = engine.world;
        
        // Create renderer
        const render = Render.create({
          element: document.getElementById('canvas-container'),
          engine: engine,
          options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: '#f0f8ff',
            pixelRatio: window.devicePixelRatio
          }
        });
        
        // Organ definitions with positions relative to body
        const organs = {
          brain: {
            x: 0,
            y: -180,
            width: 60,
            height: 50,
            color: '#e74c3c',
            label: 'Brain',
            system: 'nervous'
          },
          heart: {
            x: -15,
            y: -60,
            width: 40,
            height: 45,
            color: '#c0392b',
            label: 'Heart',
            system: 'circulatory'
          },
          lungs: {
            x: 0,
            y: -70,
            width: 100,
            height: 60,
            color: '#3498db',
            label: 'Lungs',
            system: 'respiratory'
          },
          liver: {
            x: -25,
            y: 0,
            width: 50,
            height: 40,
            color: '#8e44ad',
            label: 'Liver',
            system: 'digestive'
          },
          stomach: {
            x: 0,
            y: 20,
            width: 45,
            height: 35,
            color: '#27ae60',
            label: 'Stomach',
            system: 'digestive'
          },
          kidneys: {
            x: 0,
            y: 40,
            width: 80,
            height: 25,
            color: '#d35400',
            label: 'Kidneys',
            system: 'urinary'
          },
          intestines: {
            x: 0,
            y: 80,
            width: 90,
            height: 60,
            color: '#f39c12',
            label: 'Intestines',
            system: 'digestive'
          },
          pancreas: {
            x: 25,
            y: 10,
            width: 40,
            height: 20,
            color: '#16a085',
            label: 'Pancreas',
            system: 'digestive'
          },
          spleen: {
            x: 30,
            y: -10,
            width: 30,
            height: 20,
            color: '#7f8c8d',
            label: 'Spleen',
            system: 'lymphatic'
          },
          thyroid: {
            x: 0,
            y: -120,
            width: 40,
            height: 15,
            color: '#e67e22',
            label: 'Thyroid',
            system: 'endocrine'
          }
        };
        
        // Body outline
        const bodyOutline = {
          head: { x: 0, y: -160, radius: 40 },
          torso: { x: 0, y: 0, width: 100, height: 200 },
          leftArm: { x: -70, y: -50, width: 30, height: 120 },
          rightArm: { x: 70, y: -50, width: 30, height: 120 },
          leftLeg: { x: -30, y: 150, width: 30, height: 120 },
          rightLeg: { x: 30, y: 150, width: 30, height: 120 }
        };
        
        // Create organ bodies
        const organBodies = {};
        const labelElements = {};
        let currentSystem = 'all';
        
        function createHumanBody() {
          // Create body outline parts
          const headBody = Bodies.circle(
            window.innerWidth / 2 + bodyOutline.head.x,
            window.innerHeight / 2 + bodyOutline.head.y,
            bodyOutline.head.radius,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          const torsoBody = Bodies.rectangle(
            window.innerWidth / 2 + bodyOutline.torso.x,
            window.innerHeight / 2 + bodyOutline.torso.y,
            bodyOutline.torso.width,
            bodyOutline.torso.height,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              chamfer: { radius: 20 },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          const leftArmBody = Bodies.rectangle(
            window.innerWidth / 2 + bodyOutline.leftArm.x,
            window.innerHeight / 2 + bodyOutline.leftArm.y,
            bodyOutline.leftArm.width,
            bodyOutline.leftArm.height,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              chamfer: { radius: 10 },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          const rightArmBody = Bodies.rectangle(
            window.innerWidth / 2 + bodyOutline.rightArm.x,
            window.innerHeight / 2 + bodyOutline.rightArm.y,
            bodyOutline.rightArm.width,
            bodyOutline.rightArm.height,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              chamfer: { radius: 10 },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          const leftLegBody = Bodies.rectangle(
            window.innerWidth / 2 + bodyOutline.leftLeg.x,
            window.innerHeight / 2 + bodyOutline.leftLeg.y,
            bodyOutline.leftLeg.width,
            bodyOutline.leftLeg.height,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              chamfer: { radius: 10 },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          const rightLegBody = Bodies.rectangle(
            window.innerWidth / 2 + bodyOutline.rightLeg.x,
            window.innerHeight / 2 + bodyOutline.rightLeg.y,
            bodyOutline.rightLeg.width,
            bodyOutline.rightLeg.height,
            {
              isStatic: true,
              render: {
                fillStyle: '#ecf0f1',
                strokeStyle: '#2c3e50',
                lineWidth: 2
              },
              chamfer: { radius: 10 },
              collisionFilter: {
                group: -1
              }
            }
          );
          
          // Add body outline to world
          World.add(world, [
            headBody,
            torsoBody,
            leftArmBody,
            rightArmBody,
            leftLegBody,
            rightLegBody
          ]);
          
          // Create organs
          for (const [organId, organ] of Object.entries(organs)) {
            // Create organ body
            let organBody;
            
            if (organId === 'brain') {
              // Brain is more oval-shaped
              organBody = Bodies.circle(
                window.innerWidth / 2 + organ.x,
                window.innerHeight / 2 + organ.y,
                organ.width / 2,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  chamfer: { radius: 10 },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
            } else if (organId === 'lungs') {
              // Create two lung parts
              const leftLung = Bodies.circle(
                window.innerWidth / 2 - 30,
                window.innerHeight / 2 - 70,
                25,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              const rightLung = Bodies.circle(
                window.innerWidth / 2 + 30,
                window.innerHeight / 2 - 70,
                25,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              organBody = Composite.create({
                bodies: [leftLung, rightLung]
              });
            } else if (organId === 'kidneys') {
              // Create two kidney parts
              const leftKidney = Bodies.circle(
                window.innerWidth / 2 - 25,
                window.innerHeight / 2 + 40,
                15,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              const rightKidney = Bodies.circle(
                window.innerWidth / 2 + 25,
                window.innerHeight / 2 + 40,
                15,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              organBody = Composite.create({
                bodies: [leftKidney, rightKidney]
              });
            } else if (organId === 'intestines') {
              // Create intestines with multiple parts for a more realistic look
              const parts = [];
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2 + 80;
              
              // Small intestine (coiled appearance)
              for (let i = 0; i < 5; i++) {
                const xOffset = Math.sin(i * 1.2) * 20;
                const yOffset = i * 8;
                
                const part = Bodies.circle(
                  centerX + xOffset,
                  centerY + yOffset - 20,
                  10,
                  {
                    isStatic: true,
                    render: {
                      fillStyle: organ.color,
                      strokeStyle: '#2c3e50',
                      lineWidth: 1
                    },
                    organId: organId,
                    label: organ.label,
                    system: organ.system
                  }
                );
                
                parts.push(part);
              }
              
              // Large intestine (frame around small intestine)
              const topColon = Bodies.rectangle(
                centerX,
                centerY - 30,
                60,
                10,
                {
                  isStatic: true,
                  render: {
                    fillStyle: '#e67e22',
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              const rightColon = Bodies.rectangle(
                centerX + 30,
                centerY,
                10,
                60,
                {
                  isStatic: true,
                  render: {
                    fillStyle: '#e67e22',
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              const bottomColon = Bodies.rectangle(
                centerX,
                centerY + 30,
                60,
                10,
                {
                  isStatic: true,
                  render: {
                    fillStyle: '#e67e22',
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              const leftColon = Bodies.rectangle(
                centerX - 30,
                centerY,
                10,
                60,
                {
                  isStatic: true,
                  render: {
                    fillStyle: '#e67e22',
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
              
              parts.push(topColon, rightColon, bottomColon, leftColon);
              
              organBody = Composite.create({
                bodies: parts
              });
            } else {
              // Default rectangular organ
              organBody = Bodies.rectangle(
                window.innerWidth / 2 + organ.x,
                window.innerHeight / 2 + organ.y,
                organ.width,
                organ.height,
                {
                  isStatic: true,
                  render: {
                    fillStyle: organ.color,
                    strokeStyle: '#2c3e50',
                    lineWidth: 1
                  },
                  chamfer: { radius: 5 },
                  organId: organId,
                  label: organ.label,
                  system: organ.system
                }
              );
            }
            
            // Store organ body
            organBodies[organId] = organBody;
            
            // Create label element
            const labelEl = document.createElement('div');
            labelEl.className = 'organ-label';
            labelEl.textContent = organ.label;
            document.getElementById('canvas-container').appendChild(labelEl);
            labelElements[organId] = labelEl;
            
            // Add organ to world
            if (organId === 'lungs' || organId === 'kidneys' || organId === 'intestines') {
              World.add(world, organBody.bodies);
            } else {
              World.add(world, organBody);
            }
          }
          
          // Hide loading screen
          setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
          }, 1500);
        }
        
        // Update label positions
        function updateLabels() {
          for (const [organId, organ] of Object.entries(organs)) {
            const labelEl = labelElements[organId];
            
            if (currentSystem === 'all' || currentSystem === organ.system) {
              labelEl.style.opacity = '1';
              
              // Position label based on organ type
              if (organId === 'lungs' && organBodies[organId].bodies) {
                // Position between the two lungs
                const leftLung = organBodies[organId].bodies[0];
                const rightLung = organBodies[organId].bodies[1];
                const x = (leftLung.position.x + rightLung.position.x) / 2;
                const y = (leftLung.position.y + rightLung.position.y) / 2;
                
                labelEl.style.left = (x - labelEl.offsetWidth / 2) + 'px';
                labelEl.style.top = (y - 30) + 'px';
              } else if (organId === 'kidneys' && organBodies[organId].bodies) {
                // Position between the two kidneys
                const leftKidney = organBodies[organId].bodies[0];
                const rightKidney = organBodies[organId].bodies[1];
                const x = (leftKidney.position.x + rightKidney.position.x) / 2;
                const y = (leftKidney.position.y + rightKidney.position.y) / 2;
                
                labelEl.style.left = (x - labelEl.offsetWidth / 2) + 'px';
                labelEl.style.top = (y - 25) + 'px';
              } else if (organId === 'intestines' && organBodies[organId].bodies) {
                // Position at the center of intestines
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2 + 80;
                
                labelEl.style.left = (centerX - labelEl.offsetWidth / 2) + 'px';
                labelEl.style.top = (centerY - 50) + 'px';
              } else if (organBodies[organId].position) {
                // Standard positioning
                const body = organBodies[organId];
                labelEl.style.left = (body.position.x - labelEl.offsetWidth / 2) + 'px';
                labelEl.style.top = (body.position.y - body.circleRadius - 20 || body.position.y - body.bounds.max.y + body.bounds.min.y - 20) + 'px';
              }
            } else {
              labelEl.style.opacity = '0';
            }
          }
        }
        
        // Change body system view
        function changeBodySystem(system) {
          currentSystem = system;
          
          // Show/hide organs based on system
          for (const [organId, organ] of Object.entries(organs)) {
            const isVisible = system === 'all' || system === organ.system;
            
            if (organId === 'lungs' || organId === 'kidneys' || organId === 'intestines') {
              // Composite organs
              organBodies[organId].bodies.forEach(body => {
                body.render.opacity = isVisible ? 1 : 0.1;
              });
            } else {
              // Single body organs
              organBodies[organId].render.opacity = isVisible ? 1 : 0.1;
            }
          }
        }
        
        // Handle clicks on organs
        function handleOrganClick(event) {
          const bodies = Composite.allBodies(world);
          
          // Get mouse position
          const mouse = {
            x: event.clientX,
            y: event.clientY
          };
          
          // Check if mouse is over any organ
          for (const body of bodies) {
            if (Matter.Bounds.contains(body.bounds, mouse) && body.organId) {
              // Send message to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'ORGAN_SELECTED',
                organId: body.organId
              }));
              
              // Highlight the clicked organ
              const originalColor = body.render.fillStyle;
              body.render.fillStyle = '#f1c40f';
              
              setTimeout(() => {
                body.render.fillStyle = originalColor;
              }, 500);
              
              break;
            }
          }
        }
        
        // Initialize
        function init() {
          createHumanBody();
          
          // Add mouse click event
          document.addEventListener('click', handleOrganClick);
          document.addEventListener('touchend', (e) => {
            handleOrganClick({
              clientX: e.changedTouches[0].clientX,
              clientY: e.changedTouches[0].clientY
            });
          });
          
          // Update labels on render
          Matter.Events.on(render, 'afterRender', updateLabels);
          
          // Run the engine
          Engine.run(engine);
          Render.run(render);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
          render.options.width = window.innerWidth;
          render.options.height = window.innerHeight;
          Render.setPixelRatio(render, window.devicePixelRatio);
          
          // Reposition all bodies
          World.clear(world);
          
          // Clear existing labels
          for (const labelEl of Object.values(labelElements)) {
            labelEl.remove();
          }
          
          // Recreate human body
          createHumanBody();
          
          // Apply current system filter
          changeBodySystem(currentSystem);
        });
        
        // Initialize when the page loads
        window.onload = init;
      </script>
    </body>
    </html>
  `;

  // System buttons data
  const systems = [
    { id: "all", name: "All Systems", color: "#3498db" },
    { id: "circulatory", name: "Circulatory", color: "#c0392b" },
    { id: "respiratory", name: "Respiratory", color: "#3498db" },
    { id: "digestive", name: "Digestive", color: "#27ae60" },
    { id: "nervous", name: "Nervous", color: "#e74c3c" },
    { id: "urinary", name: "Urinary", color: "#d35400" },
    { id: "endocrine", name: "Endocrine", color: "#e67e22" },
    { id: "lymphatic", name: "Lymphatic", color: "#7f8c8d" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Human Body Explorer</Text>
      </View>

      <View style={styles.systemSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {systems.map((system) => (
            <TouchableOpacity
              key={system.id}
              style={[
                styles.systemButton,
                bodySystem === system.id && styles.systemButtonActive,
                {
                  backgroundColor:
                    bodySystem === system.id ? system.color : "#ecf0f1"
                }
              ]}
              onPress={() => changeBodySystem(system.id)}
            >
              <Text
                style={[
                  styles.systemButtonText,
                  bodySystem === system.id && styles.systemButtonTextActive
                ]}
              >
                {system.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scrollEnabled={false}
          bounces={false}
          style={styles.webView}
        />
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedOrgan?.name}</Text>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalDescription}>
                {selectedOrgan?.description}
              </Text>

              <Text style={styles.modalSubtitle}>Functions:</Text>
              {selectedOrgan?.functions.map((func, index) => (
                <View key={index} style={styles.functionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.functionText}>{func}</Text>
                </View>
              ))}

              <Text style={styles.modalSubtitle}>Interesting Fact:</Text>
              <Text style={styles.factText}>{selectedOrgan?.facts}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff"
  },
  header: {
    padding: 15,
    backgroundColor: "#3498db",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  systemSelector: {
    padding: 10,
    backgroundColor: "#ecf0f1"
  },
  systemButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: "#bdc3c7"
  },
  systemButtonActive: {
    borderColor: "transparent"
  },
  systemButtonText: {
    color: "#2c3e50",
    fontWeight: "600"
  },
  systemButtonTextActive: {
    color: "white"
  },
  webViewContainer: {
    flex: 1,
    overflow: "hidden"
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50"
  },
  modalScroll: {
    maxHeight: 400,
    width: "100%"
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    color: "#34495e"
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
    color: "#2c3e50"
  },
  functionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3498db",
    marginTop: 6,
    marginRight: 8
  },
  functionText: {
    flex: 1,
    fontSize: 14,
    color: "#34495e"
  },
  factText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#7f8c8d",
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default HumanBodyExplorer;
