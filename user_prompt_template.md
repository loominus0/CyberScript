# CyberScript User Prompt Template

CyberScript uses a dynamic user prompt template to generate structured cyber‑attack storyboards based on two user inputs:

- Target Description — a free‑text description of the organization or environment
- Difficulty Level — a selectable complexity value

The template binds these values directly into the model request sent to Gemini.

---

## Template

Generate a CyberScript attack storyboard for:
Target Description: ${customPrompt || 'A generic enterprise environment'}
Difficulty Level: ${complexity}

---

## Description

This template instructs Gemini to generate a complete cyber‑attack storyboard tailored to:

- the user‑provided target description
- the selected difficulty level

The model expands this into a multi‑phase attack scenario including:

- overview
- attack phases
- sample logs
- flow visualization
- mitigation guidance

This template is the core of CyberScript’s dynamic scenario generation.
