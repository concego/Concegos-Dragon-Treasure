# Guia do Desenvolvedor: Ecossistema CDT
**Bem-vindo à criação de jogos inclusivos para o Concego's Dragon Treasure.**

## 1. O Hardware Virtual (Specs 32-bit)
O CDT emula a filosofia de um console de meados dos anos 90.
*   **Resolução:** Embora flexível, recomendamos 320x240 para manter a estética pixel-art.
*   **Áudio:** Canal Duplo (Estéreo). Utilize o balanço (Panning) para indicar posição de objetos.
*   **Input:** Haptic Grid (Zonas fixas de toque com feedback vibratório).

## 2. Estrutura do J-SOM
Seu jogo deve ser um arquivo único `.json`.
*   `header`: Metadados.
*   `scripts.init`: Carrega uma vez (configurações, boas-vindas).
*   `scripts.update`: 60 FPS (lógica de jogo, colisões).
*   `scripts.render`: Desenho no canvas.

## 3. Diretrizes de Inclusão (Obrigatórias)
Para um jogo ser aceito na curadoria oficial do ECJ:
1.  **Narração de Interface:** Todos os menus devem usar a API `CDT.voice.say()`.
2.  **Feedback de Impacto:** Eventos físicos (danos, saltos, colisões) devem disparar a API `CDT.haptic.vibrate()`.
3.  **Localização Sonora:** Inimigos ou itens importantes devem emitir sons com panning estéreo proporcional à posição na tela.
4.  **Tutorial Tátil:** O jogo deve explicar seu mapeamento de botões no início ou possuir um modo de treino.

## 4. Exemplos de API
*   `CDT.input.button('A').pressed`: Detecta pressão no botão A.
*   `CDT.input.dpad.direction`: Retorna 'up', 'down', 'left', 'right'.
*   `CDT.audio.play('id')`: Toca um asset de áudio.
*   `CDT.haptic.vibrate([100, 50, 100])`: Pulso de vibração.
