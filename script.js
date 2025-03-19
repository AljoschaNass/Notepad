let allNotes = {
  notesTitles: [],
  notes: [],
  archivedNotesTitles: [],
  archivedNotes: [],
  trashNotesTitles: [],
  trashNotes: [],
};

let currentDraggedElement;
let currentDraggedElementId;

let inputTitle = document.getElementById("note_title_input");
inputTitle.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btn_add_note").click();
  }
});

let inputNote = document.getElementById("note_input");
inputNote.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
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
    allNotes = myAllNotes;
  }
}

function renderAllNotes() {
  renderNotes();
  renderArchivedNotes();
  renderTrashNotes();
}

function renderNotes() {
  let contentRef = document.getElementById("notes_content");
  contentRef.innerHTML = "";

  for (let indexNote = 0; indexNote < allNotes.notes.length; indexNote++) {
    contentRef.innerHTML += getNoteTemplate(indexNote);
  }
}

function renderArchivedNotes() {
  let archivedContentRef = document.getElementById("archived_content");
  archivedContentRef.innerHTML = "";

  for (
    let indexArchivedNote = 0;
    indexArchivedNote < allNotes.archivedNotes.length;
    indexArchivedNote++
  ) {
    archivedContentRef.innerHTML += getArchivedNoteTemplate(indexArchivedNote);
  }
}

function renderTrashNotes() {
  let trashContentRef = document.getElementById("trash_content");
  trashContentRef.innerHTML = "";

  for (
    let indexTrashNote = 0;
    indexTrashNote < allNotes.trashNotes.length;
    indexTrashNote++
  ) {
    trashContentRef.innerHTML += getTrashNoteTemplate(indexTrashNote);
  }
}

function addNote() {
  let noteInputRef = document.getElementById("note_input");
  let noteInput = noteInputRef.value;

  let noteTitleInputRef = document.getElementById("note_title_input");
  let noteTitleInput = noteTitleInputRef.value;

  if (noteInput != "" && noteTitleInput != "") {
    allNotes.notes.push(noteInput);
    allNotes.notesTitles.push(noteTitleInput);

    noteInputRef.value = "";
    noteTitleInputRef.value = "";
  }
  saveToLocalStorage();
  renderAllNotes();
}

function moveNote(indexNote, startKey, destinationKey) {
  let noteRef = allNotes[startKey].splice(indexNote, 1);
  allNotes[destinationKey].push(noteRef[0]);

  let noteTitleRef = allNotes[startKey + "Titles"].splice(indexNote, 1);
  allNotes[destinationKey + "Titles"].push(noteTitleRef[0]);

  saveToLocalStorage();
  renderAllNotes();
}

function deleteNote(indexTrashNote) {
  allNotes.trashNotes.splice(indexTrashNote, 1);
  allNotes.trashNotesTitles.splice(indexTrashNote, 1);

  saveToLocalStorage();
  renderAllNotes();
}

function startDragging(i, e) {
  currentDraggedElement = e;
  currentDraggedElementId = i;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  moveNote(currentDraggedElementId, currentDraggedElement, category); 
  renderAllNotes();
}