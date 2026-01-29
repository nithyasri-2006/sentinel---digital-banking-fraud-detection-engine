# Sentinel - Digital Banking Fraud Detection Engine

Sentinel is a high-fidelity, real-time fraud monitoring platform designed for digital banking ecosystems. It combines traditional heuristic rule sets with advanced Large Language Model (LLM) analysis via the Google Gemini API to identify, flag, and block suspicious financial activities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Gemini](https://img.shields.io/badge/AI-Gemini_3_Flash-8E75B2?logo=google-gemini)

## 🚀 Features

### 1. Security Terminal Gateway
- **Authorized Access Only**: Professional login interface with simulated biometric verification.
- **Session Monitoring**: Fully tracked operator sessions with terminal termination capabilities.

### 2. Live Simulation Hub
- **Traffic Ingestion**: Real-time generation of global banking transactions (ATM, POS, Online, Transfers).
- **Anomaly Injection**: Adjustable fraud probability sliders to test system resilience.
- **Variable TPS**: Control the throughput of the ingestion engine for stress testing.

### 3. Dual-Layer Detection Engine
- **Heuristic Layer**: Customizable rules for value thresholds, cross-border monitoring, and frequency caps.
- **AI Core (Gemini)**: Suspicious transactions are automatically routed to the Gemini-3-Flash model for deep contextual analysis, providing human-readable reasoning for every block.

### 4. Security Dashboard
- **Real-time Feed**: Live-updating transaction table with risk scoring and status indicators.
- **Visual Analytics**: Interactive traffic monitoring using Recharts.
- **Health Monitoring**: System status pings for heuristics and the neural hub.

## 🛠 Tech Stack

- **Frontend**: React 19 (ES6 Modules)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Intelligence**: Google Gemini API (`@google/genai`)
- **Build Tool**: Vite

## 📦 Installation

To run this project locally in your preferred IDE (IntelliJ IDEA, VS Code, etc.):

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sentinel-fraud-detection.git
   cd sentinel-fraud-detection
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Terminal:**
   ```bash
   npm run dev
   ```

## 🧠 How It Works

1. **Ingestion**: The simulation engine generates random transaction data based on real-world banking patterns.
2. **First Pass**: The heuristic engine checks the transaction against active `DetectionRules` (e.g., is the amount > $10,000?).
3. **Escalation**: If a rule is triggered or the transaction hits a high-risk threshold, the data is sent to the `geminiService`.
4. **Analysis**: Gemini acts as a "Senior Fraud Analyst," evaluating the JSON payload for indicators of money laundering or account takeover.
5. **Action**: The UI updates the "Live Gateway Feed" with the final classification and the AI's technical reasoning.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
**Disclaimer**: This is a simulation environment for educational and demonstration purposes. No real financial data is processed.
