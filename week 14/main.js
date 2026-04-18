import './style.css'

class PrintQueueSimulator {
  constructor() {
    this.queue = [];
    this.completed = [];
    this.jobCounter = 1;
    this.isPrinting = false;
    
    // DOM Elements
    this.enqueueBtn = document.getElementById('enqueue-btn');
    
    this.printerStatus = document.getElementById('printer-status');
    this.statusText = this.printerStatus.querySelector('.status-text');
    this.printerLoader = document.getElementById('printer-loader');
    
    this.currentJobPanel = document.getElementById('current-job');
    this.currJobName = document.getElementById('current-job-name');
    this.currJobId = document.getElementById('current-job-id');
    this.progressBar = document.getElementById('printer-progress');
    
    this.queueCount = document.getElementById('queue-count');
    this.queueList = document.getElementById('queue-list');
    this.emptyQueueMsg = document.getElementById('empty-queue-msg');
    
    this.completedCount = document.getElementById('completed-count');
    this.completedList = document.getElementById('completed-list');
    this.emptyCompletedMsg = document.getElementById('empty-completed-msg');

    this.bindEvents();
    
    // Start interval checking for jobs
    setInterval(() => this.processNextJob(), 1000);
  }

  bindEvents() {
    this.enqueueBtn.addEventListener('click', () => this.enqueueJob());
  }

  generateDocumentName() {
    const prefixes = ['Annual_Report', 'Invoice', 'Meeting_Notes', 'Project_Proposal', 'Design_Assets', 'Budget_Q3'];
    const extensions = ['.pdf', '.docx', '.xlsx', '.png', '.pptx'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const ext = extensions[Math.floor(Math.random() * extensions.length)];
    return `${prefix}_${Math.floor(Math.random() * 1000)}${ext}`;
  }

  enqueueJob() {
    const job = {
      id: `JOB-${String(this.jobCounter).padStart(4, '0')}`,
      name: this.generateDocumentName(),
      timestamp: new Date().toLocaleTimeString(),
    };
    
    this.jobCounter++;
    this.queue.push(job); // FIFO Enqueue
    this.renderQueue();
  }

  async processNextJob() {
    if (this.isPrinting || this.queue.length === 0) return;

    this.isPrinting = true;
    
    // Grab DOM element to animate removal
    const firstJobId = this.queue[0].id;
    const firstJobEl = document.getElementById(firstJobId);
    
    // Provide a small animation window for removal from queue if element exists
    if (firstJobEl) {
        firstJobEl.classList.add('removing');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Dequeue (FIFO)
    const job = this.queue.shift();
    this.renderQueue();
    
    // Update Printer State
    this.setPrinterState('Processing', job);
    
    // Simulate printing process with progress bar
    await this.simulatePrinting();
    
    // Set Job as completed
    this.completed.unshift(job); // Add to top of completed list (Newest first)
    this.renderCompleted();
    
    this.setPrinterState('Idle', null);
    
    // Small delay before taking next job
    setTimeout(() => {
        this.isPrinting = false;
    }, 500);
  }

  setPrinterState(state, job) {
    if (state === 'Processing') {
      this.printerStatus.className = 'status-indicator processing';
      this.statusText.textContent = 'Processing';
      this.printerLoader.classList.remove('hidden');
      
      this.currentJobPanel.classList.remove('hidden');
      this.currJobName.textContent = job.name;
      this.currJobId.textContent = job.id;
      this.progressBar.style.width = '0%';
    } else {
      this.printerStatus.className = 'status-indicator idle';
      this.statusText.textContent = 'Idle';
      this.printerLoader.classList.add('hidden');
      this.currentJobPanel.classList.add('hidden');
    }
  }

  simulatePrinting() {
    return new Promise(resolve => {
      let progress = 0;
      const duration = 1500 + Math.random() * 2000; // 1.5s to 3.5s
      const tick = 50;
      const step = (100 * tick) / duration;
      
      const interval = setInterval(() => {
        progress += step;
        this.progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(resolve, 300); // Short pause at 100%
        }
      }, tick);
    });
  }

  createJobCardHTML(job, isCompleted = false) {
    return `
      <div class="job-card ${isCompleted ? 'completed' : ''}" id="${job.id}">
        <div class="job-name" title="${job.name}">${job.name}</div>
        <div class="job-meta">
          <span>${job.id}</span>
          <span>${job.timestamp}</span>
        </div>
      </div>
    `;
  }

  renderQueue() {
    this.queueCount.textContent = this.queue.length;
    if (this.queue.length === 0) {
      this.emptyQueueMsg.classList.remove('hidden');
      this.queueList.innerHTML = '';
      this.queueList.appendChild(this.emptyQueueMsg);
    } else {
      this.emptyQueueMsg.classList.add('hidden');
      this.queueList.innerHTML = this.queue.map(job => this.createJobCardHTML(job, false)).join('');
    }
  }

  renderCompleted() {
    this.completedCount.textContent = this.completed.length;
    if (this.completed.length === 0) {
      this.emptyCompletedMsg.classList.remove('hidden');
      this.completedList.innerHTML = '';
      this.completedList.appendChild(this.emptyCompletedMsg);
    } else {
      this.emptyCompletedMsg.classList.add('hidden');
      this.completedList.innerHTML = this.completed.map(job => this.createJobCardHTML(job, true)).join('');
    }
  }
}

// Initialize when DOM is mostly ready
document.addEventListener('DOMContentLoaded', () => {
  new PrintQueueSimulator();
});
