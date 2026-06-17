const ACHIEVEMENTS = {
  primeira_missao: { code: "primeira_missao", title: "Primeira Missão" },
  autonomo: { code: "autonomo", title: "Algoritmista Autônomo" },
  rapido: { code: "rapido", title: "Raciocínio Rápido" },
  sem_ajuda: { code: "sem_ajuda", title: "Sem Ajuda" },
  persistente: { code: "persistente", title: "Persistente" }
};
export function calculateRewards({ completed, attempts, totalTimeSeconds, interventionsUsed, currentAchievements }) {
  let xp = 0, coins = 0;
  const achievements = [];
  if (completed) {
    xp += 100; coins += 20;
    if (!currentAchievements.includes("primeira_missao")) achievements.push(ACHIEVEMENTS.primeira_missao);
  }
  if (completed && attempts === 1 && !currentAchievements.includes("autonomo")) { xp += 50; achievements.push(ACHIEVEMENTS.autonomo); }
  if (completed && totalTimeSeconds <= 60 && !currentAchievements.includes("rapido")) { xp += 30; achievements.push(ACHIEVEMENTS.rapido); }
  if (completed && interventionsUsed.length === 0 && !currentAchievements.includes("sem_ajuda")) { xp += 40; achievements.push(ACHIEVEMENTS.sem_ajuda); }
  if (completed && attempts >= 5 && !currentAchievements.includes("persistente")) { xp += 25; achievements.push(ACHIEVEMENTS.persistente); }
  return { xp, coins, achievements };
}
