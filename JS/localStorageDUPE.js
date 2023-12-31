

for(let i = 0; i < 10; i++) {
  let random = Math.random();
  let color;
  if(random <= 0.5) {
    color = "green";
  } else {
    color = "blue";
  }
  let yes = {
    name: `yes${i}`,
    data: "DaTa",
    assignedColor: `${color}`,
  };
  localStorage.setItem(`testSave${i}_StorylineNotepadSave` , JSON.stringify(yes));
}