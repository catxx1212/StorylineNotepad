const notepadSaveEndingID = "_StorylineNotepadSave";
const loadedDataBoxesSection = document.getElementById("loaded-data-boxes-section")
let number = 0;
const startNewButtoN = document.getElementById("startNewButton");
startNewButtoN.addEventListener("click" , () => {
  window.location.href = `null2/storyline-notepad.html`
});

document.addEventListener("DOMContentLoaded" , () => {
  for(let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    if(key.endsWith(notepadSaveEndingID)){
      foundSavedData = JSON.parse(value);
      console.log(foundSavedData)
      number++;
      let DataBoxBaseHTML = `
      <div class="dataBox" id="dataBox${number}">
        <div class="dataBox-icon ${foundSavedData.assignedColor}"></div>
        <p>${foundSavedData.name}</p>
      </div>`;

      loadedDataBoxesSection.insertAdjacentHTML("beforeend" , DataBoxBaseHTML);
    } else {
      console.log(value)
    }
  }
});







const startNewButton = document.getElementById("startNewButton");

startNewButton.addEventListener("click" , () => {
console.log(DataBoxBaseHTML)
  
});

