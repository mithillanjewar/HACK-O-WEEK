class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.queue = new Array(capacity).fill(null);
    this.front = -1;
    this.rear = -1;
    this.size = 0;
  }

  isFull() {
    return (this.rear + 1) % this.capacity === this.front;
  }

  isEmpty() {
    return this.front === -1;
  }

  enqueue(item) {
    if (this.isFull()) {
      return false; // Cannot enqueue
    }
    
    if (this.front === -1) {
      this.front = 0;
    }
    
    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = item;
    this.size++;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    
    const item = this.queue[this.front];
    this.queue[this.front] = null;
    this.size--;
    
    if (this.front === this.rear) {
      // Queue is now empty after removing the only element
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.capacity;
    }
    
    return item;
  }
}

// App Logic
document.addEventListener('DOMContentLoaded', () => {
  const CAPACITY = 6;
  const atmQueue = new CircularQueue(CAPACITY);
  let customerCounter = 1;

  // DOM Elements
  const queueSlotsContainer = document.getElementById('queue-slots');
  const btnEnqueue = document.getElementById('btn-enqueue');
  const btnDequeue = document.getElementById('btn-dequeue');
  const queueSizeDisp = document.getElementById('queue-size-disp');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const ptrFront = document.getElementById('ptr-front');
  const ptrRear = document.getElementById('ptr-rear');
  const notificationsArea = document.getElementById('notifications');
  const serveModal = document.getElementById('serve-modal');
  const servedCustomerName = document.getElementById('served-customer-name');
  
  // Initialization
  initSlots();
  updateUI();

  // Event Listeners
  btnEnqueue.addEventListener('click', handleEnqueue);
  btnDequeue.addEventListener('click', handleDequeue);
  window.addEventListener('resize', updatePointers);

  function initSlots() {
    queueSlotsContainer.innerHTML = '';
    for (let i = 0; i < CAPACITY; i++) {
      const slot = document.createElement('div');
      slot.className = 'queue-slot';
      slot.id = `slot-${i}`;
      
      const indexLabel = document.createElement('div');
      indexLabel.className = 'slot-index';
      indexLabel.textContent = `[${i}]`;
      
      slot.appendChild(indexLabel);
      queueSlotsContainer.appendChild(slot);
    }
  }

  function handleEnqueue() {
    if (atmQueue.isFull()) {
      showToast('Peak Hours!', 'The ATM Queue is currently full.', 'error');
      return;
    }

    const customer = {
      id: customerCounter++,
      name: `C${customerCounter - 1}`
    };

    atmQueue.enqueue(customer);
    showToast('Customer Arrived', `Customer ${customer.id} joined the queue.`, 'success');
    updateUI();
  }

  function handleDequeue() {
    if (atmQueue.isEmpty()) {
      showToast('Queue Empty', 'No customers to serve right now.', 'warning');
      return;
    }

    const servedCustomer = atmQueue.dequeue();
    
    // Show visual modal for dealing with the customer
    showServeModal(servedCustomer);
    updateUI();
  }

  function updateUI() {
    // 1. Update queue size text
    queueSizeDisp.textContent = `${atmQueue.size} / ${CAPACITY}`;
    
    // 2. Update status indicator (Full/Empty/Ready)
    if (atmQueue.isFull()) {
      statusIndicator.classList.add('full');
      statusText.textContent = 'Queue Full (Peak Hours)';
      btnEnqueue.disabled = true;
    } else {
      statusIndicator.classList.remove('full');
      statusText.textContent = atmQueue.isEmpty() ? 'No Customers (Queue Empty)' : 'Operating Normally';
      btnEnqueue.disabled = false;
    }
    
    btnDequeue.disabled = atmQueue.isEmpty();

    // 3. Render Slots
    const slots = document.querySelectorAll('.queue-slot');
    for (let i = 0; i < CAPACITY; i++) {
      const slot = slots[i];
      const customer = atmQueue.queue[i];
      
      // Clean previous content except index
      Array.from(slot.children).forEach(child => {
        if (!child.classList.contains('slot-index')) {
          slot.removeChild(child);
        }
      });

      if (customer) {
        slot.classList.add('filled');
        
        const avatar = document.createElement('div');
        avatar.className = 'customer-avatar';
        avatar.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
        
        const nametag = document.createElement('div');
        nametag.className = 'customer-id';
        nametag.textContent = customer.name;
        
        slot.appendChild(avatar);
        slot.appendChild(nametag);
      } else {
        slot.classList.remove('filled');
      }
    }

    // 4. Update Position of Front and Rear Pointers
    // Use requestAnimationFrame to ensure DOM is updated out before layout calculation
    requestAnimationFrame(updatePointers);
  }

  function updatePointers() {
    if (atmQueue.isEmpty()) {
      ptrFront.classList.add('hidden');
      ptrRear.classList.add('hidden');
      return;
    }

    ptrFront.classList.remove('hidden');
    ptrRear.classList.remove('hidden');

    const slots = document.querySelectorAll('.queue-slot');
    const frontSlot = slots[atmQueue.front];
    const rearSlot = slots[atmQueue.rear];
    const containerRect = document.getElementById('pointers-layer').getBoundingClientRect();

    if (frontSlot && rearSlot) {
      const frontRect = frontSlot.getBoundingClientRect();
      const rearRect = rearSlot.getBoundingClientRect();

      // Set explicit pixel coordinates
      ptrFront.style.left = `${frontRect.left - containerRect.left + frontRect.width / 2}px`;
      ptrFront.style.transform = 'translateX(-50%)';

      ptrRear.style.left = `${rearRect.left - containerRect.left + rearRect.width / 2}px`;
      ptrRear.style.transform = 'translateX(-50%)';
    }
  }

  function showToast(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'error') { // Full queue
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    } else if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    notificationsArea.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove toast logic
    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });
    }, 3000);
  }

  function showServeModal(customer) {
    servedCustomerName.textContent = `Customer ${customer.id} (${customer.name}) has been served!`;
    serveModal.classList.remove('hidden');

    setTimeout(() => {
      serveModal.classList.add('hidden');
    }, 1500);
  }
});
