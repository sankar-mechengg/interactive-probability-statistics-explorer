"use client";

import { useState, useEffect, useRef } from "react";

// ========== PRIORITY 2: ADVANCED CONCEPTS ==========

// Markov Chain Simulator Component
export function MarkovChainSimulator() {
  const [states, setStates] = useState(["Sunny", "Cloudy", "Rainy"]);
  const [currentState, setCurrentState] = useState(0);
  const [transitionMatrix, setTransitionMatrix] = useState([
    [0.7, 0.2, 0.1], // From Sunny
    [0.3, 0.4, 0.3], // From Cloudy
    [0.2, 0.3, 0.5], // From Rainy
  ]);
  const [steadyState, setSteadyState] = useState([]);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedExample, setSelectedExample] = useState("weather");

  const examples = {
    weather: {
      name: "Weather Prediction",
      states: ["Sunny", "Cloudy", "Rainy"],
      matrix: [
        [0.7, 0.2, 0.1],
        [0.3, 0.4, 0.3],
        [0.2, 0.3, 0.5],
      ],
    },
    stock: {
      name: "Stock Movement",
      states: ["Bull", "Stable", "Bear"],
      matrix: [
        [0.6, 0.3, 0.1],
        [0.2, 0.6, 0.2],
        [0.1, 0.4, 0.5],
      ],
    },
    customer: {
      name: "Customer Behavior",
      states: ["Active", "Inactive", "Churned"],
      matrix: [
        [0.8, 0.15, 0.05],
        [0.3, 0.5, 0.2],
        [0.1, 0.1, 0.8],
      ],
    },
  };

  useEffect(() => {
    if (selectedExample !== "custom") {
      const ex = examples[selectedExample];
      setStates(ex.states);
      setTransitionMatrix(ex.matrix);
      setCurrentState(0);
    }
    calculateSteadyState();
  }, [selectedExample, transitionMatrix]);

  const calculateSteadyState = () => {
    // Simple iterative method to find steady state
    let state = [1 / states.length, 1 / states.length, 1 / states.length];
    for (let i = 0; i < 100; i++) {
      const newState = state.map((_, j) =>
        state.reduce((sum, prob, k) => sum + prob * transitionMatrix[k][j], 0)
      );
      state = newState;
    }
    setSteadyState(state);
  };

  const updateTransition = (from, to, value) => {
    const newMatrix = [...transitionMatrix];
    newMatrix[from][to] = parseFloat(value);

    // Normalize the row to sum to 1
    const rowSum = newMatrix[from].reduce((a, b) => a + b, 0);
    if (rowSum > 0) {
      newMatrix[from] = newMatrix[from].map((val) => val / rowSum);
    }

    setTransitionMatrix(newMatrix);
    setSelectedExample("custom");
  };

  const simulate = () => {
    setIsSimulating(true);
    const history = [currentState];
    let state = currentState;

    const interval = setInterval(() => {
      // Choose next state based on transition probabilities
      const rand = Math.random();
      let cumProb = 0;
      let nextState = 0;

      for (let i = 0; i < states.length; i++) {
        cumProb += transitionMatrix[state][i];
        if (rand <= cumProb) {
          nextState = i;
          break;
        }
      }

      state = nextState;
      history.push(state);
      setCurrentState(state);
      setSimulationHistory([...history]);

      if (history.length >= 50) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 200);
  };

  const reset = () => {
    setCurrentState(0);
    setSimulationHistory([]);
    setIsSimulating(false);
  };

  return (
    <div className="interactive-card">
      <h3>⛓️ Markov Chain Simulator</h3>
      <p>Model systems where future depends only on present state!</p>

      <div className="example-selector">
        <label>Example:</label>
        <select
          value={selectedExample}
          onChange={(e) => setSelectedExample(e.target.value)}
        >
          {Object.entries(examples).map(([key, ex]) => (
            <option key={key} value={key}>
              {ex.name}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="markov-controls">
        <button
          onClick={simulate}
          disabled={isSimulating}
          className="simulate-btn"
        >
          {isSimulating ? "Simulating..." : "🎬 Start Simulation"}
        </button>
        <button onClick={reset} className="reset-btn">
          🔄 Reset
        </button>
      </div>

      <div className="markov-content">
        <div className="transition-matrix">
          <h4>Transition Matrix</h4>
          <div className="matrix-grid">
            <div className="matrix-header">
              <div></div>
              {states.map((state, i) => (
                <div key={i} className="header-cell">
                  To {state}
                </div>
              ))}
            </div>
            {states.map((fromState, i) => (
              <div key={i} className="matrix-row">
                <div className="row-header">From {fromState}</div>
                {states.map((_, j) => (
                  <input
                    key={j}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={transitionMatrix[i][j].toFixed(2)}
                    onChange={(e) => updateTransition(i, j, e.target.value)}
                    className="matrix-input"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="current-state">
          <h4>Current State</h4>
          <div className={`state-indicator state-${currentState}`}>
            {states[currentState]}
          </div>
          <div className="simulation-path">
            <h5>Path: {simulationHistory.map((s) => states[s]).join(" → ")}</h5>
          </div>
        </div>

        <div className="steady-state">
          <h4>Steady State Probabilities</h4>
          {states.map((state, i) => (
            <div key={i} className="steady-prob">
              <span>{state}:</span>
              <span className="prob-bar">
                <div
                  className="prob-fill"
                  style={{ width: `${steadyState[i] * 100}%` }}
                ></div>
                <span className="prob-text">
                  {(steadyState[i] * 100).toFixed(1)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hypothesis Testing Dashboard Component
export function HypothesisTestingDashboard() {
  const [nullMean, setNullMean] = useState(0);
  const [trueMean, setTrueMean] = useState(0.5);
  const [sampleSize, setSampleSize] = useState(30);
  const [alpha, setAlpha] = useState(0.05);
  const [sigma, setSigma] = useState(1);
  const [testType, setTestType] = useState("two-tailed");
  const [results, setResults] = useState({});

  useEffect(() => {
    calculateHypothesisTest();
  }, [nullMean, trueMean, sampleSize, alpha, sigma, testType]);

  const calculateHypothesisTest = () => {
    const standardError = sigma / Math.sqrt(sampleSize);
    const zScore = (trueMean - nullMean) / standardError;

    let criticalValue, pValue, power;

    if (testType === "two-tailed") {
      criticalValue = 1.96; // For α = 0.05
      pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
      power =
        normalCDF(zScore - criticalValue) +
        (1 - normalCDF(zScore + criticalValue));
    } else if (testType === "right-tailed") {
      criticalValue = 1.645; // For α = 0.05
      pValue = 1 - normalCDF(zScore);
      power = 1 - normalCDF(criticalValue - zScore);
    } else {
      // left-tailed
      criticalValue = -1.645;
      pValue = normalCDF(zScore);
      power = normalCDF(criticalValue - zScore);
    }

    const typeIError = alpha;
    const typeIIError = 1 - power;

    setResults({
      zScore,
      pValue,
      power,
      typeIError,
      typeIIError,
      criticalValue,
      rejectNull: Math.abs(zScore) > Math.abs(criticalValue),
      standardError,
    });
  };

  const normalCDF = (x) => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  const erf = (x) => {
    // Approximation of error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  return (
    <div className="interactive-card">
      <h3>🧪 Hypothesis Testing Dashboard</h3>
      <p>Explore Type I/II errors, p-values, and statistical power!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Null Hypothesis Mean (μ₀): {nullMean}</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={nullMean}
            onChange={(e) => setNullMean(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>True Mean (μ₁): {trueMean}</label>
          <input
            type="range"
            min="-2"
            max="3"
            step="0.1"
            value={trueMean}
            onChange={(e) => setTrueMean(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Sample Size (n): {sampleSize}</label>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Significance Level (α): {alpha}</label>
          <input
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Test Type:</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="two-tailed">Two-tailed</option>
            <option value="right-tailed">Right-tailed</option>
            <option value="left-tailed">Left-tailed</option>
          </select>
        </div>
      </div>

      <div className="hypothesis-results">
        <div className="result-section">
          <h4>Test Results</h4>
          <div className="test-stats">
            <div className="stat-item">
              <label>Z-Score:</label>
              <span className="stat-value">{results.zScore?.toFixed(3)}</span>
            </div>
            <div className="stat-item">
              <label>p-value:</label>
              <span
                className={`stat-value ${
                  results.pValue < alpha ? "significant" : "not-significant"
                }`}
              >
                {results.pValue?.toFixed(4)}
              </span>
            </div>
            <div className="stat-item">
              <label>Decision:</label>
              <span
                className={`decision ${
                  results.rejectNull ? "reject" : "fail-reject"
                }`}
              >
                {results.rejectNull ? "Reject H₀" : "Fail to Reject H₀"}
              </span>
            </div>
          </div>
        </div>

        <div className="error-analysis">
          <h4>Error Analysis</h4>
          <div className="error-grid">
            <div className="error-card type1">
              <h5>Type I Error (α)</h5>
              <div className="error-value">
                {(results.typeIError * 100).toFixed(1)}%
              </div>
              <p>Reject true H₀</p>
            </div>
            <div className="error-card type2">
              <h5>Type II Error (β)</h5>
              <div className="error-value">
                {(results.typeIIError * 100).toFixed(1)}%
              </div>
              <p>Accept false H₀</p>
            </div>
            <div className="error-card power">
              <h5>Power (1-β)</h5>
              <div className="error-value">
                {(results.power * 100).toFixed(1)}%
              </div>
              <p>Correctly reject false H₀</p>
            </div>
          </div>
        </div>
      </div>

      <PowerCurveVisualization
        nullMean={nullMean}
        trueMean={trueMean}
        sampleSize={sampleSize}
        alpha={alpha}
        sigma={sigma}
        testType={testType}
      />
    </div>
  );
}

// Power Curve Visualization Component
function PowerCurveVisualization({
  nullMean,
  trueMean,
  sampleSize,
  alpha,
  sigma,
  testType,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawPowerCurve();
    }
  }, [nullMean, trueMean, sampleSize, alpha, sigma, testType]);

  const drawPowerCurve = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const margin = 40;

    // Draw axes
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(margin, margin);
    ctx.stroke();

    // Draw power curve
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.beginPath();

    const minEffect = -2;
    const maxEffect = 2;
    const standardError = sigma / Math.sqrt(sampleSize);

    for (let i = 0; i <= 100; i++) {
      const effectSize = minEffect + (maxEffect - minEffect) * (i / 100);
      const x = margin + (width - 2 * margin) * (i / 100);

      // Calculate power for this effect size
      const zScore = effectSize / standardError;
      let power;

      if (testType === "two-tailed") {
        const criticalValue = 1.96;
        power =
          normalCDF(zScore - criticalValue) +
          (1 - normalCDF(zScore + criticalValue));
      } else if (testType === "right-tailed") {
        const criticalValue = 1.645;
        power = 1 - normalCDF(criticalValue - zScore);
      } else {
        const criticalValue = -1.645;
        power = normalCDF(criticalValue - zScore);
      }

      const y =
        height -
        margin -
        (height - 2 * margin) * Math.max(0, Math.min(1, power));

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mark current effect size
    const currentEffect = trueMean - nullMean;
    const currentX =
      margin +
      (width - 2 * margin) *
        ((currentEffect - minEffect) / (maxEffect - minEffect));

    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.arc(
      currentX,
      height - margin - (height - 2 * margin) * 0.5,
      5,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Add labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Effect Size", width / 2 - 30, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Power", -20, 0);
    ctx.restore();
  };

  const normalCDF = (x) => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  const erf = (x) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  return (
    <div className="power-curve">
      <h4>Power Curve</h4>
      <canvas ref={canvasRef} className="power-canvas"></canvas>
      <p className="power-note">
        Red line shows power vs effect size. Green dot shows current settings.
      </p>
    </div>
  );
}

// Maximum Likelihood Estimation Component
export function MaximumLikelihoodEstimation() {
  const [distribution, setDistribution] = useState("normal");
  const [data, setData] = useState([]);
  const [parameters, setParameters] = useState({ mu: 0, sigma: 1 });
  const [mleParams, setMleParams] = useState({ mu: 0, sigma: 1 });
  const [likelihood, setLikelihood] = useState(0);
  const [sampleSize, setSampleSize] = useState(50);

  useEffect(() => {
    generateData();
  }, [distribution, sampleSize]);

  useEffect(() => {
    calculateMLE();
    calculateLikelihood();
  }, [data, parameters]);

  const generateData = () => {
    const newData = [];
    for (let i = 0; i < sampleSize; i++) {
      if (distribution === "normal") {
        newData.push(normalRandom(0, 1));
      } else if (distribution === "exponential") {
        newData.push(-Math.log(Math.random()));
      }
    }
    setData(newData);
  };

  const normalRandom = (mean, std) => {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return (
      mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    );
  };

  const calculateMLE = () => {
    if (data.length === 0) return;

    if (distribution === "normal") {
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const variance =
        data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length;
      setMleParams({ mu: mean, sigma: Math.sqrt(variance) });
    } else if (distribution === "exponential") {
      const lambda = data.length / data.reduce((a, b) => a + b, 0);
      setMleParams({ lambda });
    }
  };

  const calculateLikelihood = () => {
    if (data.length === 0) return;

    let logLikelihood = 0;

    if (distribution === "normal") {
      const { mu, sigma } = parameters;
      for (let x of data) {
        logLikelihood +=
          -0.5 * Math.log(2 * Math.PI * sigma * sigma) -
          ((x - mu) * (x - mu)) / (2 * sigma * sigma);
      }
    } else if (distribution === "exponential") {
      const { lambda } = parameters;
      for (let x of data) {
        logLikelihood += Math.log(lambda) - lambda * x;
      }
    }

    setLikelihood(logLikelihood);
  };

  return (
    <div className="interactive-card">
      <h3>📈 Maximum Likelihood Estimation</h3>
      <p>
        Find the parameters that maximize the likelihood of observing your data!
      </p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Distribution:</label>
          <select
            value={distribution}
            onChange={(e) => setDistribution(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="exponential">Exponential</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sample Size: {sampleSize}</label>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <button onClick={generateData} className="generate-btn">
          🎲 Generate New Data
        </button>
      </div>

      {distribution === "normal" && (
        <div className="parameter-controls">
          <div className="control-group">
            <label>Mean (μ): {parameters.mu.toFixed(2)}</label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={parameters.mu}
              onChange={(e) =>
                setParameters({ ...parameters, mu: parseFloat(e.target.value) })
              }
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Std Dev (σ): {parameters.sigma.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={parameters.sigma}
              onChange={(e) =>
                setParameters({
                  ...parameters,
                  sigma: parseFloat(e.target.value),
                })
              }
              className="slider"
            />
          </div>
        </div>
      )}

      <div className="mle-results">
        <div className="likelihood-display">
          <h4>Current Log-Likelihood: {likelihood.toFixed(2)}</h4>
          <div className="likelihood-bar">
            <div
              className="likelihood-fill"
              style={{
                width: `${Math.max(0, Math.min(100, (likelihood + 200) / 4))}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mle-estimates">
          <h4>MLE Estimates:</h4>
          {distribution === "normal" ? (
            <div>
              <p>μ̂ = {mleParams.mu.toFixed(3)}</p>
              <p>σ̂ = {mleParams.sigma.toFixed(3)}</p>
            </div>
          ) : (
            <p>λ̂ = {mleParams.lambda?.toFixed(3)}</p>
          )}
        </div>

        <button
          onClick={() => setParameters(mleParams)}
          className="use-mle-btn"
        >
          Use MLE Estimates
        </button>
      </div>

      <DataVisualization
        data={data}
        parameters={parameters}
        distribution={distribution}
      />
    </div>
  );
}

// Data Visualization Component for MLE
function DataVisualization({ data, parameters, distribution }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data.length > 0) {
      drawVisualization();
    }
  }, [data, parameters, distribution]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw histogram of data
    const bins = 20;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogram = new Array(bins).fill(0);

    data.forEach((value) => {
      const bin = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      histogram[bin]++;
    });

    const maxCount = Math.max(...histogram);
    const barWidth = canvas.width / bins;

    // Draw histogram bars
    ctx.fillStyle = "#667eea60";
    ctx.strokeStyle = "#667eea";
    histogram.forEach((count, i) => {
      const height = (count / maxCount) * canvas.height * 0.7;
      const x = i * barWidth;
      const y = canvas.height - height;
      ctx.fillRect(x, y, barWidth - 1, height);
      ctx.strokeRect(x, y, barWidth - 1, height);
    });

    // Draw theoretical distribution
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= 100; i++) {
      const x = min + (max - min) * (i / 100);
      const canvasX = (i / 100) * canvas.width;

      let density;
      if (distribution === "normal") {
        const { mu, sigma } = parameters;
        density =
          (1 / (sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
      } else if (distribution === "exponential") {
        const { lambda } = parameters;
        density = x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
      }

      const canvasY =
        canvas.height - density * canvas.height * 0.7 * data.length * binWidth;

      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();
  };

  return (
    <div className="data-visualization">
      <h4>Data vs Theoretical Distribution</h4>
      <canvas ref={canvasRef} className="data-canvas"></canvas>
      <p className="viz-note">
        Blue bars: observed data. Red line: theoretical distribution with
        current parameters.
      </p>
    </div>
  );
}
