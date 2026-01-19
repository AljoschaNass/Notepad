let allNotes = {
  notes: [],
  archivedNotes: [],
  trashNotes: [],
};

let currentDraggedElement;
let currentDraggedElementId;
let editingNoteId = null;
let editingCategory = null;
let searchTerm = "";

let inputTitle = document.getElementById("note_title_input");
inputTitle.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btn_add_note").click();
  }
});

let inputNote = document.getElementById("note_input");
inputNote.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("btn_add_note").click();
  }
});

function init() {
  getFromLocalStorage();
  renderAllNotes();
}

function saveToLocalStorage() {
  localStorage.setItem("allNotes", JSON.stringify(allNotes));
}

function getFromLocalStorage() {
  let myAllNotes = JSON.parse(localStorage.getItem("allNotes"));
  if (myAllNotes != null) {
    allNotes = migrateOldFormat(myAllNotes);
  }
}

function migrateOldFormat(data) {
  if (data.notesTitles && Array.isArray(data.notesTitles)) {
    let migratedData = {
      notes: [],
      archivedNotes: [],
      trashNotes: [],
    };

    for (let i = 0; i < data.notes.length; i++) {
      migratedData.notes.push({
        id: Date.now() + i,
        title: data.notesTitles[i],
        content: data.notes[i],
        created: Date.now(),
        modified: Date.now(),
      });
    }

    if (data.archivedNotes) {
      for (let i = 0; i < data.archivedNotes.length; i++) {
        migratedData.archivedNotes.push({
          id: Date.now() + 1000 + i,
          title: data.archivedNotesTitles[i],
          content: data.archivedNotes[i],
          created: Date.now(),
          modified: Date.now(),
        });
      }
    }

    if (data.trashNotes) {
      for (let i = 0; i < data.trashNotes.length; i++) {
        migratedData.trashNotes.push({
          id: Date.now() + 2000 + i,
          title: data.trashNotesTitles[i],
          content: data.trashNotes[i],
          created: Date.now(),
          modified: Date.now(),
        });
      }
    }

    saveToLocalStorage();
    return migratedData;
  }

  return data;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function renderAllNotes() {
  renderNotes();
  renderArchivedNotes();
  renderTrashNotes();
}

function renderNotes() {
  let contentRef = document.getElementById("notes_content");
  contentRef.innerHTML = "";

  let filteredNotes = allNotes.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    contentRef.innerHTML = '<p class="empty_state">Keine Notizen vorhanden</p>';
  } else {
    for (let indexNote = 0; indexNote < allNotes.notes.length; indexNote++) {
      let note = allNotes.notes[indexNote];
      if (
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        contentRef.innerHTML += getNoteTemplate(indexNote, note);
      }
    }
  }
}

function renderArchivedNotes() {
  let archivedContentRef = document.getElementById("archived_content");
  archivedContentRef.innerHTML = "";

  let filteredNotes = allNotes.archivedNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    archivedContentRef.innerHTML = '<p class="empty_state">Archiv ist leer</p>';
  } else {
    for (
      let indexArchivedNote = 0;
      indexArchivedNote < allNotes.archivedNotes.length;
      indexArchivedNote++
    ) {
      let note = allNotes.archivedNotes[indexArchivedNote];
      if (
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        archivedContentRef.innerHTML += getArchivedNoteTemplate(
          indexArchivedNote,
          note
        );
      }
    }
  }
}

function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  trashContentRef.innerHTML = "";

  let filteredNotes = allNotes.trashNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    trashContentRef.innerHTML = '<p class="empty_state">Papierkorb ist leer</p>';
  } else {
    for (
      let indexTrashNote = 0;
      indexTrashNote < allNotes.trashNotes.length;
      indexTrashNote++
    ) {
      let note = allNotes.trashNotes[indexTrashNote];
      if (
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        trashContentRef.innerHTML += getTrashNoteTemplate(indexTrashNote, note);
      }
    }
  }
}

