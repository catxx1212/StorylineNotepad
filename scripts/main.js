const currentActiveSaveRef = sessionStorage.getItem("activeSaveSlot") || -1;

if(currentActiveSaveRef < 0 || currentActiveSaveRef > 9) {
  location.href = "saveSlots.html";
}

var currentActiveTheme = "";
var currentActiveThemeType = "";
var currentActiveThemeCategory = "";

var currentActiveGlobalStyle = "";

// function isObjectEmpty(obj) {
//   return Object.keys(obj).length === 0;
// }

// var userPreferences_expectedObjectLength = 3;

// if (!localStorage.getItem("storylineNotepad_global")) {
//   let defaultStorylineNotepad_globalObject = {
//     userPreferences: {
//       appendTimeAndDateToFileExport: "enabled",
//       defaultFallbackTheme: "white",
//       autoExportWhenImporting: "enabled",
//     },
//     storylineSaves: {

//     },
//     lastTimeStamp: undefined,
//   };
//   localStorage.setItem("storylineNotepad_global", JSON.stringify(defaultStorylineNotepad_globalObject));
// } else {

//   let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));

//   if (!storylineNotepad_global_setUserPreferences.userPreferences || isObjectEmpty(storylineNotepad_global_setUserPreferences.userPreferences) || !(Object.keys(storylineNotepad_global_setUserPreferences.userPreferences).length === userPreferences_expectedObjectLength)) {
//     storylineNotepad_global_setUserPreferences.userPreferences = {
//       appendTimeAndDateToFileExport: "enabled",
//       defaultFallbackTheme: "white",
//       autoExportWhenImporting: "enabled",
//     };
//     localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
//     setTimeout(() => {
//       UI.error("User Preferences was reset because it was either missing or malformed.")
//     }, 500);
//   }
// }


//  load user preferences

var loadedUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global")).userPreferences;

// data loading



var uid = 0;
function generateUID(increment) {
  if(!increment) return uid;
  uid++;
  return Number(uid);
}

var loadSuccessful;

const storyBoxSection = document.getElementById("StoryBoxSection");

try {
  var storylineNotepad_global_storylineSave = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef]; // << soon to be dynamic :D (more than one save)
  loadSuccessful = true;

} catch (error) {
  setTimeout(() => {
    UI.error("Something went wrong with loading your data. This is most likely because of incorrect import data. Please try again. If this does not work, then report the issue. Error code: 2")
  }, 500);
  loadSuccessful = false;
}
if(storylineNotepad_global_storylineSave !== undefined) {
  if(Object.keys(storylineNotepad_global_storylineSave).length !== 0) {
    var loadedStoryBoxes = "";
    storylineNotepad_global_storylineSave.textData.forEach(textareaToLoad => {
      loadedStoryBoxes += `
        <div class="box_container" id="box${generateUID(true)}">
          <div class="storyBox storyBox_color">
            <textarea class="text storyBox_innerColor" id="textarea${generateUID()}" oncontextmenu="contextMenuForStoryboxes(event)" placeholder="Start typing:">${textareaToLoad.storyBoxTextContent}</textarea>
          </div>
          <div class="arrow" oncontextmenu="showContextMenu('addRemove', event, ${generateUID()})" title="Right click for more options">
            <img src="../assets/icons/arrow_light.png" class="icon"/>
          </div>
        </div>`;
    });
    storyBoxSection.insertAdjacentHTML("beforeend" , loadedStoryBoxes);
  }
} else {
  setTimeout(() => {
    UI.warn("Nothing will save unless there's storyline data to save.");
  }, 500);
}


// storyline title

const storylineTitle = document.getElementById("storylineTitle");

let storylineNotepad_global_storylineSaves_title = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
let loadedTitle;

if(storylineNotepad_global_storylineSaves_title === null || storylineNotepad_global_storylineSaves_title === undefined) {
  loadedTitle = "Untitled Notepad";
} else {
  loadedTitle = storylineNotepad_global_storylineSaves_title.storylineTitle;
}
storylineTitle.textContent = loadedTitle;
sessionStorage.setItem("savedStorylineTitle", loadedTitle);

storylineTitle.onclick = function() {
  let newTitle = prompt("New Title:", sessionStorage.getItem("savedStorylineTitle"));
  if(newTitle === null) return;
  if(newTitle.trim() !== ``) {
    if(newTitle.length >= 40) {
      UI.warn("Storyline title too large. Must be under 40 characters");
      return;
    } else if(newTitle.toLowerCase() === "empty") {
      UI.warn("You cannot name a storyline 'empty' as it is reserved.");
      return;
    }
    storylineTitle.textContent = newTitle;
    sessionStorage.setItem("savedStorylineTitle" , newTitle)
  }
};


// storyline saving


function savestorylineData(textData, numberData, titleData, activeTheme, activeGlobalStyle, saveToDisk) {
  let storylineData = {
    versionNumber: currentVersionNumber,
    textData: textData,
    storylineTitle: titleData,
    activeTheme: activeTheme,
    activeGlobalStyle: activeGlobalStyle,
  }
  if(saveToDisk) {
    try {
      let storylineNotepad_global_storylineSaves = JSON.parse(localStorage.getItem("storylineNotepad_global"));
      storylineNotepad_global_storylineSaves.storylineSaves[currentActiveSaveRef] = storylineData;
      localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_storylineSaves));
      return true;
    } catch {
      UI.error("Failed to save to disk. Please export your storyline to prevent data loss. Error code: 1")
      return false;
    }
  }
}

function saveDataForCurrentStoryline() {
  var textareas = document.querySelectorAll("textarea");
  if(textareas.length === 0) return; 
  var storyBoxData = [];
  let boxIncrement;
  textareas.forEach((textarea, index) => {
    let storyBoxObject = {
      storyboxNumber: index,
      storyBoxTextContent: textarea.value,
    };
    storyBoxData.push(storyBoxObject);
    boxIncrement = index;
  });
  let currentTitle = sessionStorage.getItem("savedStorylineTitle");
  let currentTheme = JSON.parse(sessionStorage.getItem("lastUsedTheme"));
  let currentGlobalStyle = (sessionStorage.getItem("lastUsedGlobalStyle"));
  savestorylineData(storyBoxData, boxIncrement, currentTitle, currentTheme, currentGlobalStyle, true)
};


function beforeUnloadEvent() {
  saveDataForCurrentStoryline();
  // sessionStorage.clear();
};

function reloadWindowEventListener() {
  window.removeEventListener("beforeunload" , beforeUnloadEvent);
  window.addEventListener("beforeunload" , beforeUnloadEvent);
};

window.addEventListener("beforeunload", beforeUnloadEvent);


// add button


const addNewStoryboxButton = document.getElementById("addNewStoryboxButton");

