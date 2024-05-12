//SESSION STORAGE


const storyBoxSection = document.getElementById("StoryBoxSection");

let boxNumber = 1;

let dataLoaded = false;
let LoadedBoxes = false;
let loadedStoryBoxText = false;
let allLoaded = false;
let noLoadNeeded = false;
var storyline_data = JSON.parse(localStorage.getItem("storylineNotepad_data"));

function loadSavedData() {
  if(storyline_data) {
    var loadedStoryBoxTextData = storyline_data.textData;
    var loadedBoxNumberData = storyline_data.indexData;
    var loadedData = {
      loadedStoryBoxTextData,
      loadedBoxNumberData,
    };
  
    return loadedData;
  } else {
    return false;
  }
};

const loadedData = loadSavedData();
console.warn(loadedData);

if(loadedData.loadedBoxNumberData && loadedData.loadedStoryBoxTextData) {
  dataLoaded = true;

  const storyBoxesToMake = loadedData.loadedBoxNumberData;
  if(dataLoaded) {

    //const storyBoxesToMake = loadedData.loadedBoxNumberData;
  
    while(storyBoxesToMake >= boxNumber) {
      let storyBox = `
        <div class="box-container" id="box${boxNumber}">
          <div class="storyBox story-box-color">
            <textarea id="textarea${boxNumber}" placeholder="storyBox${boxNumber}"></textarea>
          </div>
          <div class="arrow">
            <img src="../../img/arrow-for-storyline-notepad--black.png" alt="Arrow"/>
          </div>
        </div>`;
      console.log(boxNumber);
      storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);
      boxNumber++;
    };
    boxNumber = boxNumber - 1;
    LoadedBoxes = true; 
  };

  if(loadedData) {
    const textData = loadedData.loadedStoryBoxTextData;
    const textAreaArea = document.querySelectorAll("textarea");
    const storyBoxesToFill = storyBoxesToMake;
    let boxNumber = 1;
    let index = 0;
    while(storyBoxesToFill >= boxNumber) {
      console.warn(textData[`textarea${boxNumber}`]);
      const putValue = textData[`textarea${boxNumber}`];
      console.log("box ref" , textAreaArea[index])
      textAreaArea[index].textContent = putValue;
      boxNumber++;
      index++;
    }
    boxNumber--;
    console.log("again boxnumber:" , boxNumber);





    allLoaded = true;
    //alert("Fak U")
  }

} else {
  noLoadNeeded = true;
  boxNumber = 0;
  // console.log();
  // storylineTitle.textContent = "Untitled Notepad";
  // sessionStorage.setItem("savedStorylineTitle" , "Untitled Notepad");
  storyline_data = {
    storyLineTitle: "Untitled Notepad",
  }
}



function saveStoryLineData(textData, numberData, titleData, saveToDisk) {
  let storyLineData = {
    textData: textData,
    indexData: numberData,
    storyLineTitle: titleData,
  }
  if(saveToDisk) {
    localStorage.setItem("storylineNotepad_data", JSON.stringify(storyLineData));
  }
}


