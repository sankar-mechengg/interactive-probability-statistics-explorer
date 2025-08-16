/* All drawing & simulation logic extracted from your original <script> and adapted for React/Next. */

// Safety check for DOM operations
function isClient() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// Safe DOM operation wrapper
function safeGetElement(id) {
  if (!isClient()) return null;
  return document.getElementById(id);
}

// Safe DOM query wrapper
function safeQuerySelectorAll(selector) {
  if (!isClient()) return [];
  return document.querySelectorAll(selector);
}

let currentAnimation = null;
export function stopAnimation() {
  if (currentAnimation) {
    clearInterval(currentAnimation);
    currentAnimation = null;
  }
}

// ---------- Utilities ----------
function factorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function combination(n, k) {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 1; i <= k; i++) r *= (n - i + 1) / i;
  return r;
}
function gammaFunc(n) {
  if (n > 170) return Math.sqrt((2 * Math.PI) / n) * Math.pow(n / Math.E, n); // Stirling
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * gammaFunc(1 - n));
  n--;
  let x = coef[0];
  for (let i = 1; i < g + 2; i++) x += coef[i] / (n + i);
  const t = n + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}
function normalRandom(mean, std) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return (
    mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  );
}
function gammaRandom(alpha, beta) {
  if (alpha >= 1) {
    const d = alpha - 1 / 3,
      c = 1 / Math.sqrt(9 * d);
    for (;;) {
      let x, v;
      do {
        x = normalRandom(0, 1);
        v = 1 + c * x;
      } while (v <= 0);
      v = v * v * v;
      const u = Math.random();
      if (u < 1 - 0.0331 * x ** 4) return (d * v) / beta;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v)))
        return (d * v) / beta;
    }
  } else {
    return gammaRandom(alpha + 1, beta) * Math.pow(Math.random(), 1 / alpha);
  }
}
function betaRandom(alpha, beta) {
  const x = gammaRandom(alpha, 1),
    y = gammaRandom(beta, 1);
  return x / (x + y);
}
function laplaceRandom(mu, b) {
  const u = Math.random() - 0.5;
  return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}
function poissonRandom(lambda) {
  let L = Math.exp(-lambda),
    p = 1.0,
    k = 0;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// ---------- View switching ----------
export function showDistribution(dist) {
  if (!isClient()) return; // Safety check for server-side rendering

  stopAnimation();
  safeQuerySelectorAll(".dist-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(dist))
      btn.classList.add("active");
  });
  safeQuerySelectorAll(".distribution-card").forEach((card) =>
    card.classList.remove("active")
  );
  const distElement = safeGetElement(dist);
  if (distElement) distElement.classList.add("active");

  // Initialize selected distribution
  const initMap = {
    bernoulli: updateBernoulli,
    binomial: updateBinomial,
    poisson: updatePoisson,
    normal: updateNormal,
    exponential: updateExponential,
    uniform: updateUniform,
    geometric: updateGeometric,
    gamma: updateGamma,
    beta: updateBeta,
    laplace: updateLaplace,
    multinomial: updateMultinomial,
  };
  initMap[dist]?.();
}

// ---------- Bernoulli ----------
export function updateBernoulli() {
  if (!isClient()) return; // Safety check for server-side rendering

  const pElement = safeGetElement("bernoulli-p");
  if (!pElement) return;

  const p = parseFloat(pElement.value);
  const pValueElement = safeGetElement("bernoulli-p-value");
  const meanElement = safeGetElement("bernoulli-mean");
  const stdElement = safeGetElement("bernoulli-std");
  const successElement = safeGetElement("bernoulli-success");

  if (pValueElement) pValueElement.textContent = p.toFixed(2);
  if (meanElement) meanElement.textContent = p.toFixed(2);
  if (stdElement) stdElement.textContent = Math.sqrt(p * (1 - p)).toFixed(2);
  if (successElement) successElement.textContent = (p * 100).toFixed(0) + "%";

  drawBernoulli(p);
}
function drawBernoulli(p) {
  if (!isClient()) return; // Safety check for server-side rendering

  const canvas = safeGetElement("bernoulli-canvas");
  if (!canvas) return; // Additional safety check

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = Math.min(150, canvas.width / 4);
  const barHeight1 = (1 - p) * 300,
    barHeight2 = p * 300;

  ctx.fillStyle = "#f5576c";
  ctx.fillRect(
    canvas.width / 2 - barWidth - 20,
    canvas.height - barHeight1 - 50,
    barWidth,
    barHeight1
  );
  ctx.fillStyle = "#333";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Failure",
    canvas.width / 2 - barWidth / 2 - 20,
    canvas.height - 25
  );
  ctx.fillText(
    (1 - p).toFixed(2),
    canvas.width / 2 - barWidth / 2 - 20,
    canvas.height - barHeight1 - 60
  );

  ctx.fillStyle = "#667eea";
  ctx.fillRect(
    canvas.width / 2 + 20,
    canvas.height - barHeight2 - 50,
    barWidth,
    barHeight2
  );
  ctx.fillStyle = "#333";
  ctx.fillText(
    "Success",
    canvas.width / 2 + barWidth / 2 + 20,
    canvas.height - 25
  );
  ctx.fillText(
    p.toFixed(2),
    canvas.width / 2 + barWidth / 2 + 20,
    canvas.height - barHeight2 - 60
  );
}
export function simulateBernoulli() {
  const p = parseFloat(document.getElementById("bernoulli-p").value);
  const results = Array.from({ length: 100 }, () =>
    Math.random() < p ? 1 : 0
  );
  const successes = results.filter((r) => r === 1).length;

  const canvas = document.getElementById("bernoulli-canvas");
  const ctx = canvas.getContext("2d");
  let i = 0;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (i >= results.length) {
      stopAnimation();
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `Results: ${successes} successes, ${100 - successes} failures`,
        canvas.width / 2,
        30
      );
      return;
    }
    const x = (i % 10) * (canvas.width / 10) + 20;
    const y = Math.floor(i / 10) * 30 + 100;
    ctx.fillStyle = results[i] ? "#667eea" : "#f5576c";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
    i++;
  }, 20);
}
export function animateBernoulli() {
  if (!isClient()) return; // Safety check for server-side rendering

  const p = parseFloat(document.getElementById("bernoulli-p").value);
  const canvas = document.getElementById("bernoulli-canvas");
  if (!canvas) return; // Additional safety check

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let angle = 0,
    spins = 0,
    maxSpins = 20;
  stopAnimation();
  currentAnimation = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.ellipse(0, 0, 60, 60 * Math.abs(Math.cos(angle)), 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    angle += 0.3;
    spins++;
    if (spins >= maxSpins) {
      stopAnimation();
      const result = Math.random() < p;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = result ? "#667eea" : "#f5576c";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        result ? "SUCCESS!" : "FAILURE!",
        canvas.width / 2,
        canvas.height / 2 + 10
      );
    }
  }, 50);
}