addNewStoryboxButton.onclick = function () {

  let storyBox = `
    <div class="box_container" id="box${generateUID(true)}">
      <div class="storyBox storyBox_color">
        <textarea class="text storyBox_innerColor" id="textarea${generateUID()}" oncontextmenu="contextMenuForStoryboxes(event)" placeholder="Start typing:"></textarea>
      </div>
      <div class="arrow" oncontextmenu="showContextMenu('addRemove', event, ${generateUID()})" title="Right click for more options">
        <img src="../assets/icons/arrow_${currentActiveThemeType}.png"/>
      </div>
    </div>`;

    storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);

    reloadWindowEventListener();
};

function removeStoryBox(id) {
  const removeLastStoryBox = document.getElementById(id);
  if(removeLastStoryBox) {
    removeLastStoryBox.remove();
  }
};





// theme select

var themeList = {
  solid: [
    {
      themeID: "white",
      themeTitle: "White",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(255, 240, 255)",
        "rgb(245, 230, 245)",
        "rgb(220 , 210, 220)",
        "rgb(50, 50, 55)",
      ],
    },
    {
      themeID: "black",
      themeTitle: "Black",
      themeType: "dark",
      themeCategory: "solid",
      preview: [
        "rgb(20, 20, 25)",
        "rgb(30, 30, 35)",
        "rgb(40 , 40, 45)",
        "rgb(205, 205, 210)",
      ],
    },
    {
      themeID: "navyBlue",
      themeTitle: "Navy Blue",
      themeType: "dark",
      themeCategory: "solid",
      preview: [
        "rgb(0, 0, 128)",
        "rgb(0, 0, 118)",
        "rgb(0, 0, 108)",
        "rgb(160, 160, 210)",
      ],
    },
    {
      themeID: "burntOrange",
      themeTitle: "Burnt Orange ",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(184, 65, 0)",
        "rgb(189, 70, 0)",
        "rgb(184, 75, 0)",
        "rgb(200, 155, 100)",
      ],
    },
    {
      themeID: "pink",
      themeTitle: "Pink",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(240, 85, 170)",
        "rgb(230, 75, 160)",
        "rgb(220, 65, 150)",
        "rgb(40, 30, 35)",
      ],
    },
    {
      themeID: "brown",
      themeTitle: "Brown",
      themeType: "dark",
      themeCategory: "solid",
      preview: [
        "rgb(150, 75, 0)",
        "rgb(140, 65, 0)",
        "rgb(130, 55, 0)",
        "rgb(200, 190, 160)",
      ],
    },
    {
      themeID: "electricBlue",
      themeTitle: "Electric blue",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(0, 232, 247)",
        "rgb(0, 222, 237)",
        "rgb(0, 212, 227)",
        "rgb(35, 50, 75)",
      ],
    },
    {
      themeID: "tannedPaper",
      themeTitle: "Tanned Paper",
      themeType: "light",
      themeCategory: "solid",
      preview: [
        "rgb(226, 218, 207)",
        "rgb(216, 208, 197)",
        "rgb(206, 198, 187)",
        "rgb(50, 45, 40)",
      ],
    },
  ],
  gradient: [
    {
      themeID: "underwaterDream",
      themeTitle: "Underwater Dream",
      themeType: "dark",
      themeCategory: "gradient",
      preview: [
        "rgb(57, 11, 172)",
        "rgb(49, 8, 149)",
        "rgb(13, 20, 112)",
        "rgb(10, 24, 75)",
        "rgb(8, 8, 18)",
        "rgb(195, 195, 210)",
      ],
    },
    {
      themeID: "thatOneSunset",
      themeTitle: "That One Sunset",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(255, 175, 69)",
        "rgb(251, 109, 72)",
        "rgb(215, 75, 118)",
        "rgb(103, 63, 105)",
        "rgb(55, 40, 30)"
      ],
    },
    {
      themeID: "blueCrystalCave",
      themeTitle: "Blue Crystal Cave",
      themeType: "dark",
      themeCategory: "gradient",
      preview: [
        "rgb(22, 24, 26)",
        "rgb(128, 166, 201)",
        "rgb(75, 87, 148)",
        "rgb(49, 48, 56)",
        "rgb(30, 30, 34)",
        "rgb(22, 24, 26)",
        "rgb(210, 225, 235)",
      ],
    },
    {
      themeID: "pinkCupcakeIcing",
      themeTitle: "Pink Cupcake Icing",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(245, 238, 230)",
        "rgb(255, 248, 227)",
        "rgb(243, 215, 202)",
        "rgb(230, 164, 180)",
        "rgb(40, 30, 40)",
      ],
    },
    {
      themeID: "pastelWoods",
      themeTitle: "Pastel Woods",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(181, 193, 142)",
        "rgb(227, 200, 165)",
        "rgb(222, 172, 128)",
        "rgb(185, 148, 112)",
        "rgb(170, 133, 97)",
        "rgb(30, 25, 0)",
      ],
    },
    {
      themeID: "dullSideRoads",
      themeTitle: "Dull Side Road",
      themeType: "dark",
      themeCategory: "gradient",
      preview: [
        "rgb(86, 86, 86)",
        "rgb(210, 183, 70)",
        "rgb(71, 71, 71)",
        "rgb(47, 47, 47)",
        "rgb(175, 175, 175)",
      ],
    },
    {
      themeID: "redHorizon",
      themeTitle: "Red Horizon",
      themeType: "dark",
      themeCategory: "gradient",
      preview: [
        "rgb(65, 65, 65)",
        "rgb(205, 0, 0)",
        "rgb(125, 4, 4)",
        "rgb(37, 37, 37)",
        "rgb(155, 155, 155)",
      ],
    },
    {
      themeID: "gentleRainbow",
      themeTitle: "Gentle Rainbow",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(255, 212, 229)",
        "rgb(255, 233, 174)",
        "rgb(212, 255, 178)",
        "rgb(219, 220, 255)",
        "rgb(238, 203, 255)",
        "rgb(25, 25, 25)",
      ],
    },
    {
      themeID: "corruptedVoid",
      themeTitle: "Corrupted Void",
      themeType: "dark",
      themeCategory: "gradient",
      preview: [
        "rgb(5, 5, 5)",
        "rgb(255, 0, 0)",
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(225, 225, 225)",
      ],
    },
    {
      themeID: "cherrySkies",
      themeTitle: "Cherry Skies",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(243, 145, 137)",
        "rgb(187, 128, 130)",
        "rgb(110, 117, 130)",
        "rgb(4, 101, 130)",
        "rgb(245, 205, 235)",
      ],
    },
    {
      themeID: "hopefulFields",
      themeTitle: "Hopeful Fields",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(221, 255, 187)",
        "rgb(199, 233, 176)",
        "rgb(179, 201, 156)",
        "rgb(164, 188, 146)",
        "rgb(105, 145, 135)",
      ],
    },
    {
      themeID: "pillowTalk",
      themeTitle: "Pillow Talk",
      themeType: "light",
      themeCategory: "gradient",
      preview: [
        "rgb(227, 214, 236)",
        "rgb(255, 255, 255)",
        "rgb(225, 225, 225)",
        "rgb(234, 249, 253)",
        "rgb(45, 25, 25)",
      ],
    },
  ],
  animated: [
    {
      themeID: "starryMidnight",
      themeTitle: "Starry Midnight",
      themeType: "dark",
      themeCategory: "animated",
      preview: [
        "rgb(29, 9, 115)",
        "rgb(39, 9, 114)",
        "rgb(54, 8, 112)",
        "rgb(64, 8, 111)",
        "rgb(200, 200, 225)",
      ],
    },
  ],
};

