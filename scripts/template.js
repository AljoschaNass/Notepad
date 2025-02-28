
function getNoteTemplate(indexNote) {
    return `
        <div class="note">
            <h3>${allNotes.notesTitles[indexNote]}</h3>
            <p>${allNotes.notes[indexNote]}</p>
            <div>
                <button onclick="moveNote(${indexNote}, 'notes', 'archivedNotes')" class="btn bg_green">
                    <img src="./assets/icons/archive.svg" alt="archive">
                </button>
                <button onclick="moveNote(${indexNote}, 'notes', 'trashNotes')" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}

function getArchivedNoteTemplate(indexArchivedNote) {
    return  `
        <div class="note">
            <h3>${allNotes.archivedNotesTitles[indexArchivedNote]}</h3>
            <p>${allNotes.archivedNotes[indexArchivedNote]}</p>
            <div>
                <button onclick="moveNote(${indexArchivedNote}, 'archivedNotes', 'notes')" class="btn bg_yellow">
                    <img src="./assets/icons/note.svg" alt="note">
                </button>
                <button onclick="moveNote(${indexArchivedNote}, 'archivedNotes', 'trashNotes')" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}

function getTrashNoteTemplate(indexTrashNote) {
    return  `
        <div class="note">
            <h3>${allNotes.trashNotesTitles[indexTrashNote]}</h3>
            <p>${allNotes.trashNotes[indexTrashNote]}</p>
            <div>
                <button onclick="moveNote(${indexTrashNote}, 'trashNotes', 'notes')" class="btn bg_yellow">
                    <img src="./assets/icons/note.svg" alt="note">
                </button>
                <button onclick="deleteNote(${indexTrashNote})" class="btn bg_red">
                    <img src="./assets/icons/trash.svg" alt="trash">
                </button>
            </div>
        </div>
        `;
}