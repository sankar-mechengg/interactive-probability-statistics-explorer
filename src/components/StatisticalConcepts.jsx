"use client";

import { useState, useEffect, useRef } from "react";

// ========== PRIORITY 3: ADVANCED STATISTICAL CONCEPTS ==========

// Joint Distribution Explorer Component
export function JointDistributionExplorer() {
  const [correlationCoeff, setCorrelationCoeff] = useState(0.5);
  const [marginalMeanX, setMarginalMeanX] = useState(0);
  const [marginalMeanY, setMarginalMeanY] = useState(0);
  const [marginalStdX, setMarginalStdX] = useState(1);
  const [marginalStdY, setMarginalStdY] = useState(1);
  const [sampleSize, setSampleSize] = useState(200);
  const [data, setData] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    generateBivariateData();
  }, [
    correlationCoeff,
    marginalMeanX,
    marginalMeanY,
    marginalStdX,
    marginalStdY,
    sampleSize,
  ]);

  const generateBivariateData = () => {
    const newData = [];

    for (let i = 0; i < sampleSize; i++) {
      // Generate correlated bivariate normal data
      const z1 = normalRandom(0, 1);
      const z2 = normalRandom(0, 1);

      const x = marginalMeanX + marginalStdX * z1;
      const y =
        marginalMeanY +
        marginalStdY *
          (correlationCoeff * z1 +
            Math.sqrt(1 - correlationCoeff * correlationCoeff) * z2);

      newData.push({ x, y });
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

  return (
    <div className="interactive-card">
      <h3>📊 Joint Distribution Explorer</h3>
      <p>Explore relationships between two random variables!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Correlation: {correlationCoeff.toFixed(2)}</label>
          <input
            type="range"
            min="-0.9"
            max="0.9"
            step="0.1"
            value={correlationCoeff}
            onChange={(e) => setCorrelationCoeff(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>X Mean: {marginalMeanX.toFixed(1)}</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={marginalMeanX}
            onChange={(e) => setMarginalMeanX(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Y Mean: {marginalMeanY.toFixed(1)}</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={marginalMeanY}
            onChange={(e) => setMarginalMeanY(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Sample Size: {sampleSize}</label>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="joint-visualization">
        <ScatterPlot
          data={data}
          onPointSelect={setSelectedPoint}
          correlationCoeff={correlationCoeff}
        />

        <div className="marginal-info">
          <h4>Marginal Distributions</h4>
          <div className="marginal-stats">
            <div className="marginal-x">
              <h5>
                X ~ N({marginalMeanX.toFixed(1)}, {marginalStdX.toFixed(1)}²)
              </h5>
              <MarginalHistogram data={data.map((d) => d.x)} color="#667eea" />
            </div>
            <div className="marginal-y">
              <h5>
                Y ~ N({marginalMeanY.toFixed(1)}, {marginalStdY.toFixed(1)}²)
              </h5>
              <MarginalHistogram data={data.map((d) => d.y)} color="#e74c3c" />
            </div>
          </div>

          {selectedPoint && (
            <div className="point-info">
              <h5>Selected Point</h5>
              <p>X = {selectedPoint.x.toFixed(2)}</p>
              <p>Y = {selectedPoint.y.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="correlation-insights">
        <div className="insight-card">
          <h4>Correlation Strength</h4>
          <div className="correlation-meter">
            <div
              className="correlation-fill"
              style={{
                width: `${Math.abs(correlationCoeff) * 100}%`,
                backgroundColor: correlationCoeff > 0 ? "#2ecc71" : "#e74c3c",
              }}
            ></div>
          </div>
          <p>{getCorrelationDescription(correlationCoeff)}</p>
        </div>
      </div>
    </div>
  );
}

// Scatter Plot Component
function ScatterPlot({ data, onPointSelect, correlationCoeff }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data.length > 0) {
      drawScatterPlot();
    }
  }, [data, correlationCoeff]);

  const drawScatterPlot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    // Find data bounds
    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const yMin = Math.min(...data.map((d) => d.y));
    const yMax = Math.max(...data.map((d) => d.y));

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Draw axes
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = "#667eea80";
    data.forEach((point) => {
      const x = margin + ((point.x - xMin) / xRange) * width;
      const y = canvas.height - margin - ((point.y - yMin) / yRange) * height;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw regression line if correlation exists
    if (Math.abs(correlationCoeff) > 0.1) {
      const slope = correlationCoeff * (yRange / xRange);
      const yIntercept = (yMin + yMax) / 2 - (slope * (xMin + xMax)) / 2;

      ctx.strokeStyle = "#e74c3c";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const x1 = margin;
      const y1 =
        canvas.height -
        margin -
        ((slope * xMin + yIntercept - yMin) / yRange) * height;
      const x2 = canvas.width - margin;
      const y2 =
        canvas.height -
        margin -
        ((slope * xMax + yIntercept - yMin) / yRange) * height;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Add axis labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("X", canvas.width - 20, canvas.height - 10);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Y", -10, 0);
    ctx.restore();
  };

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find closest data point
    let closestPoint = null;
    let minDistance = Infinity;

    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    const xMin = Math.min(...data.map((d) => d.x));
    const xMax = Math.max(...data.map((d) => d.x));
    const yMin = Math.min(...data.map((d) => d.y));
    const yMax = Math.max(...data.map((d) => d.y));

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    data.forEach((point) => {
      const px = margin + ((point.x - xMin) / xRange) * width;
      const py = canvas.height - margin - ((point.y - yMin) / yRange) * height;

      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (distance < minDistance && distance < 10) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    if (closestPoint) {
      onPointSelect(closestPoint);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="scatter-plot"
      width={400}
      height={300}
      onClick={handleClick}
    ></canvas>
  );
}

// Marginal Histogram Component
function MarginalHistogram({ data, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data.length > 0) {
      drawHistogram();
    }
  }, [data, color]);

  const drawHistogram = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bins = 15;
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

    ctx.fillStyle = color + "80";
    ctx.strokeStyle = color;

    histogram.forEach((count, i) => {
      const height = (count / maxCount) * canvas.height * 0.8;
      const x = i * barWidth;
      const y = canvas.height - height;

      ctx.fillRect(x, y, barWidth - 1, height);
      ctx.strokeRect(x, y, barWidth - 1, height);
    });
  };

  return <canvas ref={canvasRef} className="marginal-histogram"></canvas>;
}

function getCorrelationDescription(corr) {
  const abs = Math.abs(corr);
  const sign = corr > 0 ? "positive" : "negative";

  if (abs < 0.1) return "No correlation";
  if (abs < 0.3) return `Weak ${sign} correlation`;
  if (abs < 0.7) return `Moderate ${sign} correlation`;
  return `Strong ${sign} correlation`;
}

// Time Series and Stochastic Processes Component
export function TimeSeriesExplorer() {
  const [processType, setProcessType] = useState("random-walk");
  const [parameters, setParameters] = useState({
    drift: 0,
    volatility: 1,
    meanReversion: 0.1,
    longTermMean: 0,
    timeSteps: 250,
  });
  const [timeSeries, setTimeSeries] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const processTypes = {
    "random-walk": "Random Walk",
    "random-walk-drift": "Random Walk with Drift",
    "mean-reverting": "Mean Reverting Process",
    "geometric-brownian": "Geometric Brownian Motion",
  };

  useEffect(() => {
    generateTimeSeries();
  }, [processType, parameters]);

  const generateTimeSeries = () => {
    const { drift, volatility, meanReversion, longTermMean, timeSteps } =
      parameters;
    const dt = 1 / 252; // Daily time step (252 trading days per year)
    const series = [0]; // Start at 0

    for (let i = 1; i < timeSteps; i++) {
      const prevValue = series[i - 1];
      const dW = normalRandom(0, Math.sqrt(dt)); // Brownian motion increment
      let nextValue;

      switch (processType) {
        case "random-walk":
          nextValue = prevValue + volatility * dW;
          break;
        case "random-walk-drift":
          nextValue = prevValue + drift * dt + volatility * dW;
          break;
        case "mean-reverting":
          nextValue =
            prevValue +
            meanReversion * (longTermMean - prevValue) * dt +
            volatility * dW;
          break;
        case "geometric-brownian":
          nextValue =
            prevValue *
            Math.exp(
              (drift - 0.5 * volatility * volatility) * dt + volatility * dW
            );
          break;
        default:
          nextValue = prevValue;
      }

      series.push(nextValue);
    }

    setTimeSeries(series);
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

  const animateGeneration = () => {
    setIsAnimating(true);
    setTimeSeries([0]);

    let currentStep = 1;
    const interval = setInterval(() => {
      const { drift, volatility, meanReversion, longTermMean, timeSteps } =
        parameters;
      const dt = 1 / 252;

      setTimeSeries((prev) => {
        const newSeries = [...prev];
        const prevValue = newSeries[newSeries.length - 1];
        const dW = normalRandom(0, Math.sqrt(dt));
        let nextValue;

        switch (processType) {
          case "random-walk":
            nextValue = prevValue + volatility * dW;
            break;
          case "random-walk-drift":
            nextValue = prevValue + drift * dt + volatility * dW;
            break;
          case "mean-reverting":
            nextValue =
              prevValue +
              meanReversion * (longTermMean - prevValue) * dt +
              volatility * dW;
            break;
          case "geometric-brownian":
            nextValue =
              prevValue *
              Math.exp(
                (drift - 0.5 * volatility * volatility) * dt + volatility * dW
              );
            break;
          default:
            nextValue = prevValue;
        }

        newSeries.push(nextValue);
        return newSeries;
      });

      currentStep++;
      if (currentStep >= parameters.timeSteps) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 20);
  };

  return (
    <div className="interactive-card">
      <h3>📈 Time Series & Stochastic Processes</h3>
      <p>Explore different types of random processes over time!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Process Type:</label>
          <select
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
          >
            {Object.entries(processTypes).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {processType !== "random-walk" && (
          <div className="control-group">
            <label>Drift: {parameters.drift.toFixed(2)}</label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              value={parameters.drift}
              onChange={(e) =>
                setParameters({
                  ...parameters,
                  drift: parseFloat(e.target.value),
                })
              }
              className="slider"
            />
          </div>
        )}

        <div className="control-group">
          <label>Volatility: {parameters.volatility.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={parameters.volatility}
            onChange={(e) =>
              setParameters({
                ...parameters,
                volatility: parseFloat(e.target.value),
              })
            }
            className="slider"
          />
        </div>

        {processType === "mean-reverting" && (
          <>
            <div className="control-group">
              <label>
                Mean Reversion Speed: {parameters.meanReversion.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={parameters.meanReversion}
                onChange={(e) =>
                  setParameters({
                    ...parameters,
                    meanReversion: parseFloat(e.target.value),
                  })
                }
                className="slider"
              />
            </div>

            <div className="control-group">
              <label>
                Long-term Mean: {parameters.longTermMean.toFixed(1)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={parameters.longTermMean}
                onChange={(e) =>
                  setParameters({
                    ...parameters,
                    longTermMean: parseFloat(e.target.value),
                  })
                }
                className="slider"
              />
            </div>
          </>
        )}
      </div>

      <div className="time-series-controls">
        <button onClick={generateTimeSeries} className="generate-btn">
          🔄 Generate New Series
        </button>
        <button
          onClick={animateGeneration}
          disabled={isAnimating}
          className="animate-btn"
        >
          {isAnimating ? "Animating..." : "🎬 Animate Generation"}
        </button>
      </div>

      <TimeSeriesChart data={timeSeries} processType={processType} />

      <TimeSeriesStats data={timeSeries} />
    </div>
  );
}

// Time Series Chart Component
function TimeSeriesChart({ data, processType }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data.length > 1) {
      drawChart();
    }
  }, [data, processType]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue || 1;

    // Draw axes
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Draw time series
    ctx.strokeStyle = "#667eea";
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * width;
      const y =
        canvas.height - margin - ((value - minValue) / valueRange) * height;

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Add zero line if data crosses zero
    if (minValue < 0 && maxValue > 0) {
      const zeroY =
        canvas.height - margin - ((0 - minValue) / valueRange) * height;
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(margin, zeroY);
      ctx.lineTo(canvas.width - margin, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Add labels
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Time", canvas.width - 30, canvas.height - 10);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Value", -20, 0);
    ctx.restore();
  };

  return <canvas ref={canvasRef} className="time-series-chart"></canvas>;
}

// Time Series Statistics Component
function TimeSeriesStats({ data }) {
  if (data.length < 2) return null;

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance =
    data.reduce((a, b) => a + (b - mean) ** 2, 0) / (data.length - 1);
  const std = Math.sqrt(variance);

  const returns = data.slice(1).map((value, i) => value - data[i]);
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const volatility = Math.sqrt(
    returns.reduce((a, b) => a + (b - meanReturn) ** 2, 0) /
      (returns.length - 1)
  );

  return (
    <div className="time-series-stats">
      <h4>Series Statistics</h4>
      <div className="stats-grid">
        <div className="stat-item">
          <label>Mean Level:</label>
          <span>{mean.toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>Standard Deviation:</label>
          <span>{std.toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>Mean Return:</label>
          <span>{meanReturn.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <label>Volatility:</label>
          <span>{volatility.toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>Min Value:</label>
          <span>{Math.min(...data).toFixed(3)}</span>
        </div>
        <div className="stat-item">
          <label>Max Value:</label>
          <span>{Math.max(...data).toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

// Bayesian Inference Workshop Component
export function BayesianInferenceWorkshop() {
  const [priorType, setPriorType] = useState("normal");
  const [priorParams, setPriorParams] = useState({ mean: 0, std: 1 });
  const [likelihood, setLikelihood] = useState("normal");
  const [data, setData] = useState([]);
  const [posteriorParams, setPosteriorParams] = useState({ mean: 0, std: 1 });
  const [sampleSize, setSampleSize] = useState(10);
  const [trueMean, setTrueMean] = useState(1.5);

  useEffect(() => {
    generateData();
  }, [sampleSize, trueMean]);

  useEffect(() => {
    if (data.length > 0) {
      updatePosterior();
    }
  }, [data, priorParams, likelihood]);

  const generateData = () => {
    const newData = [];
    for (let i = 0; i < sampleSize; i++) {
      newData.push(normalRandom(trueMean, 1));
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

  const updatePosterior = () => {
    if (priorType === "normal" && likelihood === "normal") {
      // Conjugate prior: Normal-Normal model
      const priorPrecision = 1 / priorParams.std ** 2;
      const likelihoodPrecision = data.length; // Assuming σ² = 1 for simplicity
      const dataSum = data.reduce((a, b) => a + b, 0);

      const posteriorPrecision = priorPrecision + likelihoodPrecision;
      const posteriorMean =
        (priorPrecision * priorParams.mean +
          likelihoodPrecision * (dataSum / data.length)) /
        posteriorPrecision;
      const posteriorStd = Math.sqrt(1 / posteriorPrecision);

      setPosteriorParams({ mean: posteriorMean, std: posteriorStd });
    }
  };

  return (
    <div className="interactive-card">
      <h3>🔮 Bayesian Inference Workshop</h3>
      <p>Update your beliefs as evidence accumulates!</p>

      <div className="controls-grid">
        <div className="control-group">
          <label>Prior Mean: {priorParams.mean.toFixed(2)}</label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={priorParams.mean}
            onChange={(e) =>
              setPriorParams({
                ...priorParams,
                mean: parseFloat(e.target.value),
              })
            }
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Prior Std: {priorParams.std.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={priorParams.std}
            onChange={(e) =>
              setPriorParams({
                ...priorParams,
                std: parseFloat(e.target.value),
              })
            }
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>True Mean: {trueMean.toFixed(1)}</label>
          <input
            type="range"
            min="-2"
            max="4"
            step="0.1"
            value={trueMean}
            onChange={(e) => setTrueMean(parseFloat(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Sample Size: {sampleSize}</label>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={sampleSize}
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <button onClick={generateData} className="generate-btn">
        🎲 Generate New Data
      </button>

      <BayesianVisualization
        priorParams={priorParams}
        posteriorParams={posteriorParams}
        data={data}
        trueMean={trueMean}
      />

      <div className="bayesian-summary">
        <div className="belief-evolution">
          <h4>Belief Evolution</h4>
          <div className="belief-comparison">
            <div className="belief-item">
              <h5>Prior Belief</h5>
              <p>
                μ ~ N({priorParams.mean.toFixed(2)},{" "}
                {priorParams.std.toFixed(2)}²)
              </p>
            </div>
            <div className="belief-arrow">→</div>
            <div className="belief-item">
              <h5>Posterior Belief</h5>
              <p>
                μ ~ N({posteriorParams.mean.toFixed(2)},{" "}
                {posteriorParams.std.toFixed(2)}²)
              </p>
            </div>
          </div>

          <div className="credible-interval">
            <h5>95% Credible Interval</h5>
            <p>
              [{(posteriorParams.mean - 1.96 * posteriorParams.std).toFixed(2)},{" "}
              {(posteriorParams.mean + 1.96 * posteriorParams.std).toFixed(2)}]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Bayesian Visualization Component
function BayesianVisualization({
  priorParams,
  posteriorParams,
  data,
  trueMean,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawBayesianUpdate();
    }
  }, [priorParams, posteriorParams, data, trueMean]);

  const drawBayesianUpdate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;

    // Draw prior distribution
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xMin = -5;
    const xMax = 5;

    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * (i / 100);
      const density = normalPDF(x, priorParams.mean, priorParams.std);
      const canvasX = margin + (i / 100) * width;
      const canvasY = canvas.height - margin - density * height * 0.7;

      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();

    // Draw posterior distribution
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * (i / 100);
      const density = normalPDF(x, posteriorParams.mean, posteriorParams.std);
      const canvasX = margin + (i / 100) * width;
      const canvasY = canvas.height - margin - density * height * 0.7;

      if (i === 0) ctx.moveTo(canvasX, canvasY);
      else ctx.lineTo(canvasX, canvasY);
    }
    ctx.stroke();

    // Mark true mean
    const trueMeanX = margin + ((trueMean - xMin) / (xMax - xMin)) * width;
    ctx.strokeStyle = "#2ecc71";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(trueMeanX, margin);
    ctx.lineTo(trueMeanX, canvas.height - margin);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add legend
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    ctx.fillText("Blue: Prior", margin, margin - 20);
    ctx.fillText("Red: Posterior", margin + 80, margin - 20);
    ctx.fillText("Green: True Mean", margin + 170, margin - 20);

    // Show data points
    if (data.length > 0) {
      ctx.fillStyle = "#34495e";
      data.forEach((point, i) => {
        const x = margin + ((point - xMin) / (xMax - xMin)) * width;
        const y = canvas.height - margin + 10 + (i % 3) * 5;
        ctx.fillRect(x - 1, y, 2, 8);
      });
    }
  };

  const normalPDF = (x, mean, std) => {
    return (
      (1 / (std * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * ((x - mean) / std) ** 2)
    );
  };

  return (
    <div className="bayesian-visualization">
      <h4>Prior → Posterior Evolution</h4>
      <canvas ref={canvasRef} className="bayesian-canvas"></canvas>
      <p className="viz-note">
        Blue: Prior belief, Red: Updated belief, Green: True parameter
      </p>
    </div>
  );
}
