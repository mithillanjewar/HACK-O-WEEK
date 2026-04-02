class ItemNode {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = parseFloat(price);
        this.next = null;
    }
}

class LinkedListCart {
    constructor() {
        this.head = null;
    }

    insertAtHead(id, name, price) {
        const newNode = new ItemNode(id, name, price);
        newNode.next = this.head;
        this.head = newNode;
    }

    insertAtTail(id, name, price) {
        const newNode = new ItemNode(id, name, price);
        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    removeById(id) {
        if (!this.head) return false;

        id = parseInt(id);

        if (this.head.id === id) {
            this.head = this.head.next;
            return true;
        }

        let current = this.head;
        let prev = null;
        while (current && current.id !== id) {
            prev = current;
            current = current.next;
        }

        if (current) {
            prev.next = current.next;
            return true;
        }
        return false;
    }

    getItems() {
        const items = [];
        let current = this.head;
        while (current) {
            items.push({ id: current.id, name: current.name, price: current.price });
            current = current.next;
        }
        return items;
    }

    getTotal() {
        let total = 0;
        let current = this.head;
        while (current) {
            total += current.price;
            current = current.next;
        }
        return total;
    }
}

// Initialize Linked List Cart
const cart = new LinkedListCart();

// DOM Elements
const listContainer = document.getElementById('listContainer');
const totalValue = document.getElementById('totalValue');

const itemIdInput = document.getElementById('itemId');
const itemNameInput = document.getElementById('itemName');
const itemPriceInput = document.getElementById('itemPrice');

const addHeadBtn = document.getElementById('addHeadBtn');
const addTailBtn = document.getElementById('addTailBtn');

const removeIdInput = document.getElementById('removeId');
const removeBtn = document.getElementById('removeBtn');

// Seed Initial Data
cart.insertAtTail(101, "Laptop", 85000.00);
cart.insertAtTail(102, "Mouse", 1500.00);
renderList();

// Core Render logic
function renderList() {
    listContainer.innerHTML = '';
    
    const items = cart.getItems();
    
    // Fallback if list is empty
    if (items.length === 0) {
        listContainer.innerHTML = '<div style="color: var(--text-muted); font-weight: 500;">Cart is empty</div>';
        totalValue.textContent = '0.00';
        return;
    }

    // Traverse and draw nodes
    items.forEach((item, index) => {
        // Build Node HTML
        const nodeEl = document.createElement('div');
        nodeEl.className = 'node';
        nodeEl.innerHTML = `
            <div class="node-header">
                <span class="node-id">ID: ${item.id}</span>
                <button class="delete-btn" onclick="removeItem(${item.id})" title="Remove Node">×</button>
            </div>
            <div class="node-name">${item.name}</div>
            <div class="node-price">₹${item.price.toFixed(2)}</div>
        `;
        listContainer.appendChild(nodeEl);

        // Build Pointer Visual (->) between items
        if (index < items.length - 1) {
            const pointerEl = document.createElement('div');
            pointerEl.className = 'pointer';
            pointerEl.textContent = '→';
            listContainer.appendChild(pointerEl);
        }
    });

    // Render Total Value
    totalValue.textContent = cart.getTotal().toFixed(2);
}

// Utility to fetch and validate inputs
function getInputs() {
    const id = parseInt(itemIdInput.value);
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    
    if (!id || !name || isNaN(price)) {
        alert("Please fill in all fields with valid data.");
        return null;
    }
    return { id, name, price };
}

function clearInputs() {
    itemIdInput.value = '';
    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemIdInput.focus();
}

// Event Listeners
addHeadBtn.addEventListener('click', () => {
    const data = getInputs();
    if (data) {
        if (cart.getItems().some(i => i.id === data.id)) {
            alert("This Item ID already exists in the cart. Please use a unique ID.");
            return;
        }
        cart.insertAtHead(data.id, data.name, data.price);
        renderList();
        clearInputs();
    }
});

addTailBtn.addEventListener('click', () => {
    const data = getInputs();
    if (data) {
        if (cart.getItems().some(i => i.id === data.id)) {
            alert("This Item ID already exists in the cart. Please use a unique ID.");
            return;
        }
        cart.insertAtTail(data.id, data.name, data.price);
        renderList();
        clearInputs();
    }
});

removeBtn.addEventListener('click', () => {
    const id = parseInt(removeIdInput.value);
    if (!id) {
        alert("Please enter a valid Item ID to remove.");
        return;
    }
    
    const success = cart.removeById(id);
    if (success) {
        renderList();
        removeIdInput.value = '';
    } else {
        alert("Item ID not found in the list.");
    }
});

// Expose removal function globally so inline button onClick works
window.removeItem = function(id) {
    if(cart.removeById(id)) {
        renderList();
    }
};
