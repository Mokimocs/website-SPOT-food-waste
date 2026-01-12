// tracking clicks
const clickedCountries = new Set();
const totalCountries = 4;

let readyToShowSpot = false;

// popup images controller
window.showPanel = function (countryKey) {
  const panel = document.getElementById(`${countryKey}Popup`);
  panel.style.visibility = "visible";
  panel.classList.add("animation");

  if (countryKey) {
    clickedCountries.add(countryKey);

    if (clickedCountries.size == 4) {
      readyToShowSpot = true;
    }
  }

  // Countries Clicked Display

  if (countryKey) {
    clickedCountries.add(countryKey);

    const progress =
      (clickedCountries.size / totalCountries) * 100;

    document.getElementById("progressBar").style.width =
      progress + "%";
  }
};

// Close popup
const panels = document.getElementsByClassName('side-panel');
const closePanelButtons = document.getElementsByClassName('closePanel');
Array.from(closePanelButtons).forEach(panel => panel.addEventListener('click', () => {
  for (let i = 0; i < panels.length; i++) {
    panels[i].style.visibility = 'hidden';
    panels[i].classList.remove("animation");
  }
  document.getElementById('spotPanel').style.display = 'none';
  if (readyToShowSpot) {
    document.getElementById('spotPanel').style.display = 'block';
    readyToShowSpot = false;
  }
}))

// Choice buttons logic
const choiceButtons = document.querySelectorAll(".choice-btn");
const choiceResult = document.getElementById("choiceResult");

const messages = {
  portion:
    "If 100 people at SPOT took smaller portions first, we could prevent hundreds of kilos of food waste per year.",
  leftovers:
    "If 100 people regularly saved leftovers, we�d turn a big share of our �waste� into tomorrow�s lunch.",
  veggies:
    "If 100 people finished their veggies more often, we�d cut both food and resource waste linked to vegetables.",
};

choiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.choice;
    choiceResult.textContent = messages[key] || "Every small change helps.";
  });
});
