# 🎮 ALGame - Adaptive Learning Game

> Jogo Educacional Adaptativo para o Ensino de Algoritmos baseado em Agentes Inteligentes, Gamificação e Aprendizagem Adaptativa.

ALGame - Jogo Digital [https://algame-zeta.vercel.app/]

## 📖 Sobre o Projeto

O **ALGame (Adaptive Learning Game)** é um ambiente gamificado para aprendizagem de algoritmos que integra um jogo digital desenvolvido em **Phaser 3** com um **Agente Pedagógico Adaptativo** orquestrado por **n8n** e modelos de IA.

O projeto tem como objetivo aumentar o engajamento dos estudantes durante a aprendizagem de programação por meio de:

* desafios adaptativos;
* intervenções pedagógicas inteligentes;
* gamificação;
* acompanhamento da evolução do estudante;
* personalização da experiência de aprendizagem.

Diferentemente de plataformas tradicionais de exercícios, o ALGame utiliza um agente de IA para atuar como um tutor inteligente capaz de:

* gerar desafios;
* avaliar soluções;
* identificar erros;
* fornecer intervenções pedagógicas graduais;
* recomendar próximos passos de aprendizagem.

---

## 🏗️ Arquitetura

```text
┌────────────────────┐
│      Phaser 3      │
│      ALGame        │
└─────────┬──────────┘
          │ HTTP/JSON
          ▼
┌────────────────────┐
│       n8n          │
│ Workflow Orchestr. │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Agente Pedagógico  │
│   Adaptativo IA    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Simple Memory    │
│  Contexto Sessão   │
└────────────────────┘
```

---

## 🎯 Objetivos

O projeto busca investigar como agentes inteligentes podem contribuir para:

* melhoria do engajamento;
* aumento da persistência na resolução de problemas;
* aprendizagem adaptativa;
* inclusão cognitiva;
* desenvolvimento do pensamento computacional.

---

## 🚀 Funcionalidades

### Agente Pedagógico

* Geração automática de desafios.
* Avaliação de soluções.
* Identificação de erros.
* Recomendações pedagógicas.
* Intervenções graduais.
* Memória de sessão.

### Game

* Sistema de níveis.
* Sistema de XP.
* Sistema de moedas (Bits).
* Conquistas (Achievements).
* Progressão do jogador.
* Narrativa gamificada.
* Feedback visual imediato.

### Aprendizagem

* Desafios de algoritmos.
* Pensamento computacional.
* Estruturas condicionais.
* Estruturas de repetição.
* Vetores e matrizes.
* Funções e modularização.

---

## 🎓 Fluxo Pedagógico

```text
Novo Desafio
      │
      ▼
Resposta do Estudante
      │
      ▼
Avaliação da Solução
      │
      ├── Correta
      │       │
      │       ▼
      │   Recompensas
      │
      └── Incorreta
              │
              ▼
      Intervenção Pedagógica
              │
              ▼
        Nova Tentativa
```

---

## 🧠 Escada de Intervenções

O agente pode fornecer diferentes níveis de apoio pedagógico:

| Nível | Intervenção       |
| ----- | ----------------- |
| 1     | Motivacional      |
| 2     | Conceitual        |
| 3     | Decomposição      |
| 4     | Procedimental     |
| 5     | Exemplo Resolvido |
| 6     | Solução Guiada    |
| 7     | Solução Completa  |

O suporte é escalonado gradualmente conforme o desempenho do estudante.

---

## 🎮 Gamificação

O sistema de gamificação é controlado pelo jogo, independentemente do agente.

### Recompensas

* XP (Experiência)
* Bits (Moeda Virtual)
* Conquistas
* Progressão de Nível

### Exemplos de Conquistas

🏆 Primeira Missão

🏆 Persistente

🏆 Algoritmista Autônomo

🏆 Raciocínio Rápido

🏆 Especialista em Condicionais

---

## 🔌 Integração com o Agente

A comunicação ocorre por meio de uma única rota HTTP.

### Endpoint

```http
POST /agent
```

### Eventos Suportados

| Evento               | Descrição             |
| -------------------- | --------------------- |
| create_challenge     | Solicita novo desafio |
| evaluate_solution    | Avalia solução        |
| request_intervention | Solicita intervenção  |
| finish_challenge     | Finaliza desafio      |

---

## 📋 Exemplo de Requisição

```json
{
  "eventType": "create_challenge",
  "sessionId": "sess_001",
  "playerId": "p001",
  "profile": {
    "nivel_aprendizagem": "iniciante",
    "topico": "condicionais",
    "perfil_cognitivo": "TDAH",
    "linguagem":"pseudocodigo", 
  }
}
```
### Linguagens suportadas

```
Pseudocódigo (pseudocodigo), 
Portugol (portugol), 
C (c), 
Javascript (javascript) e Python (python) 
```
 

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* Phaser 3
* JavaScript
* HTML5
* CSS3

### Backend e Orquestração

* n8n
* Webhooks REST

### Inteligência Artificial

* OpenAI API
* AI Agent (n8n)

### Persistência

* Simple Memory (n8n)

### Evoluções Futuras

* MongoDB
* Supabase
* Learning Analytics
* Telemetria Multimodal
* EEG (MindWave)

---

## 📂 Estrutura do Projeto

```text
ALGame/

├── frontend/
│   ├── src/
│   ├── assets/
│   ├── scenes/
│   ├── services/
│   └── state/
│
├── workflows/
│   └── n8n/
│
├── docs/
│
├── research/
│
└── README.md
```

---

## 🔬 Contexto de Pesquisa

O ALGame faz parte de uma linha de pesquisa voltada para:

* Aprendizagem Adaptativa;
* Learning Analytics;
* Agentes Inteligentes;
* Inclusão Cognitiva;
* Neurodiversidade;
* Jogos Educacionais Digitais;
* Inteligência Artificial na Educação.

O projeto evolui a partir da proposta do **IncluC0de**, investigando mecanismos para adaptação automática de desafios e intervenções pedagógicas em ambientes de aprendizagem digital.

---

## 📈 Roadmap

### Versão 1

* Integração Phaser + n8n
* Criação de desafios
* Avaliação automática
* Intervenções pedagógicas

### Versão 2

* Sistema completo de gamificação
* Narrativa e progressão
* Missões e conquistas

### Versão 3

* Learning Analytics
* Perfil de aprendizagem
* Recomendações adaptativas

### Versão 4

* Inclusão Cognitiva
* Telemetria Multimodal
* EEG
* Arquitetura Multiagente

---

## 👨‍💻 Autores

* **Leandro Vaguetti**
* **Hially Rabelo Vaguetti**

Projeto desenvolvido no contexto de pesquisa aplicada em Inteligência Artificial, Jogos Educacionais Digitais e Aprendizagem Adaptativa.

---

## 📜 Licença

Este projeto é disponibilizado para fins acadêmicos e de pesquisa.