function getThemeByID(themeArray, ID) {
  try {
    return themeArray.find(theme => theme.themeID === ID);
  } catch {
    return false;
  }
}

var fallbackTheme = getThemeByID(themeList.solid, loadedUserPreferences.defaultFallbackTheme);
var loadedLastTheme;
try {
  loadedLastTheme = getThemeByID(themeList[JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef].activeTheme[0]], JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef].activeTheme[1]);
} catch {
  loadedLastTheme = false;
}


if(loadedLastTheme) {
  document.body.classList.add(`${loadedLastTheme.themeID}_theme`);
  changeIconButtonColor(loadedLastTheme.themeType);

  currentActiveTheme = loadedLastTheme.themeID;
  currentActiveThemeType = loadedLastTheme.themeType;
  currentActiveThemeCategory = loadedLastTheme.themeCategory

  sessionStorage.setItem("lastUsedTheme", JSON.stringify([loadedLastTheme.themeCategory, loadedLastTheme.themeID]));
} else {
  setTimeout(() => {
    UI.error("Something went wrong finding that theme. Defaulting to fallback theme.");
  }, 500);

  currentActiveTheme = fallbackTheme.themeID;
  currentActiveThemeType = fallbackTheme.themeType;
  currentActiveThemeCategory = fallbackTheme.themeCategory;

  sessionStorage.setItem("lastUsedTheme", JSON.stringify([currentActiveThemeCategory, currentActiveTheme]));

  document.body.classList.add(`${fallbackTheme.themeID}_theme`);
  changeIconButtonColor(fallbackTheme.themeType);


}


function changeTheme(newTheme, themeType, themeCategory) {
  let currentGlobalStyle = [...document.body.classList].find(clss => clss.includes('_theme'));
  document.body.classList.replace(currentGlobalStyle, newTheme + "_theme")
  document.querySelectorAll(".themeMenu_themeSection_themeButton").forEach(element => {
    if(element.classList.contains("selectedMenuButton")) {
      element.classList.remove("selectedMenuButton");
    }
  });

  console.log(newTheme)
  console.log(themeType)
  console.log(themeCategory)
  currentActiveTheme = newTheme;
  currentActiveThemeType = themeType;
  currentActiveThemeCategory = themeCategory;

  document.getElementById(newTheme + "_themeButton").classList.add("selectedMenuButton");
  sessionStorage.setItem("lastUsedTheme", JSON.stringify([currentActiveThemeCategory, currentActiveTheme]));
  


  changeIconButtonColor(themeType);
}

function changeIconButtonColor(themeType) {
  document.querySelectorAll(".icon").forEach(icon => {
    let currentSRC = icon.src;
    if(themeType === "dark") {
      icon.src = currentSRC.replace("light", "dark");
      icon.classList.replace("iconButton_light", "iconButton_dark");
      } else if(themeType === "light") {
        icon.src = currentSRC.replace("dark", "light");
        icon.classList.replace("iconButton_dark", "iconButton_light");
    }
  });
}

var themeMenuElement = document.createElement("div");
themeMenuElement.id = "themeMenu";
themeMenuElement.classList.add("menu_color");

const themeMenuButton = document.getElementById("themeMenuButton");

function closeOpenThemeMenu(event) {
  if(document.getElementById("themeMenu") && (event.target.id !== "themeMenu" && event.target.id !== "themeMenuButton" && !event.target.classList.contains("menuSubElement"))) {
    document.getElementById("themeMenu").remove();
    document.removeEventListener("click", closeOpenThemeMenu);
  }
}

function generatePreview(previewArray) {
  let previewContent = "";
  if(previewArray.length === 0) {
    return "<p class='preview_noPreview'>No Preview</p>";
  } else {
    previewArray.forEach(color => {
      previewContent += `
      <div class="previewBar" style="background-color: ${color};"></div>
      `;
    })
    return previewContent;
  }
}

function loadThemeButtons(themeTreeRef) {
  let outputButtonListHTML = "";
  themeList[themeTreeRef].forEach(theme => {
    if(currentActiveTheme === theme.themeID) {
      outputButtonListHTML += `
        <div onclick="changeTheme('${theme.themeID}', '${theme.themeType}', '${theme.themeCategory}')" id="${theme.themeID}_themeButton" class="themeMenu_themeSection_themeButton selectedMenuButton menuSubElement themeMenu_themeSection_themeButton_color">
          <div class="previewContainer popup_color clickThrough">${generatePreview(theme.preview)}</div>
          <p class="themeMenu_themeSection_themeButton_themeTitle clickThrough">${theme.themeTitle}</p>
        </div>
      `;
    } else {
      outputButtonListHTML += `
        <div onclick="changeTheme('${theme.themeID}', '${theme.themeType}', '${theme.themeCategory}')" id="${theme.themeID}_themeButton" class="themeMenu_themeSection_themeButton menuSubElement themeMenu_themeSection_themeButton_color">
          <div class="previewContainer popup_color clickThrough">${generatePreview(theme.preview)}</div>
          <p class="themeMenu_themeSection_themeButton_themeTitle clickThrough">${theme.themeTitle}</p>
        </div>
      `;
    }
  });
  return outputButtonListHTML;
}

