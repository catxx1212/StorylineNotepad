var changelogs = [
  // copy upwards
  {
    versionRef: "Version 0.6.0",
    date: "??/08/2024",
    changeList: `
      <li>Added three new themes: Oceanside Nap, Cozy Bed, and Rainy Day.</li>
      <li>Added a new user preference: text alignment.</li>
      <li>Added a "Clear Data" menu.</li>
      <li>The theme menu now jumps to your current active theme when opened.</li>
      <li>Made slight adjustments to the layout.</li>
      <li>Changing the light or dark mode on pages using the toggle now updates the fallback theme. This ensures that when navigating to another page, the theme remains consistent (does not affect the storyline notepad if a theme is already set).
      <li>The loading screen now follows the selected fallback theme.</li>
      <li>Created a tutorial storyline. If you were a user before this update, you can download it <span class="spanForDownload" onclick='downloadTextFile(JSON.stringify(storylineNotepad_tutorialSaveFile), "tutorialSaveFile", "");''>here</span>.</li>
      <li>Fixed a bug with the import buttons.</li>
      <li>Added dates to the changelog.</li>
      <li>Added action previews for the arrow context menu.</li>
      <li>Added scroll priority: when your mouse is over a scrollable storybox, it will scroll that box instead of the entire storyline.</li>
      <li>Made some other small changes, fixes, and optimizations.</li>
    `,
  },
  {
    versionRef: "Version 0.5.1",
    date: "11/08/2024",
    changeList: `
      <li>Added a new theme: Starry Midnight.</li>
      <li>Theme requests are now open!</li>
      <li>Small fixes to window size checker.</li>
    `,
  },
  {
    versionRef: "Version 0.5.0",
    date: "27/07/2024",
    changeList: `
      <li>Added the Storyline save slot page. You can now have up to ten Storylines at one time!</li>
      <li>Made slight changes to the general layout, including moving the "clear current storyline" button to the sidebar.</li>
      <li>Added a new theme: Pillow Talk.</li>
      <li>Some smaller fixes and optimizations.</li>
    `,
  },
  {
    versionRef: "Version 0.4.1",
    date: "13/07/2024",
    changeList: `
      <li>Added two new themes: Cherry Skies and Hopeful Fields.</li>
    `,
  },
  {
    versionRef: "Version 0.4.0",
    date: "01/07/2024",
    changeList: `
      <li>Added a user preferences menu. You can now configure some of Storyline Notepad's behavior.</li>
      <li>Added in-window message, warning, and error notifications.</li>
      <li>Added a weekly in-window notification to remind you to hard reload the page. This will ensure you have the latest version (due to cache issues).</li>
      <li>Added two new themes: Corrupted Void and Tanned Paper.</li>
      <li>Renamed Pale skies to Gentle Rainbow.</li>
      <li>Added time and date extensions to storyline export filenames.</li>
      <li>Added a dark mode option for title page and changelog page.</li>
      <li>Some smaller adjustments to general behavior.</li>
      <li>Added "wrong aspect ratio" screen too all pages now.</li>
      <li>Other fixes and small changes.</li>
    `,
  },
  {
    versionRef: "Version 0.3.1",
    date: "22/06/2024",
    changeList: `
      <li>Added one new theme: Pale skies.</li>
      <li>Fixed another issue with the context menu.</li>
      <li>Added "pre-code" for an upcoming new feature.</li>
    `,
  },
  {
    versionRef: "Version 0.3.0",
    date: "21/06/2024",
    changeList: `
      <li>Significant UI changes and additions, including new menus and icons.</li>
      <li>New storyline save data structure.</li>
      <li>Import and export now use files instead of text.</li>
      <li>You can now add or remove any story box in any part of your storyline.</li>
      <li>Added theme categories and brand new themes.</li>
      <li>Added a custom context menu (right-click the arrows).</li>
      <li>New title page.</li>
      <li>Started the changelog.</li>
      <li>Some optimizations and bug fixes.</li>  
    `,
  },
];