if(allLoaded || noLoadNeeded) {
  
  // let currentActiveStorylineNotepad_whenOpened = storyline_data.storyLineTitle;
  // console.log(currentActiveStorylineNotepad_whenOpened);
  // if(currentActiveStorylineNotepad_whenOpened.indexOf(" ") !== -1) {
  //    currentActiveStorylineNotepad_whenOpened = currentActiveStorylineNotepad_whenOpened.replace(/ /g, "_");
  // }
  // console.log(currentActiveStorylineNotepad_whenOpened);


  const exitMessage = "Your work has hopfully been saved, unless you have local storage for websites disabled";

  function saveDataForStoryBox() {
    function noSave() {
      console.log("No Text Save Happened (good thing)")
    };
    const textareas = document.querySelectorAll("textarea");
    const storyBoxSaveData = {};
    textareas.forEach((textarea , index) => {
      index++;
      const id = `textarea${index}`;
      const value = textarea.value;
      if(value === "") {
        noSave()
        delete storyBoxSaveData[id];
      } else {
        storyBoxSaveData[id] = value;
        console.log("savedTextBox");
      }
    });
    if(Object.keys(storyBoxSaveData).length === 0){
      noSave()
    } else {
      let boxNumberValue = boxNumber
      if(boxNumberValue >= 1) {
        let currentTitle = sessionStorage.getItem("savedStorylineTitle");  //MAKE CURRENT TITLE TMP TORE IN SESSION STORAGE AND THEN RETRIVE IT HERE :££:£:£:£:£
        saveStoryLineData(storyBoxSaveData, boxNumberValue, currentTitle, true);
      } else {
        noSave();
      }
      // localStorage.setItem("savedStoryBoxTextData" , JSON.stringify(storyBoxSaveData));
    }
  };

  function saveStoryBoxNumber() {
    let boxNumberValue = boxNumber
    if(boxNumberValue >= 1) {
    localStorage.setItem("savedBoxNumberData" , boxNumberValue);
    } else {
      console.log("noBoxNumberSave");
    }
  };

  function beforeUnloadEvent(event) {
    saveDataForStoryBox();
    // saveStoryBoxNumber();
    sessionStorage.clear();
    event.returnValue = exitMessage;
    return exitMessage;
  };

  function reloadWindowEventListener() {
    window.removeEventListener("beforeunload" , beforeUnloadEvent);
    window.addEventListener("beforeunload" , beforeUnloadEvent);
  };

  window.addEventListener("beforeunload" , beforeUnloadEvent );



  const AddNewButton = document.getElementById("addNewButton");
  //let boxNumber = 0;

  AddNewButton.addEventListener("click" , () => {
    boxNumber++;
    console.warn(boxNumber);

    let storyBox = `
      <div class="box-container" id="box${boxNumber}">
        <div class="storyBox story-box-color">
          <textarea id="textarea${boxNumber}" placeholder="storyBox${boxNumber}"></textarea>
        </div>
        <div class="arrow">
          <img src="../../img/arrow-for-storyline-notepad--black.png" alt="Arrow"/>
        </div>
      </div>`;

      storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);

      reloadWindowEventListener();
      //MERGE SAVE.JS  WITH THIS  :( :( :(
      //Done :D
  });

  function removeStoryBox(id) {
    const removeLastStoryBox = document.getElementById(id);
    if(removeLastStoryBox) {
      removeLastStoryBox.remove();
    }
  };

  const removeButton = document.getElementById("removeButton");

  removeButton.addEventListener("click" , () => {
    let confirmRemove = confirm("Do you want to remove this box?");
    if(confirmRemove) {
      const boxId = document.querySelectorAll(`[id^="box"]`);
      if(boxId.length > 0) {
        const lastBox = boxId[boxId.length -1];
        const lastBoxId = lastBox.getAttribute("id");
        removeStoryBox(lastBoxId);
        boxNumber--;
      } else {
        alert("no box to remove");
      }
    }
    console.log("box number" , boxNumber)
    reloadWindowEventListener();
  });
  

  const clearDataButton = document.getElementById("clearDataButton");

  clearDataButton.addEventListener("click" , () => {
    const askIfUserWantsToClearAllData = confirm("Are you sure you want to clear all data linked to your notepad?");
    if (askIfUserWantsToClearAllData) {
      window.removeEventListener("beforeunload" , beforeUnloadEvent);
      localStorage.removeItem("storylineNotepad_data");
      location.reload();
    } else {
      console.warn("Clear Data Not Done")
    }
  });


  //the two eventlisteners under here save thier data diffrently to the others. note to me: do not fuck with them (2024 me: girl calm tf down :3 )
  const storylineTitle = document.getElementById("storylineTitle");
  var loadedStorylineTitleData = storyline_data.storyLineTitle;
  if(loadedStorylineTitleData) {
    storylineTitle.textContent = loadedStorylineTitleData;
    sessionStorage.setItem("savedStorylineTitle", loadedStorylineTitleData);
  } else {
      storylineTitle.textContent = "Untitled Notepad";
      sessionStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
  }

  storylineTitle.addEventListener("click" , () => {
    let newTitle = prompt("New Title:");
    console.log("any errors to do with the title changing is fine, dw about that");
    if(newTitle.trim() !== ``){
      storylineTitle.textContent = newTitle;
      sessionStorage.setItem("savedStorylineTitle" , newTitle)
    } else {
      // storylineTitle.textContent = "Untitled Notepad";
      // sessionStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
    }
  });



  const themeSelect = document.getElementById("themeSelect");
  const defaultTheme = "seaView-theme";
  const loadedLastTheme = localStorage.getItem("savedLastTheme");
  if(loadedLastTheme) {
    document.body.classList.add(`${loadedLastTheme}-theme`);
    themeSelect.value = `${loadedLastTheme}`
  } else {
    document.body.classList.add(defaultTheme);
  }

  themeSelect.addEventListener("change" , () => {
    let currentTheme = themeSelect.value;
    document.body.classList.remove("seaView-theme" , "midnight-theme" , "hellScape-theme" , "grass-theme", "void-theme");
    document.body.classList.add(currentTheme + "-theme");
    localStorage.setItem("savedLastTheme" , themeSelect.value);
  });
}

