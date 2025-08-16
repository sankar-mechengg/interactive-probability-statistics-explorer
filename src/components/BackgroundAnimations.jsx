"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BackgroundAnimations() {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const symbolsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating mathematical symbols
    const mathSymbols = [
      "π",
      "∑",
      "∫",
      "∞",
      "∂",
      "√",
      "±",
      "≈",
      "μ",
      "σ",
      "β",
      "α",
      "λ",
      "θ",
      "φ",
      "Ω",
      "χ²",
      "∝",
      "≠",
      "≤",
      "≥",
    ];
    const statisticalSymbols = [
      "P(x)",
      "f(x)",
      "μ±σ",
      "x̄",
      "s²",
      "r",
      "H₀",
      "H₁",
      "p-value",
      "CI",
    ];
    const allSymbols = [...mathSymbols, ...statisticalSymbols];
    const container = containerRef.current;

    // Create floating symbols
    for (let i = 0; i < 20; i++) {
      const symbol = document.createElement("div");
      symbol.className = "floating-symbol";
      symbol.textContent =
        allSymbols[Math.floor(Math.random() * allSymbols.length)];
      const size = Math.random() * 35 + 15;
      symbol.style.cssText = `
        position: fixed;
        font-size: ${size}px;
        color: rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05});
        pointer-events: none;
        z-index: 1;
        font-weight: ${Math.random() > 0.5 ? "bold" : "normal"};
        user-select: none;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        font-family: ${
          Math.random() > 0.5
            ? "'Times New Roman', serif"
            : "'Arial', sans-serif"
        };
      `;
      container.appendChild(symbol);
      symbolsRef.current.push(symbol);

      // Animate floating symbols with more variety
      gsap.to(symbol, {
        y: "-=120vh",
        x: `+=${Math.random() * 300 - 150}`,
        rotation: Math.random() * 720 - 360,
        duration: Math.random() * 25 + 20,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 15,
      });

      // Pulsing animation with different patterns
      gsap.to(symbol, {
        opacity: Math.random() * 0.4 + 0.1,
        scale: Math.random() * 0.5 + 0.8,
        duration: Math.random() * 4 + 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 2,
      });
    }

    // Create particle system
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.className = "background-particle";
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
      `;
      container.appendChild(particle);
      particlesRef.current.push(particle);

      // Animate particles
      gsap.to(particle, {
        y: "-=150vh",
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 25 + 20,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 15,
      });

      // Scale animation
      gsap.to(particle, {
        scale: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 4 + 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    // Create wave patterns
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement("div");
      wave.className = "wave-pattern";
      wave.style.cssText = `
        position: fixed;
        width: 200vw;
        height: 200px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: -50vw;
        top: ${Math.random() * 100}vh;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(wave);

      // Animate waves
      gsap.to(wave, {
        x: "100vw",
        rotation: `+=${Math.random() * 180 + 90}`,
        duration: Math.random() * 30 + 25,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 10,
      });

      gsap.to(wave, {
        scaleY: Math.random() * 2 + 0.5,
        duration: Math.random() * 8 + 5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    // Create probability distribution curves
    for (let i = 0; i < 4; i++) {
      const curve = document.createElement("div");
      curve.className = "distribution-curve";
      curve.style.cssText = `
        position: fixed;
        width: 300px;
        height: 150px;
        border: 2px solid rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        border-bottom: none;
        border-left: none;
        transform: rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(curve);

      // Animate curves
      gsap.to(curve, {
        rotation: `+=${Math.random() * 720 + 360}`,
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        duration: Math.random() * 40 + 30,
        repeat: -1,
        ease: "none",
      });

      gsap.to(curve, {
        scale: Math.random() * 1.5 + 0.7,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    // Create formula ghosts
    const formulas = [
      "∫f(x)dx=1",
      "E[X]=μ",
      "Var(X)=σ²",
      "P(A|B)",
      "lim n→∞",
      "∇f(x)",
      "∂²f/∂x²",
    ];
    for (let i = 0; i < 6; i++) {
      const formula = document.createElement("div");
      formula.className = "formula-ghost";
      formula.textContent =
        formulas[Math.floor(Math.random() * formulas.length)];
      formula.style.cssText = `
        position: fixed;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.05);
        pointer-events: none;
        z-index: 1;
        font-family: 'Times New Roman', serif;
        font-style: italic;
        user-select: none;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        opacity: 0;
      `;
      container.appendChild(formula);

      // Animate formula ghosts - they appear and disappear
      gsap.to(formula, {
        opacity: 0.15,
        duration: 0.5,
        repeat: -1,
        repeatDelay: Math.random() * 20 + 10,
        yoyo: true,
        ease: "power2.inOut",
      });

      gsap.to(formula, {
        y: "-=50",
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 60 + 40,
        repeat: -1,
        ease: "none",
      });
    }

    // Create constellation connections
    for (let i = 0; i < 8; i++) {
      const line = document.createElement("div");
      line.className = "constellation-line";
      const angle = Math.random() * 360;
      const length = Math.random() * 200 + 100;
      line.style.cssText = `
        position: fixed;
        width: ${length}px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        transform-origin: left center;
        transform: rotate(${angle}deg);
      `;
      container.appendChild(line);

      // Animate constellation lines
      gsap.to(line, {
        rotation: `+=${Math.random() * 360 + 180}`,
        x: `+=${Math.random() * 400 - 200}`,
        y: `+=${Math.random() * 400 - 200}`,
        duration: Math.random() * 60 + 40,
        repeat: -1,
        ease: "none",
      });

      gsap.to(line, {
        opacity: Math.random() * 0.3 + 0.1,
        scaleX: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 8 + 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    // Create grid pattern
    const grid = document.createElement("div");
    grid.className = "animated-grid";
    grid.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    `;
    container.appendChild(grid);

    // Animate grid
    gsap.to(grid, {
      backgroundPosition: "50px 50px",
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Create floating Gastly Pokemon - Force to very top of DOM
    const gastly = document.createElement("div");
    gastly.className = "floating-gastly";
    gastly.setAttribute("data-gastly", "true"); // For easy identification
    gastly.innerHTML = `
      <img src="/gastly.svg" alt="Gastly" width="80" height="80" />
      <div class="gastly-speech-bubble" style="display: none;">
        <div class="bubble-content"></div>
      </div>
      <div class="gastly-hint" style="
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        pointer-events: none;
        z-index: 2147483647 !important;
      ">Click me! 👻</div>
    `;

    // Position Gastly with viewport-relative coordinates
    let gastlyX = Math.random() * (window.innerWidth - 120) + 60; // Keep away from edges
    let gastlyY = Math.random() * (window.innerHeight - 120) + 60;
    let velocityX = (Math.random() - 0.5) * 2; // Random direction
    let velocityY = (Math.random() - 0.5) * 2;

    gastly.style.cssText = `
      position: fixed !important;
      pointer-events: auto !important;
      z-index: 2147483647 !important;
      cursor: pointer !important;
      left: ${gastlyX}px !important;
      top: ${gastlyY}px !important;
      transition: transform 0.3s ease !important;
      will-change: transform !important;
      isolation: isolate !important;
    `;

    // Force append to the very end of body for maximum z-index effectiveness
    setTimeout(() => {
      document.body.appendChild(gastly);
      // Force re-render
      gastly.style.display = "block";
    }, 100);

    // Viewport boundaries animation with bounce physics
    const animateGastlyMovement = () => {
      const rect = gastly.getBoundingClientRect();
      const gastlyWidth = 80;
      const gastlyHeight = 80;

      // Update position
      gastlyX += velocityX;
      gastlyY += velocityY;

      // Bounce off edges
      if (gastlyX <= 0 || gastlyX >= window.innerWidth - gastlyWidth) {
        velocityX *= -1;
        gastlyX = Math.max(
          0,
          Math.min(window.innerWidth - gastlyWidth, gastlyX)
        );
      }
      if (gastlyY <= 0 || gastlyY >= window.innerHeight - gastlyHeight) {
        velocityY *= -1;
        gastlyY = Math.max(
          0,
          Math.min(window.innerHeight - gastlyHeight, gastlyY)
        );
      }

      // Apply position
      gastly.style.left = `${gastlyX}px`;
      gastly.style.top = `${gastlyY}px`;

      // Add some randomness to movement
      velocityX += (Math.random() - 0.5) * 0.1;
      velocityY += (Math.random() - 0.5) * 0.1;

      // Limit velocity
      const maxSpeed = 2;
      velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
      velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));
    };

    // Handle window resize
    const handleResize = () => {
      const gastlyWidth = 80;
      const gastlyHeight = 80;

      // Keep Gastly within new viewport bounds
      gastlyX = Math.max(0, Math.min(window.innerWidth - gastlyWidth, gastlyX));
      gastlyY = Math.max(
        0,
        Math.min(window.innerHeight - gastlyHeight, gastlyY)
      );

      gastly.style.left = `${gastlyX}px`;
      gastly.style.top = `${gastlyY}px`;
    };

    window.addEventListener("resize", handleResize);

    // Show hint initially
    const hint = gastly.querySelector(".gastly-hint");
    gsap.to(hint, {
      opacity: 1,
      delay: 2,
      duration: 0.5,
    });
    gsap.to(hint, {
      opacity: 0,
      delay: 6,
      duration: 0.5,
    });

    // Start continuous movement animation
    let isGastlyPaused = false;
    let animationFrame;

    const startMovement = () => {
      if (!isGastlyPaused) {
        animateGastlyMovement();
        animationFrame = requestAnimationFrame(startMovement);
      }
    };

    startMovement();

    // Gastly bobbing animation (independent of movement)
    const bobbingAnimation = gsap.to(gastly, {
      y: "+=15",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Gastly rotation
    const rotationAnimation = gsap.to(gastly, {
      rotation: "+=10",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Probability and Statistics facts
    const facts = [
      "🎲 Did you know? The birthday paradox shows that in a group of just 23 people, there's a 50% chance two share the same birthday!",
      "📊 Fun fact: The normal distribution was first discovered by Abraham de Moivre in 1738, not Carl Gauss!",
      "🧮 Spooky stat: Benford's Law shows that in many datasets, about 30% of numbers start with the digit 1!",
      "🎯 Ghostly truth: The Law of Large Numbers was proven by Jacob Bernoulli, published posthumously in 1713!",
      "🎰 Eerie fact: Casino games use negative expected value - the house always wins in the long run!",
      "🔮 Mystical math: Bayes' Theorem can update probabilities as new evidence appears, like ghost sightings!",
      "👻 Phantom phenomena: Simpson's Paradox can make trends disappear or reverse when data is grouped!",
      "🌟 Supernatural stats: The Central Limit Theorem works even with non-normal data - pure magic!",
      "🎪 Spectral surprise: The Monty Hall Problem stumped even mathematicians - switching doors doubles your odds!",
      "🔬 Ethereal equation: Standard deviation measures how spread out ghosts... I mean data points are!",
      "🎯 Haunting hypothesis: P-values tell us how likely our results are due to random chance, not paranormal activity!",
      "🎲 Otherworldly odds: Independent events don't influence each other, unlike what horror movies suggest!",

      // 100 Additional Facts
      "🌙 Midnight mystery: The Poisson distribution was named after Siméon Denis Poisson, who studied rare events like horse kicks in the Prussian army!",
      "🔍 Hidden truth: Correlation doesn't imply causation - ice cream sales and drowning deaths both peak in summer, but ice cream doesn't cause drowning!",
      "🎭 Statistical stage: The placebo effect can be so strong that even fake surgeries sometimes show improvement in patients!",
      "⚡ Lightning logic: You're more likely to be struck by lightning (1 in 15,300) than win most lottery jackpots!",
      "🧬 Genetic ghost: DNA paternity tests are 99.9% accurate, but false positives still occur in about 1 in 10,000 cases!",
      "🎨 Artistic anomaly: Benford's Law can detect art forgeries by analyzing the frequency of leading digits in measurements!",
      "🏆 Winning weirdness: In sports, the hot hand phenomenon is real - players really do have streaks beyond random chance!",
      "🌊 Wave of wonder: Stock market crashes follow power law distributions - rare but devastating events are more likely than normal distributions predict!",
      "🎵 Musical math: Spotify's shuffle isn't truly random - they made it 'more random' by preventing recently played songs from repeating!",
      "🍕 Pizza probability: If you cut a pizza randomly 4 times, there's only a 1 in 1,073,741,824 chance all pieces will be equal!",
      "🚗 Traffic terror: Your lifetime odds of dying in a car accident (1 in 101) are much higher than in a plane crash (1 in 11 million)!",
      "🎪 Carnival conundrum: The probability of winning any prize at a typical carnival game is designed to be around 10-15%!",
      "🌟 Star statistics: There are more possible games of chess (10^120) than atoms in the observable universe (10^80)!",
      "🎲 Dice dilemma: Rolling a pair of dice, the most likely sum is 7, occurring 16.67% of the time!",
      "🔮 Fortune fallacy: Psychic predictions have the same accuracy rate as random guessing - about 50%!",
      "🎯 Targeting truth: Marketing A/B tests need thousands of visitors to detect a 10% improvement with statistical significance!",
      "👥 Social statistics: The average person knows about 600 people, but Facebook's algorithm shows you content from only about 10%!",
      "🌡️ Temperature tale: Weather forecasts are 90% accurate for next-day predictions but only 50% accurate beyond 10 days!",
      "🎰 Vegas reality: The house edge in roulette is 5.26% for American wheels and 2.7% for European wheels!",
      "📱 Phone phenomena: You check your phone an average of 96 times per day - that's once every 10 minutes while awake!",
      "🏥 Medical marvel: False positive rates in medical tests can be surprisingly high - even 99% accurate tests can be wrong 50% of the time!",
      "🎮 Gaming ghost: Random number generators in computers aren't truly random - they're pseudorandom algorithms!",
      "🌍 Global gamble: The probability that you exist exactly as you are is approximately 1 in 10^2,685,000!",
      "🎪 Circus statistics: Tightrope walkers have a lower injury rate than professional football players!",
      "🍀 Lucky legend: Finding a four-leaf clover has odds of about 1 in 10,000, but some people have genetic advantages!",
      "🎨 Art analysis: Statistical analysis of brushstrokes can identify paintings by specific artists with 90%+ accuracy!",
      "🌈 Rainbow rarity: The probability of seeing a complete circular rainbow from ground level is virtually zero - you need to be in an airplane!",
      "🎵 Song stats: Hit songs follow predictable statistical patterns in tempo, key changes, and chord progressions!",
      "🚀 Space statistics: The probability of an asteroid hitting Earth and causing mass extinction is about 1 in 20,000 per year!",
      "🎭 Drama distribution: Shakespeare's plays follow Zipf's Law - word frequency follows a predictable power distribution!",
      "🔬 Science surprise: Reproducibility crisis: up to 70% of scientific studies can't be replicated with the same results!",
      "🎪 Performance paradox: Stage fright affects 75% of the population, making it more common than the fear of death!",
      "🌙 Lunar luck: Crime rates don't actually increase during full moons - that's just confirmation bias!",
      "🎯 Accuracy anomaly: Polygraph tests are only 65-87% accurate - barely better than expert human judgment!",
      "🍎 Food facts: The probability of finding a worm in an apple is about 1 in 18,000 in modern agriculture!",
      "🎨 Color coincidence: Humans can distinguish about 10 million different colors, but we only have names for about 11 basic ones!",
      "🌊 Ocean odds: You're more likely to be attacked by a vending machine (1 in 112 million) than by a shark (1 in 264 million)!",
      "🎪 Circus skills: Juggling 3 balls seems easy, but the probability equations involve chaos theory and nonlinear dynamics!",
      "📚 Book biology: Speed reading claims are mostly false - comprehension drops dramatically above 400 words per minute!",
      "🎯 Target truth: Darts thrown randomly at a dartboard follow a bivariate normal distribution around the center!",
      "🌟 Stellar stats: The Drake Equation suggests there could be 20-50 million intelligent civilizations in our galaxy!",
      "🎲 Random reality: True randomness is philosophically impossible to prove - we can only measure apparent randomness!",
      "🍕 Pizza paradox: When sharing pizza equally, cutting it into 5 or 7 pieces creates the most complicated fractions!",
      "🎪 Carnival chaos: Ring toss games are nearly impossible to win due to physics - the rings bounce off at angles!",
      "🌙 Moon myth: Lunar cycles don't affect human behavior, despite what 40% of people believe!",
      "🎯 Archery accuracy: Olympic archers hit the bullseye about 20% of the time from 70 meters!",
      "🔮 Crystal clarity: Prediction markets are often more accurate than expert polls for forecasting events!",
      "🎰 Slot secrets: Modern slot machines use complex algorithms with millions of possible combinations!",
      "🌊 Wave wisdom: Rogue waves follow extreme value distributions and are much more common than once thought!",
      "🎪 Performance probability: Stage magicians exploit cognitive biases and statistical thinking errors!",
      "📱 Digital dice: Your smartphone's accelerometer can generate truly random numbers from thermal noise!",
      "🎨 Artistic algorithms: AI can now create art that art experts can't distinguish from human-created works 60% of the time!",
      "🌟 Star surprise: The probability of two snowflakes being identical is effectively zero due to crystallization chaos!",
      "🎯 Testing trouble: Multiple testing increases false discovery rates - testing 20 hypotheses gives 64% chance of false positive!",
      "🍀 Clover calculations: The genes for four-leaf clovers are recessive, making them naturally rare mutations!",
      "🎪 Carnival cunning: Basketball toss games use oval hoops and overinflated balls to reduce winning probability!",
      "🌍 Earth equations: The Goldilocks Zone calculation shows Earth's habitability probability is about 1 in 700 quintillion!",
      "🎲 Dice dynamics: Loaded dice can be detected using chi-square tests on frequency distributions!",
      "🔬 Lab lottery: Scientific breakthroughs often follow Poisson processes - breakthrough discoveries cluster unexpectedly!",
      "🎯 Bullseye bias: Sharpshooters' accuracy follows beta distributions, not normal distributions!",
      "🌙 Midnight math: Insomnia affects 30% of adults, but sleep tracking apps overestimate sleep quality 23% of the time!",
      "🎪 Circus statistics: Trapeze artists have a safety net catch rate of 99.8%, but still face 1 in 100,000 injury odds per performance!",
      "🍎 Apple analytics: Newton's apple story is likely false, but gravitational acceleration follows precise statistical distributions!",
      "🎨 Museum mystery: Art auction prices follow log-normal distributions with heavy tails for masterpieces!",
      "🌊 Ocean observations: Tsunami prediction models use Bayesian networks with 85% accuracy within 4 hours!",
      "🎯 Target technique: Professional darts players' accuracy follows mixture distributions combining skill and random error!",
      "🔮 Fortune physics: Coin flips aren't 50/50 - slight bias toward starting position makes it 51/49!",
      "🎪 Big top biology: Circus animals perform better in certain weather patterns following circadian rhythm statistics!",
      "🌟 Cosmic calculations: The anthropic principle suggests our universe's physical constants have 1 in 10^120 probability!",
      "🎲 Gaming geometry: Craps has the lowest house edge (0.6%) of any casino game when played optimally!",
      "📱 Phone phenomena: Smartphone addiction affects 50% of teens, with usage patterns following power law distributions!",
      "🎯 Accuracy assessment: Lie detector accuracy varies by question type - behavioral tells are more reliable than physiological!",
      "🍀 Lucky logarithms: Lottery number selection follows predictable patterns - birthdays and consecutive numbers are overchosen!",
      "🎪 Acrobatic algorithms: Gymnastic scoring follows weighted distributions to account for difficulty and execution!",
      "🌙 Lunar logistics: Moon phase effects on stock markets are statistically significant but economically meaningless!",
      "🎨 Palette probability: Color preference follows cultural distributions - blue is preferred by 60% of people globally!",
      "🌊 Surfing statistics: Perfect surfing conditions occur with probability distributions based on wind and tide interactions!",
      "🎯 Shooting stars: Meteor shower intensities follow Poisson processes with predictable peak rates!",
      "🔬 Science stats: Peer review catches errors 85% of the time, but introduces new errors 3% of the time!",
      "🎪 Carnival mathematics: Duck pond games use weighted ducks - winning ducks are 90% lighter than losing ones!",
      "🍎 Orchard odds: Apple trees follow spatial clustering patterns that maximize pollination probability!",
      "🎲 Probability paradox: Bertrand's Box Paradox shows that conditional probability can be counterintuitive!",
      "🌟 Stellar statistics: Variable stars' brightness follows specific probability distributions based on their type!",
      "🎯 Tournament theory: March Madness brackets have 1 in 9.2 quintillion odds of being perfect!",
      "🔮 Prediction precision: Weather models use ensemble forecasting - running hundreds of simulations for confidence intervals!",
      "🎪 Ring master reality: Circus audience engagement follows predictable patterns based on performance sequence statistics!",
      "🌙 Dream distributions: REM sleep cycles follow ultradian rhythms with statistical variations between individuals!",
      "🎨 Brushstroke biometrics: Artists' painting techniques create unique statistical fingerprints detectable by algorithms!",
      "🌊 Wave patterns: Surfable waves follow Rayleigh distributions, with the biggest waves being exponentially rarer!",
      "🎯 Accuracy aging: Human reaction time follows gamma distributions and slows predictably with age!",
      "🍀 Garden genetics: Plant breeding uses statistical genetics - trait inheritance follows Mendel's probability laws!",
      "🎪 Tightrope tension: Balance performance follows control theory with feedback loops and error correction!",
      "🌟 Galaxy geometry: Spiral galaxy arm patterns follow logarithmic spirals with statistical self-similarity!",
      "🎲 Random walks: Stock prices mathematically follow Brownian motion with drift parameters!",
      "📱 App analytics: Mobile app success follows power law distributions - 80% of revenue comes from 20% of users!",
      "🎯 Marksmanship mathematics: Sniper accuracy degrades exponentially with distance due to environmental factors!",
      "🔮 Crystal statistics: Mineral formation follows nucleation theory with probability distributions for crystal size!",
      "🎪 Audience attention: Crowd engagement follows attention economy principles with exponential decay rates!",
      "🌙 Tidal tables: Ocean tides follow harmonic analysis with multiple periodic components!",
      "🎨 Color chemistry: Paint mixing ratios follow additive and subtractive color models with statistical uncertainties!",
      "🌊 Rip current risk: Beach safety statistics show rip currents cause 80% of lifeguard rescues!",
      "🎯 Championship chances: Sports upsets follow power law distributions - David vs Goliath scenarios are predictably rare!",
      "🍀 Mutation mathematics: Genetic mutations follow Poisson processes with environmental factors affecting rates!",
      "🎪 Circus safety: Aerial act injuries follow inverse power law distributions - higher acts have exponentially higher risk!",
      "🌟 Supernova statistics: Stellar explosions in galaxies follow Poisson processes with predictable rates per century!",
      "🎲 Dice deception: Casinos replace dice every 8 hours because microscopic wear creates statistical bias!",
      "📱 Social statistics: Social media viral content follows epidemic models with network effect multipliers!",
      "🎯 Election equations: Polling accuracy follows statistical confidence intervals, but systematic bias can skew results!",
      "🔮 Fortune fluctuations: Tarot card reading follows pattern recognition - humans find meaning in random sequences!",
      "🎪 Performance pressure: Stage performance quality follows inverted-U curves - moderate stress optimizes results!",
      "🌙 Biorhythm bias: Circadian rhythm disruptions follow probabilistic health risk models!",
      "🎨 Artistic authentication: Art forgery detection uses statistical analysis of brush pressure and paint layer thickness!",
      "🌊 Tsunami timing: Seismic wave propagation follows precisely calculated probability models for coastal impact!",
      "🎯 Competitive chaos: Tournament seeding systems use Elo ratings based on logistic probability distributions!",
      "🍀 Ecological equations: Species population dynamics follow logistic growth models with environmental stochasticity!",
      "🎪 Juggling geometry: Three-ball juggling follows mathematical siteswap notation with temporal probability patterns!",
      "🌟 Cosmic coincidence: The fine-structure constant value allows chemistry to exist - pure statistical luck!",
      "🎲 Gambling ghosts: Problem gambling behaviors follow addiction psychology with predictable relapse probability patterns!",
    ];

    // Gastly click event
    gastly.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!isGastlyPaused) {
        // Pause animations
        cancelAnimationFrame(animationFrame);
        bobbingAnimation.pause();
        rotationAnimation.pause();
        isGastlyPaused = true;

        // Show speech bubble with random fact
        const bubble = gastly.querySelector(".gastly-speech-bubble");
        const content = gastly.querySelector(".bubble-content");
        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        content.textContent = randomFact;
        bubble.style.display = "block";

        // Animate bubble appearance
        gsap.fromTo(
          bubble,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        // Auto-hide bubble after 8 seconds and resume movement
        setTimeout(() => {
          gsap.to(bubble, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              bubble.style.display = "none";
              isGastlyPaused = false;

              // Resume animations
              startMovement();
              bobbingAnimation.play();
              rotationAnimation.play();
            },
          });
        }, 8000);
      }
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf(symbolsRef.current);
      gsap.killTweensOf(particlesRef.current);
      symbolsRef.current.forEach((symbol) => symbol.remove());
      particlesRef.current.forEach((particle) => particle.remove());
      symbolsRef.current = [];
      particlesRef.current = [];

      // Cleanup Gastly animations
      cancelAnimationFrame(animationFrame);
      bobbingAnimation?.kill();
      rotationAnimation?.kill();
      window.removeEventListener("resize", handleResize);

      // Remove Gastly from body
      document
        .querySelectorAll('[data-gastly="true"]')
        .forEach((el) => el.remove());
      document
        .querySelectorAll(".floating-gastly")
        .forEach((el) => el.remove());

      // Remove all created elements from container
      container
        .querySelectorAll(
          ".wave, .constellation, .formula-ghost, .wave-pattern, .distribution-curve, .animated-grid, .constellation-line"
        )
        .forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="background-animations"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    />
  );
}
