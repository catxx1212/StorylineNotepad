sessionStorage.clear();
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

var userPreferences_expectedObjectLength = 3;

if (!localStorage.getItem("storylineNotepad_global")) {
  let defaultStorylineNotepad_globalObject = {
    userPreferences: {
      appendTimeAndDateToFileExport: "enabled",
      defaultFallbackTheme: "white",
      autoExportWhenImporting: "enabled",
    },
    storylineSaves: {

    },
    lastTimeStamp: undefined,
  };
  localStorage.setItem("storylineNotepad_global", JSON.stringify(defaultStorylineNotepad_globalObject));
} else {

  let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));

  if (!storylineNotepad_global_setUserPreferences.userPreferences || isObjectEmpty(storylineNotepad_global_setUserPreferences.userPreferences) || !(Object.keys(storylineNotepad_global_setUserPreferences.userPreferences).length === userPreferences_expectedObjectLength)) {
    storylineNotepad_global_setUserPreferences.userPreferences = {
      appendTimeAndDateToFileExport: "enabled",
      defaultFallbackTheme: "white",
      autoExportWhenImporting: "enabled",
    };
    localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
    setTimeout(() => {
      UI.error("User Preferences was reset because it was either missing or malformed.")
    }, 500);
  }
}

const saveSlotContainer = document.getElementById("saveSlotContainer");

var storylineNotepad_global_getSaveSlots = JSON.parse(localStorage.getItem("storylineNotepad_global"));

console.log(storylineNotepad_global_getSaveSlots.storylineSaves);

Object.entries(storylineNotepad_global_getSaveSlots.storylineSaves).forEach(([key, saveData]) => {
  let saveSlotTitle = saveData.storylineTitle;
  if(saveData.storylineTitle.length > 10) {
      saveSlotTitle = saveSlotTitle.slice(0, 10) + '...';
  }
  document.querySelector(`#saveSlot_${key} .saveSlot_title`).innerText = saveSlotTitle;
  
});

function openSaveSlot(saveRef) {
  sessionStorage.setItem("activeSaveSlot", saveRef);
  location.href = "storyline-notepad.html";
};

let fallBackTheme;
try {
  fallBackTheme = JSON.parse(localStorage.getItem("storylineNotepad_global")).userPreferences.defaultFallbackTheme;
} catch {
  fallBackTheme = "white";
}

document.body.classList.add(fallBackTheme + "_theme");

let themeType = function() {
  switch(fallBackTheme) {
    case "black":
      return "light";
    case "white":
      return "dark";
  }
};
document.getElementById("darkLightToggle").src = `../assets/icons/${themeType()}Icon_${themeType()}.png`;



var darkLightToggle = document.getElementById("darkLightToggle");
let toggle = fallBackTheme === "white";


darkLightToggle.onclick = function() {
  if(toggle) {
    toggle = false;
    darkLightToggle.src = "../assets/icons/lightIcon_light.png";
    document.body.classList.replace("white_theme", "black_theme");
  } else if(!toggle) {
    toggle = true;
    darkLightToggle.src = "../assets/icons/darkIcon_dark.png";
    document.body.classList.replace("black_theme", "white_theme");
    
  }
}
