const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');

// Load notes from localStorage or initialize empty array
let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

function saveAndRender() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
    renderNotes(searchInput.value);
}

function renderNotes(filter = '') {
    notesList.innerHTML = '';
    
    // Filter notes based on search query
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(filter.toLowerCase())
    );

    // Update count message
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    if (filteredNotes.length === 0 && notes.length > 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.textContent = "No notes match your search.";
        emptyMsg.style.color = "#777";
        notesList.appendChild(emptyMsg);
        return;
    }

    filteredNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category.toLowerCase()}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'note-content';

        const textP = document.createElement('p');
        textP.textContent = note.text; // Safe from XSS

        const metaDiv = document.createElement('div');
        metaDiv.className = 'note-meta';

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'category-badge';
        badgeSpan.textContent = note.category;

        const dateSpan = document.createElement('span');
        dateSpan.textContent = ` • ${note.createdAt}`;

        metaDiv.appendChild(badgeSpan);
        metaDiv.appendChild(dateSpan);

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#e74c3c';
        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveAndRender();
}

// Handle Form Submission & Validation
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textValue = noteInput.value.trim();

    // Validation checks
    if (textValue === '') {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (textValue.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear error message if validation passes
    errorMessage.textContent = '';

    const newNote = {
        id: Date.now().toString(),
        text: textValue,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.unshift(newNote); // Add to beginning of array
    noteInput.value = '';
    saveAndRender();
});

// Live Search Listener
searchInput.addEventListener('input', (e) => {
    renderNotes(e.target.value);
});

// Initial render on page load
renderNotes();