themeMenuButton.addEventListener("click", function openTheThemeMenu(event) {
  if(document.getElementById("themeMenu")) return;

  themeMenuElement.innerHTML = `
    <div id="themeMenu_categorySection" class="themeMenu_categorySection_color">
      <p id="solidTheme_CategoryButton" class="themeMenu_categorySection_text">Solid</p>
      <p id="gradientTheme_CategoryButton" class="themeMenu_categorySection_text">Gradient</p>
      <p id="animatedTheme_CategoryButton" class="themeMenu_categorySection_text">Animated</p>
      <p id="RequestTheme_button" class="themeMenu_categorySection_text">Request a new theme</p>
    </div>
    <div id="themeMenu_themeSection" class="themeMenu_themeSection_color">
    
    </div>
  `;
  document.body.appendChild(themeMenuElement);
  setTimeout(() => {
    try {
      document.getElementById("themeMenu").querySelectorAll('*').forEach(element => {element.classList.add("menuSubElement")})
  
  
      
      var solidTheme_CategoryButton = document.getElementById("solidTheme_CategoryButton");
      var gradientTheme_CategoryButton = document.getElementById("gradientTheme_CategoryButton");
      var animatedTheme_CategoryButton = document.getElementById("animatedTheme_CategoryButton");

      var themeCategoryButtonArray = [
        solidTheme_CategoryButton, 
        gradientTheme_CategoryButton,
        animatedTheme_CategoryButton,
      ];
  
      themeCategoryButtonArray.forEach(button => {
        if(button.classList.contains("selectedThemeCategory")) {
          button.classList.remove("selectedThemeCategory")
        }
      });

      switch(currentActiveThemeCategory) {
        case "solid":
          solidTheme_CategoryButton.classList.add("selectedThemeCategory");
          themeMenu_themeSection.innerHTML = loadThemeButtons("solid");
          break;
        case "gradient":
          gradientTheme_CategoryButton.classList.add("selectedThemeCategory");
          themeMenu_themeSection.innerHTML = loadThemeButtons("gradient");
          break;
        case "animated":
          animatedTheme_CategoryButton.classList.add("selectedThemeCategory");
          themeMenu_themeSection.innerHTML = loadThemeButtons("animated");
          break;

      }

  
      solidTheme_CategoryButton.onclick = function() {
        themeCategoryButtonArray.forEach(button => {
          if(button.classList.contains("selectedThemeCategory")) {
            button.classList.remove("selectedThemeCategory")
          }
        });
        solidTheme_CategoryButton.classList.add("selectedThemeCategory");
  
        themeMenu_themeSection.innerHTML = loadThemeButtons("solid");
  
      };
      gradientTheme_CategoryButton.onclick = function() {
        themeCategoryButtonArray.forEach(button => {
          if(button.classList.contains("selectedThemeCategory")) {
            button.classList.remove("selectedThemeCategory")
          }
        });
        gradientTheme_CategoryButton.classList.add("selectedThemeCategory");
  
        themeMenu_themeSection.innerHTML = loadThemeButtons("gradient");
      };
      animatedTheme_CategoryButton.onclick = function() {
        themeCategoryButtonArray.forEach(button => {
          if(button.classList.contains("selectedThemeCategory")) {
            button.classList.remove("selectedThemeCategory")
          }
        });
        animatedTheme_CategoryButton.classList.add("selectedThemeCategory");
  
        themeMenu_themeSection.innerHTML = loadThemeButtons("animated");
      };

      RequestTheme_button.onclick = function() {
        window.open("https://catxx1212.com/discord", "_blank");
      };
  
    } catch {
      // UI.warn("Unable to attach themeMenu to themeMenu container. You clicked out of the menu too fast.")
    }
  }, 100);

  document.addEventListener("click", closeOpenThemeMenu, true);
  event.stopPropagation();
});



// style


var styleList = [
  {
    styleID: "small",
    title: "Small Font",
  },
  {
    styleID: "smallBold",
    title: "Small Bold Font",
  },
  {
    styleID: "normal",
    title: "Normal Font",
  },
  {
    styleID: "normalBold",
    title: "Normal Bold Font",
  },
  {
    styleID: "large",
    title: "Large Font",
  },
  {
    styleID: "largeBold",
    title: "Large Bold Font",
  },
];

function checkSavedStyleAgainstStyleList(styleID) {
  try {
    return styleList.find(style => style.styleID === styleID) !== undefined;
  } catch {
    return false;
  }
}


var fallbackGlobalStyle = "normal";
var loadedLastUsedGlobalStyle;
try {
  loadedLastUsedGlobalStyle = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef].activeGlobalStyle;

} catch {
  loadedLastUsedGlobalStyle = null;
}

if(loadedLastUsedGlobalStyle !== null && checkSavedStyleAgainstStyleList(loadedLastUsedGlobalStyle)) {
  document.body.classList.add(`${loadedLastUsedGlobalStyle}_globalStyle`);
  sessionStorage.setItem("lastUsedGlobalStyle", loadedLastUsedGlobalStyle);
  currentActiveGlobalStyle = loadedLastUsedGlobalStyle;
} else {
  setTimeout(() => {
    UI.error("Something went wrong finding that globalStyle. Defaulting to fallback style.");
  }, 500);
  sessionStorage.setItem("lastUsedGlobalStyle", fallbackGlobalStyle);
  document.body.classList.add(`${fallbackGlobalStyle}_globalStyle`);
  currentActiveGlobalStyle = fallbackGlobalStyle;
}

function changeGlobalStyle(styleID) {
  // console.log("new style: " + styleID)
  let currentGlobalStyle = [...document.body.classList].find(clss => clss.includes('_globalStyle'));
  // console.log("current style: " + currentGlobalStyle)
  document.body.classList.replace(currentGlobalStyle, styleID + "_globalStyle")
  document.querySelectorAll(".globalStlyeMenu_buttonSection_styleButton").forEach(element => {
    if(element.classList.contains("selectedMenuButton")) {
      element.classList.remove("selectedMenuButton");
    }
  });
  document.getElementById(styleID + "_globalStyleButton").classList.add("selectedMenuButton");
  sessionStorage.setItem("lastUsedGlobalStyle", styleID);
  
  currentActiveGlobalStyle = styleID;
}




function loadGlobalStyleButtons() {
  let outputButtonListHTML = "";
  styleList.forEach(globalStyle => {
    if(currentActiveGlobalStyle === globalStyle.styleID) {
      outputButtonListHTML += `
        <div onclick="changeGlobalStyle('${globalStyle.styleID}')" id="${globalStyle.styleID}_globalStyleButton" class="globalStlyeMenu_buttonSection_styleButton selectedMenuButton menuSubElement globalStlyeMenu_buttonSection_styleButton_color">
          <p class="globalStlyeMenu_buttonSection_text clickThrough">${globalStyle.title}</p>
        </div>
      `;
    } else {
      outputButtonListHTML += `
        <div onclick="changeGlobalStyle('${globalStyle.styleID}')" id="${globalStyle.styleID}_globalStyleButton" class="globalStlyeMenu_buttonSection_styleButton menuSubElement globalStlyeMenu_buttonSection_styleButton_color">
          <p class="globalStlyeMenu_buttonSection_text clickThrough">${globalStyle.title}</p>
        </div>
      `;
    }
  });
  return outputButtonListHTML;
}

var globalStyleMenu = document.createElement("div");
globalStyleMenu.id = "globalStyleMenu";
globalStyleMenu.classList.add("menu_color");

const globalStyleMenuButton = document.getElementById("globalStyleMenuButton");


function closeGlobalStyleMenu(event) {
  if(document.getElementById("globalStyleMenu") && (event.target.id !== "globalStyleMenu" && event.target.id !== "globalStyleMenuButton" && !event.target.classList.contains("menuSubElement"))) {
    document.getElementById("globalStyleMenu").remove();
    document.removeEventListener("click", closeGlobalStyleMenu);
  }
}

globalStyleMenuButton.addEventListener("click", function openTheGlobalStyleMenu(event) {
  if(document.getElementById("globalStyleMenu")) return;

  globalStyleMenu.innerHTML = `
    <div id="globalStyleMenu_buttonSection" class="globalStyleMenu_buttonSection_color">

    </div>
  `;
  document.body.appendChild(globalStyleMenu);
  setTimeout(() => {
    try {
      document.getElementById("globalStyleMenu").querySelectorAll('*').forEach(element => {element.classList.add("menuSubElement")})
  
      document.getElementById("globalStyleMenu_buttonSection").innerHTML = loadGlobalStyleButtons();

    } catch {
      // UI.warn("Unable to attach globalStyleMenu to globalStyleMenu container. You clicked out of the menu too fast.")
    }
  }, 100);

  document.addEventListener("click", closeGlobalStyleMenu, true);
  event.stopPropagation();
});