// ---------- Binomial ----------
export function updateBinomial() {
  if (!isClient()) return; // Safety check for server-side rendering

  const n = parseInt(document.getElementById("binomial-n").value, 10);
  const p = parseFloat(document.getElementById("binomial-p").value);
  document.getElementById("binomial-n-value").textContent = n;
  document.getElementById("binomial-p-value").textContent = p.toFixed(2);
  document.getElementById("binomial-mean").textContent = (n * p).toFixed(2);
  document.getElementById("binomial-std").textContent = Math.sqrt(
    n * p * (1 - p)
  ).toFixed(2);
  document.getElementById("binomial-mode").textContent = Math.floor(
    (n + 1) * p
  );
  drawBinomial(n, p);
}
function drawBinomial(n, p) {
  const canvas = document.getElementById("binomial-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const probs = [],
    maxProbRef = { v: 0 };
  for (let k = 0; k <= n; k++) {
    const prob = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    probs.push(prob);
    if (prob > maxProbRef.v) maxProbRef.v = prob;
  }
  const barWidth = Math.min(50, (canvas.width - 100) / (n + 1));
  const startX = (canvas.width - barWidth * (n + 1)) / 2;
  const mean = n * p,
    std = Math.sqrt(n * p * (1 - p));
  for (let k = 0; k <= n; k++) {
    const barHeight = (probs[k] / maxProbRef.v) * 300;
    const x = startX + k * barWidth;
    const z = Math.abs(k - mean) / (std || 1e-9);
    ctx.fillStyle = z < 1 ? "#667eea" : z < 2 ? "#9f7aea" : "#cbd5e0";
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
    if (n <= 20 || k % Math.ceil(n / 20) === 0) {
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(k, x + barWidth / 2, canvas.height - 30);
    }
  }
  const meanX = startX + mean * barWidth;
  ctx.strokeStyle = "#f5576c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanX, 50);
  ctx.lineTo(meanX, canvas.height - 50);
  ctx.stroke();
  ctx.setLineDash([]);
}
export function simulateBinomial() {
  const n = parseInt(document.getElementById("binomial-n").value, 10);
  const p = parseFloat(document.getElementById("binomial-p").value);
  const results = [];
  for (let exp = 0; exp < 1000; exp++) {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) successes++;
    }
    results.push(successes);
  }
  const counts = new Array(n + 1).fill(0);
  results.forEach((r) => counts[r]++);
  const canvas = document.getElementById("binomial-canvas");
  const ctx = canvas.getContext("2d");
  let currentBar = 0;
  const barWidth = Math.min(50, (canvas.width - 100) / (n + 1));
  const startX = (canvas.width - barWidth * (n + 1)) / 2;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (currentBar > n) {
      stopAnimation();
      return;
    }
    const x = startX + currentBar * barWidth;
    const barHeight = (counts[currentBar] / 1000) * 1000;
    ctx.fillStyle = "#f5576c40";
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
    currentBar++;
  }, 50);
}
export function animateBinomial() {
  const n = parseInt(document.getElementById("binomial-n").value, 10);
  const p = parseFloat(document.getElementById("binomial-p").value);
  const canvas = document.getElementById("binomial-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let trial = 0,
    successes = 0;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (trial >= n) {
      stopAnimation();
      ctx.fillStyle = "#333";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `Total Successes: ${successes} out of ${n}`,
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }
    const x = (trial % 10) * 60 + 50;
    const y = Math.floor(trial / 10) * 60 + 50;
    const success = Math.random() < p;
    if (success) successes++;
    ctx.fillStyle = success ? "#667eea" : "#f5576c";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(success ? "✓" : "✗", x, y + 5);
    trial++;
  }, 100);
}

