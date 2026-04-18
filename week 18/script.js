class TreeNode {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.left = null;
        this.right = null;
        // Properties for visualization positioning
        this.x = 0;
        this.y = 0;
    }
}

class BinaryDirectoryTree {
    constructor() {
        this.root = new TreeNode(this._generateId(), '/'); // Root directory
        this.selectedNode = this.root;
        this.nodeCounter = 1;
        this.nodeMap = { [this.root.id]: this.root };
    }

    _generateId() {
        return 'node_' + Math.random().toString(36).substr(2, 9);
    }

    getNodeById(id) {
        return this.nodeMap[id] || null;
    }

    selectNode(id) {
        const node = this.getNodeById(id);
        if (node) {
            this.selectedNode = node;
            return true;
        }
        return false;
    }

    insertLeft(name) {
        if (!this.selectedNode) return { success: false, error: 'No node selected' };
        if (this.selectedNode.left) return { success: false, error: 'Left subdirectory already exists' };
        
        const newNode = new TreeNode(this._generateId(), name);
        this.selectedNode.left = newNode;
        this.nodeMap[newNode.id] = newNode;
        return { success: true, node: newNode };
    }

    insertRight(name) {
        if (!this.selectedNode) return { success: false, error: 'No node selected' };
        if (this.selectedNode.right) return { success: false, error: 'Right subdirectory already exists' };
        
        const newNode = new TreeNode(this._generateId(), name);
        this.selectedNode.right = newNode;
        this.nodeMap[newNode.id] = newNode;
        return { success: true, node: newNode };
    }

    // Traversal methods that yield nodes (generator pattern for animation)
    *preOrderGenerator(node = this.root) {
        if (!node) return;
        yield node;
        yield* this.preOrderGenerator(node.left);
        yield* this.preOrderGenerator(node.right);
    }

    *inOrderGenerator(node = this.root) {
        if (!node) return;
        yield* this.inOrderGenerator(node.left);
        yield node;
        yield* this.inOrderGenerator(node.right);
    }

    *postOrderGenerator(node = this.root) {
        if (!node) return;
        yield* this.postOrderGenerator(node.left);
        yield* this.postOrderGenerator(node.right);
        yield node;
    }
}

// UI Controller
class UIController {
    constructor() {
        this.tree = new BinaryDirectoryTree();
        this.isTraversing = false;
        
        // DOM Elements
        this.folderNameInput = document.getElementById('folder-name');
        this.selectedNodeDisplay = document.getElementById('selected-node-display');
        this.btnAddLeft = document.getElementById('btn-add-left');
        this.btnAddRight = document.getElementById('btn-add-right');
        this.terminalOutput = document.getElementById('terminal-output');
        this.treeSvg = document.getElementById('tree-svg');
        this.treeNodesContainer = document.getElementById('tree-nodes');
        
        // Config for visualization
        this.levelHeight = 80;
        this.minNodeSpacing = 120;
        
        this.initializeUI();
    }

    initializeUI() {
        this.setupEventListeners();
        this.renderTree();
        this.updateSelectionDisplay();
    }

