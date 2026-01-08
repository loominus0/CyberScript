# CyberScript Architecture Overview

CyberScript is built using Google AI Studio’s App Builder, React (TSX), Vite, and the Gemini 3 API. The architecture is intentionally lightweight, modular, and optimized for fast scenario generation.

---

## Core Components

### 1. UI Layer (React + TSX)
The user interface is built from modular components that render the app layout and display the generated storyboard.

Key files:
- app.tsx — main application container
- components/Button.tsx — reusable UI button
- components/StoryboardCard.tsx — renders each section of the generated storyboard

---

### 2. Prompt Engine
CyberScript uses a dynamic user prompt template that binds two user inputs:
- Target Description
- Difficulty Level

The template is defined in `user_prompt_template.md` and injected into the Gemini request at runtime.

---

### 3. Gemini Integration
The Gemini 3 Flash Preview model powers the scenario generation.

Key file:
- services/geminiService.ts

This service:
- constructs the model request
- injects the user prompt template
- sends the request to Gemini
- returns structured text for rendering

---

### 4. Output Rendering
The model returns a structured cyber‑attack storyboard, including:
- scenario overview
- attack phases
- sample logs
- flow visualization
- mitigation guidance

Each section is displayed using StoryboardCard components for clean, readable formatting.

---

## Data Flow

1. User enters a target description.
2. User selects a difficulty level.
3. The UI injects these values into the user prompt template.
4. The Gemini service sends the request to Gemini 3 Flash Preview.
5. Gemini generates a structured cyber‑attack storyboard.
6. The UI renders each section dynamically using StoryboardCard components.

---

## Design Goals

- Lightweight and fast
- Easy to extend
- Clean separation between UI, prompt logic, and model integration
- Structured, predictable output for cybersecurity training scenarios

CyberScript demonstrates how Gemini 3 can drive domain‑specific simulation and educational tooling within a modern, minimal front‑end architecture.