// ---------- Poisson ----------
export function updatePoisson() {
  const lambda = parseFloat(document.getElementById("poisson-lambda").value);
  document.getElementById("poisson-lambda-value").textContent = lambda;
  document.getElementById("poisson-mean").textContent = lambda.toFixed(2);
  document.getElementById("poisson-std").textContent =
    Math.sqrt(lambda).toFixed(2);
  document.getElementById("poisson-var").textContent = lambda.toFixed(2);
  drawPoisson(lambda);
}
function drawPoisson(lambda) {
  const canvas = document.getElementById("poisson-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxK = Math.min(50, Math.ceil(lambda + 5 * Math.sqrt(lambda)));
  const probs = [];
  let maxProb = 0;
  for (let k = 0; k <= maxK; k++) {
    const prob = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    probs.push(prob);
    maxProb = Math.max(maxProb, prob);
  }
  const barWidth = Math.min(30, (canvas.width - 100) / maxK);
  const startX = (canvas.width - barWidth * maxK) / 2;
  for (let k = 0; k <= maxK; k++) {
    if (probs[k] < 0.001) continue;
    const barHeight = (probs[k] / maxProb) * 300;
    const x = startX + k * barWidth;
    const z = Math.abs(k - lambda) / Math.sqrt(lambda || 1e-9);
    ctx.fillStyle = z < 1 ? "#667eea" : z < 2 ? "#9f7aea" : "#cbd5e0";
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
    if (probs[k] > maxProb * 0.1) {
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(k, x + barWidth / 2, canvas.height - 30);
    }
  }
}
export function simulatePoisson() {
  const lambda = parseFloat(document.getElementById("poisson-lambda").value);
  const results = Array.from({ length: 1000 }, () => poissonRandom(lambda));
  const maxVal = Math.max(...results);
  const counts = new Array(maxVal + 1).fill(0);
  results.forEach((r) => counts[r]++);
  const canvas = document.getElementById("poisson-canvas");
  const ctx = canvas.getContext("2d");
  const maxK = Math.min(50, Math.ceil(lambda + 5 * Math.sqrt(lambda)));
  const barWidth = Math.min(30, (canvas.width - 100) / maxK);
  const startX = (canvas.width - barWidth * maxK) / 2;
  ctx.fillStyle = "#f5576c40";
  for (let k = 0; k <= Math.min(maxVal, maxK); k++) {
    const x = startX + k * barWidth;
    const barHeight = (counts[k] / 1000) * 1000;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
  }
}
export function animatePoisson() {
  const lambda = parseFloat(document.getElementById("poisson-lambda").value);
  const canvas = document.getElementById("poisson-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let time = 0,
    events = 0;
  const timeStep = 0.1,
    maxTime = 10;
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, canvas.height - 50);
  ctx.lineTo(canvas.width - 50, canvas.height - 50);
  ctx.stroke();
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (time >= maxTime) {
      stopAnimation();
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `${events} events in ${maxTime} time units (expected: ${(
          lambda * maxTime
        ).toFixed(1)})`,
        canvas.width / 2,
        30
      );
      return;
    }
    if (Math.random() < lambda * timeStep) {
      events++;
      const x = 50 + (time / maxTime) * (canvas.width - 100),
        y = canvas.height - 50;
      ctx.fillStyle = "#667eea";
      ctx.beginPath();
      ctx.arc(x, y - 20, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#667eea50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 200);
      ctx.stroke();
    }
    time += timeStep;
  }, 50);
}

