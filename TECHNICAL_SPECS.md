# Documentação Técnica: Concego's Dragon Treasure (CDT)
**Versão:** 0.1 (Draft Inicial)
**Autor:** Anderson Carvalho (ECJ) & Zapia
**Objetivo:** Console Virtual PWA para Inclusão Digital e Retrogaming.

---

## 1. Visão Geral e Identidade
O **Concego's Dragon Treasure (CDT)** é um console virtual hospedado como um Progressive Web App (PWA). Ele visa unir a estética nostálgica dos 32-bits (PS1/Saturn) com um motor de acessibilidade de ponta, permitindo que usuários cegos e videntes joguem os mesmos títulos em pé de igualdade.

*   **Plataforma:** Web (PWA), otimizado para Android/iOS.
*   **Mascote:** Dragão Gamer (Lore: Guardião dos tesouros tecnológicos).
*   **Filosofia:** Inclusão Digital acima da Acessibilidade reativa. O sistema é desenhado para ser intuitivo nativamente, não adaptado.

---

## 2. Arquitetura de Interface (UX)
O console opera em dois estados distintos para otimizar o uso de leitores de tela e a performance de jogo.

### 2.1. Modo HUB (Menu)
*   **Interface:** HTML/CSS padrão (DOM).
*   **Acessibilidade:** Compatibilidade total com TalkBack e NVDA.
*   **Funcionalidades:** Inserir jogo (J-SOM), gerenciar Memory Card, Teste de Joystick e configurações.
*   **Orientação:** Retrato ou Paisagem.

### 2.2. Modo GAMEPLAY (Console)
*   **Ativação:** Disparada ao carregar um jogo ou entrar no Teste de Joystick.
*   **Bloqueio de Orientação:** Força o modo Paisagem (Landscape-Primary).
*   **Autonomia de Acessibilidade:** O console solicita a desativação do leitor de tela do sistema para reduzir a latência e assume o controle do feedback tátil e sonoro.
*   **Motor de Renderização:** Canvas 2D otimizado para estética retro (resolução base sugerida: 320x240).

---

## 3. Sistema de Input (Haptic Grid)
O CDT não utiliza botões físicos, mas sim uma "Grade Háptica" baseada em zonas fixas para criar memória muscular.

### 3.1. Divisão de Tela (Tri-Zonal)
1.  **Zona Esquerda (Movimento):** Sistema de Joystick Relativo. O primeiro toque define o centro; o arrasto define a direção. Suporta gestos complexos (Ex: Hadouken).
2.  **Zona Central (Sistema):** Área morta para comandos de controle do console.
    *   Toque Curto: Select.
    *   Toque Longo: Start.
    *   Duplo Toque: Home (Sair do jogo).
3.  **Zona Direita (Ações):** Quadrantes fixos para botões A, B, X, Y.
4.  **Borda Superior (Asas):** Áreas LW1, LW2 (Esquerda) e RW1, RW2 (Direita) para comandos de ombro.

### 3.2. Feedback Multimodal
*   **Tátil (Vibration API):** Pulsos de vibração diferenciados para cada tipo de interação.
*   **Sonoro (Web Audio API):**
    *   **Panning Estéreo:** Sons originados no lado esquerdo da tela saem apenas no canal esquerdo do fone, e vice-versa.
    *   **Pitch (Tom):** Beeps agudos para ações, graves para movimento.
*   **Voz (Web Speech API):** Narração utilitária para menus e identificação de teclas no modo de teste.

---

## 4. O Padrão J-SOM (Cartuchos Virtuais)
Os jogos são distribuídos em arquivos `.json` chamados **J-SOM**.
*   **Header:** Metadados (Título, Autor, Versão).
*   **Assets:** Referências para áudios e sprites (ou Base64).
*   **Logic:** Scripting em JavaScript que interage com a API do console `dtConsole.input`.
*   **Save State:** O próprio arquivo J-SOM pode atuar como um "Memory Card" persistente.

---

## 5. Estratégia de Mercado e Editais
O CDT se posiciona como uma solução de baixo custo para desenvolvedores indie e uma ferramenta de alto impacto social para editais de cultura e tecnologia.
*   **Unicidade:** Nome blindado "Concego's Dragon Treasure".
*   **Escalabilidade:** Como PWA, dispensa a necessidade de lojas de apps e burocracia de publicação.
