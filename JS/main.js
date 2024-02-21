//SESSION STORAGE


const storyBoxSection = document.getElementById("StoryBoxSection");

let boxNumber = 1;

let dataLoaded = false;
let LoadedBoxes = false;
let loadedStoryBoxText = false;
let allLoaded = false;
let noLoadNeeded = false
;

function loadSavedData() {
  const loadedStoryBoxTextData = JSON.parse(localStorage.getItem("savedStoryBoxTextData"));
  const loadedBoxNumberData = localStorage.getItem("savedBoxNumberData");
  const loadedData = {
    loadedStoryBoxTextData,
    loadedBoxNumberData,
  };

  return loadedData;
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
  console.log();
  storylineTitle.textContent = "Untitled Notepad";
  localStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
}





if(allLoaded || noLoadNeeded) {
  
  let currentActiveStorylineNotepad_whenOpened = localStorage.getItem("savedStorylineTitle");
  console.log(currentActiveStorylineNotepad_whenOpened);
  // if(currentActiveStorylineNotepad_whenOpened.indexOf(" ") !== -1) {
  //    currentActiveStorylineNotepad_whenOpened = currentActiveStorylineNotepad_whenOpened.replace(/ /g, "_");
  // }
  // console.log(currentActiveStorylineNotepad_whenOpened);


  const exitMessage = "Your work has hopfully been saved, unless you have local storage for websites disabled";

  function saveTextDataForStoryBox() {

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
      localStorage.setItem("savedStoryBoxTextData" , JSON.stringify(storyBoxSaveData));
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
    saveTextDataForStoryBox();
    saveStoryBoxNumber();
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
      localStorage.removeItem("savedStoryBoxTextData");
      localStorage.removeItem("savedBoxNumberData");
      location.reload();
    } else {
      console.warn("Clear Data Not Done")
    }
  });


  //the two eventlisteners under here save thier data diffrently to the others. note to me: do not fuck with them
  const storylineTitle = document.getElementById("storylineTitle");
  const loadedStorylineTitleData = localStorage.getItem("savedStorylineTitle");

  if(loadedStorylineTitleData) {
    storylineTitle.textContent = loadedStorylineTitleData;
  } else {
      storylineTitle.textContent = "Untitled Notepad";
      localStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
  }

  storylineTitle.addEventListener("click" , () => {
    let newTitle = prompt("New Title:");
    console.log("any errors to do with the title changing is fine, dw about that");
    if(newTitle.trim() !== ``){
      storylineTitle.textContent = newTitle;
      localStorage.setItem("savedStorylineTitle" , newTitle)
    } else {
      storylineTitle.textContent = "Untitled Notepad";
      localStorage.setItem("savedStorylineTitle" , "Untitled Notepad")
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
    document.body.classList.remove("seaView-theme" , "midnight-theme" , "hellScape-theme" , "grass");
    document.body.classList.add(currentTheme + "-theme");
    localStorage.setItem("savedLastTheme" , themeSelect.value);
  });
}