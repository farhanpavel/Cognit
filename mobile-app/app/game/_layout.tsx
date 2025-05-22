"use client";

import { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import WebView from "react-native-webview";

export default function DataStructureGame() {
  const webViewRef = useRef(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  // HTML content with structured data visualization
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Data Structure Learning</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: #f0f4f8;
          overflow: hidden;
          touch-action: manipulation;
        }
        #app {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: #2c3e50;
          color: white;
          padding: 10px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
        .game-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 10px;
          overflow: hidden;
        }
        .instructions {
          background: rgba(44, 62, 80, 0.9);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
          transition: opacity 0.3s;
        }
        .workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
        }
        .element-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .element {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3498db;
          color: white;
          font-weight: bold;
          border-radius: 8px;
          cursor: grab;
          user-select: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          position: relative;
          transition: transform 0.1s;
        }
        .element.dragging {
          opacity: 0.8;
          z-index: 1000;
          cursor: grabbing;
          transform: scale(1.05);
        }
        .dropzone {
          background: rgba(236, 240, 241, 0.8);
          border: 2px dashed #7f8c8d;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .dropzone.highlight {
          background: rgba(46, 204, 113, 0.2);
          border-color: #2ecc71;
        }
        .dropzone.occupied {
          border-style: solid;
          border-color: #3498db;
        }
        .success-message {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(39, 174, 96, 0.9);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .button {
          background: #2980b9;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
        }
        .button:hover {
          background: #3498db;
        }
        .score {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(44, 62, 80, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
        }
        
        /* Array specific styles */
        .array-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        .array-cell {
          width: 60px;
          height: 60px;
          border: 2px solid #34495e;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(236, 240, 241, 0.8);
          font-weight: bold;
          font-size: 18px;
        }
        .array-index {
          position: absolute;
          bottom: -25px;
          font-size: 14px;
          color: #7f8c8d;
        }
        
        /* Linked List specific styles */
        .linked-list-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0;
        }
        .linked-list-workspace {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          min-height: 100px;
        }
        .node {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          position: relative;
          margin: 0 40px;
        }
        .node-container {
          display: flex;
          align-items: center;
          position: relative;
        }
        .pointer {
          width: 40px;
          height: 4px;
          background: #e74c3c;
          position: relative;
        }
        .pointer:after {
          content: '';
          position: absolute;
          right: 0;
          top: -8px;
          border-left: 12px solid #e74c3c;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
        }
        
        /* Stack specific styles */
        .stack-container {
          width: 200px;
          margin: 0 auto;
          border-left: 4px solid #34495e;
          border-right: 4px solid #34495e;
          border-bottom: 4px solid #34495e;
          display: flex;
          flex-direction: column-reverse;
          min-height: 300px;
          position: relative;
        }
        .stack-element {
          width: 100%;
          height: 50px;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border-bottom: 1px solid rgba(255,255,255,0.3);
        }
        .stack-dropzone {
          width: 100%;
          height: 50px;
          background: rgba(236, 240, 241, 0.5);
          border-bottom: 1px dashed #7f8c8d;
        }
        
        /* Binary Tree specific styles */
        .tree-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px 0;
          position: relative;
        }
        .tree-level {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
          position: relative;
          width: 100%;
        }
        .tree-node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin: 0 10px;
        }
        .tree-node {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          position: relative;
        }
        .tree-edge {
          position: absolute;
          background: #7f8c8d;
          width: 3px;
          transform-origin: top center;
          z-index: -1;
        }
        .tree-dropzone {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(236, 240, 241, 0.5);
          border: 2px dashed #7f8c8d;
        }
      </style>
    </head>
    <body>
      <div id="app">
        <div class="header">
          <span id="level-title">Data Structure Learning</span>
        </div>
        
        <div class="game-container">
          <div class="score">Score: <span id="score">0</span></div>
          <div class="instructions" id="instructions"></div>
          <div class="workspace" id="workspace"></div>
        </div>
      </div>

      <script>
        // Game state
        const gameState = {
          score: 0,
          currentLevel: 1,
          maxLevel: 4,
          tutorial: true,
          levelCompleted: false,
          draggedElement: null,
          elements: [],
          dropzones: []
        };

        // Level definitions
        const levels = {
          1: {
            title: "Arrays",
            description: "Arrange the array elements in ascending order (0-4). Drag elements to their correct positions.",
            tutorial: "Arrays store elements in contiguous memory locations with direct access by index. Each element occupies the same amount of memory.",
            setup: setupArrayLevel,
            check: checkArrayLevel
          },
          2: {
            title: "Linked List",
            description: "Create a linked list by placing nodes in order (1→2→3→4→5).",
            tutorial: "Linked Lists connect nodes with pointers. Each node contains data and a reference to the next node in the sequence.",
            setup: setupLinkedListLevel,
            check: checkLinkedListLevel
          },
          3: {
            title: "Stack",
            description: "Build a LIFO stack with elements in order (5 at bottom, 1 at top).",
            tutorial: "Stacks follow Last-In-First-Out (LIFO) principle. Elements can only be added or removed from the top of the stack.",
            setup: setupStackLevel,
            check: checkStackLevel
          },
          4: {
            title: "Binary Search Tree",
            description: "Create a valid binary search tree with root 4.",
            tutorial: "In a Binary Search Tree, all nodes in the left subtree have values less than the parent, and all nodes in the right subtree have values greater than the parent.",
            setup: setupTreeLevel,
            check: checkTreeLevel
          }
        };

        // DOM elements
        const workspace = document.getElementById('workspace');
        const instructions = document.getElementById('instructions');
        const scoreElement = document.getElementById('score');
        const levelTitle = document.getElementById('level-title');

        // Initialize game
        function initGame() {
          loadLevel(gameState.currentLevel);
          updateScore();
        }

        // Load a specific level
        function loadLevel(levelNum) {
          if (levels[levelNum]) {
            clearWorkspace();
            gameState.currentLevel = levelNum;
            gameState.levelCompleted = false;
            
            levelTitle.textContent = \`\${levels[levelNum].title} - Level \${levelNum}/\${gameState.maxLevel}\`;
            
            if (gameState.tutorial) {
              instructions.innerHTML = \`
                <p><strong>\${levels[levelNum].description}</strong></p>
                <p>\${levels[levelNum].tutorial}</p>
              \`;
            } else {
              instructions.innerHTML = \`<p><strong>\${levels[levelNum].description}</strong></p>\`;
            }
            
            levels[levelNum].setup();
            setupDragAndDrop();
          }
        }

        // Clear workspace
        function clearWorkspace() {
          workspace.innerHTML = '';
          gameState.elements = [];
          gameState.dropzones = [];
          
          // Remove any success messages
          const successMsg = document.querySelector('.success-message');
          if (successMsg) successMsg.remove();
        }

        // Update score display
        function updateScore() {
          scoreElement.textContent = gameState.score;
        }

        // Show level success message
        function showLevelSuccess() {
          const successDiv = document.createElement('div');
          successDiv.className = 'success-message';
          successDiv.innerHTML = \`
            <h2>Level Complete!</h2>
            <p>You've mastered \${levels[gameState.currentLevel].title}!</p>
            <p>+100 points</p>
            <button class="button" id="next-level">Next Level</button>
          \`;
          document.body.appendChild(successDiv);
          
          document.getElementById('next-level').addEventListener('click', () => {
            if (gameState.currentLevel < gameState.maxLevel) {
              loadLevel(gameState.currentLevel + 1);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'LEVEL_CHANGE',
                level: gameState.currentLevel
              }));
            } else {
              // Game completed
              successDiv.innerHTML = \`
                <h2>Congratulations!</h2>
                <p>You've completed all levels!</p>
                <p>Final Score: \${gameState.score}</p>
                <button class="button" id="restart-game">Play Again</button>
              \`;
              document.getElementById('restart-game').addEventListener('click', () => {
                gameState.currentLevel = 1;
                loadLevel(1);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'LEVEL_CHANGE',
                  level: 1
                }));
              });
            }
          });
        }

        // Setup drag and drop functionality
        function setupDragAndDrop() {
          const elements = document.querySelectorAll('.element');
          const dropzones = document.querySelectorAll('.dropzone');
          
          gameState.elements = Array.from(elements);
          gameState.dropzones = Array.from(dropzones);
          
          // Setup touch events for mobile
          elements.forEach(element => {
            element.addEventListener('touchstart', handleDragStart, { passive: false });
            element.addEventListener('touchmove', handleDragMove, { passive: false });
            element.addEventListener('touchend', handleDragEnd, { passive: false });
            
            // Also setup mouse events for testing in browser
            element.addEventListener('mousedown', handleDragStart);
          });
          
          document.addEventListener('mousemove', handleDragMove);
          document.addEventListener('mouseup', handleDragEnd);
        }

        // Handle drag start
        function handleDragStart(e) {
          e.preventDefault();
          
          // Get the element being dragged
          const element = e.target.closest('.element');
          if (!element) return;
          
          // If element is already in a dropzone, remove it
          const parentDropzone = element.parentElement.closest('.dropzone');
          if (parentDropzone) {
            parentDropzone.classList.remove('occupied');
            parentDropzone.dataset.value = '';
          }
          
          // Set as dragged element
          gameState.draggedElement = element;
          element.classList.add('dragging');
          
          // Get initial position
          const touch = e.type === 'touchstart' ? e.touches[0] : e;
          const rect = element.getBoundingClientRect();
          
          element.dataset.offsetX = touch.clientX - rect.left;
          element.dataset.offsetY = touch.clientY - rect.top;
          
          // Move element to body for absolute positioning during drag
          document.body.appendChild(element);
          element.style.position = 'absolute';
          
          // Position at current location
          updateElementPosition(touch);
        }

        // Handle drag move
        function handleDragMove(e) {
          e.preventDefault();
          
          if (!gameState.draggedElement) return;
          
          const touch = e.type === 'touchmove' ? e.touches[0] : e;
          updateElementPosition(touch);
          
          // Highlight dropzone under element
          const dropzone = getDropzoneUnderElement(touch);
          
          gameState.dropzones.forEach(dz => {
            dz.classList.remove('highlight');
          });
          
          if (dropzone && !dropzone.classList.contains('occupied')) {
            dropzone.classList.add('highlight');
          }
        }

        // Handle drag end
        function handleDragEnd(e) {
          e.preventDefault();
          
          if (!gameState.draggedElement) return;
          
          const element = gameState.draggedElement;
          element.classList.remove('dragging');
          
          const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
          const dropzone = getDropzoneUnderElement(touch);
          
          // Remove highlight from all dropzones
          gameState.dropzones.forEach(dz => {
            dz.classList.remove('highlight');
          });
          
          if (dropzone && !dropzone.classList.contains('occupied')) {
            // Place element in dropzone
            element.style.position = '';
            element.style.top = '';
            element.style.left = '';
            
            dropzone.appendChild(element);
            dropzone.classList.add('occupied');
            dropzone.dataset.value = element.dataset.value;
            
            // Check if level is completed
            if (levels[gameState.currentLevel].check()) {
              gameState.levelCompleted = true;
              gameState.score += 100;
              updateScore();
              showLevelSuccess();
            }
          } else {
            // Return to element container
            const elementContainer = document.querySelector('.element-container');
            element.style.position = '';
            element.style.top = '';
            element.style.left = '';
            elementContainer.appendChild(element);
          }
          
          gameState.draggedElement = null;
        }

        // Update dragged element position
        function updateElementPosition(touch) {
          const element = gameState.draggedElement;
          const offsetX = parseInt(element.dataset.offsetX) || 0;
          const offsetY = parseInt(element.dataset.offsetY) || 0;
          
          element.style.left = (touch.clientX - offsetX) + 'px';
          element.style.top = (touch.clientY - offsetY) + 'px';
        }

        // Get dropzone under element
        function getDropzoneUnderElement(touch) {
          // Get all dropzones
          const dropzones = gameState.dropzones;
          
          // Check if touch point is over any dropzone
          for (const dropzone of dropzones) {
            const rect = dropzone.getBoundingClientRect();
            if (
              touch.clientX >= rect.left &&
              touch.clientX <= rect.right &&
              touch.clientY >= rect.top &&
              touch.clientY <= rect.bottom &&
              !dropzone.classList.contains('occupied')
            ) {
              return dropzone;
            }
          }
          
          return null;
        }

        // Array Level
        function setupArrayLevel() {
          // Create array visualization
          const arrayContainer = document.createElement('div');
          arrayContainer.className = 'array-container';
          
          // Create array cells with indices
          for (let i = 0; i < 5; i++) {
            const cell = document.createElement('div');
            cell.className = 'array-cell dropzone';
            cell.dataset.index = i;
            
            const indexLabel = document.createElement('div');
            indexLabel.className = 'array-index';
            indexLabel.textContent = \`Index \${i}\`;
            
            cell.appendChild(indexLabel);
            arrayContainer.appendChild(cell);
          }
          
          workspace.appendChild(arrayContainer);
          
          // Create draggable elements
          const elementContainer = document.createElement('div');
          elementContainer.className = 'element-container';
          
          // Create array elements in random order
          const values = [0, 1, 2, 3, 4];
          const shuffled = values.sort(() => Math.random() - 0.5);
          
          for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'element';
            element.textContent = shuffled[i];
            element.dataset.value = shuffled[i];
            
            elementContainer.appendChild(element);
          }
          
          workspace.appendChild(elementContainer);
        }

        function checkArrayLevel() {
          const dropzones = document.querySelectorAll('.array-cell');
          
          // Check if all dropzones are filled
          if (Array.from(dropzones).some(dz => !dz.classList.contains('occupied'))) {
            return false;
          }
          
          // Check if elements are in correct order
          for (let i = 0; i < dropzones.length; i++) {
            const value = parseInt(dropzones[i].dataset.value);
            if (value !== i) {
              return false;
            }
          }
          
          return true;
        }

        // Linked List Level
        function setupLinkedListLevel() {
          // Create linked list visualization
          const linkedListContainer = document.createElement('div');
          linkedListContainer.className = 'linked-list-container';
          
          // Create linked list workspace
          const linkedListWorkspace = document.createElement('div');
          linkedListWorkspace.className = 'linked-list-workspace';
          
          // Create node placeholders with pointers
          for (let i = 0; i < 5; i++) {
            const nodeContainer = document.createElement('div');
            nodeContainer.className = 'node-container';
            
            const nodeDropzone = document.createElement('div');
            nodeDropzone.className = 'tree-dropzone dropzone';
            nodeDropzone.dataset.position = i;
            
            nodeContainer.appendChild(nodeDropzone);
            
            // Add pointer except for last node
            if (i < 4) {
              const pointer = document.createElement('div');
              pointer.className = 'pointer';
              nodeContainer.appendChild(pointer);
            }
            
            linkedListWorkspace.appendChild(nodeContainer);
          }
          
          linkedListContainer.appendChild(linkedListWorkspace);
          workspace.appendChild(linkedListContainer);
          
          // Create draggable elements
          const elementContainer = document.createElement('div');
          elementContainer.className = 'element-container';
          
          // Create nodes in random order
          const values = [1, 2, 3, 4, 5];
          const shuffled = values.sort(() => Math.random() - 0.5);
          
          for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'element node';
            element.textContent = shuffled[i];
            element.dataset.value = shuffled[i];
            
            elementContainer.appendChild(element);
          }
          
          workspace.appendChild(elementContainer);
        }

        function checkLinkedListLevel() {
          const dropzones = document.querySelectorAll('.linked-list-workspace .dropzone');
          
          // Check if all dropzones are filled
          if (Array.from(dropzones).some(dz => !dz.classList.contains('occupied'))) {
            return false;
          }
          
          // Check if nodes are in correct order (1->2->3->4->5)
          for (let i = 0; i < dropzones.length; i++) {
            const value = parseInt(dropzones[i].dataset.value);
            if (value !== i + 1) {
              return false;
            }
          }
          
          return true;
        }

        // Stack Level
        function setupStackLevel() {
          // Create stack visualization
          const stackContainer = document.createElement('div');
          stackContainer.className = 'stack-container';
          
          // Create stack dropzones
          for (let i = 0; i < 5; i++) {
            const dropzone = document.createElement('div');
            dropzone.className = 'stack-dropzone dropzone';
            dropzone.dataset.position = i;
            stackContainer.appendChild(dropzone);
          }
          
          workspace.appendChild(stackContainer);
          
          // Create draggable elements
          const elementContainer = document.createElement('div');
          elementContainer.className = 'element-container';
          
          // Create stack elements in random order
          const values = [1, 2, 3, 4, 5];
          const shuffled = values.sort(() => Math.random() - 0.5);
          
          for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'element stack-element';
            element.textContent = shuffled[i];
            element.dataset.value = shuffled[i];
            
            elementContainer.appendChild(element);
          }
          
          workspace.appendChild(elementContainer);
        }

        function checkStackLevel() {
          const dropzones = document.querySelectorAll('.stack-dropzone');
          
          // Check if all dropzones are filled
          if (Array.from(dropzones).some(dz => !dz.classList.contains('occupied'))) {
            return false;
          }
          
          // Check if elements are in correct order (5 at bottom, 1 at top)
          for (let i = 0; i < dropzones.length; i++) {
            const value = parseInt(dropzones[i].dataset.value);
            if (value !== 5 - i) {
              return false;
            }
          }
          
          return true;
        }

        // Binary Tree Level
        function setupTreeLevel() {
          // Create tree visualization
          const treeContainer = document.createElement('div');
          treeContainer.className = 'tree-container';
          
          // Create tree levels
          // Level 1 (root)
          const level1 = document.createElement('div');
          level1.className = 'tree-level';
          
          const rootNodeContainer = document.createElement('div');
          rootNodeContainer.className = 'tree-node-container';
          
          const rootDropzone = document.createElement('div');
          rootDropzone.className = 'tree-dropzone dropzone';
          rootDropzone.dataset.position = 'root';
          
          rootNodeContainer.appendChild(rootDropzone);
          level1.appendChild(rootNodeContainer);
          
          // Level 2 (children of root)
          const level2 = document.createElement('div');
          level2.className = 'tree-level';
          
          const leftNodeContainer = document.createElement('div');
          leftNodeContainer.className = 'tree-node-container';
          
          const leftDropzone = document.createElement('div');
          leftDropzone.className = 'tree-dropzone dropzone';
          leftDropzone.dataset.position = 'left';
          
          leftNodeContainer.appendChild(leftDropzone);
          
          const rightNodeContainer = document.createElement('div');
          rightNodeContainer.className = 'tree-node-container';
          
          const rightDropzone = document.createElement('div');
          rightDropzone.className = 'tree-dropzone dropzone';
          rightDropzone.dataset.position = 'right';
          
          rightNodeContainer.appendChild(rightDropzone);
          
          level2.appendChild(leftNodeContainer);
          level2.appendChild(rightNodeContainer);
          
          // Level 3 (grandchildren)
          const level3 = document.createElement('div');
          level3.className = 'tree-level';
          
          const leftLeftNodeContainer = document.createElement('div');
          leftLeftNodeContainer.className = 'tree-node-container';
          
          const leftLeftDropzone = document.createElement('div');
          leftLeftDropzone.className = 'tree-dropzone dropzone';
          leftLeftDropzone.dataset.position = 'leftLeft';
          
          leftLeftNodeContainer.appendChild(leftLeftDropzone);
          
          const leftRightNodeContainer = document.createElement('div');
          leftRightNodeContainer.className = 'tree-node-container';
          
          const leftRightDropzone = document.createElement('div');
          leftRightDropzone.className = 'tree-dropzone dropzone';
          leftRightNodeContainer.appendChild(leftRightDropzone);
          
          const rightLeftNodeContainer = document.createElement('div');
          rightLeftNodeContainer.className = 'tree-node-container';
          
          const rightLeftDropzone = document.createElement('div');
          rightLeftDropzone.className = 'tree-dropzone dropzone';
          rightLeftNodeContainer.appendChild(rightLeftDropzone);
          
          const rightRightNodeContainer = document.createElement('div');
          rightRightNodeContainer.className = 'tree-node-container';
          
          const rightRightDropzone = document.createElement('div');
          rightRightDropzone.className = 'tree-dropzone dropzone';
          rightRightNodeContainer.appendChild(rightRightDropzone);
          
          level3.appendChild(leftLeftNodeContainer);
          level3.appendChild(leftRightNodeContainer);
          level3.appendChild(rightLeftNodeContainer);
          level3.appendChild(rightRightNodeContainer);
          
          // Add edges
          const rootToLeftEdge = document.createElement('div');
          rootToLeftEdge.className = 'tree-edge';
          rootToLeftEdge.style.height = '40px';
          rootToLeftEdge.style.width = '3px';
          rootToLeftEdge.style.top = '60px';
          rootToLeftEdge.style.left = '50%';
          rootToLeftEdge.style.transform = 'rotate(-45deg)';
          
          const rootToRightEdge = document.createElement('div');
          rootToRightEdge.className = 'tree-edge';
          rootToRightEdge.style.height = '40px';
          rootToRightEdge.style.width = '3px';
          rootToRightEdge.style.top = '60px';
          rootToRightEdge.style.left = '50%';
          rootToRightEdge.style.transform = 'rotate(45deg)';
          
          rootNodeContainer.appendChild(rootToLeftEdge);
          rootNodeContainer.appendChild(rootToRightEdge);
          
          // Add edges from level 2 to level 3
          const leftToLeftLeftEdge = document.createElement('div');
          leftToLeftLeftEdge.className = 'tree-edge';
          leftToLeftLeftEdge.style.height = '40px';
          leftToLeftLeftEdge.style.width = '3px';
          leftToLeftLeftEdge.style.top = '60px';
          leftToLeftLeftEdge.style.left = '50%';
          leftToLeftLeftEdge.style.transform = 'rotate(-45deg)';
          
          const leftToLeftRightEdge = document.createElement('div');
          leftToLeftRightEdge.className = 'tree-edge';
          leftToLeftRightEdge.style.height = '40px';
          leftToLeftRightEdge.style.width = '3px';
          leftToLeftRightEdge.style.top = '60px';
          leftToLeftRightEdge.style.left = '50%';
          leftToLeftRightEdge.style.transform = 'rotate(45deg)';
          
          leftNodeContainer.appendChild(leftToLeftLeftEdge);
          leftNodeContainer.appendChild(leftToLeftRightEdge);
          
          const rightToRightLeftEdge = document.createElement('div');
          rightToRightLeftEdge.className = 'tree-edge';
          rightToRightLeftEdge.style.height = '40px';
          rightToRightLeftEdge.style.width = '3px';
          rightToRightLeftEdge.style.top = '60px';
          rightToRightLeftEdge.style.left = '50%';
          rightToRightLeftEdge.style.transform = 'rotate(-45deg)';
          
          const rightToRightRightEdge = document.createElement('div');
          rightToRightRightEdge.className = 'tree-edge';
          rightToRightRightEdge.style.height = '40px';
          rightToRightRightEdge.style.width = '3px';
          rightToRightRightEdge.style.top = '60px';
          rightToRightRightEdge.style.left = '50%';
          rightToRightRightEdge.style.transform = 'rotate(45deg)';
          
          rightNodeContainer.appendChild(rightToRightLeftEdge);
          rightNodeContainer.appendChild(rightToRightRightEdge);
          
          // Add levels to tree container
          treeContainer.appendChild(level1);
          treeContainer.appendChild(level2);
          treeContainer.appendChild(level3);
          
          workspace.appendChild(treeContainer);
          
          // Create draggable elements
          const elementContainer = document.createElement('div');
          elementContainer.className = 'element-container';
          
          // Create tree nodes
          const values = [1, 2, 3, 4, 5, 6, 7];
          const shuffled = values.sort(() => Math.random() - 0.5);
          
          for (let i = 0; i < 7; i++) {
            const element = document.createElement('div');
            element.className = 'element tree-node';
            element.textContent = shuffled[i];
            element.dataset.value = shuffled[i];
            
            elementContainer.appendChild(element);
          }
          
          workspace.appendChild(elementContainer);
        }

        function checkTreeLevel() {
          const dropzones = document.querySelectorAll('.tree-dropzone');
          
          // Check if root is 4
          const rootDropzone = document.querySelector('[data-position="root"]');
          if (!rootDropzone.classList.contains('occupied') || parseInt(rootDropzone.dataset.value) !== 4) {
            return false;
          }
          
          // Check left subtree (all values < 4)
          const leftDropzone = document.querySelector('[data-position="left"]');
          const leftLeftDropzone = document.querySelector('[data-position="leftLeft"]');
          const leftRightDropzone = document.querySelector('[data-position="leftRight"]');
          
          if (leftDropzone.classList.contains('occupied')) {
            const leftValue = parseInt(leftDropzone.dataset.value);
            if (leftValue >= 4) return false;
            
            // Check left's children
            if (leftLeftDropzone.classList.contains('occupied')) {
              const leftLeftValue = parseInt(leftLeftDropzone.dataset.value);
              if (leftLeftValue >= leftValue) return false;
            }
            
            if (leftRightDropzone.classList.contains('occupied')) {
              const leftRightValue = parseInt(leftRightDropzone.dataset.value);
              if (leftRightValue <= leftValue || leftRightValue >= 4) return false;
            }
          }
          
          // Check right subtree (all values > 4)
          const rightDropzone = document.querySelector('[data-position="right"]');
          const rightLeftDropzone = document.querySelector('[data-position="rightLeft"]');
          const rightRightDropzone = document.querySelector('[data-position="rightRight"]');
          
          if (rightDropzone.classList.contains('occupied')) {
            const rightValue = parseInt(rightDropzone.dataset.value);
            if (rightValue <= 4) return false;
            
            // Check right's children
            if (rightLeftDropzone.classList.contains('occupied')) {
              const rightLeftValue = parseInt(rightLeftDropzone.dataset.value);
              if (rightLeftValue <= 4 || rightLeftValue >= rightValue) return false;
            }
            
            if (rightRightDropzone.classList.contains('occupied')) {
              const rightRightValue = parseInt(rightRightDropzone.dataset.value);
              if (rightRightValue <= rightValue) return false;
            }
          }
          
          // At least root and one level of children should be filled
          return leftDropzone.classList.contains('occupied') || rightDropzone.classList.contains('occupied');
        }

        // Initialize the game
        initGame();

        // Communication with React Native
        window.addEventListener('message', function(event) {
          const message = JSON.parse(event.data);
          
          if (message.type === 'CHANGE_LEVEL') {
            loadLevel(message.level);
          } else if (message.type === 'TOGGLE_TUTORIAL') {
            gameState.tutorial = message.show;
            loadLevel(gameState.currentLevel); // Reload level to update instructions
          }
        });
      </script>
    </body>
    </html>
  `;

  // Handle messages from WebView
  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "LEVEL_CHANGE") {
        setCurrentLevel(message.level);
      }
    } catch (error) {
      console.error("Error parsing message from WebView:", error);
    }
  };

  // Send message to WebView
  const changeLevel = (level) => {
    webViewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'CHANGE_LEVEL',
        level: ${level}
      }), '*');
      true;
    `);
  };

  const toggleTutorial = () => {
    setShowInstructions(!showInstructions);
    webViewRef.current?.injectJavaScript(`
      window.postMessage(JSON.stringify({
        type: 'TOGGLE_TUTORIAL',
        show: ${!showInstructions}
      }), '*');
      true;
    `);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Structure Learning</Text>
        <Text style={styles.levelText}>Level {currentLevel}/4</Text>
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          style={styles.webView}
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.levelButtons}>
          {[1, 2, 3, 4].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                currentLevel === level && styles.activeLevelButton
              ]}
              onPress={() => changeLevel(level)}
            >
              <Text style={styles.levelButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.helpButton} onPress={toggleTutorial}>
          <Text style={styles.helpButtonText}>
            {showInstructions ? "Hide Help" : "Show Help"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2c3e50"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  levelText: {
    fontSize: 16,
    color: "#3498db",
    fontWeight: "bold"
  },
  webViewContainer: {
    flex: 1,
    overflow: "hidden"
  },
  webView: {
    backgroundColor: "transparent"
  },
  controls: {
    padding: 15,
    backgroundColor: "#2c3e50",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  levelButtons: {
    flexDirection: "row"
  },
  levelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#34495e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  activeLevelButton: {
    backgroundColor: "#3498db"
  },
  levelButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  helpButton: {
    backgroundColor: "#34495e",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5
  },
  helpButtonText: {
    color: "white",
    fontWeight: "bold"
  }
});