// ---------- Normal ----------
export function updateNormal() {
  const mean = parseFloat(document.getElementById("normal-mean").value);
  const std = parseFloat(document.getElementById("normal-std").value);
  document.getElementById("normal-mean-value").textContent = mean.toFixed(1);
  document.getElementById("normal-std-value").textContent = std.toFixed(1);
  document.getElementById("normal-mean-stat").textContent = mean.toFixed(1);
  document.getElementById("normal-std-stat").textContent = std.toFixed(1);
  drawNormal(mean, std);
}
function drawNormal(mean, std) {
  const canvas = document.getElementById("normal-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const minX = mean - 4 * std,
    maxX = mean + 4 * std,
    range = maxX - minX;
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let maxY = 0;
  const points = [];
  for (let i = 0; i <= canvas.width; i++) {
    const x = minX + (i / canvas.width) * range;
    const variance = std * std;
    const y =
      (1 / Math.sqrt(2 * Math.PI * variance)) *
      Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    points.push({ x: i, y });
    maxY = Math.max(maxY, y);
  }
  points.forEach((p, i) => {
    const yPos = canvas.height - 50 - (p.y / maxY) * 300;
    if (i === 0) ctx.moveTo(p.x, yPos);
    else ctx.lineTo(p.x, yPos);
  });
  ctx.stroke();

  for (let sigma = 1; sigma <= 3; sigma++) {
    ctx.fillStyle =
      sigma === 1 ? "#667eea20" : sigma === 2 ? "#667eea10" : "#667eea05";
    ctx.beginPath();
    const startX = mean - sigma * std,
      endX = mean + sigma * std;
    let first = true;
    for (let i = 0; i <= canvas.width; i++) {
      const x = minX + (i / canvas.width) * range;
      if (x >= startX && x <= endX) {
        const variance = std * std;
        const y =
          (1 / Math.sqrt(2 * Math.PI * variance)) *
          Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
        const yPos = canvas.height - 50 - (y / maxY) * 300;
        if (first) {
          ctx.moveTo(i, canvas.height - 50);
          ctx.lineTo(i, yPos);
          first = false;
        } else {
          ctx.lineTo(i, yPos);
        }
      }
    }
    ctx.lineTo(((endX - minX) / range) * canvas.width, canvas.height - 50);
    ctx.closePath();
    ctx.fill();
  }
  const meanX = ((mean - minX) / range) * canvas.width;
  ctx.strokeStyle = "#f5576c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanX, 50);
  ctx.lineTo(meanX, canvas.height - 50);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("μ", meanX, canvas.height - 30);
}
export function simulateNormal() {
  const mean = parseFloat(document.getElementById("normal-mean").value);
  const std = parseFloat(document.getElementById("normal-std").value);
  const canvas = document.getElementById("normal-canvas");
  const ctx = canvas.getContext("2d");
  const samples = Array.from({ length: 1000 }, () => normalRandom(mean, std));
  const minX = mean - 4 * std,
    maxX = mean + 4 * std,
    bins = 30,
    binWidth = (maxX - minX) / bins;
  const counts = new Array(bins).fill(0);
  samples.forEach((s) => {
    const bin = Math.floor((s - minX) / binWidth);
    if (bin >= 0 && bin < bins) counts[bin]++;
  });
  ctx.fillStyle = "#f5576c30";
  counts.forEach((count, i) => {
    const x = (i / bins) * canvas.width;
    const barHeight = (count / 1000) * 1500;
    const barWidth = canvas.width / bins;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 1, barHeight);
  });
}
export function animateNormal() {
  const mean = parseFloat(document.getElementById("normal-mean").value);
  const std = parseFloat(document.getElementById("normal-std").value);
  const canvas = document.getElementById("normal-canvas");
  const ctx = canvas.getContext("2d");
  updateNormal();
  const stages = [
    { sigma: 1, text: "68.3% within 1σ", color: "#667eea60" },
    { sigma: 2, text: "95.4% within 2σ", color: "#9f7aea60" },
    { sigma: 3, text: "99.7% within 3σ", color: "#cbd5e060" },
  ];
  let stage = 0;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (stage >= stages.length) {
      stopAnimation();
      return;
    }
    const s = stages[stage];
    ctx.fillStyle = s.color;
    const minX = mean - 4 * std,
      maxX = mean + 4 * std,
      range = maxX - minX;
    const startX = ((mean - s.sigma * std - minX) / range) * canvas.width;
    const endX = ((mean + s.sigma * std - minX) / range) * canvas.width;
    ctx.fillRect(startX, 50, endX - startX, canvas.height - 100);
    ctx.fillStyle = "#333";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(s.text, canvas.width / 2, 30);
    stage++;
  }, 1500);
}

