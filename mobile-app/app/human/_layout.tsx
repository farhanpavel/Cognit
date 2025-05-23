"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { View, StyleSheet, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { Text, Surface, Button } from "react-native-paper";

const HumanBodyExplorer = () => {
  const webViewRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [bodySystem, setBodySystem] = useState("all");
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
      "This Biology component demonstrates Physical Part of our body from liver to kidney,from intestine to feet",
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
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
          color: #1C9777;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #A8E2D0;
        }
        
        .info-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          background-color: #20B486;
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
          color: #20B486;
          font-weight: bold;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #20B486;
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
          color: #1C9777;
          font-size: 14px;
          pointer-events: none;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 8px;
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
            color: '#20B486',
            label: 'Brain',
            system: 'nervous'
          },
          heart: {
            x: -15,
            y: -60,
            width: 40,
            height: 45,
            color: '#17A97B',
            label: 'Heart',
            system: 'circulatory'
          },
          lungs: {
            x: 0,
            y: -70,
            width: 100,
            height: 60,
            color: '#1C9777',
            label: 'Lungs',
            system: 'respiratory'
          },
          liver: {
            x: -25,
            y: 0,
            width: 50,
            height: 40,
            color: '#20B486',
            label: 'Liver',
            system: 'digestive'
          },
          stomach: {
            x: 0,
            y: 20,
            width: 45,
            height: 35,
            color: '#17A97B',
            label: 'Stomach',
            system: 'digestive'
          },
          kidneys: {
            x: 0,
            y: 40,
            width: 80,
            height: 25,
            color: '#1C9777',
            label: 'Kidneys',
            system: 'urinary'
          },
          intestines: {
            x: 0,
            y: 80,
            width: 90,
            height: 60,
            color: '#20B486',
            label: 'Intestines',
            system: 'digestive'
          },
          pancreas: {
            x: 25,
            y: 10,
            width: 40,
            height: 20,
            color: '#17A97B',
            label: 'Pancreas',
            system: 'digestive'
          },
          spleen: {
            x: 30,
            y: -10,
            width: 30,
            height: 20,
            color: '#1C9777',
            label: 'Spleen',
            system: 'lymphatic'
          },
          thyroid: {
            x: 0,
            y: -120,
            width: 40,
            height: 15,
            color: '#20B486',
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
                strokeStyle: '#A8E2D0',
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
                strokeStyle: '#A8E2D0',
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
                strokeStyle: '#A8E2D0',
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
                strokeStyle: '#A8E2D0',
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
                strokeStyle: '#A8E2D0',
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
                strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
                      strokeStyle: '#A8E2D0',
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
                    fillStyle: '#17A97B',
                    strokeStyle: '#A8E2D0',
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
                    fillStyle: '#17A97B',
                    strokeStyle: '#A8E2D0',
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
                    fillStyle: '#17A97B',
                    strokeStyle: '#A8E2D0',
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
                    fillStyle: '#17A97B',
                    strokeStyle: '#A8E2D0',
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
                    strokeStyle: '#A8E2D0',
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
              body.render.fillStyle = '#A8E2D0';
              
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
    { id: "all", name: "All Systems", color: "#20B486" },
    { id: "circulatory", name: "Circulatory", color: "#17A97B" },
    { id: "respiratory", name: "Respiratory", color: "#1C9777" },
    { id: "digestive", name: "Digestive", color: "#20B486" },
    { id: "nervous", name: "Nervous", color: "#17A97B" },
    { id: "urinary", name: "Urinary", color: "#1C9777" },
    { id: "endocrine", name: "Endocrine", color: "#20B486" },
    { id: "lymphatic", name: "Lymphatic", color: "#17A97B" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.title}>Human Body Explorer</Text>
      </Surface>

      <Surface style={styles.systemSelector} elevation={1}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.systemScrollContent}
        >
          {systems.map((system) => (
            <Button
              key={system.id}
              mode={bodySystem === system.id ? "contained" : "outlined"}
              onPress={() => changeBodySystem(system.id)}
              style={styles.systemButton}
              buttonColor={
                bodySystem === system.id ? system.color : "transparent"
              }
              textColor={bodySystem === system.id ? "white" : "#1C9777"}
              compact
            >
              {system.name}
            </Button>
          ))}
        </ScrollView>
      </Surface>

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
          <Surface style={styles.modalContent} elevation={5}>
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

              <Surface style={styles.factCard} elevation={1}>
                <Text style={styles.factTitle}>Interesting Fact:</Text>
                <Text style={styles.factText}>{selectedOrgan?.facts}</Text>
              </Surface>
            </ScrollView>

            <Button
              mode="contained"
              onPress={() => setShowModal(false)}
              style={styles.modalButton}
              buttonColor="#20B486"
              icon="check"
            >
              Close
            </Button>
          </Surface>
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
    backgroundColor: "#20B486",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  systemSelector: {
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#A8E2D0"
  },
  systemScrollContent: {
    paddingHorizontal: 5
  },
  systemButton: {
    marginHorizontal: 4,
    borderColor: "#A8E2D0",
    borderRadius: 20
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
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#20B486"
  },
  modalScroll: {
    maxHeight: 400,
    width: "100%"
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 22,
    color: "#333"
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 5,
    color: "#1C9777"
  },
  functionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#20B486",
    marginTop: 6,
    marginRight: 10
  },
  functionText: {
    flex: 1,
    fontSize: 14,
    color: "#333"
  },
  factCard: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f9f7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#20B486"
  },
  factTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1C9777"
  },
  factText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#333"
  },
  modalButton: {
    marginTop: 15,
    borderRadius: 8,
    paddingHorizontal: 20
  }
});

export default HumanBodyExplorer;
