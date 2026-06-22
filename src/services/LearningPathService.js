export const DIDACTIC_PATH = [
    { id: "variaveis", title: "Variáveis" },
    { id: "operadores_aritmeticos", title: "Operadores Aritméticos" },
    { id: "condicionais", title: "Condicionais" },
    { id: "operadores_comparacao", title: "Operadores de Comparação" },
    { id: "operadores_logicos", title: "Operadores Lógicos" },
    { id: "laco_for", title: "Laço For" },
    { id: "laco_while", title: "Laço While" },
    { id: "laco_dowhile", title: "Laço Do While" }
  ];
  
  export const LEVELS = ["basico", "intermediario", "avancado"];
  
  export function createInitialLearningPath() {
    const topics = {};
  
    DIDACTIC_PATH.forEach((topic, index) => {
      topics[topic.id] = {
        id: topic.id,
        title: topic.title,
        unlocked: index === 0,
        levels: {
          basico: createLevelState(index === 0),
          intermediario: createLevelState(false),
          avancado: createLevelState(false)
        }
      };
    });
  
    return {
      currentTopic: "variaveis",
      currentLevel: "basico",
      topics
    };
  }
  
  function createLevelState(unlocked) {
    return {
      unlocked,
      completed: false,
      excellence: false,
      challengesCompleted: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      totalInterventions: 0,
      fullSolutionsUsed: 0
    };
  }
  
  export function updateLearningProgress(gameState, finishResponse) {
    const topicId = gameState.learningPath.currentTopic;
    const levelId = gameState.learningPath.currentLevel;
  
    const topic = gameState.learningPath.topics[topicId];
    const level = topic.levels[levelId];
  
    const score = finishResponse.summary?.finalScore ?? 0;
    const interventions = finishResponse.summary?.successfulInterventions || [];
  
    level.challengesCompleted += 1;
    level.totalScore += score;
    level.averageScore = Math.round(level.totalScore / level.challengesCompleted);
    level.bestScore = Math.max(level.bestScore, score);
    level.totalInterventions += interventions.length;
  
    if (interventions.includes("full_solution")) {
      level.fullSolutionsUsed += 1;
    }
  
    checkCompletion(gameState, topicId, levelId);
  }
  
  function checkCompletion(gameState, topicId, levelId) {
    const level = gameState.learningPath.topics[topicId].levels[levelId];
  
    if (
      level.challengesCompleted >= 5 &&
      level.averageScore >= 75 &&
      level.fullSolutionsUsed <= 1
    ) {
      level.completed = true;
    }
  
    if (
      level.challengesCompleted >= 5 &&
      level.averageScore >= 90 &&
      level.fullSolutionsUsed === 0 &&
      level.totalInterventions <= 5
    ) {
      level.excellence = true;
    }
  
    unlockNext(gameState, topicId, levelId);
  }
  
  function unlockNext(gameState, topicId, levelId) {
    if (!gameState.learningPath.topics[topicId].levels[levelId].completed) return;
  
    const topicIndex = DIDACTIC_PATH.findIndex((t) => t.id === topicId);
    const levelIndex = LEVELS.indexOf(levelId);
  
    if (levelIndex < LEVELS.length - 1) {
      const nextLevel = LEVELS[levelIndex + 1];
  
      gameState.learningPath.topics[topicId].levels[nextLevel].unlocked = true;
  
      gameState.learningPath.currentTopic = topicId;
      gameState.learningPath.currentLevel = nextLevel;
  
      gameState.profile.topico = topicId;
      gameState.profile.nivel_aprendizagem = nextLevel;
  
      return;
    }
  
    const nextTopic = DIDACTIC_PATH[topicIndex + 1];
  
    if (nextTopic) {
      gameState.learningPath.topics[nextTopic.id].unlocked = true;
      gameState.learningPath.topics[nextTopic.id].levels.basico.unlocked = true;
  
      gameState.learningPath.currentTopic = nextTopic.id;
      gameState.learningPath.currentLevel = "basico";
  
      gameState.profile.topico = nextTopic.id;
      gameState.profile.nivel_aprendizagem = "basico";
    }
  }