// ---------- Exponential ----------
export function updateExponential() {
  const lambda = parseFloat(
    document.getElementById("exponential-lambda").value
  );
  document.getElementById("exponential-lambda-value").textContent =
    lambda.toFixed(1);
  document.getElementById("exponential-mean").textContent = (
    1 / lambda
  ).toFixed(2);
  document.getElementById("exponential-std").textContent = (1 / lambda).toFixed(
    2
  );
  document.getElementById("exponential-median").textContent = (
    Math.log(2) / lambda
  ).toFixed(2);
  drawExponential(lambda);
}
function drawExponential(lambda) {
  const canvas = document.getElementById("exponential-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxX = 5 / lambda;
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i++) {
    const x = (i / canvas.width) * maxX;
    const y = lambda * Math.exp(-lambda * x);
    const yPos = canvas.height - 50 - y * 200;
    if (i === 0) ctx.moveTo(i, yPos);
    else ctx.lineTo(i, yPos);
  }
  ctx.stroke();
  ctx.fillStyle = "#667eea20";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  for (let i = 0; i <= canvas.width; i++) {
    const x = (i / canvas.width) * maxX;
    const y = lambda * Math.exp(-lambda * x);
    const yPos = canvas.height - 50 - y * 200;
    ctx.lineTo(i, yPos);
  }
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.closePath();
  ctx.fill();
  const meanX = (1 / lambda / maxX) * canvas.width;
  ctx.strokeStyle = "#f5576c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanX, 50);
  ctx.lineTo(meanX, canvas.height - 50);
  ctx.stroke();
  ctx.setLineDash([]);
}
export function simulateExponential() {
  const lambda = parseFloat(
    document.getElementById("exponential-lambda").value
  );
  const samples = Array.from(
    { length: 1000 },
    () => -Math.log(1 - Math.random()) / lambda
  );
  const canvas = document.getElementById("exponential-canvas");
  const ctx = canvas.getContext("2d");
  const maxX = 5 / lambda,
    bins = 30,
    binWidth = maxX / bins;
  const counts = new Array(bins).fill(0);
  samples.forEach((s) => {
    const bin = Math.floor(s / binWidth);
    if (bin >= 0 && bin < bins) counts[bin]++;
  });
  ctx.fillStyle = "#f5576c30";
  counts.forEach((count, i) => {
    const x = (i / bins) * canvas.width;
    const barHeight = (count / 1000) * 800;
    const barWidth = canvas.width / bins;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 1, barHeight);
  });
}
export function animateExponential() {
  const lambda = parseFloat(
    document.getElementById("exponential-lambda").value
  );
  const canvas = document.getElementById("exponential-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let currentTime = 0;
  const events = [];
  stopAnimation();
  currentAnimation = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2);
    ctx.lineTo(canvas.width - 50, canvas.height / 2);
    ctx.stroke();
    currentTime += 0.05;
    if (
      events.length === 0 ||
      currentTime - events[events.length - 1] >
        -Math.log(Math.random()) / lambda
    )
      events.push(currentTime);
    events.forEach((t) => {
      const x = 50 + (t / 10) * (canvas.width - 100);
      if (x < canvas.width - 50) {
        ctx.fillStyle = "#667eea";
        ctx.beginPath();
        ctx.arc(x, canvas.height / 2, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    if (events.length > 1) {
      const waitTime = events[events.length - 1] - events[events.length - 2];
      ctx.fillStyle = "#333";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `Last wait: ${waitTime.toFixed(2)} units`,
        canvas.width / 2,
        50
      );
    }
    if (currentTime > 10) stopAnimation();
  }, 50);
}

// ---------- Uniform ----------
export function updateUniform() {
  const min = parseFloat(document.getElementById("uniform-min").value);
  let max = parseFloat(document.getElementById("uniform-max").value);
  if (min >= max) {
    max = min + 1;
    document.getElementById("uniform-max").value = max;
  }
  document.getElementById("uniform-min-value").textContent = min.toFixed(1);
  document.getElementById("uniform-max-value").textContent = max.toFixed(1);
  document.getElementById("uniform-mean").textContent = (
    (min + max) /
    2
  ).toFixed(2);
  document.getElementById("uniform-std").textContent = Math.sqrt(
    ((max - min) * (max - min)) / 12
  ).toFixed(2);
  document.getElementById("uniform-range").textContent = (max - min).toFixed(1);
  drawUniform(min, max);
}
function drawUniform(min, max) {
  const canvas = document.getElementById("uniform-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const padding = 100;
  const rectX = padding;
  const rectWidth = canvas.width - 2 * padding;
  const rectHeight = 200;
  const rectY = (canvas.height - rectHeight) / 2;
  ctx.fillStyle = "#667eea30";
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  const density = 1 / (max - min);
  ctx.fillStyle = "#333";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `Probability Density = ${density.toFixed(3)}`,
    canvas.width / 2,
    rectY - 20
  );
  ctx.fillText(min.toFixed(1), rectX, rectY + rectHeight + 30);
  ctx.fillText(max.toFixed(1), rectX + rectWidth, rectY + rectHeight + 30);
  const meanX = rectX + rectWidth / 2;
  ctx.strokeStyle = "#f5576c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanX, rectY);
  ctx.lineTo(meanX, rectY + rectHeight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText("Mean", meanX, rectY + rectHeight + 50);
}
export function simulateUniform() {
  const min = parseFloat(document.getElementById("uniform-min").value);
  const max = parseFloat(document.getElementById("uniform-max").value);
  const canvas = document.getElementById("uniform-canvas");
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
      const value = min + Math.random() * (max - min);
      const x = 100 + ((value - min) / (max - min)) * (canvas.width - 200);
      const y = Math.random() * 180 + (canvas.height - 200) / 2;
      ctx.fillStyle = "#f5576c50";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }, i * 2);
  }
}
export function animateUniform() {
  const min = parseFloat(document.getElementById("uniform-min").value);
  const max = parseFloat(document.getElementById("uniform-max").value);
  const canvas = document.getElementById("uniform-canvas");
  const ctx = canvas.getContext("2d");
  drawUniform(min, max);
  let picks = 0;
  const maxPicks = 20;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (picks >= maxPicks) {
      stopAnimation();
      return;
    }
    const value = min + Math.random() * (max - min);
    const x = 100 + ((value - min) / (max - min)) * (canvas.width - 200);
    ctx.fillStyle = "#f5576c";
    ctx.beginPath();
    ctx.moveTo(x, 100);
    ctx.lineTo(x - 10, 80);
    ctx.lineTo(x + 10, 80);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value.toFixed(2), x, 70);
    picks++;
  }, 300);
}

