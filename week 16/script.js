// Task format: { id: string, text: string }
// Action format: 
// { type: 'ADD', task: Task, index: number }
// { type: 'DELETE', task: Task, index: number }
// { type: 'EDIT', id: string, oldText: string, newText: string }

class TaskManager {
    constructor() {
        this.tasks = [];
        this.undoStack = [];
        this.redoStack = [];

        // DOM Elements
        this.form = document.getElementById('task-form');
        this.input = document.getElementById('task-input');
        this.list = document.getElementById('task-list');
        this.undoBtn = document.getElementById('undo-btn');
        this.redoBtn = document.getElementById('redo-btn');

        // Modal Elements
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-form');
        this.editInput = document.getElementById('edit-input');
        this.cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        this.currentEditId = null;

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());

        // Modal events
        this.editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveEdit();
        });

        this.cancelEditBtn.addEventListener('click', () => {
            this.closeEditModal();
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Records an action to the undo stack and clears redo stack
    recordAction(action) {
        this.undoStack.push(action);
        this.redoStack = []; // Clear redo stack on new action
        this.updateButtons();
    }

    handleAddTask() {
        const text = this.input.value.trim();
        if (!text) return;

        const newTask = { id: this.generateId(), text };
        
        // Action execution
        this.tasks.push(newTask);
        
        // Record action
        this.recordAction({ 
            type: 'ADD', 
            task: newTask,
            index: this.tasks.length - 1
        });

        this.input.value = '';
        this.render();
    }

    handleDeleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return;

        const taskToDelete = this.tasks[index];
        
        // Action execution
        this.tasks.splice(index, 1);

        // Record action
        this.recordAction({
            type: 'DELETE',
            task: taskToDelete,
            index: index
        });

        this.render();
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.currentEditId = id;
        this.editInput.value = task.text;
        this.editModal.classList.remove('hidden');
        this.editInput.focus();
    }

    closeEditModal() {
        this.editModal.classList.add('hidden');
        this.currentEditId = null;
    }

    handleSaveEdit() {
        const newText = this.editInput.value.trim();
        if (!newText || !this.currentEditId) return;

        const task = this.tasks.find(t => t.id === this.currentEditId);
        if (!task || task.text === newText) {
            this.closeEditModal();
            return;
        }

        const oldText = task.text;
        
        // Action execution
        task.text = newText;

        // Record action
        this.recordAction({
            type: 'EDIT',
            id: this.currentEditId,
            oldText: oldText,
            newText: newText
        });

        this.closeEditModal();
        this.render();
    }

    undo() {
        if (this.undoStack.length === 0) return;

        const action = this.undoStack.pop();
        
        // Reverse the action
        switch (action.type) {
            case 'ADD':
                // Undoing an ADD means removing it
                this.tasks = this.tasks.filter(t => t.id !== action.task.id);
                break;
            case 'DELETE':
                // Undoing a DELETE means adding it back at the same index
                this.tasks.splice(action.index, 0, action.task);
                break;
            case 'EDIT':
                // Undoing an EDIT means restoring old text
                const taskToUnedit = this.tasks.find(t => t.id === action.id);
                if (taskToUnedit) taskToUnedit.text = action.oldText;
                break;
        }

        // Push to redo stack
        this.redoStack.push(action);
        
        this.updateButtons();
        this.render();
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const action = this.redoStack.pop();
        
        // Re-execute the action
        switch (action.type) {
            case 'ADD':
                // Redoing an ADD means adding it back at its original index or end
                this.tasks.splice(action.index, 0, action.task);
                break;
            case 'DELETE':
                // Redoing a DELETE means removing it again
                this.tasks = this.tasks.filter(t => t.id !== action.task.id);
                break;
            case 'EDIT':
                // Redoing an EDIT means applying new text again
                const taskToEdit = this.tasks.find(t => t.id === action.id);
                if (taskToEdit) taskToEdit.text = action.newText;
                break;
        }

        // Push to undo stack
        this.undoStack.push(action);
        
        this.updateButtons();
        this.render();
    }

    updateButtons() {
        this.undoBtn.disabled = this.undoStack.length === 0;
        this.redoBtn.disabled = this.redoStack.length === 0;
    }

    render() {
        this.list.innerHTML = '';

        if (this.tasks.length === 0) {
            this.list.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
            return;
        }

        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            
            li.innerHTML = `
                <span class="task-text"></span>
                <div class="task-actions">
                    <button class="icon-btn edit" data-id="${task.id}" aria-label="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button class="icon-btn delete" data-id="${task.id}" aria-label="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            `;
            
            // XSS Protection: Use textContent for user input
            li.querySelector('.task-text').textContent = task.text;
            
            // Event Listeners for buttons
            li.querySelector('.edit').addEventListener('click', () => this.openEditModal(task.id));
            li.querySelector('.delete').addEventListener('click', () => this.handleDeleteTask(task.id));
            
            this.list.appendChild(li);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
