/**
 * AI Career Guidance – shared shapes (for JSDoc / consistency).
 * No runtime code; use in service and RoadmapView.
 */

/**
 * @typedef {Object} RoadmapPhase
 * @property {string} title
 * @property {string} duration
 * @property {string} description
 * @property {string[]} topics
 * @property {Array<{ name: string; url: string }>} resources
 * @property {string[]} milestones
 */

/**
 * @typedef {Object} CareerRoadmap
 * @property {string} roleName
 * @property {string} estimatedTotalTime
 * @property {string} difficulty
 * @property {RoadmapPhase[]} phases
 * @property {{ salaryRange: string; demand: string; keySkills: string[] }} careerInsights
 */

export const AppState = {
  WELCOME: 0,
  QUESTIONNAIRE: 1,
  THINKING: 2,
  ROADMAP: 3,
};