// ---------- Geometric ----------
export function updateGeometric() {
  const p = parseFloat(document.getElementById("geometric-p").value);
  document.getElementById("geometric-p-value").textContent = p.toFixed(2);
  document.getElementById("geometric-mean").textContent = (1 / p).toFixed(2);
  document.getElementById("geometric-std").textContent = (
    Math.sqrt(1 - p) / p
  ).toFixed(2);
  drawGeometric(p);
}
function drawGeometric(p) {
  const canvas = document.getElementById("geometric-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxK = Math.min(30, Math.ceil(3 / p));
  const probs = [];
  const maxProb = p;
  for (let k = 1; k <= maxK; k++) probs.push(Math.pow(1 - p, k - 1) * p);
  const barWidth = Math.min(25, (canvas.width - 100) / maxK);
  const startX = (canvas.width - barWidth * maxK) / 2;
  for (let k = 1; k <= maxK; k++) {
    const barHeight = (probs[k - 1] / maxProb) * 300;
    const x = startX + (k - 1) * barWidth;
    ctx.fillStyle = k === 1 ? "#667eea" : k <= 5 ? "#9f7aea" : "#cbd5e0";
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
    if (k <= 10 || k % 5 === 0) {
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(k, x + barWidth / 2, canvas.height - 30);
    }
  }
}
export function simulateGeometric() {
  const p = parseFloat(document.getElementById("geometric-p").value);
  const results = [];
  for (let i = 0; i < 1000; i++) {
    let trials = 1;
    while (Math.random() > p && trials < 100) trials++;
    results.push(trials);
  }
  const canvas = document.getElementById("geometric-canvas");
  const ctx = canvas.getContext("2d");
  const maxK = Math.min(30, Math.max(...results));
  const counts = new Array(maxK).fill(0);
  results.forEach((r) => {
    if (r <= maxK) counts[r - 1]++;
  });
  const barWidth = Math.min(25, (canvas.width - 100) / maxK);
  const startX = (canvas.width - barWidth * maxK) / 2;
  ctx.fillStyle = "#f5576c40";
  for (let k = 1; k <= maxK; k++) {
    const x = startX + (k - 1) * barWidth;
    const barHeight = (counts[k - 1] / 1000) * 800;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 2, barHeight);
  }
}
export function animateGeometric() {
  const p = parseFloat(document.getElementById("geometric-p").value);
  const canvas = document.getElementById("geometric-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let trial = 1;
  stopAnimation();
  currentAnimation = setInterval(() => {
    ctx.clearRect(0, 100, canvas.width, 200);
    const success = Math.random() < p;
    const x = canvas.width / 2;
    const y = 200;
    ctx.fillStyle = success ? "#667eea" : "#f5576c";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(success ? "SUCCESS!" : "FAIL", x, y + 5);
    ctx.fillStyle = "#333";
    ctx.font = "18px Arial";
    ctx.fillText(`Trial ${trial}`, x, y - 60);
    if (success) {
      stopAnimation();
      ctx.font = "bold 24px Arial";
      ctx.fillText(
        `Success after ${trial} trial${trial > 1 ? "s" : ""}!`,
        x,
        350
      );
      return;
    }
    trial++;
    if (trial > 20) {
      stopAnimation();
      ctx.fillText("Still trying...", x, 350);
    }
  }, 500);
}

// ---------- Gamma ----------
export function updateGamma() {
  const alpha = parseFloat(document.getElementById("gamma-alpha").value);
  const beta = parseFloat(document.getElementById("gamma-beta").value);
  document.getElementById("gamma-alpha-value").textContent = alpha.toFixed(1);
  document.getElementById("gamma-beta-value").textContent = beta.toFixed(1);
  document.getElementById("gamma-mean").textContent = (alpha / beta).toFixed(2);
  document.getElementById("gamma-std").textContent = (
    Math.sqrt(alpha) / beta
  ).toFixed(2);
  drawGamma(alpha, beta);
}
function drawGamma(alpha, beta) {
  const canvas = document.getElementById("gamma-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mean = alpha / beta,
    std = Math.sqrt(alpha) / beta,
    maxX = Math.min(mean + 4 * std, 20);
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let maxY = 0;
  const points = [];
  for (let i = 0; i <= canvas.width; i++) {
    const x = (i / canvas.width) * maxX;
    if (x > 0) {
      const y =
        (Math.pow(beta, alpha) / gammaFunc(alpha)) *
        Math.pow(x, alpha - 1) *
        Math.exp(-beta * x);
      points.push({ x: i, y });
      maxY = Math.max(maxY, y);
    }
  }
  points.forEach((p, i) => {
    const yPos = canvas.height - 50 - (p.y / maxY) * 300;
    if (i === 0) ctx.moveTo(p.x, yPos);
    else ctx.lineTo(p.x, yPos);
  });
  ctx.stroke();
  ctx.fillStyle = "#667eea20";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  points.forEach((p) => {
    const yPos = canvas.height - 50 - (p.y / maxY) * 300;
    ctx.lineTo(p.x, yPos);
  });
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.closePath();
  ctx.fill();
}
export function simulateGamma() {
  const alpha = parseFloat(document.getElementById("gamma-alpha").value);
  const beta = parseFloat(document.getElementById("gamma-beta").value);
  const samples = Array.from({ length: 1000 }, () => gammaRandom(alpha, beta));
  const canvas = document.getElementById("gamma-canvas");
  const ctx = canvas.getContext("2d");
  const mean = alpha / beta,
    std = Math.sqrt(alpha) / beta,
    maxX = Math.min(mean + 4 * std, 20),
    bins = 30,
    binWidth = maxX / bins;
  const counts = new Array(bins).fill(0);
  samples.forEach((s) => {
    const bin = Math.floor(s / binWidth);
    if (bin >= 0 && bin < bins) counts[bin]++;
  });
  ctx.fillStyle = "#f5576c30";
  counts.forEach((count, i) => {
    const x = (i / bins) * canvas.width;
    const barHeight = (count / 1000) * 800;
    const barWidth = canvas.width / bins;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 1, barHeight);
  });
}

// ---------- Beta ----------
export function updateBeta() {
  const alpha = parseFloat(document.getElementById("beta-alpha").value);
  const beta = parseFloat(document.getElementById("beta-beta").value);
  document.getElementById("beta-alpha-value").textContent = alpha.toFixed(1);
  document.getElementById("beta-beta-value").textContent = beta.toFixed(1);
  document.getElementById("beta-mean").textContent = (
    alpha /
    (alpha + beta)
  ).toFixed(2);
  const variance =
    (alpha * beta) / ((alpha + beta) * (alpha + beta) * (alpha + beta + 1));
  document.getElementById("beta-std").textContent =
    Math.sqrt(variance).toFixed(2);
  drawBeta(alpha, beta);
}
function drawBeta(alpha, beta) {
  const canvas = document.getElementById("beta-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let maxY = 0;
  const points = [];
  for (let i = 1; i < canvas.width - 1; i++) {
    const x = i / canvas.width;
    const y =
      (Math.pow(x, alpha - 1) *
        Math.pow(1 - x, beta - 1) *
        gammaFunc(alpha + beta)) /
      (gammaFunc(alpha) * gammaFunc(beta));
    points.push({ x: i, y });
    maxY = Math.max(maxY, y);
  }
  points.forEach((p, i) => {
    const yPos = canvas.height - 50 - (p.y / maxY) * 300;
    if (i === 0) ctx.moveTo(p.x, yPos);
    else ctx.lineTo(p.x, yPos);
  });
  ctx.stroke();
  ctx.fillStyle = "#667eea20";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  points.forEach((p) => {
    const yPos = canvas.height - 50 - (p.y / maxY) * 300;
    ctx.lineTo(p.x, yPos);
  });
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.stroke();
  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("0", 20, canvas.height - 30);
  ctx.fillText("0.5", canvas.width / 2, canvas.height - 30);
  ctx.fillText("1", canvas.width - 20, canvas.height - 30);
}
export function simulateBeta() {
  const alpha = parseFloat(document.getElementById("beta-alpha").value);
  const beta = parseFloat(document.getElementById("beta-beta").value);
  const samples = Array.from({ length: 1000 }, () => betaRandom(alpha, beta));
  const canvas = document.getElementById("beta-canvas");
  const ctx = canvas.getContext("2d");
  const bins = 30,
    binWidth = 1 / bins;
  const counts = new Array(bins).fill(0);
  samples.forEach((s) => {
    const bin = Math.floor(s / binWidth);
    if (bin >= 0 && bin < bins) counts[bin]++;
  });
  ctx.fillStyle = "#f5576c30";
  counts.forEach((count, i) => {
    const x = (i / bins) * canvas.width;
    const barHeight = (count / 1000) * 800;
    const barWidth = canvas.width / bins;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 1, barHeight);
  });
}

// ---------- Laplace ----------
export function updateLaplace() {
  const mu = parseFloat(document.getElementById("laplace-mu").value);
  const b = parseFloat(document.getElementById("laplace-b").value);
  document.getElementById("laplace-mu-value").textContent = mu.toFixed(1);
  document.getElementById("laplace-b-value").textContent = b.toFixed(1);
  document.getElementById("laplace-mean").textContent = mu.toFixed(1);
  document.getElementById("laplace-std").textContent = (
    Math.sqrt(2) * b
  ).toFixed(2);
  drawLaplace(mu, b);
}
function drawLaplace(mu, b) {
  const canvas = document.getElementById("laplace-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const minX = mu - 5 * b * Math.sqrt(2),
    maxX = mu + 5 * b * Math.sqrt(2),
    range = maxX - minX;
  ctx.strokeStyle = "#667eea";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let maxY = 1 / (2 * b);
  for (let i = 0; i <= canvas.width; i++) {
    const x = minX + (i / canvas.width) * range;
    const y = (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
    const yPos = canvas.height - 50 - (y / maxY) * 300;
    if (i === 0) ctx.moveTo(i, yPos);
    else ctx.lineTo(i, yPos);
  }
  ctx.stroke();
  ctx.fillStyle = "#667eea20";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 50);
  for (let i = 0; i <= canvas.width; i++) {
    const x = minX + (i / canvas.width) * range;
    const y = (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
    const yPos = canvas.height - 50 - (y / maxY) * 300;
    ctx.lineTo(i, yPos);
  }
  ctx.lineTo(canvas.width, canvas.height - 50);
  ctx.closePath();
  ctx.fill();

  const meanX = ((mu - minX) / range) * canvas.width;
  ctx.strokeStyle = "#f5576c";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(meanX, 50);
  ctx.lineTo(meanX, canvas.height - 50);
  ctx.stroke();
  ctx.setLineDash([]);

  // Overlay comparable normal with same variance (σ^2 = 2b^2)
  ctx.strokeStyle = "#f5576c50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= canvas.width; i++) {
    const x = minX + (i / canvas.width) * range;
    const variance = 2 * b * b;
    const y =
      (1 / Math.sqrt(2 * Math.PI * variance)) *
      Math.exp(-Math.pow(x - mu, 2) / (2 * variance));
    const yPos =
      canvas.height - 50 - (y / (1 / (b * Math.sqrt(2 * Math.PI * 2)))) * 300;
    if (i === 0) ctx.moveTo(i, yPos);
    else ctx.lineTo(i, yPos);
  }
  ctx.stroke();
  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Laplace (solid) vs Normal (dashed)", canvas.width / 2, 30);
}
export function simulateLaplace() {
  const mu = parseFloat(document.getElementById("laplace-mu").value);
  const b = parseFloat(document.getElementById("laplace-b").value);
  const samples = Array.from({ length: 1000 }, () => laplaceRandom(mu, b));
  const canvas = document.getElementById("laplace-canvas");
  const ctx = canvas.getContext("2d");
  const minX = mu - 5 * b * Math.sqrt(2),
    maxX = mu + 5 * b * Math.sqrt(2),
    bins = 30,
    binWidth = (maxX - minX) / bins;
  const counts = new Array(bins).fill(0);
  samples.forEach((s) => {
    const bin = Math.floor((s - minX) / binWidth);
    if (bin >= 0 && bin < bins) counts[bin]++;
  });
  ctx.fillStyle = "#f5576c30";
  counts.forEach((count, i) => {
    const x = (i / bins) * canvas.width;
    const barHeight = (count / 1000) * 800;
    const barWidth = canvas.width / bins;
    ctx.fillRect(x, canvas.height - barHeight - 50, barWidth - 1, barHeight);
  });
}

// ---------- Multinomial ----------
export function updateMultinomial() {
  const n = parseInt(document.getElementById("multinomial-n").value, 10);
  document.getElementById("multinomial-n-value").textContent = n;
  document.getElementById("multinomial-total").textContent = n;
  drawMultinomial(n);
}
function drawMultinomial(n) {
  const canvas = document.getElementById("multinomial-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 400;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!window.multinomialProbs)
    window.multinomialProbs = [0.25, 0.25, 0.25, 0.25];
  const colors = ["#667eea", "#f5576c", "#48bb78", "#ed8936"];
  const labels = ["Category A", "Category B", "Category C", "Category D"];
  const barWidth = 80;
  const startX = (canvas.width - barWidth * 4 - 30 * 3) / 2;

  window.multinomialProbs.forEach((prob, i) => {
    const x = startX + i * (barWidth + 30);
    const barHeight = prob * 250;
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, canvas.height - barHeight - 100, barWidth, barHeight);
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(
      x + barWidth / 2,
      canvas.height - barHeight - 100,
      8,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], x + barWidth / 2, canvas.height - 70);
    ctx.fillText(
      (prob * 100).toFixed(0) + "%",
      x + barWidth / 2,
      canvas.height - barHeight - 110
    );
  });
  ctx.fillStyle = "#666";
  ctx.font = "12px Arial";
  window.multinomialProbs.forEach((prob, i) => {
    const x = startX + i * (barWidth + 30);
    ctx.fillText(
      `E[X] = ${(n * prob).toFixed(1)}`,
      x + barWidth / 2,
      canvas.height - 50
    );
  });
  ctx.fillStyle = "#666";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Click buttons below to simulate!", canvas.width / 2, 30);
}
export function simulateMultinomial() {
  const n = parseInt(document.getElementById("multinomial-n").value, 10);
  const probs = window.multinomialProbs || [0.25, 0.25, 0.25, 0.25];
  const results = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    let cumSum = 0;
    for (let j = 0; j < probs.length; j++) {
      cumSum += probs[j];
      if (r < cumSum) {
        results[j]++;
        break;
      }
    }
  }
  const canvas = document.getElementById("multinomial-canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 50, canvas.width, 60);
  ctx.fillStyle = "#333";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `Results: A=${results[0]}, B=${results[1]}, C=${results[2]}, D=${results[3]}`,
    canvas.width / 2,
    80
  );

  const colors = ["#667eea80", "#f5576c80", "#48bb7880", "#ed893680"];
  const barWidth = 80;
  const startX = (canvas.width - barWidth * 4 - 30 * 3) / 2;
  results.forEach((count, i) => {
    const x = startX + i * (barWidth + 30);
    const barHeight = (count / n) * 250;
    ctx.fillStyle = colors[i];
    ctx.fillRect(
      x + 10,
      canvas.height - barHeight - 100,
      barWidth - 20,
      barHeight
    );
  });
}
export function animateMultinomial() {
  const n = parseInt(document.getElementById("multinomial-n").value, 10);
  const probs = window.multinomialProbs || [0.25, 0.25, 0.25, 0.25];
  const colors = ["#667eea", "#f5576c", "#48bb78", "#ed8936"];
  const canvas = document.getElementById("multinomial-canvas");
  const ctx = canvas.getContext("2d");
  drawMultinomial(n);
  const results = [0, 0, 0, 0];
  let selections = 0;
  stopAnimation();
  currentAnimation = setInterval(() => {
    if (selections >= Math.min(n, 20)) {
      stopAnimation();
      if (n > 20) {
        for (let i = 20; i < n; i++) {
          const r = Math.random();
          let cumSum = 0;
          for (let j = 0; j < probs.length; j++) {
            cumSum += probs[j];
            if (r < cumSum) {
              results[j]++;
              break;
            }
          }
        }
      }
      ctx.fillStyle = "#333";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        `Final: A=${results[0]}, B=${results[1]}, C=${results[2]}, D=${results[3]}`,
        canvas.width / 2,
        60
      );
      return;
    }
    const r = Math.random();
    let cumSum = 0;
    let selected = 0;
    for (let j = 0; j < probs.length; j++) {
      cumSum += probs[j];
      if (r < cumSum) {
        selected = j;
        results[j]++;
        break;
      }
    }
    const ballX = 100 + (selections % 10) * 50;
    const ballY = 120 + Math.floor(selections / 10) * 30;
    ctx.fillStyle = colors[selected];
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, 2 * Math.PI);
    ctx.fill();
    selections++;
  }, 150);
}
