/*export const CONFIG = {
  GAME_WIDTH: 1024,
  GAME_HEIGHT: 640,
  AGENT_WEBHOOK_URL: 'https://n8n.incluc0de.com.br/webhook/algame',
  DEFAULT_PLAYER: {
    playerId: 'p001',
    sessionId: 'sess_001',
    profile: {
      nivel_aprendizagem: 'iniciante',
      topico: 'variaveis',
      perfil_cognitivo: 'TDAH',
      linguagem: "c",
      adaptacoes_preferenciais: [
        'enunciado_curto',
        'passos_sequenciais',
        'objetivo_explicito',
      ],
    },
  },
};*/
export const CONFIG = {
  GAME_WIDTH: 1024,
  GAME_HEIGHT: 640,

  PRE_GAME_XP_TIME: 30,

  AGENT_WEBHOOK_URL: "https://n8n.incluc0de.com.br/webhook/algame",

  DEFAULT_PLAYER: {
    playerId: "p001",
    sessionId: "sess_001",
    profile: {
      nivel_aprendizagem: "avancado",
      topico: "variaveis",
      perfil_cognitivo: "TDAH",
      linguagem: "Pseudocodigo",
      adaptacoes_preferenciais: [
        "enunciado_curto",
        "passos_sequenciais",
        "objetivo_explicito"
      ]
    }
  }
};
