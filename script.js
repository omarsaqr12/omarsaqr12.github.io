"use strict";

// Progressive enhancement: the complete portfolio is present in the HTML.
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll(".project-card[data-category]")];
const filterGroup = document.querySelector(".project-filters");
if (filterGroup) filterGroup.hidden = false;
filters.forEach(button => button.addEventListener("click", () => {
  const category = button.dataset.filter;
  filters.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = category !== "all" && card.dataset.category !== category;
    if (!card.hidden) count += 1;
  });
  document.getElementById("project-count").textContent = `${count} ${count === 1 ? "project" : "projects"}`;
}));

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Independent miniature DSP demonstration, not a trained model result.
// Symbol sets have mean energy 1. Complex AWGN has power 10^(-SNR/10).
const canvas = document.getElementById("constellation");
const snrInput = document.getElementById("snr");
const snrOutput = document.getElementById("snr-value");
const modulationButtons = [...document.querySelectorAll("[data-mod]")];
let selectedModulation = "qpsk";
const labels = { qpsk: "QPSK", qam16: "16-QAM", psk8: "8-PSK" };

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
}

function symbolsFor(modulation) {
  if (modulation === "qam16") {
    const symbols = [];
    for (const i of [-3, -1, 1, 3]) for (const q of [-3, -1, 1, 3]) {
      symbols.push([i / Math.sqrt(10), q / Math.sqrt(10)]);
    }
    return symbols;
  }
  const count = modulation === "psk8" ? 8 : 4;
  const offset = modulation === "qpsk" ? Math.PI / 4 : 0;
  return Array.from({ length: count }, (_, index) => {
    const phase = 2 * Math.PI * index / count + offset;
    return [Math.cos(phase), Math.sin(phase)];
  });
}

function generateSamples(modulation, snr, count = 440) {
  const random = seededRandom(41229);
  const symbols = symbolsFor(modulation);
  const sigma = Math.sqrt(Math.pow(10, -snr / 10) / 2);
  return Array.from({ length: count }, () => {
    const symbol = symbols[Math.floor(random() * symbols.length)];
    const radius = Math.sqrt(-2 * Math.log(random()));
    const angle = 2 * Math.PI * random();
    return [symbol[0] + sigma * radius * Math.cos(angle), symbol[1] + sigma * radius * Math.sin(angle)];
  });
}

function drawConstellation() {
  if (!canvas || !snrInput) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const width = rect.width;
  const height = rect.height;
  const snr = Number(snrInput.value);
  snrOutput.value = `${snr} dB`;
  canvas.setAttribute("aria-label", `Synthetic ${labels[selectedModulation]} constellation with additive Gaussian noise at ${snr} decibels signal-to-noise ratio. Lower signal-to-noise ratios spread the symbol clusters.`);
  context.clearRect(0, 0, width, height);
  const left = 34, right = 20, top = 19, bottom = 29;
  const scale = Math.min((width - left - right) / 4.1, (height - top - bottom) / 4.1);
  const centerX = (width + left - right) / 2;
  const centerY = (height + top - bottom) / 2;
  const mapX = value => centerX + value * scale;
  const mapY = value => centerY - value * scale;
  context.lineWidth = 1;
  for (const value of [-1.5, -1, -.5, 0, .5, 1, 1.5]) {
    context.strokeStyle = value === 0 ? "#536679" : "#293c50";
    context.beginPath(); context.moveTo(mapX(value), mapY(-1.75)); context.lineTo(mapX(value), mapY(1.75)); context.stroke();
    context.beginPath(); context.moveTo(mapX(-1.75), mapY(value)); context.lineTo(mapX(1.75), mapY(value)); context.stroke();
  }
  context.fillStyle = "#aabacb";
  context.font = "12px ui-monospace, monospace";
  context.textAlign = "center";
  for (const value of [-1, 0, 1]) context.fillText(String(value), mapX(value), mapY(-1.75) + 16);
  context.textAlign = "right";
  for (const value of [-1, 1]) context.fillText(String(value), mapX(-1.75) - 8, mapY(value) + 4);
  context.fillText("Q", mapX(-1.75) - 8, mapY(1.75) - 3);
  context.textAlign = "left"; context.fillText("I", mapX(1.75) + 6, mapY(-1.75) + 16);
  context.save();
  context.beginPath(); context.rect(mapX(-1.75), mapY(1.75), 3.5 * scale, 3.5 * scale); context.clip();
  context.fillStyle = "#c5f36c";
  context.globalAlpha = .6;
  for (const [i, q] of generateSamples(selectedModulation, snr)) {
    context.beginPath(); context.arc(mapX(i), mapY(q), 1.7, 0, 2 * Math.PI); context.fill();
  }
  context.globalAlpha = 1;
  context.strokeStyle = "#fff";
  context.lineWidth = 1.2;
  for (const [i, q] of symbolsFor(selectedModulation)) {
    context.beginPath(); context.arc(mapX(i), mapY(q), 4, 0, 2 * Math.PI); context.stroke();
  }
  context.restore();
}

modulationButtons.forEach(button => button.addEventListener("click", () => {
  selectedModulation = button.dataset.mod;
  modulationButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  drawConstellation();
}));
if (snrInput) snrInput.addEventListener("input", drawConstellation);
if (canvas) {
  drawConstellation();
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(drawConstellation).observe(canvas);
  else window.addEventListener("resize", drawConstellation);
}