const importExportButton = document.getElementById("importExportButton");

function timeAndDateOfExport() {
  if(loadedUserPreferences.appendTimeAndDateToFileExport === "disabled") return "";
  let timeAndDate = new Date();
  return `_${timeAndDate.getDate().toString().padStart(2, "0")}_${(timeAndDate.getMonth() + 1).toString().padStart(2, "0")}_${timeAndDate.getFullYear()}___${timeAndDate.getHours().toString().padStart(2, "0")}_${timeAndDate.getMinutes().toString().padStart(2, "0")}`; 
}

function downloadTextFile(fileContent, fileTitle, filePrefix) {
    let newBlob = new Blob([fileContent], { type: 'text/plain' });
    let url = URL.createObjectURL(newBlob);
    let download = document.createElement('a');

    download.href = url;
    download.download = fileTitle + filePrefix + timeAndDateOfExport() + ".storylinenotepad";
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    URL.revokeObjectURL(url);
}

var importExportElement = document.createElement("div");
importExportElement.id = "importExportElement";
importExportElement.classList.add("footer_color", "popup_color");
importExportElement.innerHTML = `
  <img id="popupElement_closeButton" src="../assets/closeButton.png" title="Close"/>
  <p class="importExport_title">Import or Export Menu</p>
  <div class="exportDiv exportDiv_color">
    <div id="exportButton_currentActiveStoryline" class="importExportMenu_buttons_color button importExportButton">
      <p class="exportButton_currentActiveStoryline_text">Export Current Storyline</p>
    </div>
    <!-- <div id="exportButton_allData" class="exportDiv_buttons_color button exportButton">
      <p class="exportButton_allData_text">Export All Your Data</p>
    </div> -->
  </div>
  <div class="importDiv importDiv_color">
  <div id="importButton_storyline_fileImport" class="importExportMenu_buttons_color button importExportButton">
    <p class="importButton_storyline_text">Import Storyline From File</p>
    <input id="importButton_storyline_fileInput" type="file" style="display: none;"/>
  </div>
  <div id="importButton_storyline_textImport" class="importExportMenu_buttons_color button importExportButton">
    <p class="importButton_storyline_text">Import Storyline From text (v0.2)</p>
  </div>
  </div>
`;

var popUpMainElement_importExport = document.createElement("div");
popUpMainElement_importExport.classList.add("popUpBackground");
popUpMainElement_importExport.id = "popUpMainElement_importExport";
popUpMainElement_importExport.appendChild(importExportElement);


importExportButton.addEventListener("click", function() {
  document.body.appendChild(popUpMainElement_importExport);

  setTimeout(() => {
    document.addEventListener("click", function(event) {
      if(event.target.id === "popupElement_closeButton" || event.target.id === "popUpMainElement_importExport") {
        popUpMainElement_importExport.remove();
      }
    });

    document.getElementById("exportButton_currentActiveStoryline").onclick = function() {
      saveDataForCurrentStoryline();
      
      setTimeout(() => {
        let storylineNotepad_global_getCurrentSaveData = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];

        if(storylineNotepad_global_getCurrentSaveData === undefined || storylineNotepad_global_getCurrentSaveData.storylineTitle === undefined) {
          UI.warn("You can't export nothing!!");
          return;
        } 
        downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData), storylineNotepad_global_getCurrentSaveData.storylineTitle.replace(/ /g, "_") , "");
      }, 250);
    };
    // document.getElementById("exportButton_allData").onclick = function() {
    //   saveDataForCurrentStoryline();
    //   let getFileTitle = prompt("Enter a filename for your export file: (required)");
    //   if(getFileTitle === "" || getFileTitle === undefined || getFileTitle === null) return;

    //   setTimeout(() => {
    //     let storylineNotepad_global_getAll = JSON.parse(localStorage.getItem("storylineNotepad_global"));
    //     downloadTextFile(JSON.stringify(storylineNotepad_global_getAll), getFileTitle, "_ALL");
    //   }, 250);
    // };


    document.getElementById("importButton_storyline_fileImport").onclick = function() {
      document.getElementById("importButton_storyline_fileInput").click();
    };

    document.getElementById("importButton_storyline_fileInput").onchange = async function(event) {
      let importedFile = event.target.files[0];
      if (importedFile) {
        let fileExtension = importedFile.name.split('.').pop().toLowerCase();
        if (fileExtension !== "storylinenotepad") {
            UI.error("Invalid file type. Only '.storylinenotepad' is allowed.");
            return;
        }
        await new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = function(event) {
              let storylineImportData = JSON.parse(event.target.result);
              window.removeEventListener("beforeunload" , beforeUnloadEvent);
              let storylineNotepad_global_getCurrentSaveData = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
              if(storylineNotepad_global_getCurrentSaveData === undefined || storylineNotepad_global_getCurrentSaveData.storylineTitle === undefined) {
                // console.log("nothing to export, skipping export")
              } else {
                if(loadedUserPreferences.autoExportWhenImporting === "enabled") downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData), storylineNotepad_global_getCurrentSaveData.storylineTitle.replace(/ /g, "_") , "_backup");
              }
              setTimeout(() => {
                let storylineNotepad_global_overwriteCurrentStoryline = JSON.parse(localStorage.getItem("storylineNotepad_global"));
                storylineNotepad_global_overwriteCurrentStoryline.storylineSaves[currentActiveSaveRef] = storylineImportData;
                localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_overwriteCurrentStoryline));
                setTimeout(() => {
                  location.reload();
                }, 150);
              }, 150);
            resolve();
          };
          reader.onerror = function(error) {
              UI.error("An error occurred while reading the file", error);
              reject();
          };
          reader.readAsText(importedFile);
        });

      }
    };

    document.getElementById("importButton_storyline_textImport").onclick = function() {
      var importData_text = prompt("Please paste your storyline export data here:");

      var convertedData;

      if(importData_text === null || importData_text === "") return;
      
      try {
        let v0_2ExportData = JSON.parse(importData_text);
        convertedData = {
          versionNumber: "0.3.0",
          textData: [],
          storylineTitle: v0_2ExportData.storylineTitle,
          activeTheme: ["solid", "white"],
          activeGlobalStyle: "normal"
        }
    
        for(let [key, value] of Object.entries(v0_2ExportData.textData)) {
          convertedData.textData.push({
            storyboxNumber: convertedData.textData.length,
            storyBoxTextContent: value
          });
        }
        window.removeEventListener("beforeunload" , beforeUnloadEvent);
        let storylineNotepad_global_getCurrentSaveData = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
        if(storylineNotepad_global_getCurrentSaveData === undefined || storylineNotepad_global_getCurrentSaveData.storylineTitle === undefined) {
          // console.log("nothing to export, skipping export");
        } else {
          if(loadedUserPreferences.autoExportWhenImporting === "enabled") downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData), storylineNotepad_global_getCurrentSaveData.storylineTitle.replace(/ /g, "_") , "_backup");
        }
        setTimeout(() => {
          let storylineNotepad_global_overwriteCurrentStoryline = JSON.parse(localStorage.getItem("storylineNotepad_global"));
          storylineNotepad_global_overwriteCurrentStoryline.storylineSaves[currentActiveSaveRef] = convertedData;
          localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_overwriteCurrentStoryline));
          setTimeout(() => {
            location.reload();
          }, 150);
        }, 150);
      } catch(e) {
        UI.error("Error converting your v0.2 export data into v0.3: <br/><br/> " + e)
        return;
      }
    };
  }, 150);
});

