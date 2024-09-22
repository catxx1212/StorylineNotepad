sessionStorage.clear();
function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

var userPreferences_expectedObjectLength = 4;

if (!localStorage.getItem("storylineNotepad_global")) {
  let defaultStorylineNotepad_globalObject = {
    userPreferences: {
      appendTimeAndDateToFileExport: "enabled",
      defaultFallbackTheme: "white",
      autoExportWhenImporting: "enabled",
      textAlign: "center",              // theres a copy of this on title page script, please keep synced
    },  
    storylineSaves: {       
      0: {"versionNumber":"0.6.1","textData":[{"storyboxNumber":0,"storyBoxTextContent":"Welcome to Storyline Notepad!\n\nThis save file is here to help users who don't know how to use Storyline Notepad yet.\n\n(You can delete this storyline if you don't need it anymore)\n\n(This will come back if you reset Storyline Notepad)"},{"storyboxNumber":1,"storyBoxTextContent":"Title Changing:\n\nJust click the title above the storyboxes to change it."},{"storyboxNumber":2,"storyBoxTextContent":"Storybox Management:\n(These boxes)\n\nYou can add a new box to the end of the storyline with the add button at the end.\n\nRight click the arrows for more options on box management.\n\nHover over each action to see a preview."},{"storyboxNumber":3,"storyBoxTextContent":"Themes Menu:\n\nThe brush icon in the top tray opens the Themes Menu.\n\nClick it to view all available themes."},{"storyboxNumber":4,"storyBoxTextContent":"Global Styles Menu:\n\nThe \"Aa\" icon in the top tray opens the Global Styles Menu.\n\nUse this to adjust font sizes and font boldness."},{"storyboxNumber":5,"storyBoxTextContent":"The Save Button:\n\nIt's pretty self explanatory, to be honest.\n\nStoryline Notepad also saves automatically when you exit."},{"storyboxNumber":6,"storyBoxTextContent":"The Import and Export Menu:\n\nThe two arrows icon in the top tray opens the Import and Export Menu.\n\nHere, you can export your current storyline to a file, either as a backup or to share with someone else.\n\nYou can also import data here, including support for version 0.2."},{"storyboxNumber":7,"storyBoxTextContent":"The Drop Down Menu:\n\nThe single arrow icon in the top tray opens the Drop Down Menu.\n\nThis is where you can find the User Preferences Menu and the Clear Data Menu."},{"storyboxNumber":8,"storyBoxTextContent":"The User Preferences Menu:\n\nThe cog icon in the dropdown menu opens the User Preferences Menu.\n\nHere, you can adjust some of Storyline Notepad's behaviours."},{"storyboxNumber":9,"storyBoxTextContent":"The Clear Data Menu:\n\nThe bin icon in the drop down menu opens the Clear Data Menu.\n\nHere, you can choose to either delete your current storyline or delete everything, including all your storyline saves and user preferences."},{"storyboxNumber":10,"storyBoxTextContent":"Tips and tricks:\n\nHold shift to scroll faster."},{"storyboxNumber":11,"storyBoxTextContent":"Tutorial Version 1.0.0\n\nThis can be downloaded from the Import/Export Menu or from:\n\nhttps://storylinenotepad.catxx1212.com/storylineNotepad/downloads/tutorialSaveFile/\n\nThank you for taking the time to read this! <3"}],"storylineTitle":"Tutorial","activeTheme":["anything","pleaseGoToFallbackTheme"],"activeGlobalStyle":"normalBold"},
    },
    lastTimeStamp: undefined,
  };
  localStorage.setItem("storylineNotepad_global", JSON.stringify(defaultStorylineNotepad_globalObject));
} else {

  let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));

  // if (!storylineNotepad_global_setUserPreferences.userPreferences || isObjectEmpty(storylineNotepad_global_setUserPreferences.userPreferences) || !(Object.keys(storylineNotepad_global_setUserPreferences.userPreferences).length === userPreferences_expectedObjectLength)) {
  //   storylineNotepad_global_setUserPreferences.userPreferences = {
  //     appendTimeAndDateToFileExport: "enabled",
  //     defaultFallbackTheme: "white",                            // this works fine, it just resets user prefrenseses without using the UI object. The one in storyline notepad main still checks so theres no harm in leaving this out. oh i see, so leave the one that tells the user that its been reset
  //     autoExportWhenImporting: "enabled",
  //     textAlign: "center",     
  //   };
  //   localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
  // }
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
var toggle;

let userPreferences_fallbackTheme = ((JSON.parse(localStorage.getItem("storylineNotepad_global")) || {}).userPreferences || {}).defaultFallbackTheme || "white";

if(userPreferences_fallbackTheme === "white" || userPreferences_fallbackTheme === undefined) {
  toggle = true;
  darkLightToggle.src = "../assets/icons/darkIcon_dark.png";
  document.body.classList = "white_theme";
} else {
  toggle = false;
  darkLightToggle.src = "../assets/icons/lightIcon_light.png";
  document.body.classList = "black_theme";
}

darkLightToggle.onclick = function() {
  if(toggle) {
    toggle = false;
    darkLightToggle.src = "../assets/icons/lightIcon_light.png";
    document.body.classList.replace("white_theme", "black_theme");
    
    let changedValue = "black";
    let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
    storylineNotepad_global_setUserPreferences.userPreferences.defaultFallbackTheme = changedValue;
    localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));

  } else if(!toggle) {
    toggle = true;
    darkLightToggle.src = "../assets/icons/darkIcon_dark.png";
    document.body.classList.replace("black_theme", "white_theme");

    let changedValue = "white";
    let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
    storylineNotepad_global_setUserPreferences.userPreferences.defaultFallbackTheme = changedValue;
    localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));

  }
}
