
# Complemento – Exemplos de Intervenções Pedagógicas

Esta seção pode ser adicionada ao final do documento principal para auxiliar desenvolvedores na implementação das intervenções no Phaser 3.

---

## Cenário de Referência

Desafio:

> Crie um algoritmo que leia um número e informe se ele é positivo, negativo ou zero.

Resposta incorreta do estudante:

```text
Leia numero

SE numero > 0
   Escreva "positivo"
SENAO
   Escreva "negativo"
FIMSE
```

Erro identificado:

```json
{
  "mainErrorCode": "missing_zero_case"
}
```

---

# Nível 1 – Motivacional

Objetivo:
Manter o engajamento e reduzir a frustração.

```json
{
  "type": "motivacional",
  "title": "Continue tentando!",
  "message": "Você já resolveu parte do problema. Tente observar quais situações ainda não foram consideradas."
}
```

Exibição sugerida:

```text
Continue tentando!
Você já resolveu parte do problema.
Observe quais situações ainda não foram consideradas.
```

---

# Nível 2 – Conceitual

Objetivo:
Relembrar um conceito necessário para resolver o problema.

```json
{
  "type": "conceitual",
  "title": "Conceito Importante",
  "message": "Um número pode ser maior que zero, menor que zero ou igual a zero."
}
```

Exibição sugerida:

```text
Conceito Importante

Um número pode ser:
- positivo
- negativo
- igual a zero
```

---

# Nível 3 – Decomposição

Objetivo:
Dividir o problema em partes menores.

```json
{
  "type": "decomposicao",
  "steps": [
    "Receba um número",
    "Verifique se é maior que zero",
    "Verifique se é menor que zero",
    "Caso contrário, trate o valor zero"
  ]
}
```

Exibição sugerida:

```text
Passo 1: Receber o número
Passo 2: Verificar positivo
Passo 3: Verificar negativo
Passo 4: Tratar o zero
```

---

# Nível 4 – Procedimental

Objetivo:
Explicar o processo de resolução.

```json
{
  "type": "procedimental",
  "procedure": [
    "Leia o número",
    "Compare com zero",
    "Escolha o fluxo adequado",
    "Exiba a classificação"
  ]
}
```

Exibição sugerida:

```text
Como resolver:

1. Ler o número
2. Comparar com zero
3. Escolher a condição correta
4. Mostrar o resultado
```

---

# Nível 5 – Exemplo Resolvido

Objetivo:
Apresentar um problema semelhante já resolvido.

```json
{
  "type": "worked_example",
  "example": {
    "problem": "Verificar se um número é par ou ímpar",
    "solution": [
      "Ler número",
      "Calcular resto da divisão por 2",
      "Se resto = 0 → Par",
      "Senão → Ímpar"
    ]
  }
}
```

Exibição sugerida:

```text
Exemplo Semelhante

Problema:
Verificar se um número é par ou ímpar.

Solução:
1. Ler número
2. Calcular resto
3. Decidir o resultado
```

---

# Nível 6 – Solução Guiada

Objetivo:
Conduzir o estudante até a solução.

```json
{
  "type": "guided_solution",
  "hints": [
    "Você já verificou quando o número é positivo.",
    "Agora verifique quando é negativo.",
    "O que acontece quando ele é igual a zero?"
  ]
}
```

Exibição sugerida:

```text
Dica 1:
Você já resolveu o caso positivo.

Dica 2:
Agora resolva o caso negativo.

Dica 3:
Falta apenas tratar o zero.
```

---

# Nível 7 – Solução Completa

Objetivo:
Apresentar a solução integral quando o limite de intervenções for atingido.

```json
{
  "type": "full_solution",
  "solution": [
    "Leia numero",
    "SE numero > 0",
    "  Escreva 'positivo'",
    "SENAO SE numero < 0",
    "  Escreva 'negativo'",
    "SENAO",
    "  Escreva 'zero'",
    "FIMSE"
  ]
}
```

Exibição sugerida:

```text
Leia numero

SE numero > 0
    positivo
SENAO SE numero < 0
    negativo
SENAO
    zero
FIMSE
```

---

# Recomendação de Escalonamento

| Tentativa | Intervenção |
|------------|-------------|
| 1 | Motivacional |
| 2 | Conceitual |
| 3 | Decomposição |
| 4 | Procedimental |
| 5 | Exemplo Resolvido |
| 6 | Solução Guiada |
| 7+ | Solução Completa |

---

# Exemplo de Fluxo

```text
Tentativa 1 → Erro
      ↓
Motivacional

Tentativa 2 → Erro
      ↓
Conceitual

Tentativa 3 → Erro
      ↓
Decomposição

Tentativa 4 → Erro
      ↓
Procedimental

Tentativa 5 → Erro
      ↓
Exemplo Resolvido

Tentativa 6 → Erro
      ↓
Solução Guiada

Tentativa 7 → Erro
      ↓
Solução Completa
```