// save button


const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function() {
  saveDataForCurrentStoryline()
  this.classList.add("flashGreen")
  this.onanimationend = function() {
    this.classList.remove("flashGreen");
  };
});

document.addEventListener("keydown", function(event) {
  if((event.ctrlKey || event.metaKey) && (event.key === "s" || event.key === "S")) {
    event.preventDefault();
    saveDataForCurrentStoryline()
    saveButton.classList.add("flashGreen")
    saveButton.onanimationend = function() {
      saveButton.classList.remove("flashGreen");
    };
  }
});

// scroll sideways default

document.querySelector("main").addEventListener("wheel", function(event) {
  if(event.deltaY !== 0) {
      // event.preventDefault();
      this.scrollLeft += event.deltaY;
  }
}, {passive: true});


// resize checker

function checkWindowSize() {
  if(window.innerHeight > window.innerWidth) {
    var wrongScreenAspectRatioElement = document.createElement("div");
    if(!document.getElementById("wrongScreenAspectRatioElement")) {
      wrongScreenAspectRatioElement.classList.add("wrongScreenAspectRatioElement", "header_color");
      wrongScreenAspectRatioElement.innerHTML = `
        <p class="wrongScreenAspectRatioElement_firstText">Hold on a second</p>
        <p class="wrongScreenAspectRatioElement_lastText">Your screen height is larger than your screen width. Storyline Notepad was designed for laptop / monitors. Maybe in a future version _(0.0)/ </p>
      `;
      wrongScreenAspectRatioElement.id = "wrongScreenAspectRatioElement";
      document.body.appendChild(wrongScreenAspectRatioElement);
    }
  } else {
    if(document.getElementById("wrongScreenAspectRatioElement")) {
      setTimeout(() => {
        try {
          document.getElementById("wrongScreenAspectRatioElement").remove();
        } catch {}
      }, 150);
    }
  }
}
window.addEventListener("resize", checkWindowSize);
checkWindowSize();


// update alert

var newUpdateElement = document.createElement("div");
newUpdateElement.id = "newUpdateElement";
newUpdateElement.classList.add("footer_color", "popup_color");
newUpdateElement.innerHTML = `
  <img id="popupElement_closeButton" src="../assets/closeButton.png" title="Close"/>
  <p class="newUpdateElement_heading">Storyline Notepad has been updated!</p>
  <p class="newUpdateElement_version">Version 0.5.0 => 0.5.1</p>
  <p class="newUpdateElement_subHeading">Here are some highlights of this update:</p>
  <ul class="newUpdateElement_list">
    <li>Added a new theme: Starry Midnight.</li>
    <li>Theme requests are now open!</li>
    <li>Small fixes to window size checker.</li>
  </ul>
  <div class="bottomOfNewUpdateElement">
    <a href="changelog.html">
      <div class="seeChangelogButton importExportMenu_buttons_color">
        <p>See full changelog</p>
      </div>
    </a>
    <p class="newUpdateElement_text1 header_textColor">I hope these updates make it a better experience for you. <br/> Have a nice day as well!!</p>
  </div>
`;


var popUpMainElement_newUpdate = document.createElement("div");
popUpMainElement_newUpdate.classList.add("popUpBackground");
popUpMainElement_newUpdate.id = "popUpMainElement_newUpdate";
popUpMainElement_newUpdate.appendChild(newUpdateElement);



if(localStorage.getItem("newUpdate_flip1") || localStorage.getItem("newUpdate_flip2")) {
  localStorage.removeItem("newUpdate_flip1");
  localStorage.removeItem("newUpdate_flip2");
}

if(localStorage.getItem("newUpdate_flip") !== currentVersionNumber) {
  document.body.appendChild(popUpMainElement_newUpdate);
  setTimeout(() => {
    document.addEventListener("click", function(event) {
      if(event.target.id === "popupElement_closeButton" || event.target.id === "popUpMainElement_newUpdate") {
        popUpMainElement_newUpdate.remove();
      }
    });
  }, 150);
  localStorage.setItem("newUpdate_flip", currentVersionNumber);
}



// weekly reminder

function resetWeeklyTimer(mainObject) {
  mainObject.lastTimeStamp = Date.now();
  // mainObject.lastTimeStamp = new Date("2024-07-08T12:00:00").getTime();
  localStorage.setItem("storylineNotepad_global", JSON.stringify(mainObject));
}

let storylineNotepad_global_getLastTimeStamp = JSON.parse(localStorage.getItem("storylineNotepad_global"));

if (!storylineNotepad_global_getLastTimeStamp || storylineNotepad_global_getLastTimeStamp.lastTimeStamp === undefined) {
  resetWeeklyTimer(storylineNotepad_global_getLastTimeStamp);
} else {

  // let futureDate = new Date("2025-07-08T12:00:00");
  let currentDate = new Date()

  let oneWeek = 7 * 24 * 60 * 60 * 1000;

  if ((currentDate.getTime() - storylineNotepad_global_getLastTimeStamp.lastTimeStamp) >= oneWeek) {
    setTimeout(() => {
      UI.message("This is a weekly reminder to do a hard reload. This ensures you have the latest version :)");
      let storylineNotepad_global_setLastTimeStamp = JSON.parse(localStorage.getItem("storylineNotepad_global"));
      resetWeeklyTimer(storylineNotepad_global_setLastTimeStamp);
    }, 500);
  }
}










// contextMenu stuff

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});

function contextMenuForStoryboxes(event) {
  event.stopPropagation();
}

var baseContextMenu = document.createElement("div");
baseContextMenu.classList.add("baseContextMenu", "contextMenu_color");
baseContextMenu.id = "contextMenu";

