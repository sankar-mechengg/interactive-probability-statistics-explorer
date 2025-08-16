"use client";

import { useState, useEffect, useRef } from "react";

// ========== PRIORITY 1: INTERACTIVE VISUALIZATIONS ==========

// Bayes' Theorem Calculator Component
export function BayesCalculator() {
  const [priorProb, setPriorProb] = useState(0.01); // Disease prevalence
  const [sensitivity, setSensitivity] = useState(0.95); // True positive rate
  const [specificity, setSpecificity] = useState(0.95); // True negative rate
  const [results, setResults] = useState({});

  useEffect(() => {
    // Calculate Bayes' theorem results
    const falsePositiveRate = 1 - specificity;
    const probTestPositive =
      sensitivity * priorProb + falsePositiveRate * (1 - priorProb);
    const posteriorProb = (sensitivity * priorProb) / probTestPositive;

    setResults({
      posterior: posteriorProb,
      probTestPositive,
      falsePositiveRate,
      truePositives: sensitivity * priorProb * 10000,
      falsePositives: falsePositiveRate * (1 - priorProb) * 10000,
      trueNegatives: specificity * (1 - priorProb) * 10000,
      falseNegatives: (1 - sensitivity) * priorProb * 10000,
    });
  }, [priorProb, sensitivity, specificity]);

  return (
    <div className="interactive-card">
      <h3>🧠 Interactive Bayes&apos; Theorem Calculator</h3>
      <p>Explore how prior probability affects diagnosis accuracy!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Disease Prevalence: {(priorProb * 100).toFixed(2)}%</label>
          <input
            type="range"
            min="0.001"
            max="0.5"
            step="0.001"
            value={priorProb}
            onChange={(e) => setPriorProb(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Test Sensitivity: {(sensitivity * 100).toFixed(1)}%</label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.01"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Test Specificity: {(specificity * 100).toFixed(1)}%</label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.01"
            value={specificity}
            onChange={(e) => setSpecificity(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="results-display">
        <div className="result-card highlight">
          <h4>🎯 Key Result</h4>
          <p className="big-number">{(results.posterior * 100).toFixed(1)}%</p>
          <p>Probability of having disease given positive test</p>
        </div>

        <div className="confusion-matrix">
          <h4>Per 10,000 people tested:</h4>
          <div className="matrix-grid">
            <div className="matrix-cell true-positive">
              <strong>{Math.round(results.truePositives || 0)}</strong>
              <small>True Positives</small>
            </div>
            <div className="matrix-cell false-positive">
              <strong>{Math.round(results.falsePositives || 0)}</strong>
              <small>False Positives</small>
            </div>
            <div className="matrix-cell false-negative">
              <strong>{Math.round(results.falseNegatives || 0)}</strong>
              <small>False Negatives</small>
            </div>
            <div className="matrix-cell true-negative">
              <strong>{Math.round(results.trueNegatives || 0)}</strong>
              <small>True Negatives</small>
            </div>
          </div>
        </div>
      </div>

      <div className="insight">
        <strong>💡 Key Insight:</strong> Even with 95% accurate tests, low
        disease prevalence means most positive results are false positives!
      </div>
    </div>
  );
}

// Central Limit Theorem Demo Component
export function CentralLimitDemo() {
  const canvasRef = useRef(null);
  const histogramRef = useRef(null);
  const [distribution, setDistribution] = useState("uniform");
  const [sampleSize, setSampleSize] = useState(1);
  const [numSamples, setNumSamples] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState({ mean: 0, std: 0 });

  const distributions = {
    uniform: { name: "Uniform (0,1)", generate: () => Math.random() },
    exponential: {
      name: "Exponential",
      generate: () => -Math.log(Math.random()),
    },
    bimodal: {
      name: "Bimodal",
      generate: () =>
        Math.random() < 0.5 ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4,
    },
  };

  useEffect(() => {
    if (canvasRef.current && histogramRef.current) {
      drawOriginalDistribution();
      generateSampleMeans();
    }
  }, [distribution, sampleSize, numSamples]);

  const drawOriginalDistribution = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate data for original distribution
    const data = Array.from({ length: 1000 }, () =>
      distributions[distribution].generate()
    );
    drawHistogram(ctx, data, canvas.width, canvas.height, "#667eea");
  };

  const generateSampleMeans = () => {
    const sampleMeans = [];
    for (let i = 0; i < numSamples; i++) {
      const sample = Array.from({ length: sampleSize }, () =>
        distributions[distribution].generate()
      );
      const mean = sample.reduce((a, b) => a + b, 0) / sample.length;
      sampleMeans.push(mean);
    }

    // Calculate statistics
    const meanOfMeans =
      sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
    const variance =
      sampleMeans.reduce((a, b) => a + (b - meanOfMeans) ** 2, 0) /
      sampleMeans.length;
    setStats({ mean: meanOfMeans, std: Math.sqrt(variance) });

    // Draw histogram of sample means
    const canvas = histogramRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistogram(ctx, sampleMeans, canvas.width, canvas.height, "#e74c3c");

    // Overlay normal curve if sample size > 1
    if (sampleSize > 1) {
      drawNormalOverlay(
        ctx,
        meanOfMeans,
        Math.sqrt(variance),
        canvas.width,
        canvas.height
      );
    }
  };

  const drawHistogram = (ctx, data, width, height, color) => {
    const bins = 30;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = new Array(bins).fill(0);

    data.forEach((value) => {
      const bin = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[bin]++;
    });

    const maxCount = Math.max(...histogram);
    const barWidth = width / bins;

    ctx.fillStyle = color + "80";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    histogram.forEach((count, i) => {
      const barHeight = (count / maxCount) * height * 0.8;
      const x = i * barWidth;
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
      ctx.strokeRect(x, y, barWidth - 1, barHeight);
    });
  };

  const drawNormalOverlay = (ctx, mean, std, width, height) => {
    ctx.strokeStyle = "#2ecc71";
    ctx.lineWidth = 3;
    ctx.beginPath();

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const dataX = mean + (x / width - 0.5) * 6 * std; // Cover 6 standard deviations
      const y = height - normalPDF(dataX, mean, std) * height * 50; // Scale for visibility

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const normalPDF = (x, mean, std) => {
    return (
      (1 / (std * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * ((x - mean) / std) ** 2)
    );
  };

  const animate = () => {
    setIsAnimating(true);
    let currentSample = 1;
    const interval = setInterval(() => {
      setSampleSize(currentSample);
      currentSample++;
      if (currentSample > 50) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
  };

  return (
    <div className="interactive-card">
      <h3>🎯 Central Limit Theorem Interactive Demo</h3>
      <p>Watch any distribution become normal as sample size increases!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Original Distribution:</label>
          <select
            value={distribution}
            onChange={(e) => setDistribution(e.target.value)}
          >
            {Object.entries(distributions).map(([key, dist]) => (
              <option key={key} value={key}>
                {dist.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Sample Size: {sampleSize}</label>
          <input
            type="range"
            min="1"
            max="100"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Number of Samples: {numSamples}</label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={numSamples}
            onChange={(e) => setNumSamples(parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <button onClick={animate} disabled={isAnimating} className="animate-btn">
        {isAnimating ? "Animating..." : "🎬 Animate CLT"}
      </button>

      <div className="visualization-container">
        <div className="viz-section">
          <h4>Original Distribution</h4>
          <canvas ref={canvasRef} className="distribution-canvas"></canvas>
        </div>

        <div className="viz-section">
          <h4>Distribution of Sample Means</h4>
          <canvas ref={histogramRef} className="distribution-canvas"></canvas>
          {sampleSize > 1 && (
            <p className="normal-note">Green line shows normal approximation</p>
          )}
        </div>
      </div>

      <div className="stats-display">
        <div className="stat-item">
          <strong>Sample Mean:</strong> {stats.mean.toFixed(3)}
        </div>
        <div className="stat-item">
          <strong>Standard Error:</strong> {stats.std.toFixed(3)}
        </div>
        <div className="stat-item">
          <strong>Normality:</strong>{" "}
          {sampleSize >= 30 ? "Approximately Normal!" : "Not yet normal"}
        </div>
      </div>
    </div>
  );
}

// Conditional Probability Visualizer Component
export function ConditionalProbabilityViz() {
  const [eventA, setEventA] = useState(0.3);
  const [eventB, setEventB] = useState(0.4);
  const [intersection, setIntersection] = useState(0.15);
  const [activeExample, setActiveExample] = useState("custom");

  const examples = {
    custom: { name: "Custom", a: 0.3, b: 0.4, intersect: 0.15 },
    cards: { name: "Playing Cards", a: 0.25, b: 0.077, intersect: 0.077 }, // Face cards and Kings
    medical: { name: "Medical Test", a: 0.01, b: 0.058, intersect: 0.0095 }, // Disease and positive test
    weather: { name: "Weather", a: 0.3, b: 0.2, intersect: 0.1 }, // Rain and cloudy
  };

  useEffect(() => {
    if (activeExample !== "custom") {
      const ex = examples[activeExample];
      setEventA(ex.a);
      setEventB(ex.b);
      setIntersection(ex.intersect);
    }
  }, [activeExample]);

  const probAGivenB = eventB > 0 ? intersection / eventB : 0;
  const probBGivenA = eventA > 0 ? intersection / eventA : 0;
  const probAOrB = eventA + eventB - intersection;

  return (
    <div className="interactive-card">
      <h3>🔗 Conditional Probability Visualizer</h3>
      <p>Explore how knowing one event affects the probability of another!</p>

      <div className="example-selector">
        <label>Example Scenario:</label>
        <select
          value={activeExample}
          onChange={(e) => setActiveExample(e.target.value)}
        >
          {Object.entries(examples).map(([key, ex]) => (
            <option key={key} value={key}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div className="controls-grid">
        <div className="control-group">
          <label>P(A) = {(eventA * 100).toFixed(1)}%</label>
          <input
            type="range"
            min="0.01"
            max="0.8"
            step="0.01"
            value={eventA}
            onChange={(e) => {
              setEventA(parseFloat(e.target.value));
              setActiveExample("custom");
            }}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>P(B) = {(eventB * 100).toFixed(1)}%</label>
          <input
            type="range"
            min="0.01"
            max="0.8"
            step="0.01"
            value={eventB}
            onChange={(e) => {
              setEventB(parseFloat(e.target.value));
              setActiveExample("custom");
            }}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>P(A ∩ B) = {(intersection * 100).toFixed(1)}%</label>
          <input
            type="range"
            min="0"
            max={Math.min(eventA, eventB)}
            step="0.001"
            value={intersection}
            onChange={(e) => {
              setIntersection(parseFloat(e.target.value));
              setActiveExample("custom");
            }}
            className="slider"
          />
        </div>
      </div>

      <VennDiagram
        eventA={eventA}
        eventB={eventB}
        intersection={intersection}
      />

      <div className="probability-results">
        <div className="prob-card">
          <h4>P(A|B)</h4>
          <div className="prob-value">{(probAGivenB * 100).toFixed(1)}%</div>
          <p>Probability of A given B</p>
        </div>

        <div className="prob-card">
          <h4>P(B|A)</h4>
          <div className="prob-value">{(probBGivenA * 100).toFixed(1)}%</div>
          <p>Probability of B given A</p>
        </div>

        <div className="prob-card">
          <h4>P(A ∪ B)</h4>
          <div className="prob-value">{(probAOrB * 100).toFixed(1)}%</div>
          <p>Probability of A or B</p>
        </div>
      </div>

      <div className="independence-check">
        <strong>Independence Test:</strong>{" "}
        {Math.abs(intersection - eventA * eventB) < 0.001
          ? "Events are independent!"
          : "Events are dependent"}
      </div>
    </div>
  );
}

// Venn Diagram Component
function VennDiagram({ eventA, eventB, intersection }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      drawVennDiagram();
    }
  }, [eventA, eventB, intersection]);

  const drawVennDiagram = () => {
    const svg = svgRef.current;
    svg.innerHTML = ""; // Clear previous content

    const width = 400;
    const height = 300;
    const radius = 80;
    const centerAX = width * 0.35;
    const centerBX = width * 0.65;
    const centerY = height * 0.5;

    // Background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#f8f9fa");
    rect.setAttribute("stroke", "#dee2e6");
    rect.setAttribute("stroke-width", "2");
    svg.appendChild(rect);

    // Circle A
    const circleA = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleA.setAttribute("cx", centerAX);
    circleA.setAttribute("cy", centerY);
    circleA.setAttribute("r", radius);
    circleA.setAttribute("fill", "#667eea60");
    circleA.setAttribute("stroke", "#667eea");
    circleA.setAttribute("stroke-width", "2");
    svg.appendChild(circleA);

    // Circle B
    const circleB = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleB.setAttribute("cx", centerBX);
    circleB.setAttribute("cy", centerY);
    circleB.setAttribute("r", radius);
    circleB.setAttribute("fill", "#e74c3c60");
    circleB.setAttribute("stroke", "#e74c3c");
    circleB.setAttribute("stroke-width", "2");
    svg.appendChild(circleB);

    // Labels
    const labelA = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    labelA.setAttribute("x", centerAX - 40);
    labelA.setAttribute("y", centerY - 50);
    labelA.setAttribute("font-family", "Arial, sans-serif");
    labelA.setAttribute("font-size", "16");
    labelA.setAttribute("font-weight", "bold");
    labelA.setAttribute("fill", "#667eea");
    labelA.textContent = "A";
    svg.appendChild(labelA);

    const labelB = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    labelB.setAttribute("x", centerBX + 30);
    labelB.setAttribute("y", centerY - 50);
    labelB.setAttribute("font-family", "Arial, sans-serif");
    labelB.setAttribute("font-size", "16");
    labelB.setAttribute("font-weight", "bold");
    labelB.setAttribute("fill", "#e74c3c");
    labelB.textContent = "B";
    svg.appendChild(labelB);

    // Intersection value
    const intersectionText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    intersectionText.setAttribute("x", width * 0.5);
    intersectionText.setAttribute("y", centerY + 5);
    intersectionText.setAttribute("font-family", "Arial, sans-serif");
    intersectionText.setAttribute("font-size", "12");
    intersectionText.setAttribute("font-weight", "bold");
    intersectionText.setAttribute("fill", "#2c3e50");
    intersectionText.setAttribute("text-anchor", "middle");
    intersectionText.textContent = `${(intersection * 100).toFixed(1)}%`;
    svg.appendChild(intersectionText);
  };

  return (
    <div className="venn-container">
      <svg ref={svgRef} width="400" height="300" className="venn-diagram"></svg>
    </div>
  );
}

export default {
  BayesCalculator,
  CentralLimitDemo,
  ConditionalProbabilityViz,
};