function copyTextToClipboard(text) {
  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      const message = successful ? "Copied to clipboard" : "Failed to copy";
      console.log(message);
    } catch (err) {
      console.error("Unable to copy", err);
    }
    document.body.removeChild(textArea);
  };
  copyToClipboard(text);
};

async function exportImportPopup(exportOrImport) {
  var popUpMainElement = document.createElement("div");
  popUpMainElement.classList.add("popUpBackground");
  if(exportOrImport === "export") {
    popUpMainElement.innerHTML = `
      <div class="exportDataOutputDiv center-header-color">
        <p>Your storyline data has been copied to your clipboard.</p>
        <p>You can either share the data with someone else and have them "import" it, or just store it in a text file until you need it again.</p>
        <button id="okButton" class="story-box-color">Ok, thanks :)</button>
      </div>
    `;
    document.body.appendChild(popUpMainElement);
    return new Promise((resolve, reject) => {
      var okButton = document.getElementById("okButton");
      okButton.addEventListener("click", function(event) {
        popUpMainElement.remove();
        resolve();
      });
    });
  } else if (exportOrImport === "import") {
    popUpMainElement.innerHTML = `
      <div class="importDataOutputDiv center-header-color">
        <p class="importDataOutputHeading">Please paste the StorylineNotepad_data here:</p>
        <input type="text" id="importDataInput" placeholder="Import data only please :3"/>
        <p>Import will NOT WORK if you already have data present. If you do have an active storyline, please export your current storyline and then "clear data" afterward.</p>
        <button id="ImportButton" class="story-box-color">Import</button>
        <button id="cancelImportButton" class="story-box-color">Cancel</button>
      </div>
    `;
    document.body.appendChild(popUpMainElement);
    return new Promise((resolve, reject) => {
      var importButton = document.getElementById("ImportButton");
      var cancelImportButton = document.getElementById("cancelImportButton");
      importButton.addEventListener("click", function(event) {
        let importDataInputValue = document.getElementById("importDataInput").value;
        popUpMainElement.remove();
        resolve(importDataInputValue);
      });
      cancelImportButton.addEventListener("click", function() {
        popUpMainElement.remove();
        resolve();
      });
    });
  }
}


const exportDataButton = document.getElementById("exportDataButton");
const importDataButton = document.getElementById("importDataButton");

exportDataButton.addEventListener("click", function(event) {
  saveDataForStoryBox();
  exportImportPopup("export");
  let exportData = localStorage.getItem("storylineNotepad_data");
  copyTextToClipboard(exportData);
});
importDataButton.addEventListener("click", async function() {
  var importOutput = await exportImportPopup("import");
  if(importOutput) {
    localStorage.setItem("storylineNotepad_data", importOutput);
    location.reload();
  }
});

const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", function() {
  saveDataForStoryBox()
  this.classList.add("flashGreen")
  this.addEventListener("animationend", function() {
    this.classList.remove("flashGreen");
  });
});

document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    saveDataForStoryBox()
    saveButton.classList.add("flashGreen")
    saveButton.addEventListener("animationend", function() {
      saveButton.classList.remove("flashGreen");
    });
  }
});