function showContextMenu(locationOfClick, event, UID) {
  event.preventDefault();
  switch(locationOfClick) {
    case "addRemove": 
      baseContextMenu.innerHTML = `
        <p class="contextMenu_buttons contextMenu_buttons_color" onclick="addBoxToTheRightOrLeft(${UID}, 'left')">Add box to the left</p>
        <p class="contextMenu_buttons contextMenu_buttons_color" onclick="addBoxToTheRightOrLeft(${UID}, 'right')">Add box to the right</p>
        <p class="contextMenu_buttons contextMenu_buttons_color" onclick="removeBoxToTheLeft(${UID})">Remove box to the left</p>
        <!--<p class="contextMenu_buttons contextMenu_buttons_color" onclick=""></p> -->
      `;
      break;
  }

  document.body.appendChild(baseContextMenu);
  contextMenu.style.left = `${event.pageX}px`;
  contextMenu.style.top = `${event.pageY}px`;

    document.addEventListener("click", function removeContextMenu() {
     if(document.getElementById("contextMenu")) {
      document.removeEventListener("click", removeContextMenu);
      document.getElementById("contextMenu").remove();
      }
    });
}

function removeBoxToTheLeft(UID) {
  document.getElementById("box" + UID).remove();
}

function addBoxToTheRightOrLeft(UID, side) {
  let storyBox = `
  <div class="box_container" id="box${generateUID(true)}">
    <div class="storyBox storyBox_color">
      <textarea class="text storyBox_innerColor" id="textarea${generateUID()}" oncontextmenu="contextMenuForStoryboxes(event)" placeholder="Start typing:"></textarea>
    </div>
    <div class="arrow" oncontextmenu="showContextMenu('addRemove', event, ${generateUID()})" title="Right click for more options">
      <img src="../assets/icons/arrow_${currentActiveThemeType}.png"/>
    </div>
  </div>`;
  switch(side) {
    case "left":
      document.getElementById("box" + UID).insertAdjacentHTML("beforebegin", storyBox);
      break;
    case "right":
      document.getElementById("box" + UID).insertAdjacentHTML("afterend", storyBox);
      break;
  }
}



// right drop down menu

var rightDropDownMenu = document.createElement("div");
rightDropDownMenu.id = "rightDropDownMenu";
rightDropDownMenu.classList.add("menu_color", "globalStyleMenu_buttonSection_color");

const rightDropDownMenuButton = document.getElementById("rightDropDownMenuButton");


function closeRightDropDownMenu(event) {
  if(document.getElementById("rightDropDownMenu") && (event.target.id !== "rightDropDownMenu" && !event.target.classList.contains("menuSubElement"))) {
    rightDropDownMenuButton.classList.toggle("rightDropDownMenuButton_rotated");
    document.getElementById("rightDropDownMenu").remove();
    document.removeEventListener("click", closeRightDropDownMenu);
  }
}

rightDropDownMenuButton.addEventListener("click", function openRightDropDownMenu(event) {
  
  if(document.getElementById("rightDropDownMenu")) return;
  
  rightDropDownMenuButton.classList.toggle("rightDropDownMenuButton_rotated");
  rightDropDownMenu.innerHTML = `
    <img id="userPreferencesButton" class="icon button iconButton_${currentActiveThemeType}" src="../assets/icons/settingsIcon_${currentActiveThemeType}.png" title="User preferences"/>
    <img id="clearDataButton" class="icon button iconButton_${currentActiveThemeType}" src="../assets/icons/clearAllButton_${currentActiveThemeType}.png" title="Clear current storyline"/>
  `;
  document.body.appendChild(rightDropDownMenu);
  setTimeout(() => {
    try {
      // document.getElementById("rightDropDownMenu").querySelectorAll('*').forEach(element => {element.classList.add("menuSubElement")})
      


      // user preferences menu

      function get_addTimeAndDateToFileExportData() {
        // console.log(loadedUserPreferences.appendTimeAndDateToFileExport);
        if(loadedUserPreferences.appendTimeAndDateToFileExport !== "enabled" && loadedUserPreferences.appendTimeAndDateToFileExport !== "disabled") {

          let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
          storylineNotepad_global_setUserPreferences.userPreferences.appendTimeAndDateToFileExport = "enabled";
          localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
          addTimeGapForUserPreferences();

          return  `
            <option selected value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          `;
        }
        switch(loadedUserPreferences.appendTimeAndDateToFileExport) {
          case "enabled":
            return  `
              <option selected value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            `;
          case "disabled":
            return  `
              <option value="enabled">Enabled</option>
              <option selected value="disabled">Disabled</option>
            `;
        }
      };

      function get_defaultFallbackTheme() {
        // console.log(loadedUserPreferences.defaultFallbackTheme);
        if(loadedUserPreferences.defaultFallbackTheme !== "white" && loadedUserPreferences.defaultFallbackTheme !== "black") {

          let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
          storylineNotepad_global_setUserPreferences.userPreferences.defaultFallbackTheme = "white";
          localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
          addTimeGapForUserPreferences();

          return  `
            <option selected value="white">White</option>
            <option value="black">Black</option>
          `;
        }
        switch(loadedUserPreferences.defaultFallbackTheme) {
          case "white":
            return  `
              <option selected value="white">White</option>
              <option value="black">Black</option>
            `;
          case "black":
            return  `
              <option value="white">White</option>
              <option selected value="black">Black</option>
            `;
        }
      };

      function get_autoExportWhenImporting() {
        console.log(loadedUserPreferences.autoExportWhenImporting);
        if(loadedUserPreferences.autoExportWhenImporting !== "enabled" && loadedUserPreferences.autoExportWhenImporting !== "disabled") {

          let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
          storylineNotepad_global_setUserPreferences.userPreferences.autoExportWhenImporting = "enabled";
          localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
          addTimeGapForUserPreferences();

          return  `
            <option selected value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          `;
        }
        switch(loadedUserPreferences.autoExportWhenImporting) {
          case "enabled":
            return  `
              <option selected value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            `;
          case "disabled":
            return  `
              <option value="enabled">Enabled</option>
              <option selected value="disabled">Disabled</option>
            `;
        }
      };
      document.getElementById("userPreferencesButton").onclick = function() {
        var userPreferencesElement = document.createElement("div");
        userPreferencesElement.id = "userPreferencesElement";
        userPreferencesElement.classList.add("footer_color", "popup_color");
        userPreferencesElement.innerHTML = `
          <img id="popupElement_closeButton" src="../assets/closeButton.png" title="Close"/>
          <p class="userPreferencesElement_title">User Preferences</p>
          <p class="userPreferencesElement_subtitle">Hover over each option for more details.</p>
          <div class="userPreferencesElement_optionsContainer">

            <div class="userPreferencesElement_inputWrapper" title="Choose whether to add the time and date of export to the file name">
            
              <lable for="userPreferenceInput_addTimeAndDateToFileExport">Append Time And Date To File Export:</lable>
              <select id="userPreferenceInput_addTimeAndDateToFileExport" class="userPreferenceInput">
                ${get_addTimeAndDateToFileExportData()}
              </select>

            </div>
            <div class="userPreferencesElement_inputWrapper" title="When a theme can't be loaded or when you start a new storyline, choose a default theme. Also effects the save slot screen.">

              <lable for="userPreferenceInput_fallbackTheme">Fallback theme:</lable>
              <select id="userPreferenceInput_fallbackTheme" class="userPreferenceInput">
                ${get_defaultFallbackTheme()}
              </select>

            </div>
            <div class="userPreferencesElement_inputWrapper"  title="WARNING: You will permanently lose the storyline you're overwriting if you disable this.">

              <lable for="userPreferenceInput_autoExportWhenImporting">Auto export when importing:</lable>
              <select id="userPreferenceInput_autoExportWhenImporting" class="userPreferenceInput">
                ${get_autoExportWhenImporting()}
              </select>
            </div>

          </div>
        `;

        var popUpMainElement_userPreferences = document.createElement("div");
        popUpMainElement_userPreferences.classList.add("popUpBackground");
        popUpMainElement_userPreferences.id = "popUpMainElement_userPreferences";
        popUpMainElement_userPreferences.appendChild(userPreferencesElement);

        document.body.appendChild(popUpMainElement_userPreferences);

        setTimeout(() => {
          document.addEventListener("click", function(event) {
            if(event.target.id === "popupElement_closeButton" || event.target.id === "popUpMainElement_userPreferences") {
              popUpMainElement_userPreferences.remove();
            }
          });

          var userPreferenceInput_addTimeAndDateToFileExport = document.getElementById("userPreferenceInput_addTimeAndDateToFileExport");
          var userPreferenceInput_fallbackTheme = document.getElementById("userPreferenceInput_fallbackTheme");
          var userPreferenceInput_autoExportWhenImporting = document.getElementById("userPreferenceInput_autoExportWhenImporting");
          
          userPreferenceInput_fallbackTheme.onchange = function() {
            let changedValue = userPreferenceInput_fallbackTheme.value;
            loadedUserPreferences.defaultFallbackTheme = changedValue;
            let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
            storylineNotepad_global_setUserPreferences.userPreferences.defaultFallbackTheme = changedValue;
            localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
            addTimeGapForUserPreferences();
          };
          
          userPreferenceInput_addTimeAndDateToFileExport.onchange = function() {
            let changedValue = userPreferenceInput_addTimeAndDateToFileExport.value;
            loadedUserPreferences.appendTimeAndDateToFileExport = changedValue;
            let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
            storylineNotepad_global_setUserPreferences.Preferences.appendTimeAndDateToFileExport = changedValue;
            localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
            addTimeGapForUserPreferences();
          };

          userPreferenceInput_autoExportWhenImporting.onchange = function() {
            let changedValue = userPreferenceInput_autoExportWhenImporting.value;
            loadedUserPreferences.autoExportWhenImporting = changedValue;
            let storylineNotepad_global_setUserPreferences = JSON.parse(localStorage.getItem("storylineNotepad_global"));
            storylineNotepad_global_setUserPreferences.userPreferences.autoExportWhenImporting = changedValue;
            localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_setUserPreferences));
            addTimeGapForUserPreferences();
          };

        }, 100);
      };


      // clear all button

      function clearAllData() {
        const askIfUserWantsToClearCurrentStroyline = confirm("Are you sure you want to clear your current storyline?");
        if(askIfUserWantsToClearCurrentStroyline) {
          saveDataForCurrentStoryline();
          window.removeEventListener("beforeunload" , beforeUnloadEvent);
          let askIfUserWantsToBackup = confirm("Would you like to backup your current storyline?");
          if(askIfUserWantsToBackup) {

            let storylineNotepad_global_getCurrentSaveData_clearAll = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
            if(storylineNotepad_global_getCurrentSaveData_clearAll === undefined || storylineNotepad_global_getCurrentSaveData_clearAll.storylineTitle === undefined) {
              UI.warn("You can't export nothing!!");
              return;
            } 
            downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData_clearAll), storylineNotepad_global_getCurrentSaveData_clearAll.storylineTitle.replace(/ /g, "_") , "_backup");

          }
          setTimeout(() => {
            let storylineNotepad_global_clearStorylineNotepadData = JSON.parse(localStorage.getItem("storylineNotepad_global"));
            delete storylineNotepad_global_clearStorylineNotepadData.storylineSaves[currentActiveSaveRef];
            localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_clearStorylineNotepadData));

            setTimeout(() => {
              location.href = "saveSlots.html";
            }, 150);
          }, 150);
        }
      }

      document.getElementById("clearDataButton").onclick = function() {
        clearAllData("clearAllData");
      };

    } catch {
      // UI.warn("unable to attach event listener to rightDropDownMenu container. This is a peaceful error so its ok")
    }
  }, 100);

  document.addEventListener("click", closeRightDropDownMenu, true);
  event.stopPropagation();
});