function addNote() {
  let noteInputRef = document.getElementById("note_input");
  let noteInput = noteInputRef.value;

  let noteTitleInputRef = document.getElementById("note_title_input");
  let noteTitleInput = noteTitleInputRef.value;

  if (noteInput != "" && noteTitleInput != "") {
    if (editingNoteId !== null && editingCategory !== null) {
      updateNote();
    } else {
      let newNote = {
        id: Date.now(),
        title: noteTitleInput,
        content: noteInput,
        created: Date.now(),
        modified: Date.now(),
      };

      allNotes.notes.push(newNote);

      noteInputRef.value = "";
      noteTitleInputRef.value = "";
    }
  }
  saveToLocalStorage();
  renderAllNotes();
}

function editNote(noteId, category) {
  editingNoteId = noteId;
  editingCategory = category;

  let note = allNotes[category].find((n) => n.id === noteId);

  let noteInputRef = document.getElementById("note_input");
  let noteTitleInputRef = document.getElementById("note_title_input");

  noteTitleInputRef.value = note.title;
  noteInputRef.value = note.content;

  let btnRef = document.getElementById("btn_add_note");
  btnRef.textContent = "Notiz aktualisieren";

  let cancelBtnRef = document.getElementById("btn_cancel_edit");
  if (!cancelBtnRef) {
    let cancelBtn = document.createElement("button");
    cancelBtn.id = "btn_cancel_edit";
    cancelBtn.textContent = "Abbrechen";
    cancelBtn.onclick = cancelEdit;
    btnRef.parentNode.appendChild(cancelBtn);
  }

  noteTitleInputRef.focus();
}

function updateNote() {
  let noteInputRef = document.getElementById("note_input");
  let noteTitleInputRef = document.getElementById("note_title_input");

  let note = allNotes[editingCategory].find((n) => n.id === editingNoteId);
  note.title = noteTitleInputRef.value;
  note.content = noteInputRef.value;
  note.modified = Date.now();

  cancelEdit();
  saveToLocalStorage();
  renderAllNotes();
}

function cancelEdit() {
  editingNoteId = null;
  editingCategory = null;

  let noteInputRef = document.getElementById("note_input");
  let noteTitleInputRef = document.getElementById("note_title_input");

  noteInputRef.value = "";
  noteTitleInputRef.value = "";

  let btnRef = document.getElementById("btn_add_note");
  btnRef.textContent = "Notiz speichern";

  let cancelBtnRef = document.getElementById("btn_cancel_edit");
  if (cancelBtnRef) {
    cancelBtnRef.remove();
  }
}

function moveNote(noteId, startKey, destinationKey) {
  let noteIndex = allNotes[startKey].findIndex((n) => n.id === noteId);
  let noteRef = allNotes[startKey].splice(noteIndex, 1);
  allNotes[destinationKey].push(noteRef[0]);

  saveToLocalStorage();
  renderAllNotes();
}

function deleteNote(noteId) {
  showDeleteDialog(noteId);
}

function showDeleteDialog(noteId) {
  let dialog = document.getElementById("delete_dialog");
  dialog.classList.add("show");

  let confirmBtn = document.getElementById("dialog_confirm");
  let cancelBtn = document.getElementById("dialog_cancel");

  confirmBtn.onclick = function () {
    confirmDelete(noteId);
  };

  cancelBtn.onclick = function () {
    closeDeleteDialog();
  };

  dialog.onclick = function (event) {
    if (event.target === dialog) {
      closeDeleteDialog();
    }
  };
}

function confirmDelete(noteId) {
  let noteIndex = allNotes.trashNotes.findIndex((n) => n.id === noteId);
  allNotes.trashNotes.splice(noteIndex, 1);

  saveToLocalStorage();
  renderAllNotes();
  closeDeleteDialog();
}

function closeDeleteDialog() {
  let dialog = document.getElementById("delete_dialog");
  dialog.classList.remove("show");
}

function startDragging(noteId, category) {
  currentDraggedElement = category;
  currentDraggedElementId = noteId;
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add("drag-over");
}

function moveTo(category) {
  moveNote(currentDraggedElementId, currentDraggedElement, category);
  removeAllDragOver();
  renderAllNotes();
}

function removeAllDragOver() {
  document.querySelectorAll(".content_grid").forEach((el) => {
    el.classList.remove("drag-over");
  });
}

function filterNotes() {
  let searchInputRef = document.getElementById("search_input");
  searchTerm = searchInputRef.value;
  renderAllNotes();
}
