# API de Agente Pedagógico Adaptativo para Jogos Educacionais

## Visão Geral

Esta API foi projetada para integração entre:

- Frontend do jogo desenvolvido em Phaser 3;
- Backend de orquestração utilizando n8n;
- Agente de IA baseado em LLM (ChatGPT API).

O objetivo do agente é:

1. Gerar desafios adaptados ao perfil do estudante;
2. Avaliar soluções submetidas;
3. Identificar erros conceituais e procedimentais;
4. Selecionar intervenções pedagógicas;
5. Acompanhar a evolução da sessão;
6. Recomendar os próximos desafios.

---

## Arquitetura Geral

```text
Phaser 3
    |
    | HTTP POST
    v
Webhook n8n
    |
    v
Agente IA
    |
    +--> Memória da Sessão
    |
    +--> Avaliação
    |
    +--> Adaptação
    |
    v
Resposta JSON
    |
    v
Phaser 3
```

---

# Endpoint Principal

```http
POST /agent
```

Todas as operações utilizam a mesma rota.

O comportamento é definido pelo campo:

```json
{
  "eventType": "create_challenge"
}
```

---

# Identificadores Obrigatórios

## sessionId

Identifica a sessão de aprendizagem.

Exemplo:

```json
{
  "sessionId": "sess_20260617_001"
}
```

## challengeId

Identifica o desafio atual.

Exemplo:

```json
{
  "challengeId": "chg_0001"
}
```

---

# Fluxo Completo

## 1. Solicitação de Desafio

### Requisição

```json
{
  "eventType": "create_challenge",
  "sessionId": "sess_20260617_001",
  "playerId": "p001",
  "profile": {
    "nivel_aprendizagem": "iniciante",
    "topico": "condicionais",
    "perfil_cognitivo": "TDAH",
    "adaptacoes_preferenciais": [
      "enunciado_curto",
      "passos_sequenciais",
      "objetivo_explicito"
    ]
  }
}
```

### Resposta

```json
{
  "eventType": "challenge_created",
  "challengeId": "chg_0001",
  "challenge": {
    "titulo": "Classificador de número",
    "nivel": "facil",
    "enunciado": "Crie um algoritmo que leia um número e informe se ele é positivo, negativo ou zero."
  }
}
```

---

## 2. Avaliação da Solução

### Requisição

```json
{
  "eventType": "evaluate_solution",
  "sessionId": "sess_20260617_001",
  "challengeId": "chg_0001",
  "studentSolution": {
    "formato": "pseudocodigo",
    "resposta": "Leia numero ..."
  }
}
```

### Resposta

```json
{
  "eventType": "solution_evaluated",
  "evaluation": {
    "isCorrect": false,
    "score": 65,
    "mainErrorCode": "missing_zero_case",
    "mainErrorCategory": "erro_logico"
  },
  "gameAction": "offer_intervention"
}
```

---

## 3. Solicitação de Intervenção

### Requisição

```json
{
  "eventType": "request_intervention",
  "sessionId": "sess_20260617_001",
  "challengeId": "chg_0001",
  "interventionContext": {
    "recommendedLevel": 2,
    "recommendedType": "conceitual"
  }
}
```

### Resposta

```json
{
  "eventType": "intervention_generated",
  "intervention": {
    "type": "conceitual",
    "message": "Um número pode ser maior, menor ou igual a zero."
  }
}
```

---

## 4. Nova Tentativa

### Requisição

```json
{
  "eventType": "evaluate_solution",
  "sessionId": "sess_20260617_001",
  "challengeId": "chg_0001",
  "studentSolution": {
    "formato": "pseudocodigo",
    "resposta": "Nova tentativa..."
  }
}
```

### Resposta

```json
{
  "eventType": "solution_evaluated",
  "evaluation": {
    "isCorrect": false,
    "score": 80,
    "mainErrorCode": "missing_output_for_zero"
  }
}
```

---

## 5. Intervenção por Decomposição

### Resposta

```json
{
  "eventType": "intervention_generated",
  "intervention": {
    "type": "decomposicao",
    "steps": [
      "Verifique se é maior que zero",
      "Verifique se é menor que zero",
      "Caso contrário, mostre zero"
    ]
  }
}
```

---

## 6. Solução Correta

### Resposta

```json
{
  "eventType": "solution_evaluated",
  "evaluation": {
    "isCorrect": true,
    "score": 100
  },
  "gameAction": "finish_challenge"
}
```

---

## 7. Finalização

### Requisição

```json
{
  "eventType": "finish_challenge",
  "sessionId": "sess_20260617_001",
  "challengeId": "chg_0001"
}
```

### Resposta

```json
{
  "eventType": "challenge_finished",
  "summary": {
    "completed": true,
    "finalScore": 100,
    "attempts": 3
  },
  "nextAction": {
    "action": "create_next_challenge"
  }
}
```

---

# Escada de Intervenções

| Nível | Tipo |
|---------|---------|
| 0 | Nenhuma |
| 1 | Motivacional |
| 2 | Conceitual |
| 3 | Decomposição |
| 4 | Procedimental |
| 5 | Exemplo Resolvido |
| 6 | Solução Guiada |
| 7 | Solução Completa |

---

# Fluxo Resumido

```text
create_challenge
        ↓
challenge_created
        ↓
evaluate_solution
        ↓
solution_evaluated
        ↓
request_intervention
        ↓
intervention_generated
        ↓
evaluate_solution
        ↓
solution_evaluated
        ↓
finish_challenge
        ↓
challenge_finished
```

---

# Benefícios da Arquitetura

- Separação entre jogo e agente;
- Contexto persistente por sessão;
- Adaptação por perfil cognitivo;
- Intervenções graduais;
- Compatível com TDAH, TEA e outros perfis;
- Preparada para futura integração com telemetria e EEG;
- Fácil implementação em Phaser 3 + n8n + ChatGPT API.
