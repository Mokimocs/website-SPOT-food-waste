// tracking clicks
const clickedCountries = new Set();
const totalCountries = 4;

let readyToShowSpot = false;

// popup images controller
window.showImg = function (src, countryKey) {
  const img = document.getElementById('popupImg');
  img.src = src;

  img.style.left = "50%";
  img.style.top = "50%";
  img.style.transform = "translate(-50%, -50%)";
    img.style.display = 'block';

    // Countries Clicked Display
    const counterEl = document.getElementById("count");

    if (countryKey) {
        clickedCountries.add(countryKey);
        counterEl.textContent = clickedCountries.size;

        if (clickedCountries.size === totalCountries) {
            readyToShowSpot = true;
        }
    }

  if (countryKey) {
    const before = clickedCountries.size;
    clickedCountries.add(countryKey);
    const after = clickedCountries.size;

    if (after === totalCountries && after !== before) {
      readyToShowSpot = true;
    }
  }
};

// Close popup
document.getElementById('popupImg').addEventListener('click', () => {
  document.getElementById('popupImg').style.display = 'none';

  if (readyToShowSpot) {
    document.getElementById('spotPanel').style.display = 'block';
    readyToShowSpot = false;
  }
});

// Close SPOT button
document.getElementById('closeSpotPanel').addEventListener('click', () => {
  document.getElementById('spotPanel').style.display = 'none';
});

// Choice buttons logic
const choiceButtons = document.querySelectorAll(".choice-btn");
const choiceResult = document.getElementById("choiceResult");

const messages = {
  portion:
    "If 100 people at SPOT took smaller portions first, we could prevent hundreds of kilos of food waste per year.",
  leftovers:
    "If 100 people regularly saved leftovers, we’d turn a big share of our ‘waste’ into tomorrow’s lunch.",
  veggies:
    "If 100 people finished their veggies more often, we’d cut both food and resource waste linked to vegetables.",
};

choiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.choice;
    choiceResult.textContent = messages[key] || "Every small change helps.";
  });
});
