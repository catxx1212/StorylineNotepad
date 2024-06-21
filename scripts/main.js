const currentActiveSaveRef = 0;

var currentActiveTheme = "";
var currentActiveThemeType = "";
var currentActiveThemeCategory = "";

var currentActiveGlobalStyle = "";


if(!localStorage.getItem("storylineNotepad_global")) {
  let defaultStorylineNotepad_globalObject = {
    storylineSaves: {

    },
  };
  localStorage.setItem("storylineNotepad_global", JSON.stringify(defaultStorylineNotepad_globalObject));
}

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
  alert("something went wrong with loading your data, This is most likey because of incorrect import data. Please try again. If this does not work, then report the issue. Error code: 2")
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

storylineTitle.addEventListener("click" , () => {
  let newTitle = prompt("New Title:");
  if(newTitle === null) return;
  if(newTitle.trim() !== ``) {
    if(newTitle.length >= 40) {
      alert("Storyline title too large. Must be under 40 characters.");
      return;
    }
    storylineTitle.textContent = newTitle;
    sessionStorage.setItem("savedStorylineTitle" , newTitle)
  }
});


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
      alert("There was an issue saving, please don't close or refresh page and try again. Error code: 1")
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

addNewStoryboxButton.addEventListener("click" , () => {

  let storyBox = `
    <div class="box_container" id="box${generateUID(true)}">
      <div class="storyBox storyBox_color">
        <textarea class="text storyBox_innerColor" id="textarea${generateUID()}" placeholder="Start typing:"></textarea>
      </div>
      <div class="arrow" oncontextmenu="showContextMenu('addRemove', event, ${generateUID()})" title="Right click for more options">
        <img src="../assets/icons/arrow_${currentActiveThemeType}.png"/>
      </div>
    </div>`;

    storyBoxSection.insertAdjacentHTML("beforeend" , storyBox);

    reloadWindowEventListener();
});

function removeStoryBox(id) {
  const removeLastStoryBox = document.getElementById(id);
  if(removeLastStoryBox) {
    removeLastStoryBox.remove();
  }
};


// clear all button


const clearDataButton = document.getElementById("clearDataButton");

function clearAllData() {
  const askIfUserWantsToClearCurrentStroyline = confirm("Are you sure you want to clear your current storyline?");
  if(askIfUserWantsToClearCurrentStroyline) {
    saveDataForCurrentStoryline();
    window.removeEventListener("beforeunload" , beforeUnloadEvent);
    let askIfUserWantsToBackup = confirm("Would you like to backup your current storyline?");
    if(askIfUserWantsToBackup) {

      let storylineNotepad_global_getCurrentSaveData_clearAll = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
      if(storylineNotepad_global_getCurrentSaveData_clearAll === undefined || storylineNotepad_global_getCurrentSaveData_clearAll.storylineTitle === undefined) {
        alert("You can't export nothing!!");
        return;
      } 
      downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData_clearAll), storylineNotepad_global_getCurrentSaveData_clearAll.storylineTitle.replace(/ /g, "_") , "_backup");

    }
    setTimeout(() => {
      let storylineNotepad_global_clearStorylineNotepadData = JSON.parse(localStorage.getItem("storylineNotepad_global"));
      delete storylineNotepad_global_clearStorylineNotepadData.storylineSaves[currentActiveSaveRef];
      localStorage.setItem("storylineNotepad_global", JSON.stringify(storylineNotepad_global_clearStorylineNotepadData));

      setTimeout(() => {
        location.reload();
      }, 150);
    }, 150);
  }
}

clearDataButton.addEventListener("click" , () => {
  clearAllData("clearAllData");
});


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
  ],
};

function getThemeByID(themeArray, ID) {
  try {
    return themeArray.find(theme => theme.themeID === ID);
  } catch {
    return false;
  }
}

