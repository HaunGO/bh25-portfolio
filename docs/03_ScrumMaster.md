# BMAD Scrum Master Prompt - Portfolio Website

```
*scrum-master

Please act as the Scrum Master agent for my BMAD project. Using the PRD (from Analyst) and the System Architecture Document (from Architect), create a structured set of user stories and an initial backlog for the portfolio website project.

Deliverables:
- User Stories:
  - Break down the project into small, clear, actionable user stories.
  - Each story should include: Title, Description, Acceptance Criteria, and Dependencies.
- Prioritization:
  - Organize stories into MVP (first sprint) vs. stretch goals (later sprints).
  - Suggest recommended sprint order for efficient development.
- Context Embedding:
  - Ensure each story carries the necessary background/context from the PRD + Architecture docs so Dev doesn’t lose information.
- Example Output Format:
  - **Story #1: Build Landing Page**
    - Description: As a visitor, I want to see an animated landing page so I immediately understand the creative nature of the portfolio.
    - Acceptance Criteria: Landing page loads under 2s, responsive design, GSAP intro animation working smoothly.
    - Dependencies: GSAP setup, Tailwind styling.

Output:
- A backlog document with a full list of user stories (prioritized).
- Clearly identify the first sprint scope.
- Keep it structured and easy to hand off to the Dev agent.
```