    setupEventListeners() {
        this.btnAddLeft.addEventListener('click', () => this.handleAddDirectory('left'));
        this.btnAddRight.addEventListener('click', () => this.handleAddDirectory('right'));
        
        document.getElementById('btn-preorder').addEventListener('click', () => {
            this.runTraversal('pre-order', this.tree.preOrderGenerator(this.tree.root));
        });
        
        document.getElementById('btn-inorder').addEventListener('click', () => {
             this.runTraversal('in-order', this.tree.inOrderGenerator(this.tree.root));
        });
        
        document.getElementById('btn-postorder').addEventListener('click', () => {
             this.runTraversal('post-order', this.tree.postOrderGenerator(this.tree.root));
        });

        // Allow 'Enter' key to add to whichever side makes sense or default to left
        this.folderNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (!this.tree.selectedNode.left) {
                    this.handleAddDirectory('left');
                } else if (!this.tree.selectedNode.right) {
                    this.handleAddDirectory('right');
                } else {
                    this.logToTerminal('Current node is full.', 'error');
                }
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (!this.isTraversing) this.renderTree();
        });
    }

    handleAddDirectory(side) {
        if (this.isTraversing) return;

        const name = this.folderNameInput.value.trim();
        if (!name) {
            this.logToTerminal('Error: Directory name cannot be empty.', 'error');
            return;
        }

        let result;
        if (side === 'left') {
            result = this.tree.insertLeft(name);
        } else {
            result = this.tree.insertRight(name);
        }

        if (result.success) {
            this.logToTerminal(`Added subdirectory '${name}' to '${this.tree.selectedNode.name}' (${side}).`, 'output');
            this.folderNameInput.value = '';
            
            // Auto-select the newly created node for rapid filling
            this.tree.selectNode(result.node.id);
            this.updateSelectionDisplay();
            
            this.renderTree();
        } else {
            this.logToTerminal(`Error: ${result.error}`, 'error');
        }
    }

    updateSelectionDisplay() {
        if (this.tree.selectedNode) {
            this.selectedNodeDisplay.textContent = this.tree.selectedNode.name;
        } else {
            this.selectedNodeDisplay.textContent = 'None';
        }

        // Update DOM node visual state
        document.querySelectorAll('.t-node').forEach(el => {
            if (el.dataset.id === this.tree.selectedNode?.id) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    }

    handleNodeClick(id) {
        if (this.isTraversing) return;
        this.tree.selectNode(id);
        this.updateSelectionDisplay();
    }

    logToTerminal(message, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = `<span class="prompt">$</span> ${message}`;
        this.terminalOutput.appendChild(line);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    async runTraversal(traversalName, generator) {
        if (this.isTraversing) {
            this.logToTerminal(`A traversal is already in progress.`, 'error');
            return;
        }
        
        this.isTraversing = true;
        this.logToTerminal(`--- Starting ${traversalName} Traversal ---`, 'output');
        
        const path = [];
        
        for (const node of generator) {
            path.push(node.name);
            
            // Highlight node visually
            const domNode = document.querySelector(`.t-node[data-id="${node.id}"]`);
            if (domNode) {
                // remove existing highlight to restart animation
                domNode.classList.remove('highlighted');
                void domNode.offsetWidth; // trigger reflow
                domNode.classList.add('highlighted');
            }
            
            this.logToTerminal(`Visited: ${node.name}`, 'output');
            
            // Wait for visual effect
            await new Promise(r => setTimeout(r, 600));
        }

        this.logToTerminal(`Result Path: ${path.join(' -> ')}`, 'output');
        this.logToTerminal(`--- Completed ${traversalName} Traversal ---`, 'output');
        this.isTraversing = false;
    }

    // --- Visualization Rendering Logic ---
    
    _calculatePositions(node, depth, minX, maxX) {
        if (!node) return;
        
        // Node's X position is exactly in middle of minX and maxX bounds
        node.x = (minX + maxX) / 2;
        node.y = depth * this.levelHeight + 50; // 50px top margin

        // Subdivide space for children
        this._calculatePositions(node.left, depth + 1, minX, node.x);
        this._calculatePositions(node.right, depth + 1, node.x, maxX);
    }

    renderTree() {
        // Clear current render
        this.treeSvg.innerHTML = '';
        this.treeNodesContainer.innerHTML = '';

        const containerWidth = document.getElementById('tree-container').clientWidth;
        // Provide adequate initial space
        const renderWidth = Math.max(containerWidth, 800); 
        
        this._calculatePositions(this.tree.root, 0, 0, renderWidth);
        this._drawNode(this.tree.root);
        
        // Update selection styles safely after rendering
        this.updateSelectionDisplay();
    }

    _drawNode(node) {
        if (!node) return;

        // Draw children recursively
        if (node.left) {
            this._drawLine(node.x, node.y, node.left.x, node.left.y);
            this._drawNode(node.left);
        }
        if (node.right) {
            this._drawLine(node.x, node.y, node.right.x, node.right.y);
            this._drawNode(node.right);
        }

        // Draw DOM element for node
        const nodeEl = document.createElement('div');
        nodeEl.className = 't-node';
        nodeEl.dataset.id = node.id;
        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;
        
        nodeEl.innerHTML = `
            <i class="ri-folder-fill"></i>
            <span>${node.name}</span>
        `;
        
        if (this.tree.selectedNode && this.tree.selectedNode.id === node.id) {
            nodeEl.classList.add('selected');
        }

        nodeEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleNodeClick(node.id);
        });

        this.treeNodesContainer.appendChild(nodeEl);
    }

    _drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'tree-line');
        this.treeSvg.appendChild(line);
    }
}

// Boot application
document.addEventListener('DOMContentLoaded', () => {
    window.appUI = new UIController();
});
