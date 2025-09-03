# BMAD Dev Agent Prompt - Portfolio Website

```
*dev

Please act as the Dev agent for my BMAD project. Use the PRD (Analyst), Architecture Document (Architect), and Backlog/User Stories (Scrum Master) to implement the project step by step.

Deliverables:
- Implement one user story at a time.
- For each story:
  1. Restate the story and acceptance criteria.
  2. Provide a clear plan for how you’ll implement it.
  3. Write clean, modular, and well-documented code (React or Next.js + TailwindCSS v3 + GSAP + Three.js, @react-three/fiber, @react-three/drei).
  4. Include relevant tests or usage notes.
  5. Explain how to run/test the feature locally.

Guidelines:
- Maintain performance and accessibility best practices.
- Keep consistency with prior architectural decisions.
- Don’t skip dependencies — if a story requires setup (e.g., GSAP config), implement/setup first.
- If clarification is needed, identify assumptions clearly.

Output:
- Deliver the code for the current story.
- Confirm whether the acceptance criteria are met.
- Indicate the next story in the backlog.
```