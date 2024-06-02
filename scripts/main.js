// massive changes are under way in a diffren folder outside of this folder >:3



const storyBoxSection = document.getElementById("StoryBoxSection");

let boxNumber = 1;

let dataLoaded = false;
let LoadedBoxes = false;
let loadedStoryBoxText = false;
let allLoaded = false;
let noLoadNeeded = false;
try {
  var storyline_data = JSON.parse(localStorage.getItem("storylineNotepad_data"));
} catch (error) {
  alert("something went wrong with loading your data, This is most likey because of incorrect import data. Please try again. If this does not work, then report the issue. Error code: 2")
}

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
        <div class="box_container" id="box${boxNumber}">
          <div class="storyBox story_box_color">
            <textarea class="text" id="textarea${boxNumber}" placeholder="storyBox${boxNumber}"></textarea>
          </div>
          <div class="arrow">
            <img src="../assets/arrow-for-storyline-notepad--black.png" alt="Arrow"/>
          </div>
        </div>`;
      console.log(boxNumber);
      storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);
      boxNumber++;
    };
    boxNumber--;
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
  // storyline_data = {
  //   storyLineTitle: "Untitled Notepad",
  // }
}



function saveStoryLineData(textData, numberData, titleData, saveToDisk) {
  let storyLineData = {
    versionNumber: currentVersionNumber,
    textData: textData,
    indexData: numberData,
    storylineTitle: titleData,
  }
  if(saveToDisk) {
    try {
      localStorage.setItem("storylineNotepad_data", JSON.stringify(storyLineData));
      return true;
    } catch {
      alert("There was an issue saving, please don't close or refresh page and try again. Error code: 1")
      return false;
    }
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
        if(saveStoryLineData(storyBoxSaveData, boxNumberValue, currentTitle, true)) {
          console.log("Saved <3");
        }
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

  // function reloadWindowEventListener() {           // im concerned becuase i remember that this was needed because of some issue. i just tested it without 1 year later and it all seems fine..
  //   window.removeEventListener("beforeunload" , beforeUnloadEvent);
  //   window.addEventListener("beforeunload" , beforeUnloadEvent);
  // };

  window.addEventListener("beforeunload", beforeUnloadEvent);



  const AddNewButton = document.getElementById("addNewButton");
  //let boxNumber = 0;

  AddNewButton.addEventListener("click" , () => {
    boxNumber++;
    console.warn(boxNumber);

    let storyBox = `
      <div class="box_container" id="box${boxNumber}">
        <div class="storyBox story_box_color">
          <textarea class="text" id="textarea${boxNumber}" placeholder="storyBox${boxNumber}"></textarea>
        </div>
        <div class="arrow">
          <img src="../assets/arrow-for-storyline-notepad--black.png" alt="Arrow"/>
        </div>
      </div>`;

      storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);

      // reloadWindowEventListener();
  });

  function removeStoryBox(id) {
    const removeLastStoryBox = document.getElementById(id);
    if(removeLastStoryBox) {
      removeLastStoryBox.remove();
    }
  };

  const clearDataButton = document.getElementById("clearDataButton");

  function clearAllData(whereButton) {
    const askIfUserWantsToClearAllData = confirm("Are you sure you want to clear all data linked to your notepad?");
    if (askIfUserWantsToClearAllData) {
      saveDataForStoryBox();
      let exportData = localStorage.getItem("storylineNotepad_data");
      copyTextToClipboard(exportData);
      if(whereButton === "clearAllData") {
        alert("Your current storyline has been copied to your clipboard in case of regret.");
      } else if(whereButton === "import") {
        alert("Your current storyline has been copied to your clipboard so that you can use it later. Keep it safe!!");
      }
      window.removeEventListener("beforeunload" , beforeUnloadEvent);
      localStorage.removeItem("storylineNotepad_data");
      location.reload();
    } else {
      console.warn("Clear Data Not Done");
    }
  }

  clearDataButton.addEventListener("click" , () => {
    clearAllData("clearAllData");
  });


  //the two eventlisteners under here save thier data diffrently to the others. note to me: do not fuck with them (2024 me: girl calm tf down :3 )
  const storylineTitle = document.getElementById("storylineTitle");
  var loadedStorylineTitleData;
  if(storyline_data && storyline_data.storylineTitle !== null) {
    loadedStorylineTitleData = storyline_data.storylineTitle;
    storylineTitle.textContent = loadedStorylineTitleData;
    sessionStorage.setItem("savedStorylineTitle", loadedStorylineTitleData);
  } else {
      storylineTitle.textContent = "Untitled Notepad";
      sessionStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
  }

  storylineTitle.addEventListener("click" , () => {
    let newTitle = prompt("New Title:");
    console.log("any errors to do with the title changing is fine, dw about that");
    if(newTitle.trim() !== ``) {
      if(newTitle.length >= 40) {
        alert("Storyline title too large. Must be under 40 characters.");
        return;
      }
      storylineTitle.textContent = newTitle;
      sessionStorage.setItem("savedStorylineTitle" , newTitle)
    } else {
      // storylineTitle.textContent = "Untitled Notepad";
      // sessionStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
    }
  });



  const themeSelect = document.getElementById("themeSelect");
  var defaultTheme = "void";
  var loadedLastTheme = localStorage.getItem("savedLastTheme");
  if(loadedLastTheme) {
    document.body.classList.add(`${loadedLastTheme}_theme`);
    themeSelect.value = `${loadedLastTheme}`
  } else {
    document.body.classList.add(`${defaultTheme}_theme`);
    themeSelect.value = `${defaultTheme}`
  }

  themeSelect.addEventListener("change" , () => {
    let currentTheme = themeSelect.value;
    document.body.classList.remove(
    "plainLight_theme", 
    "plainDark_theme", 
    "coralReef_theme" , 
    "midnight_theme", 
    "hellScape_theme", 
    "void_theme", 
    "sunset_theme", 
    "candyIsland_theme", 
    "dreamySkies_theme",
    "lightboundFields_theme",
    "pinkNeonDisco_theme",
    "milkyCappuccino_theme",
  );
    document.body.classList.add(currentTheme + "_theme");
    localStorage.setItem("savedLastTheme" , themeSelect.value);
  });

  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const defaultFontSize = "normal";
  const loadedLastFontSize = localStorage.getItem("savedLastFontSize");
  if(loadedLastTheme) {
    document.body.classList.add(`fontSize_${loadedLastFontSize}`);
    fontSizeSelect.value = `${loadedLastFontSize}`
  } else {
    document.body.classList.add(`fontSize_${defaultFontSize}`);
    fontSizeSelect.value = defaultFontSize;
  }

  fontSizeSelect.addEventListener("change" , () => {
    let currentFontSize = fontSizeSelect.value;
    console.log(currentFontSize)
    document.body.classList.remove("fontSize_small", "fontSize_smallBold", "fontSize_normal", "fontSize_normalBold", "fontSize_large", "fontSize_largeBold");
    document.body.classList.add("fontSize_" + currentFontSize);
    localStorage.setItem("savedLastFontSize" , fontSizeSelect.value);
  });
}

function copyTextToClipboard(text) {
  function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999%";
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
      <div class="exportDataOutputDiv center_header_color">
        <p>Your storyline data has been copied to your clipboard.</p>
        <p>It's recommended that you store it in a text file until you need it again.</p>
        <button id="okButton" class="story_box_color">Ok, thanks :)</button>
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
      <div class="importDataOutputDiv center_header_color">
        <p class="importDataOutputHeading">Please paste the StorylineNotepad_data here:</p>
        <input autocomplete="off" type="text" id="importDataInput" placeholder="Import data only please."/>
        <p>For "just in case", when you import, your current storyline is copied to your clipboard, you can import it again later.</p>
        <button id="ImportButton" class="story_box_color">Import</button>
        <button id="cancelImportButton" class="story_box_color">Cancel</button>
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

exportDataButton.addEventListener("click", function() {
  saveDataForStoryBox();
  exportImportPopup("export");
  let exportData = localStorage.getItem("storylineNotepad_data");
  copyTextToClipboard(exportData);
});
importDataButton.addEventListener("click", async function() {
  var importOutput = await exportImportPopup("import");
  if(importOutput) {
    clearAllData("import");
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

document.addEventListener("keydown", function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    saveDataForStoryBox()
    saveButton.classList.add("flashGreen")
    saveButton.addEventListener("animationend", function() {
      saveButton.classList.remove("flashGreen");
    });
  }
});


document.addEventListener("DOMContentLoaded", function() {
  const contextMenu = document.getElementById("contextMenu");
  const addNewButton = document.getElementById("addNewButton");

  addNewButton.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      showContextMenu(event.pageX, event.pageY);
  });

  document.addEventListener("click", function(event) {
      if (contextMenu.style.display === "block") {
          contextMenu.style.display = "none";
      }
  });
  // document.addEventListener("contextmenu", function(event) {
  //   event.preventDefault();
  // })
  function showContextMenu(x, y) {
      contextMenu.style.display = "block";
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
  }
});



function removeLastStorybox() {
  const boxId = document.querySelectorAll(`[id^="box"]`);
  if(boxId.length > 0) {
    const lastBox = boxId[boxId.length -1];
    const lastBoxId = lastBox.getAttribute("id");
    removeStoryBox(lastBoxId);
    boxNumber--;
  }
}



document.querySelector(".storylineNotepad_main").addEventListener("wheel", function(event) {
  if(event.deltaY !== 0) {
      event.preventDefault();
      this.scrollLeft += event.deltaY;
  }
});


if(window.innerHeight > window.innerWidth) {
  var wrongScreenAspectRatioElement = document.createElement("div");
  wrongScreenAspectRatioElement.classList.add("wrongScreenAspectRatioElement", "center_header_color");
  wrongScreenAspectRatioElement.innerHTML = `
    <p class="wrongScreenAspectRatioElement_firstText">Hold on a second</p>
    <p class="wrongScreenAspectRatioElement_lastText">Your screen height is larger than your screen width. Storyline Notepad was designed for laptop / monitors. Maybe in a future version _(0.0)/ </p>
  `;
  document.body.appendChild(wrongScreenAspectRatioElement);
}



var newUpdateElement = document.createElement("div");
newUpdateElement.id = "newUpdateElement";
newUpdateElement.classList.add("footer_color");
newUpdateElement.innerHTML = `
  <img id="newUpdateElement_closeButton" src="../assets/closeButton.png" title="Close"/>
  <p class="newUpdateElement_title">There has been an update!!</p>
  <p class="newUpdateElement_version">Version 0.2.4 => 0.2.5</p>
  <p class="newUpdateElement_changedTitle">Here's what has changed:</p>
  <ul class="newUpdateElement_list">
    <li>Fixed an issue with the context menu not coming up for spelling corrections.</li>
    <li>Added the update pop-up.</li>
    <li>Fixed and adjusted some CSS.</li>
    <li>Fixed an issue with the storyline title showing "null".</li>
    <li>Changes to the storyline title code too!</li>
  </ul>
  <p class="newUpdateElement_text1">I hope these updates make it a better experience for you. <br/> Have a nice day too!!</p>
  
`;

var popUpMainElement = document.createElement("div");
popUpMainElement.classList.add("popUpBackground");
popUpMainElement.appendChild(newUpdateElement);



var flipToUse = 1;  // <<<<<<<  change this each update PLEASE :3   last changed: 0.2.5 = 1    <<< (this might help)
var otherFlip = function() {
  if(flipToUse === 1) {
    return 2
  } else if(flipToUse === 2) {
    return 1;
  }
}
if(!localStorage.getItem("newUpdate_flip1") && !localStorage.getItem("newUpdate_flip2")) {
  localStorage.setItem("newUpdate_flip1", true);
  localStorage.setItem("newUpdate_flip2", false);
}

if(localStorage.getItem(`newUpdate_flip${flipToUse}`) === 'true') {
  document.body.appendChild(popUpMainElement);
  setTimeout(() => {
    document.getElementById("newUpdateElement_closeButton").addEventListener("click", function() {
      popUpMainElement.remove();
    });
  }, 500);
  localStorage.setItem(`newUpdate_flip${flipToUse}`, false);
  localStorage.setItem(`newUpdate_flip${otherFlip()}`, true);
}