function addTimeGapForUserPreferences() {
  document.querySelectorAll("select").forEach((element) => {
    element.disabled = true;
  });
  setTimeout(() => {
    document.querySelectorAll("select").forEach((element) => {
      element.disabled = false;
    });
  }, 500);
}





// UI messages, warnings, and error notifications

const UImessageContainer = document.getElementById("UImessageContainer");


function slideOutUINotification(notificationMain) {
  notificationMain.classList.replace("UImessage_slideIn", "UImessage_slideOut");
  notificationMain.onanimationend = function() { notificationMain.remove(); };
}

var UI = {
  message: function(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("UImessage", "contextMenu_color", "UImessage_slideIn");
    messageElement.innerHTML = `
      <div class="UImessage_iconContainer">
        <img title="message" src="../assets/icons/messageIcon_${currentActiveThemeType}.png" class="icon"/>
      </div>
      <p class="UImessage_text">${message}</p>
      <div class="UImessage_closeButtonContainer">
        <img class="icon button iconButton_dark" title="Close" src="../assets/icons/otherCloseButton_${currentActiveThemeType}.png" onclick="slideOutUINotification(this.parentElement.parentElement)"/>
      </div>
    `;
    UImessageContainer.appendChild(messageElement);

  },
  warn: function(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("UImessage", "contextMenu_color", "UImessage_slideIn");
    messageElement.innerHTML = `
      <div class="UImessage_iconContainer">
        <img title="warning" src="../assets/icons/warningIcon_${currentActiveThemeType}.png" class="icon"/>
      </div>
      <p class="UImessage_text">${message}</p>
      <div class="UImessage_closeButtonContainer">
        <img class="icon button iconButton_dark" title="Close" src="../assets/icons/otherCloseButton_${currentActiveThemeType}.png" onclick="slideOutUINotification(this.parentElement.parentElement)"/>
      </div>
    `;
    UImessageContainer.appendChild(messageElement);
  },
  error: function(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("UImessage", "contextMenu_color", "UImessage_slideIn");
    messageElement.innerHTML = `
      <div class="UImessage_iconContainer">
        <img title="error" src="../assets/icons/errorIcon_${currentActiveThemeType}.png" class="icon"/>
      </div>
      <p class="UImessage_text">${message}</p>
      <div class="UImessage_closeButtonContainer">
        <img class="icon button iconButton_dark" title="Close" src="../assets/icons/otherCloseButton_${currentActiveThemeType}.png" onclick="slideOutUINotification(this.parentElement.parentElement)"/>
      </div>
    `;
    UImessageContainer.appendChild(messageElement);
  },
};