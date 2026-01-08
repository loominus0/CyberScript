# CyberScript

CyberScript is an interactive cybersecurity training simulator powered by the Gemini 3 API.  
It transforms simple user inputs into fully structured cyber‑attack storyboards designed for students, analysts, and cybersecurity enthusiasts.

The app is built in Google AI Studio using Gemini 3 Flash Preview, dynamic prompt templating, and custom UI components. Users describe a target organization and select a difficulty level, and CyberScript generates:

- Overview of the attack scenario
- Multi‑phase attack storyboard
- Sample system logs
- Attack flow visualization
- Mitigation and strategic lessons

CyberScript demonstrates how Gemini 3 can orchestrate domain‑specific simulations, narrative synthesis, and structured output generation within a lightweight, interactive interface.

## 🚀 Live Demo
Public App Link:  
*(Insert your AI Studio public link here)*

## 🧠 Gemini Integration
CyberScript uses Gemini 3 Flash Preview as its reasoning engine.  
The system prompt enforces a strict five‑section output format, while the user prompt template binds UI inputs directly into the model request. This allows Gemini to generate tailored, scalable scenarios with realistic logs, attack phases, and mitigation strategies.

## 📂 Repository Structure
- `/components` — UI components (buttons, storyboard cards)
- `/services` — Gemini API integration
- `/screenshots` — UI and output examples
- `system_prompt.md` — full system prompt used in the app
- `user_prompt_template.md` — dynamic prompt template
- `architecture_overview.md` — explanation of app structure

## 📝 License
MIT License