var fallbackTheme = getThemeByID(themeList.solid, "white");
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
  console.error("Something went wrong finding that theme. Defaulting to fallback theme.");
  sessionStorage.setItem("lastUsedTheme", JSON.stringify(["solid", "white"]));

  document.body.classList.add(`${fallbackTheme.themeID}_theme`);
  changeIconButtonColor(fallbackTheme.themeType);

  currentActiveTheme = fallbackTheme.themeID;
  currentActiveThemeType = fallbackTheme.themeType;
  currentActiveThemeCategory = fallbackTheme.themeCategory;
}


function changeTheme(newTheme, themeType, themeCategory) {
  let currentGlobalStyle = [...document.body.classList].find(clss => clss.includes('_theme'));
  document.body.classList.replace(currentGlobalStyle, newTheme + "_theme")
  document.querySelectorAll(".themeMenu_themeSection_themeButton").forEach(element => {
    if(element.classList.contains("selectedMenuButton")) {
      element.classList.remove("selectedMenuButton");
    }
  });
  document.getElementById(newTheme + "_themeButton").classList.add("selectedMenuButton");
  sessionStorage.setItem("lastUsedTheme", JSON.stringify([themeCategory, newTheme]));
  
  currentActiveTheme = newTheme;
  currentActiveThemeType = themeType;
  currentActiveThemeCategory = themeCategory;

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

      var themeCategoryButtonArray = [
        solidTheme_CategoryButton, 
        gradientTheme_CategoryButton
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
  
    } catch {
      console.log("unable to attach themeMenu to themeMenu container. This is a peaceful error so its ok")
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
  console.error("Something went wrong finding that globalStyle. Defaulting to fallback style.");
  sessionStorage.setItem("lastUsedGlobalStyle", fallbackGlobalStyle);
  document.body.classList.add(`${fallbackGlobalStyle}_globalStyle`);
  currentActiveGlobalStyle = fallbackGlobalStyle;
}

function changeGlobalStyle(styleID) {
  console.log("new style: " + styleID)
  let currentGlobalStyle = [...document.body.classList].find(clss => clss.includes('_globalStyle'));
  console.log("current Theme: " + currentGlobalStyle)
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


function closeOpenGlobalStyleMenu(event) {
  if(document.getElementById("globalStyleMenu") && (event.target.id !== "globalStyleMenu" && event.target.id !== "globalStyleMenuButton" && !event.target.classList.contains("menuSubElement"))) {
    document.getElementById("globalStyleMenu").remove();
    document.removeEventListener("click", closeOpenGlobalStyleMenu);
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
      console.log("unable to attach globalStyleMenu to globalStyleMenu container. This is a peaceful error so its ok")
    }
  }, 100);

  document.addEventListener("click", closeOpenGlobalStyleMenu, true);
  event.stopPropagation();
});

const importExportButton = document.getElementById("importExportButton");

