class SongNode {
    constructor(title, artist) {
        this.title = title;
        this.artist = artist;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    addFront(title, artist) {
        const newNode = new SongNode(title, artist);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.length++;
    }

    addEnd(title, artist) {
        const newNode = new SongNode(title, artist);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    deleteAt(position) {
        if (position < 1 || position > this.length) {
            alert("Invalid position!");
            return false;
        }

        let current = this.head;

        if (position === 1) {
            this.head = current.next;
            if (this.head) {
                this.head.prev = null;
            } else {
                this.tail = null;
            }
        } else if (position === this.length) {
            this.tail = this.tail.prev;
            this.tail.next = null;
        } else {
            for (let i = 1; i < position; i++) {
                current = current.next;
            }
            current.prev.next = current.next;
            current.next.prev = current.prev;
        }
        this.length--;
        return true;
    }

    reverse() {
        if (!this.head || this.length <= 1) return;

        let current = this.head;
        let temp = null;

        // Swap next and prev for all nodes
        while (current !== null) {
            temp = current.prev;
            current.prev = current.next;
            current.next = temp;
            current = current.prev; // Since we swapped, prev is now the original next
        }

        // Swap head and tail
        temp = this.head;
        this.head = this.tail;
        this.tail = temp;
    }

    toArray() {
        const result = [];
        let current = this.head;
        while (current !== null) {
            result.push({ title: current.title, artist: current.artist });
            current = current.next;
        }
        return result;
    }
}

// UI State
const playlist = new DoublyLinkedList();

// Add some default songs so the user is "wowed" immediately
playlist.addEnd("Blinding Lights", "The Weeknd");
playlist.addEnd("Levitating", "Dua Lipa");
playlist.addEnd("As It Was", "Harry Styles");

// Elements
const songNameInput = document.getElementById('songName');
const artistNameInput = document.getElementById('artistName');
const addFrontBtn = document.getElementById('addFrontBtn');
const addEndBtn = document.getElementById('addEndBtn');
const deletePosInput = document.getElementById('deletePos');
const deleteBtn = document.getElementById('deleteBtn');
const reverseBtn = document.getElementById('reverseBtn');
const playlistContainer = document.getElementById('playlistContainer');

function renderPlaylist() {
    playlistContainer.innerHTML = '';

    if (playlist.length === 0) {
        playlistContainer.innerHTML = '<div class="empty-state">Playlist is empty. Add some songs!</div>';
        return;
    }

    let current = playlist.head;
    let index = 1;

    while (current !== null) {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'song-node';
        
        // Label for Head/Tail //
        let labelHtml = '';
        if (current === playlist.head && current === playlist.tail) {
            labelHtml = '<div class="head-tail-label">Head / Tail</div>';
        } else if (current === playlist.head) {
            labelHtml = '<div class="head-tail-label">Head</div>';
        } else if (current === playlist.tail) {
            labelHtml = '<div class="head-tail-label">Tail</div>';
        }

        nodeEl.innerHTML = `
            ${labelHtml}
            <div style="font-size: 0.7rem; color: #00c6ff; margin-bottom: 4px;">#${index}</div>
            <div class="song-title">${current.title}</div>
            <div class="song-artist">${current.artist}</div>
        `;

        playlistContainer.appendChild(nodeEl);

        // Add arrow if not the last item
        if (current.next !== null) {
            const arrowEl = document.createElement('div');
            arrowEl.className = 'link-arrow';
            arrowEl.innerHTML = `<span>⇄</span>`;
            playlistContainer.appendChild(arrowEl);
        }

        current = current.next;
        index++;
    }
}

// Event Listeners
addFrontBtn.addEventListener('click', () => {
    const title = songNameInput.value.trim() || 'Unknown Song';
    const artist = artistNameInput.value.trim() || 'Unknown Artist';
    playlist.addFront(title, artist);
    songNameInput.value = '';
    artistNameInput.value = '';
    renderPlaylist();
});

addEndBtn.addEventListener('click', () => {
    const title = songNameInput.value.trim() || 'Unknown Song';
    const artist = artistNameInput.value.trim() || 'Unknown Artist';
    playlist.addEnd(title, artist);
    songNameInput.value = '';
    artistNameInput.value = '';
    renderPlaylist();
});

deleteBtn.addEventListener('click', () => {
    const pos = parseInt(deletePosInput.value);
    if (!isNaN(pos)) {
        playlist.deleteAt(pos);
        deletePosInput.value = '';
        renderPlaylist();
    } else {
        alert("Please enter a valid position number.");
    }
});

reverseBtn.addEventListener('click', () => {
    playlist.reverse();
    renderPlaylist();
});

// Initial Render
renderPlaylist();
