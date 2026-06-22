import { CONFIG } from "../config.js";
import { createInitialLearningPath } from "../services/LearningPathService.js";

const STORAGE_KEY = "inclucode_player_state_v1";

const defaultState = {
  playerId: CONFIG.DEFAULT_PLAYER.playerId,
  sessionId: CONFIG.DEFAULT_PLAYER.sessionId,

  xp: 0,
  coins: 0,
  level: 1,
  achievements: [],

  currentChallenge: null,
  lastEvaluation: null,
  lastIntervention: null,
  lastSummary: null,

  attempts: 0,
  interventionsUsed: [],
  challengeStartTime: null,

  preGameReturnScene: "MenuScene",
  focusBreaksUsed: 0,
  maxFocusBreaksPerChallenge: 3,

  learningPath: createInitialLearningPath(),

  profile: CONFIG.DEFAULT_PLAYER.profile
};

export const GameState = {
  data: { ...defaultState },

  load() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        this.data = {
          ...defaultState,
          ...parsed,
          learningPath: parsed.learningPath || createInitialLearningPath(),
          profile: {
            ...CONFIG.DEFAULT_PLAYER.profile,
            ...(parsed.profile || {})
          }
        };
      } catch {
        this.data = { ...defaultState };
      }
    }

    return this.data;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },

  resetSession() {
    this.data.currentChallenge = null;
    this.data.lastEvaluation = null;
    this.data.lastIntervention = null;
    this.data.lastSummary = null;

    this.data.attempts = 0;
    this.data.interventionsUsed = [];
    this.data.challengeStartTime = null;

    this.data.preGameReturnScene = "MenuScene";
    this.data.focusBreaksUsed = 0;

    this.save();
  },

  startChallenge(challengeResponse) {
    this.data.currentChallenge = challengeResponse;
    this.data.lastEvaluation = null;
    this.data.lastIntervention = null;
    this.data.lastSummary = null;

    this.data.attempts = 0;
    this.data.interventionsUsed = [];
    this.data.challengeStartTime = Date.now();

    this.save();
  },

  addAttempt() {
    this.data.attempts += 1;
    this.save();
  },

  addIntervention(type) {
    if (type && !this.data.interventionsUsed.includes(type)) {
      this.data.interventionsUsed.push(type);
    }

    this.save();
  },

  applyRewards(rewards) {
    this.data.xp += rewards.xp;
    this.data.coins += rewards.coins;
    this.data.level = Math.floor(this.data.xp / 300) + 1;

    for (const a of rewards.achievements) {
      if (!this.data.achievements.includes(a.code)) {
        this.data.achievements.push(a.code);
      }
    }

    this.save();
  },

  setCurrentLearningStep(topicId, levelId) {
    this.data.learningPath.currentTopic = topicId;
    this.data.learningPath.currentLevel = levelId;
    this.save();
  },

  resetLearningPath() {
    this.data.learningPath = createInitialLearningPath();
    this.save();
  }
};