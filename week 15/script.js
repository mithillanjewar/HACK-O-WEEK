// Initial Contact Data
let contacts = [
    { name: "Alice Johnson", phone: "+1 555-0100", email: "alice@example.com" },
    { name: "Bob Smith", phone: "+1 555-0101", email: "bob@techcorp.com" },
    { name: "Charlie Brown", phone: "+1 555-0102", email: "charlie@peanuts.com" },
    { name: "Diana Prince", phone: "+1 555-0103", email: "diana@themyscira.io" },
    { name: "Ethan Hunt", phone: "+1 555-0104", email: "ethan@imf.gov" },
    { name: "Fiona Gallagher", phone: "+1 555-0105", email: "fiona@shameless.com" },
    { name: "George Miller", phone: "+1 555-0106", email: "george@madmax.com" },
    { name: "Hannah Abbott", phone: "+1 555-0107", email: "hannah@hogwarts.edu" },
    { name: "Ian Malcolm", phone: "+1 555-0108", email: "ian@jurassic.com" },
    { name: "Julia Roberts", phone: "+1 555-0109", email: "julia@hollywood.com" },
    { name: "Kevin Hart", phone: "+1 555-0110", email: "kevin@comedy.com" },
    { name: "Liam Neeson", phone: "+1 555-0111", email: "liam@taken.net" },
    { name: "Mia Wallace", phone: "+1 555-0112", email: "mia@pulpfiction.com" },
    { name: "Noah Centineo", phone: "+1 555-0113", email: "noah@netflix.com" },
    { name: "Olivia Pope", phone: "+1 555-0114", email: "olivia@scandal.com" }
];

// DOM Elements
const contactsGrid = document.getElementById('contactsGrid');
const searchInput = document.getElementById('searchInput');
const statusBar = document.getElementById('statusBar');
const addBtn = document.getElementById('addBtn');
const addModal = document.getElementById('addModal');
const closeModalBtn = document.getElementById('closeModal');
const saveContactBtn = document.getElementById('saveContactBtn');
const newNameInput = document.getElementById('newName');
const newPhoneInput = document.getElementById('newPhone');
const newEmailInput = document.getElementById('newEmail');

// Sort contacts alphabetically
function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

// Generate initials for avatar
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Render contacts to the grid
function renderContacts(contactList) {
    contactsGrid.innerHTML = '';
    
    if (contactList.length === 0) {
        contactsGrid.innerHTML = `<div style="text-align:center; grid-column: 1/-1; color: var(--text-secondary); padding: 2rem;">No contacts found matching your criteria.</div>`;
        return;
    }

    contactList.forEach((contact, index) => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="contact-header">
                <div class="avatar">${getInitials(contact.name)}</div>
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <p>Contact</p>
                </div>
            </div>
            <div class="contact-details">
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>${contact.phone}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>${contact.email}</span>
                </div>
            </div>
        `;
        contactsGrid.appendChild(card);
    });
}

// Binary Search Implementation (Prefix Match)
function binarySearch(query) {
    const target = query.toLowerCase();
    let lower = 0;
    let upper = contacts.length - 1;
    let resultIndex = -1;

    // First find any match that starts with the target
    while (lower <= upper) {
        let mid = Math.floor((lower + upper) / 2);
        let currentName = contacts[mid].name.toLowerCase();

        if (currentName.startsWith(target)) {
            resultIndex = mid;
            // To find all matches, we search towards the left to find the first occurrence
            upper = mid - 1;
        } else if (currentName < target) {
            lower = mid + 1;
        } else {
            upper = mid - 1;
        }
    }

    if (resultIndex === -1) return [];

    // Collect all consecutive matches starting from resultIndex
    let results = [];
    for (let i = resultIndex; i < contacts.length; i++) {
        if (contacts[i].name.toLowerCase().startsWith(target)) {
            results.push(contacts[i]);
        } else {
            break;
        }
    }
    
    return results;
}

// Handle Search Input
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query === '') {
        renderContacts(contacts);
        statusBar.textContent = `Showing all ${contacts.length} contacts.`;
        return;
    }

    const t0 = performance.now();
    const results = binarySearch(query);
    const t1 = performance.now();
    
    renderContacts(results);
    statusBar.textContent = `Found ${results.length} result(s) in ${(t1 - t0).toFixed(2)}ms using Binary Search.`;
});

// Modal Logic
addBtn.addEventListener('click', () => {
    addModal.classList.add('active');
    newNameInput.focus();
});

function closeModal() {
    addModal.classList.remove('active');
    newNameInput.value = '';
    newPhoneInput.value = '';
    newEmailInput.value = '';
}

closeModalBtn.addEventListener('click', closeModal);

addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeModal();
});

// Save New Contact
saveContactBtn.addEventListener('click', () => {
    const name = newNameInput.value.trim();
    const phone = newPhoneInput.value.trim();
    const email = newEmailInput.value.trim();

    if (!name) {
        alert("Name is required!");
        return;
    }

    contacts.push({ name, phone, email });
    sortContacts(); // Resort after adding
    renderContacts(contacts);
    
    // Reset search
    searchInput.value = '';
    statusBar.textContent = `Contact added successfully. Total contacts: ${contacts.length}`;
    
    closeModal();
});

// Initial Setup
function init() {
    sortContacts(); // Ensure contacts are sorted before anything else
    renderContacts(contacts);
    statusBar.textContent = `Contacts loaded and sorted. O(log n) search ready. Total contacts: ${contacts.length}`;
}

// Run 
init();
