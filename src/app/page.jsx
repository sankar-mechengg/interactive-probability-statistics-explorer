"use client";

import { useEffect, useState } from "react";
import * as Engine from "../lib/engine";

// Import interactive components
import {
  BayesCalculator,
  CentralLimitDemo,
  ConditionalProbabilityViz,
} from "../components/InteractiveVisualizations";
import {
  MarkovChainSimulator,
  HypothesisTestingDashboard,
  MaximumLikelihoodEstimation,
} from "../components/AdvancedConcepts";
import {
  JointDistributionExplorer,
  TimeSeriesExplorer,
  BayesianInferenceWorkshop,
} from "../components/StatisticalConcepts";

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before running DOM operations
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Initialize first view (Bernoulli) and set up cleanup
      Engine.updateBernoulli();
      return () => Engine.stopAnimation();
    }
  }, [isClient]);

  return (
    <div className="container">
      <div className="header">
        <h1>📊 Interactive Probability & Statistics Explorer</h1>
        <p>
          Master probability distributions, statistical concepts, and advanced
          analytics through comprehensive interactive visualizations and
          real-world applications!
        </p>
      </div>

      {/* Intro */}
      <div className="intro-card">
        <h2>📊 Understanding Mean & Standard Deviation</h2>
        <div className="concept">
          <h3>📍 Mean (Average)</h3>
          <p>
            <strong>What it is:</strong> The &quot;center&quot; or &quot;balance
            point&quot; of your data. Imagine balancing all your data points on
            a seesaw - the mean is where the fulcrum needs to be!
          </p>
          <p>
            <strong>Real example:</strong> If 5 friends have heights of 160,
            165, 170, 175, 180 cm, the mean is (160+165+170+175+180)/5 = 170 cm.
            This is the &quot;typical&quot; height.
          </p>
        </div>
        <div className="concept">
          <h3>📏 Standard Deviation (Spread)</h3>
          <p>
            <strong>What it is:</strong> How &quot;spread out&quot; your data is
            from the mean. Small = data clusters near the mean. Large = data
            spreads far from the mean.
          </p>
          <p>
            <strong>Real example:</strong> Test scores with mean 75 and std dev
            5 means most students scored between 70-80. With std dev 15, scores
            vary widely from 60-90!
          </p>
          <p>
            <strong>Rule of thumb:</strong> About 68% of data falls within 1
            standard deviation, 95% within 2, and 99.7% within 3!
          </p>
        </div>
      </div>

      {/* Core Probability Concepts */}
      <div className="concepts-section">
        <h2>🎯 Fundamental Probability Concepts</h2>
        <div className="concepts-grid">
          {/* PMF vs PDF */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>📊 PMF vs PDF</h3>
              <p>Discrete vs Continuous Probability</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>PMF (Probability Mass Function):</strong> For discrete
                variables - gives exact probability at each point
              </p>
              <p>
                <strong>PDF (Probability Density Function):</strong> For
                continuous variables - probability is area under curve
              </p>
              <div className="visual-example">
                <div className="pmf-example">
                  <strong>PMF Example:</strong> P(X = 3) = 0.25 for dice roll
                </div>
                <div className="pdf-example">
                  <strong>PDF Example:</strong> P(2 ≤ X ≤ 3) = ∫[2,3] f(x)dx for
                  height
                </div>
              </div>
            </div>
          </div>

          {/* Bayes' Theorem */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>🧠 Bayes&apos; Theorem</h3>
              <p>Updating Probabilities with Evidence</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>Formula:</strong> P(A|B) = P(B|A) × P(A) / P(B)
              </p>
              <div className="bayes-example">
                <strong>Medical Example:</strong>
                <ul>
                  <li>Disease rate: 1% of population</li>
                  <li>Test accuracy: 95% correct</li>
                  <li>
                    Positive test result → What&apos;s actual disease
                    probability?
                  </li>
                  <li>
                    <strong>Answer:</strong> Only ~16% (not 95%!)
                  </li>
                </ul>
              </div>
              <p>
                <em>Shows why context matters more than test accuracy!</em>
              </p>
            </div>
          </div>

          {/* Central Limit Theorem */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>🎯 Central Limit Theorem</h3>
              <p>The Magic of Large Samples</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>Key Insight:</strong> Sample means become normally
                distributed, regardless of original distribution!
              </p>
              <div className="clt-example">
                <strong>Example:</strong>
                <ul>
                  <li>Roll 1 die: Uniform distribution (1-6)</li>
                  <li>Average of 30 dice: Normal distribution!</li>
                  <li>Works for ANY original distribution</li>
                </ul>
              </div>
              <p>
                <em>
                  Foundation of statistical inference and confidence intervals
                </em>
              </p>
            </div>
          </div>

          {/* Conditional Probability */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>🔗 Conditional Probability</h3>
              <p>When Information Changes Everything</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>Formula:</strong> P(A|B) = P(A ∩ B) / P(B)
              </p>
              <div className="conditional-example">
                <strong>Card Example:</strong>
                <ul>
                  <li>P(King) = 4/52 = 7.7%</li>
                  <li>P(King | Face Card) = 4/12 = 33.3%</li>
                  <li>
                    Knowing it&apos;s a face card triples the probability!
                  </li>
                </ul>
              </div>
              <p>
                <em>Essential for understanding dependence and correlation</em>
              </p>
            </div>
          </div>

          {/* Markov Chains */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>⛓️ Markov Chains</h3>
              <p>Predicting Future from Present</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>Key Idea:</strong> Future depends only on current state,
                not history
              </p>
              <div className="markov-example">
                <strong>Weather Example:</strong>
                <ul>
                  <li>If sunny today → 70% sunny tomorrow</li>
                  <li>If rainy today → 60% sunny tomorrow</li>
                  <li>Long-term: ~63% sunny days (steady state)</li>
                </ul>
              </div>
              <p>
                <em>Used in Google PageRank, stock prices, genetics</em>
              </p>
            </div>
          </div>

          {/* Statistical Inference */}
          <div className="concept-card">
            <div className="concept-header">
              <h3>🔬 Statistical Inference</h3>
              <p>Learning from Data</p>
            </div>
            <div className="concept-content">
              <p>
                <strong>Confidence Intervals:</strong> Range of plausible values
                for unknown parameter
              </p>
              <p>
                <strong>Hypothesis Testing:</strong> Is this effect real or just
                random?
              </p>
              <div className="inference-example">
                <strong>Example:</strong>
                <ul>
                  <li>Sample mean height: 170cm ± 3cm (95% confidence)</li>
                  <li>p-value less than 0.05 means reject null hypothesis</li>
                </ul>
              </div>
              <p>
                <em>Foundation of scientific research and A/B testing</em>
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Visualizations Section */}
        <div className="interactive-section">
          <h3>🎮 Interactive Visualizations - Now Available!</h3>
          <p>Explore these concepts through hands-on interactive demos:</p>
        </div>
      </div>

      {/* Priority 1: Core Interactive Visualizations */}
      <div className="priority-section">
        <h2>🎯 Core Interactive Concepts</h2>

        <BayesCalculator />
        <CentralLimitDemo />
        <ConditionalProbabilityViz />
      </div>

      {/* Priority 2: Advanced Concepts */}
      <div className="priority-section">
        <h2>🚀 Advanced Statistical Methods</h2>

        <MarkovChainSimulator />
        <HypothesisTestingDashboard />
        <MaximumLikelihoodEstimation />
      </div>

      {/* Priority 3: Statistical Modeling */}
      <div className="priority-section">
        <h2>📊 Statistical Modeling & Analysis</h2>

        <JointDistributionExplorer />
        <TimeSeriesExplorer />
        <BayesianInferenceWorkshop />
      </div>

      {/* Distribution selector */}
      <div className="distribution-selector">
        <button
          className="dist-btn active"
          onClick={() => Engine.showDistribution("bernoulli")}
        >
          Bernoulli
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("binomial")}
        >
          Binomial
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("poisson")}
        >
          Poisson
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("normal")}
        >
          Normal/Gaussian
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("exponential")}
        >
          Exponential
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("uniform")}
        >
          Uniform
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("geometric")}
        >
          Geometric
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("gamma")}
        >
          Gamma
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("beta")}
        >
          Beta
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("laplace")}
        >
          Laplace
        </button>
        <button
          className="dist-btn"
          onClick={() => Engine.showDistribution("multinomial")}
        >
          Multinomial
        </button>
      </div>

      {/* --- Bernoulli --- */}
      <div className="distribution-card active" id="bernoulli">
        <div className="card-header">
          <div className="card-icon">🪙</div>
          <div className="card-title">
            <h2>Bernoulli Distribution</h2>
            <p>The simplest distribution - just YES or NO!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Coin Flip</h3>
          <p>
            Think of a coin flip: Heads (success) or Tails (failure).
            That&apos;s it! Used for any yes/no situation: Will it rain today?
            Will a customer buy? Will the light bulb work?
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Probability of Success (p):{" "}
              <span id="bernoulli-p-value">0.5</span>
            </label>
            <input
              type="range"
              id="bernoulli-p"
              min="0"
              max="1"
              step="0.01"
              defaultValue="0.5"
              onInput={Engine.updateBernoulli}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="bernoulli-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateBernoulli}>
          🎲 Flip Coin 100 Times
        </button>
        <button className="simulate-btn" onClick={Engine.animateBernoulli}>
          🎬 Watch Single Flip
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="bernoulli-mean">0.5</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="bernoulli-std">0.5</p>
          </div>
          <div className="stat-card">
            <h4>Success Rate</h4>
            <p id="bernoulli-success">50%</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> P(X = 1) = p, P(X = 0) = 1 - p
        </div>
      </div>

      {/* --- Binomial --- */}
      <div className="distribution-card" id="binomial">
        <div className="card-header">
          <div className="card-icon">🎯</div>
          <div className="card-title">
            <h2>Binomial Distribution</h2>
            <p>Count successes in multiple independent trials!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Free Throws</h3>
          <p>
            A basketball player shoots 10 free throws. Each shot has 70% success
            rate. How many will they make? Could be 0, could be 10, but likely
            around 7!
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Number of Trials (n): <span id="binomial-n-value">10</span>
            </label>
            <input
              type="range"
              id="binomial-n"
              min="1"
              max="50"
              defaultValue="10"
              onInput={Engine.updateBinomial}
            />
          </div>
          <div className="control-group">
            <label>
              Success Probability (p): <span id="binomial-p-value">0.5</span>
            </label>
            <input
              type="range"
              id="binomial-p"
              min="0"
              max="1"
              step="0.01"
              defaultValue="0.5"
              onInput={Engine.updateBinomial}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="binomial-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateBinomial}>
          🎲 Run 1000 Experiments
        </button>
        <button className="simulate-btn" onClick={Engine.animateBinomial}>
          🎬 Watch One Experiment
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="binomial-mean">5</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="binomial-std">1.58</p>
          </div>
          <div className="stat-card">
            <h4>Most Likely</h4>
            <p id="binomial-mode">5</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
        </div>
      </div>

      {/* --- Poisson --- */}
      <div className="distribution-card" id="poisson">
        <div className="card-header">
          <div className="card-icon">📧</div>
          <div className="card-title">
            <h2>Poisson Distribution</h2>
            <p>Count events in a fixed time/space interval!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Customer Arrivals</h3>
          <p>
            A coffee shop gets 3 customers per minute on average. In any minute,
            they might get 0, 1, 2, 3, 4, 5, or more! Poisson tells the
            likelihood.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Average Rate (λ): <span id="poisson-lambda-value">3</span>
            </label>
            <input
              type="range"
              id="poisson-lambda"
              min="0.5"
              max="20"
              step="0.5"
              defaultValue="3"
              onInput={Engine.updatePoisson}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="poisson-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulatePoisson}>
          🎲 Simulate 1000 Time Periods
        </button>
        <button className="simulate-btn" onClick={Engine.animatePoisson}>
          🎬 Watch Events Arrive
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="poisson-mean">3</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="poisson-std">1.73</p>
          </div>
          <div className="stat-card">
            <h4>Variance</h4>
            <p id="poisson-var">3</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> P(X = k) = (λ^k × e^(-λ)) / k!
        </div>
      </div>

      {/* --- Normal --- */}
      <div className="distribution-card" id="normal">
        <div className="card-header">
          <div className="card-icon">🔔</div>
          <div className="card-title">
            <h2>Normal (Gaussian) Distribution</h2>
            <p>The famous bell curve - nature&apos;s favorite!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Human Height</h3>
          <p>
            Adult heights cluster around average; very short/tall are rare. IQ,
            test grades, errors often follow this pattern.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Mean (μ): <span id="normal-mean-value">0</span>
            </label>
            <input
              type="range"
              id="normal-mean"
              min="-10"
              max="10"
              step="0.5"
              defaultValue="0"
              onInput={Engine.updateNormal}
            />
          </div>
          <div className="control-group">
            <label>
              Standard Deviation (σ): <span id="normal-std-value">1</span>
            </label>
            <input
              type="range"
              id="normal-std"
              min="0.5"
              max="5"
              step="0.1"
              defaultValue="1"
              onInput={Engine.updateNormal}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="normal-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateNormal}>
          🎲 Generate 1000 Samples
        </button>
        <button className="simulate-btn" onClick={Engine.animateNormal}>
          🎬 Show 68-95-99.7 Rule
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="normal-mean-stat">0</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="normal-std-stat">1</p>
          </div>
          <div className="stat-card">
            <h4>Within 1σ</h4>
            <p>68.3%</p>
          </div>
          <div className="stat-card">
            <h4>Within 2σ</h4>
            <p>95.4%</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = (1/σ√(2π)) × e^(-½((x-μ)/σ)²)
        </div>
      </div>

      {/* --- Exponential --- */}
      <div className="distribution-card" id="exponential">
        <div className="card-header">
          <div className="card-icon">⏱️</div>
          <div className="card-title">
            <h2>Exponential Distribution</h2>
            <p>Time until the next event occurs!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Waiting for the Bus</h3>
          <p>
            If buses arrive every 10 minutes on average, how long do you wait?
            Often short, sometimes long; also models lifetimes, calls, etc.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Rate (λ): <span id="exponential-lambda-value">1</span>
            </label>
            <input
              type="range"
              id="exponential-lambda"
              min="0.1"
              max="5"
              step="0.1"
              defaultValue="1"
              onInput={Engine.updateExponential}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="exponential-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateExponential}>
          🎲 Simulate 1000 Wait Times
        </button>
        <button className="simulate-btn" onClick={Engine.animateExponential}>
          🎬 Watch Time Pass
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="exponential-mean">1</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="exponential-std">1</p>
          </div>
          <div className="stat-card">
            <h4>Median</h4>
            <p id="exponential-median">0.69</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = λ × e^(-λx) for x ≥ 0
        </div>
      </div>

      {/* --- Uniform --- */}
      <div className="distribution-card" id="uniform">
        <div className="card-header">
          <div className="card-icon">📏</div>
          <div className="card-title">
            <h2>Uniform Distribution</h2>
            <p>Every value equally likely!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Rolling a Die</h3>
          <p>
            Each face 1–6 is equally likely. Also: RNGs, round-off errors,
            arrival windows.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Minimum (a): <span id="uniform-min-value">0</span>
            </label>
            <input
              type="range"
              id="uniform-min"
              min="-10"
              max="10"
              step="0.5"
              defaultValue="0"
              onInput={Engine.updateUniform}
            />
          </div>
          <div className="control-group">
            <label>
              Maximum (b): <span id="uniform-max-value">10</span>
            </label>
            <input
              type="range"
              id="uniform-max"
              min="-10"
              max="20"
              step="0.5"
              defaultValue="10"
              onInput={Engine.updateUniform}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="uniform-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateUniform}>
          🎲 Generate 1000 Values
        </button>
        <button className="simulate-btn" onClick={Engine.animateUniform}>
          🎬 Show Random Selection
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="uniform-mean">5</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="uniform-std">2.89</p>
          </div>
          <div className="stat-card">
            <h4>Range</h4>
            <p id="uniform-range">10</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = 1/(b-a) for a ≤ x ≤ b
        </div>
      </div>

      {/* --- Geometric --- */}
      <div className="distribution-card" id="geometric">
        <div className="card-header">
          <div className="card-icon">🎮</div>
          <div className="card-title">
            <h2>Geometric Distribution</h2>
            <p>Trials until first success!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Winning a Game</h3>
          <p>
            Win chance 20% → how many tries until first win? Could be 1st try,
            could be much later.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Success Probability (p): <span id="geometric-p-value">0.3</span>
            </label>
            <input
              type="range"
              id="geometric-p"
              min="0.05"
              max="0.95"
              step="0.05"
              defaultValue="0.3"
              onInput={Engine.updateGeometric}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="geometric-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateGeometric}>
          🎲 Run 1000 Experiments
        </button>
        <button className="simulate-btn" onClick={Engine.animateGeometric}>
          🎬 Try Until Success
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean Trials</h4>
            <p id="geometric-mean">3.33</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="geometric-std">2.72</p>
          </div>
          <div className="stat-card">
            <h4>Mode</h4>
            <p>1 (always!)</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> P(X = k) = (1-p)^(k-1) × p
        </div>
      </div>

      {/* --- Gamma --- */}
      <div className="distribution-card" id="gamma">
        <div className="card-header">
          <div className="card-icon">🔥</div>
          <div className="card-title">
            <h2>Gamma Distribution</h2>
            <p>Time until multiple events occur!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Server Response Time</h3>
          <p>Time to process several requests with varying durations.</p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Shape (α): <span id="gamma-alpha-value">2</span>
            </label>
            <input
              type="range"
              id="gamma-alpha"
              min="0.5"
              max="10"
              step="0.5"
              defaultValue="2"
              onInput={Engine.updateGamma}
            />
          </div>
          <div className="control-group">
            <label>
              Rate (β): <span id="gamma-beta-value">1</span>
            </label>
            <input
              type="range"
              id="gamma-beta"
              min="0.5"
              max="5"
              step="0.5"
              defaultValue="1"
              onInput={Engine.updateGamma}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="gamma-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateGamma}>
          🎲 Generate 1000 Samples
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="gamma-mean">2</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="gamma-std">1.41</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = (β^α/Γ(α)) × x^(α-1) × e^(-βx)
        </div>
      </div>

      {/* --- Beta --- */}
      <div className="distribution-card" id="beta">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <div className="card-title">
            <h2>Beta Distribution</h2>
            <p>Probabilities and proportions!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Click-Through Rate</h3>
          <p>
            After 7 clicks in 10 visits, what&apos;s the underlying click rate?
            Beta models uncertainty.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Alpha (α): <span id="beta-alpha-value">2</span>
            </label>
            <input
              type="range"
              id="beta-alpha"
              min="0.5"
              max="10"
              step="0.5"
              defaultValue="2"
              onInput={Engine.updateBeta}
            />
          </div>
          <div className="control-group">
            <label>
              Beta (β): <span id="beta-beta-value">2</span>
            </label>
            <input
              type="range"
              id="beta-beta"
              min="0.5"
              max="10"
              step="0.5"
              defaultValue="2"
              onInput={Engine.updateBeta}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="beta-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateBeta}>
          🎲 Generate 1000 Samples
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="beta-mean">0.5</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="beta-std">0.22</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = x^(α-1) × (1-x)^(β-1) / B(α,β)
        </div>
      </div>

      {/* --- Laplace --- */}
      <div className="distribution-card" id="laplace">
        <div className="card-header">
          <div className="card-icon">⚡</div>
          <div className="card-title">
            <h2>Laplace Distribution</h2>
            <p>Double exponential - sharp peak, heavy tails!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Financial Returns</h3>
          <p>
            More extreme events than a normal predicts; Laplace captures fat
            tails.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Location (μ): <span id="laplace-mu-value">0</span>
            </label>
            <input
              type="range"
              id="laplace-mu"
              min="-5"
              max="5"
              step="0.5"
              defaultValue="0"
              onInput={Engine.updateLaplace}
            />
          </div>
          <div className="control-group">
            <label>
              Scale (b): <span id="laplace-b-value">1</span>
            </label>
            <input
              type="range"
              id="laplace-b"
              min="0.5"
              max="5"
              step="0.5"
              defaultValue="1"
              onInput={Engine.updateLaplace}
            />
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="laplace-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateLaplace}>
          🎲 Generate 1000 Samples
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Mean</h4>
            <p id="laplace-mean">0</p>
          </div>
          <div className="stat-card">
            <h4>Std Dev</h4>
            <p id="laplace-std">1.41</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> f(x) = (1/2b) × e^(-|x-μ|/b)
        </div>
      </div>

      {/* --- Multinomial --- */}
      <div className="distribution-card" id="multinomial">
        <div className="card-header">
          <div className="card-icon">🎨</div>
          <div className="card-title">
            <h2>Multinomial Distribution</h2>
            <p>Multiple outcomes, not just success/failure!</p>
          </div>
        </div>
        <div className="example-box">
          <h3>🌟 Real-World Example: Dice Games</h3>
          <p>
            Roll 10 dice: how many of each face? Or 100 shoppers choosing among
            3 products.
          </p>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>
              Number of Trials: <span id="multinomial-n-value">20</span>
            </label>
            <input
              type="range"
              id="multinomial-n"
              min="10"
              max="100"
              step="10"
              defaultValue="20"
              onInput={Engine.updateMultinomial}
            />
          </div>
          <div className="control-group">
            <label>
              Category Probabilities (click simulate to see results):
            </label>
          </div>
        </div>
        <div className="canvas-container">
          <canvas id="multinomial-canvas"></canvas>
        </div>
        <button className="simulate-btn" onClick={Engine.simulateMultinomial}>
          🎲 Run Experiment
        </button>
        <button className="simulate-btn" onClick={Engine.animateMultinomial}>
          🎬 Watch Selections
        </button>
        <div className="stats-display">
          <div className="stat-card">
            <h4>Total Trials</h4>
            <p id="multinomial-total">20</p>
          </div>
          <div className="stat-card">
            <h4>Categories</h4>
            <p id="multinomial-cats">4</p>
          </div>
        </div>
        <div className="formula-box">
          <strong>Formula:</strong> P(X₁=k₁,...,Xₙ=kₙ) = n!/(k₁!...kₙ!) ×
          p₁^k₁...pₙ^kₙ
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📚 About This Project</h3>
            <p>
              A comprehensive interactive web application designed to help
              students, researchers, and professionals master probability
              distributions, statistical concepts, and advanced analytics
              through hands-on visualizations, simulations, and real-world
              applications.
            </p>
          </div>

          <div className="footer-section">
            <h3>🎯 Features</h3>
            <ul>
              <li>11 Interactive probability distributions</li>
              <li>9 Advanced statistical components</li>
              <li>Real-time parameter adjustments</li>
              <li>Canvas-based visualizations</li>
              <li>Monte Carlo simulations</li>
              <li>Bayesian inference workshop</li>
              <li>Time series & stochastic processes</li>
              <li>Hypothesis testing dashboard</li>
              <li>Joint distribution explorer</li>
              <li>Markov chain simulator</li>
              <li>Maximum likelihood estimation</li>
              <li>Educational explanations</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>🔗 Links & Resources</h3>
            <ul>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Probability_distribution"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Probability Distributions (Wikipedia)
                </a>
              </li>
              <li>
                <a
                  href="https://www.khanacademy.org/math/statistics-probability"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🎓 Khan Academy Statistics
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💻 View Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="credits">
            <p>
              Made with ❤️ by <strong>Sankar Balasubramanian</strong>
            </p>
            <div className="social-links">
              <a
                href="https://www.sankar.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                🌐 Portfolio
              </a>
              <a
                href="https://www.linkedin.com/in/sankar4/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-btn"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>

          <div className="tech-info">
            <p>Built with Next.js, React & HTML5 Canvas | © 2025</p>
            <p>Educational tool for probability & statistics learning</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
