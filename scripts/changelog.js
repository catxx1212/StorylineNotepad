var changelogs = [
  // copy upwards
  {
    versionRef: "Version 0.5.0",
    changeList: `
      <li>Added the Storyline save slot page. You can now have up to ten Storylines at one time!</li>
      <li>Made slight changes to the general layout, including moving the "clear current storyline" button to the sidebar.</li>
      <li>Added a new theme: Pillow Talk.</li>
      <li>Some smaller fixes and optimizations.</li>
    `,
  },
  {
    versionRef: "Version 0.4.1",
    changeList: `
      <li>Added two new themes: Cherry Skies and Hopeful Fields</li>
    `,
  },
  {
    versionRef: "Version 0.4.0",
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
    changeList: `
      <li>Added one new theme: Pale skies.</li>
      <li>Fixed another issue with the context menu.</li>
      <li>Added "pre-code" for an upcoming new feature.</li>
    `,
  },
  {
    versionRef: "Version 0.3.0",
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
        <ul class="changelog_list header_textColor">
          ${changelog.changeList}
        </ul>
        <hr class="popup_color"/>
      </div>
    `;
  }
});

changelogList.innerHTML = changelogHTML;