function downloadTextFile(fileContent, fileTitle, filePrefix) {
    let newBlob = new Blob([fileContent], { type: 'text/plain' });
    let url = URL.createObjectURL(newBlob);
    let download = document.createElement('a');

    download.href = url;
    download.download = fileTitle + filePrefix + ".storylinenotepad";
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
          alert("You can't export nothing!!");
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
            alert("Invalid file type. Only '.storylinenotepad' is allowed");
            return;
        }
        await new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = function(event) {
              let storylineImportData = JSON.parse(event.target.result);
              window.removeEventListener("beforeunload" , beforeUnloadEvent);
              let storylineNotepad_global_getCurrentSaveData = JSON.parse(localStorage.getItem("storylineNotepad_global")).storylineSaves[currentActiveSaveRef];
              if(storylineNotepad_global_getCurrentSaveData === undefined || storylineNotepad_global_getCurrentSaveData.storylineTitle === undefined) {
                console.log("nothing to export, skipping export")
              } else {
                downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData), storylineNotepad_global_getCurrentSaveData.storylineTitle.replace(/ /g, "_") , "_backup");
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
              console.error("An error occurred while reading the file", error);
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
          console.log("nothing to export, skipping export");
        } else {
          downloadTextFile(JSON.stringify(storylineNotepad_global_getCurrentSaveData), storylineNotepad_global_getCurrentSaveData.storylineTitle.replace(/ /g, "_") , "_backup");
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
        alert("Error converting your v0.2 export data into v0.3  : " + e)
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

window.addEventListener("resize", function() {
  if(window.innerHeight > window.innerWidth) {
    var wrongScreenAspectRatioElement = document.createElement("div");
    wrongScreenAspectRatioElement.classList.add("wrongScreenAspectRatioElement", "header_color");
    wrongScreenAspectRatioElement.innerHTML = `
      <p class="wrongScreenAspectRatioElement_firstText">Hold on a second</p>
      <p class="wrongScreenAspectRatioElement_lastText">Your screen height is larger than your screen width. Storyline Notepad was designed for laptop / monitors. Maybe in a future version _(0.0)/ </p>
    `;
    wrongScreenAspectRatioElement.id = "wrongScreenAspectRatioElement";
    document.body.appendChild(wrongScreenAspectRatioElement);
  } else {
    if(document.getElementById("wrongScreenAspectRatioElement")) {
      setTimeout(() => {
        try {
          document.getElementById("wrongScreenAspectRatioElement").remove();
        } catch {}
      }, 150);
    }
  }
});


// update alert

var newUpdateElement = document.createElement("div");
newUpdateElement.id = "newUpdateElement";
newUpdateElement.classList.add("footer_color", "popup_color");
newUpdateElement.innerHTML = `
  <img id="popupElement_closeButton" src="../assets/closeButton.png" title="Close"/>
  <p class="newUpdateElement_heading">Storyline Notepad has been updated!</p>
  <p class="newUpdateElement_version">Version 0.2.5 => 0.3.0</p>
  <p class="newUpdateElement_subHeading">Here are some highlights of this update:</p>
  <ul class="newUpdateElement_list">
    <li>Significant UI changes and additions, including new menus and icons.</li>
    <li>New storyline save data structure.</li>
    <li>Import and export now use files instead of text.</li>
    <li>You can now add or remove any story box in any part of your storyline.</li>
    <li>Added theme categories and brand new themes.</li>
  </ul>
  <a href="changelog.html">
    <div class="seeChangelogButton importExportMenu_buttons_color">
      <p>See full changelog</p>
    </div>
  </a>
  <p class="newUpdateElement_text1 header_textColor">I hope these updates make it a better experience for you. <br/> Have a nice day as well!!</p>
`;


var popUpMainElement_newUpdate = document.createElement("div");
popUpMainElement_newUpdate.classList.add("popUpBackground");
popUpMainElement_newUpdate.id = "popUpMainElement_newUpdate";
popUpMainElement_newUpdate.appendChild(newUpdateElement);



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
  document.body.appendChild(popUpMainElement_newUpdate);
  setTimeout(() => {
    document.addEventListener("click", function(event) {
      if(event.target.id === "popupElement_closeButton" || event.target.id === "popUpMainElement_newUpdate") {
        popUpMainElement_newUpdate.remove();
      }
    });
  }, 150);
  localStorage.setItem(`newUpdate_flip${flipToUse}`, false);
  localStorage.setItem(`newUpdate_flip${otherFlip()}`, true);
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
      <textarea class="text storyBox_innerColor" id="textarea${generateUID()}" placeholder="Start typing:"></textarea>
    </div>
    <div class="arrow" oncontextmenu="showContextMenu('addRemove', event, ${generateUID()})" title="Right click for more options">
      <img src="../assets/icons/arrow_${currentActiveThemeType}.png"/>
    </div>
  </div>`;
  switch(side) {
    case "left":
      document.getElementById("box" + UID).insertAdjacentHTML("afterend", storyBox);
      break;
    case "right":
      document.getElementById("box" + UID).insertAdjacentHTML("beforebegin", storyBox);
      break;
  }
}