# 📊 Interactive Probability & Statistics Explorer

A comprehensive interactive web application designed to help students, researchers, and professionals master probability distributions, statistical concepts, and advanced analytics through hands-on visualizations, simulations, and real-world applications.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🎯 Features

### 📈 Probability Distributions (11 Interactive)

- **Bernoulli Distribution** - Coin flip modeling
- **Binomial Distribution** - Multiple trial scenarios
- **Poisson Distribution** - Event rate modeling
- **Normal/Gaussian Distribution** - The famous bell curve
- **Exponential Distribution** - Time between events
- **Uniform Distribution** - Equal probability outcomes
- **Geometric Distribution** - First success modeling
- **Gamma Distribution** - Shape and rate parameters
- **Beta Distribution** - Uncertainty modeling
- **Laplace Distribution** - Double exponential
- **Multinomial Distribution** - Multiple category outcomes

### 🧠 Interactive Visualizations

- **Bayes Calculator** - Interactive Bayes' Theorem with medical diagnosis examples
- **Central Limit Demo** - Watch sample means become normally distributed
- **Conditional Probability Visualizer** - Venn diagrams and real-world scenarios

### 🔬 Advanced Statistical Concepts

- **Markov Chain Simulator** - State transition modeling with weather/stock examples
- **Hypothesis Testing Dashboard** - Type I/II errors, power curves, and statistical tests
- **Maximum Likelihood Estimation** - Parameter estimation with visual likelihood functions

### 📊 Advanced Analytics

- **Joint Distribution Explorer** - Bivariate normal distributions with correlation analysis
- **Time Series Explorer** - Random walks, mean reversion, and stochastic processes
- **Bayesian Inference Workshop** - Prior to posterior belief updating

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sankar-mechengg/interactive-probability-statistics-explorer.git
cd interactive-probability-statistics-explorer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout component
│   └── page.jsx             # Main application page
├── components/
│   ├── AdvancedConcepts.jsx      # Markov chains, hypothesis testing, MLE
│   ├── InteractiveVisualizations.jsx # Bayes calculator, CLT demo, conditional probability
│   └── StatisticalConcepts.jsx   # Joint distributions, time series, Bayesian inference
└── lib/
    └── engine.js            # Core probability distribution engine
```

## 🎓 Educational Value

This application is designed for:

- **Students** learning probability and statistics
- **Researchers** exploring statistical concepts
- **Professionals** working with data analysis
- **Educators** teaching statistical concepts

### Key Learning Outcomes:

- Understanding probability distribution shapes and parameters
- Visualizing the Central Limit Theorem in action
- Exploring Bayesian thinking and belief updating
- Understanding correlation vs. causation
- Learning about stochastic processes and time series
- Mastering hypothesis testing concepts

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 15.4.6
- **UI Library**: React 19.1.0
- **Styling**: CSS3 with custom components
- **Visualizations**: HTML5 Canvas API
- **Mathematics**: Custom JavaScript implementations
- **Simulations**: Monte Carlo methods

## 🎨 Key Features in Detail

### Real-time Parameter Adjustment

All distributions and simulations feature interactive sliders and controls that update visualizations in real-time.

### Canvas-based Visualizations

High-performance rendering using HTML5 Canvas for smooth animations and responsive charts.

### Monte Carlo Simulations

Each distribution includes simulation capabilities to demonstrate law of large numbers.

### Educational Explanations

Each concept includes practical examples and real-world applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sankar Balasubramanian**

- Website: [sankar.studio](https://www.sankar.studio)
- GitHub: [@sankar-mechengg](https://github.com/sankar-mechengg)
- LinkedIn: [Sankar Balasubramanian](https://www.linkedin.com/in/sankar-balasubramanian)

## 🔗 Useful Resources

- [Probability Distributions (Wikipedia)](https://en.wikipedia.org/wiki/Probability_distribution)
- [Khan Academy Statistics](https://www.khanacademy.org/math/statistics-probability)
- [Next.js Documentation](https://nextjs.org/docs)

## 🚀 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect it's a Next.js app and deploy it

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

⭐ **If you find this project helpful, please consider giving it a star on GitHub!**
