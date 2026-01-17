const clickedCountries = new Set();
const totalCountries = 4;

let allDone = false;           // all 4 visited
let spotMode = false;          // switched to NL map
let waitingForNLClick = false; // NL is shown and zoomed into

function parsePoints(pointsStr) {
  return pointsStr
    .trim()
    .split(/\s+/)
    .map(pair => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });
}

function centroidOfPoints(points) {
  // centroid 
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function zoomToViewBoxPoint(vx, vy, scale) {
  const viewport = document.getElementById("mapViewport");
  const rect = viewport.getBoundingClientRect();

  const cx = rect.width / 2;
  const cy = rect.height / 2;

  // viewBox is 2000x1000
  const px = (vx / 2000) * rect.width;
  const py = (vy / 1000) * rect.height;

  const tx = cx - px * scale;
  const ty = cy - py * scale;

  viewport.style.setProperty("--tx", `${tx}px`);
  viewport.style.setProperty("--ty", `${ty}px`);
  viewport.style.setProperty("--scale", scale);

}

function resetZoom() {
  const viewport = document.getElementById("mapViewport");
  viewport.style.setProperty("--tx", "0px");
  viewport.style.setProperty("--ty", "0px");
  viewport.style.setProperty("--scale", "1");
}


window.showPanel = function (countryKey) {
  // If SPOT mode, ignore other countries panels
  if (spotMode) return;

  const panel = document.getElementById(`${countryKey}Popup`);
  if (!panel) return;

  panel.classList.add("open");

  // keeping track of visited countries
  const before = clickedCountries.size;
  clickedCountries.add(countryKey);
  const after = clickedCountries.size;

  // Update progress bar
  const progress = (after / totalCountries) * 100;
  document.getElementById("progressBar").style.width = progress + "%";

  // zoom into polygons
  const poly = document.querySelector(`polygon[data-country="${countryKey}"]`);
  if (poly) {
    const pts = parsePoints(poly.getAttribute("points"));
    const c = centroidOfPoints(pts);
    zoomToViewBoxPoint(c.x, c.y, responsiveScale(2.3));

  }

  // If this click completed all 4, mark done (but doesnt switch yet)
  if (after === totalCountries && after !== before) {
    allDone = true;
  }
};

function responsiveScale(desktopScale) {
  return window.innerWidth < 768
    ? desktopScale * 0.75
    : desktopScale;
}

window.addEventListener("resize", () => {
  if (!spotMode && !waitingForNLClick) {
    resetZoom();
  }
});


// --- Close buttons for side panels ---
const panels = document.getElementsByClassName('side-panel');
const closePanelButtons = document.getElementsByClassName('closePanel');

Array.from(closePanelButtons).forEach(btn => btn.addEventListener('click', () => {
  // Close all side panels
  for (let i = 0; i < panels.length; i++) {
    panels[i].classList.remove("open");

  }

  // Reset zoom back to full map after closing a country panel
  resetZoom();

  // If all countries visited, switch to SPOT mode
  if (allDone && !spotMode) {
    enterSpotMode();
  }
}));

function enterSpotMode() {
  spotMode = true;

  // swapping map image (background)
  const mapImg = document.getElementById("mapImg");
  mapImg.src = "images/mapNL.png";

  // hides other polygons
  document.querySelectorAll("polygon.map-region[data-country]").forEach(p => {
    p.style.display = "none";
  });

  // shows NL polygon
  const nl = document.getElementById("nlRegion");
  nl.style.display = "block";

  // No zoom at start, zooms in after 2 seconds
  resetZoom();
  waitingForNLClick = false;

  setTimeout(() => {
    const box = nl.getBBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    zoomToViewBoxPoint(cx, cy, responsiveScale(4.0));

    waitingForNLClick = true;
  }, 2000); //can also be changed
}


// spot panel
window.openSpot = function () {
  if (!waitingForNLClick) return;
  document.getElementById("spotPanel").style.display = "block";
  waitingForNLClick = false;
};


// closes spot panel
function showFinalOverlay() {
  const final = document.getElementById("finalOverlay");
  if (!final) return;
  final.style.display = "block";
}

document.querySelector("#spotPanel .closePanel")?.addEventListener("click", () => {
  document.getElementById("spotPanel").style.display = "none";

  setTimeout(() => {
    showFinalOverlay();
  }, 2000);
});

// choice buttons
const choiceButtons = document.querySelectorAll(".choice-btn");
const choiceResult = document.getElementById("choiceResult");

const messages = {
  portion:
    "If 30 people at SPOT took smaller portions first, we could prevent hundreds of kilos of food waste per year.",
  leftovers:
    "If 100 people regularly saved leftovers, we’d turn a big share of our ‘waste’ into tomorrow’s lunch.",
  spoilage:
    "Prioritising foods that spoil faster helps reduce waste caused by quality loss.",
};

choiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.choice;
    choiceResult.textContent = messages[key] || "Every small change helps.";
  });
});

window.openFinalPdf = function () {
  window.open("pdf/Learn more about Food Waste.pdf", "_blank");
};

function closeSplash() {
  const splash = document.getElementById("startimageOverlay");
  if (!splash) return;

  resetZoom();
  splash.style.display = "none";
  document.body.style.overflow = "";
}

function checkOrientation (){
  const rotateOverlay = document.getElementById("rotateOverlay");
  if (!rotateOverlay) return;

  const isPhone = Math.min(window.innerWidth, window.innerHeight) <= 768;

  const isPortrait = 
    screen.orientation
    ? screen.orientation.type.includes("portrait")
    : window.matchMedia("(orientation: portrait)").matches;

  if (isPhone && isPortrait){
    rotateOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  } else {
    rotateOverlay.style.display = "none";
    document.body.style.overflow = "";
  }
}

checkOrientation();

window.addEventListener("resize", checkOrientation);

if (screen.orientation){
  screen.orientation.addEventListener("change", checkOrientation);
}

document.getElementById("startimageOverlay")?.addEventListener("click", closeSplash);