const changelogList = document.getElementById("changelogList");

var changelogHTML = ``;

changelogs.forEach((changelog, index) => {
  if(index === 0) {
    changelogHTML += `
    <div class="changelogEntryDiv">
      <p class="changelog_version header_textColor">${changelog.versionRef} (Current version)</p>
      <p class="changelog_date header_textColor">(${changelog.date})</p>
      <ul class="changelog_list header_textColor">
        ${changelog.changeList}
      </ul>
      <hr class="popup_color"/>
    </div>
    `;
  } else {
    changelogHTML += `
      <div class="changelogEntryDiv">
        <p class="changelog_version header_textColor">${changelog.versionRef}</p>
        <p class="changelog_date header_textColor">(${changelog.date})</p>  
        <ul class="changelog_list header_textColor">
          ${changelog.changeList}
        </ul>
        <hr class="popup_color"/>
      </div>
    `;
  }
});

changelogList.innerHTML = changelogHTML;









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
var storylineNotepad_tutorialSaveFile = {"versionNumber":"0.6.0","textData":[{"storyboxNumber":0,"storyBoxTextContent":"Welcome to Storyline Notepad!\n\nThis save file is here to help users who don't know how to use Storyline Notepad yet.\n\n(You can delete this storyline if you don't need it anymore)\n\n(This will come back if you reset Storyline Notepad)"},{"storyboxNumber":1,"storyBoxTextContent":"Title Changing:\n\nJust click the title above the storyboxes to change it."},{"storyboxNumber":2,"storyBoxTextContent":"Storybox Management:\n(These boxes)\n\nYou can add a new box to the end of the storyline with the add button at the end.\n\nRight click the arrows for more options on box management.\n\nHover over each action to see a preview."},{"storyboxNumber":3,"storyBoxTextContent":"Themes Menu:\n\nThe brush icon in the top tray opens the Themes Menu.\n\nClick it to view all available themes."},{"storyboxNumber":4,"storyBoxTextContent":"Global Styles Menu:\n\nThe \"Aa\" icon in the top tray opens the Global Styles Menu.\n\nUse this to adjust font sizes and font boldness."},{"storyboxNumber":5,"storyBoxTextContent":"The Save Button:\n\nIt's pretty self explanatory, to be honest.\n\nStoryline Notepad also saves automatically when you exit."},{"storyboxNumber":6,"storyBoxTextContent":"The Import and Export Menu:\n\nThe two arrows icon in the top tray opens the Import and Export Menu.\n\nHere, you can export your current storyline to a file, either as a backup or to share with someone else.\n\nYou can also import data here, including support for version 0.2."},{"storyboxNumber":7,"storyBoxTextContent":"The Drop Down Menu:\n\nThe single arrow icon in the top tray opens the Drop Down Menu.\n\nThis is where you can find the User Preferences Menu and the Clear Data Menu."},{"storyboxNumber":8,"storyBoxTextContent":"The User Preferences Menu:\n\nThe cog icon in the dropdown menu opens the User Preferences Menu.\n\nHere, you can adjust some of Storyline Notepad's behaviours."},{"storyboxNumber":9,"storyBoxTextContent":"The Clear Data Menu:\n\nThe bin icon in the drop down menu opens the Clear Data Menu.\n\nHere, you can choose to either delete your current storyline or delete everything, including all your storyline saves and user preferences."},{"storyboxNumber":10,"storyBoxTextContent":"Tips and tricks:\n\nHold shift to scroll faster."},{"storyboxNumber":11,"storyBoxTextContent":"Tutorial Version 1.0.0\n\nThis can be downloaded from the Import/Export Menu or from:\n\nhttps://storylinenotepad.catxx1212.com/storylineNotepad/downloads/tutorialSaveFile/\n\nThank you for taking the time to read this! <3"}],"storylineTitle":"Tutorial","activeTheme":["anything","pleaseGoToFallbackTheme"],"activeGlobalStyle":"normalBold"};
