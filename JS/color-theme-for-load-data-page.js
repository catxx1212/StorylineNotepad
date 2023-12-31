const themeSelect = document.getElementById("themeSelect");
const defaultTheme = "seaView-theme";
const loadedLastTheme = localStorage.getItem("loadDataScreenTheme");
if(loadedLastTheme) {
  document.body.classList.add(`${loadedLastTheme}-theme`);
  themeSelect.option = `${loadedLastTheme}`
} else {
  document.body.classList.add(defaultTheme);
}

themeSelect.addEventListener("change" , () => {
  let currentTheme = themeSelect.value;
  document.body.classList.remove("seaView-theme" , "midnight-theme" , "hellScape-theme" , "grass");
  document.body.classList.add(currentTheme + "-theme");
  localStorage.setItem("loadDataScreenTheme" , themeSelect.value);
});