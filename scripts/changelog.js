var changelogs = [
  // copy upwards
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
      <p class="changelog_version">${changelog.versionRef} (Current version)</p>
      <ul class="changelog_list">
        ${changelog.changeList}
      </ul>
      <hr/>
    </div>
    `;
  } else {
    changelogHTML += `
      <div class="changelogEntryDiv">
        <p class="changelog_version">${changelog.versionRef}</p>
        <ul class="changelog_list">
          ${changelog.changeList}
        </ul>
        <hr/>
      </div>
    `;
  }
});

changelogList.innerHTML = changelogHTML;
