function getNoteTemplate(indexNote, note) {
  return `
        <div draggable="true" ondragstart="startDragging(${note.id}, 'notes')" class="note">
            <h3>${escapeHtml(note.title)}</h3>
            <p class="note_content">${escapeHtml(note.content)}</p>
            <div class="note_timestamps">
                <small>Erstellt: ${formatDate(note.created)}</small>
                ${
                  note.modified !== note.created
                    ? `<small>Geändert: ${formatDate(note.modified)}</small>`
                    : ""
                }
            </div>
            <div>
                <button onclick="editNote(${note.id}, 'notes')" class="btn bg_blue">
                    <img src="./assets/icons/edit.svg" alt="edit">
                </button>
                <button onclick="moveNote(${note.id}, 'notes', 'archivedNotes')" class="btn bg_green">
                    <img src="./assets/icons/archive.svg" alt="archive">
                </button>
                <button onclick="moveNote(${note.id}, 'notes', 'trashNotes')" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}

function getArchivedNoteTemplate(indexArchivedNote, note) {
  return `
        <div draggable="true" ondragstart="startDragging(${note.id}, 'archivedNotes')" class="note">
            <h3>${escapeHtml(note.title)}</h3>
            <p class="note_content">${escapeHtml(note.content)}</p>
            <div class="note_timestamps">
                <small>Erstellt: ${formatDate(note.created)}</small>
                ${
                  note.modified !== note.created
                    ? `<small>Geändert: ${formatDate(note.modified)}</small>`
                    : ""
                }
            </div>
            <div>
                <button onclick="editNote(${note.id}, 'archivedNotes')" class="btn bg_blue">
                    <img src="./assets/icons/edit.svg" alt="edit">
                </button>
                <button onclick="moveNote(${note.id}, 'archivedNotes', 'notes')" class="btn bg_yellow">
                    <img src="./assets/icons/note.svg" alt="note">
                </button>
                <button onclick="moveNote(${note.id}, 'archivedNotes', 'trashNotes')" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}

function getTrashNoteTemplate(indexTrashNote, note) {
  return `
        <div draggable="true" ondragstart="startDragging(${note.id}, 'trashNotes')" class="note">
            <h3>${escapeHtml(note.title)}</h3>
            <p class="note_content">${escapeHtml(note.content)}</p>
            <div class="note_timestamps">
                <small>Erstellt: ${formatDate(note.created)}</small>
                ${
                  note.modified !== note.created
                    ? `<small>Geändert: ${formatDate(note.modified)}</small>`
                    : ""
                }
            </div>
            <div>
                <button onclick="moveNote(${note.id}, 'trashNotes', 'notes')" class="btn bg_yellow">
                    <img src="./assets/icons/note.svg" alt="note">
                </button>
                <button onclick="deleteNote(${note.id})" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}
