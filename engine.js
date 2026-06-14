/**
 * Dragon Treasure Engine - Core Logic
 * Architecture by Anderson Carvalho & Zapia
 */

class DragonTreasureConsole {
    constructor() {
        this.state = 'STANDBY';
        this.currentGame = null;
        this.memoryCard = {}; // In a real app, this would use IndexedDB
        
        // Elementos da UI
        this.screens = {
            standby: document.getElementById('screen-standby'),
            boot: document.getElementById('screen-boot'),
            hub: document.getElementById('screen-hub'),
            gameplay: document.getElementById('screen-gameplay')
        };
        
        this.btnPowerOff = document.getElementById('btn-power-off');
        this.btnTestJoy = document.getElementById('btn-test-joy');
        
        this.init();
    }

    init() {
        document.getElementById('btn-power').addEventListener('click', () => this.powerOn());
        this.btnPowerOff.addEventListener('click', () => this.powerOff());
        this.btnTestJoy.addEventListener('click', () => this.enterTestMode());
        document.getElementById('btn-upload').addEventListener('click', () => this.uploadGame());
        
        // Novo: Carregar jogos da biblioteca oficial
        this.loadLibrary();
        
        // Inicializa o Gerenciador de Input
        this.input = new InputManager(this);
        
        console.log("Dragon Treasure System Ready...");
    }

    async loadLibrary() {
        console.log("Carregando biblioteca...");
        const libraryContainer = document.getElementById('library-list');
        if (!libraryContainer) return;

        // Lista de jogos oficiais (caminhos relativos ao repositório)
        const games = [
            { name: "Primeiro Voo", path: "library/official/primeiro_voo.json" },
            { name: "Exemplo", path: "games/exemplo.json" }
        ];

        games.forEach(game => {
            const btn = document.createElement('button');
            btn.className = "btn-game-card";
            btn.innerHTML = `<span>🐉</span> ${game.name}`;
            btn.onclick = () => this.fetchGame(game.path);
            btn.setAttribute('aria-label', `Carregar jogo ${game.name}`);
            libraryContainer.appendChild(btn);
        });
    }

    async fetchGame(url) {
        this.speak("Carregando cartucho da biblioteca...");
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao baixar o J-SOM");
            const gameData = await response.json();
            this.loadGame(gameData);
        } catch (err) {
            console.error(err);
            this.speak("Erro ao carregar o jogo da biblioteca.");
        }
    }

    enterTestMode() {
        this.state = 'TEST_JOYSTICK';
        this.transitionTo('gameplay');
        this.input.activate();
        
        // Aviso sonoro inicial via Web Speech API (usando síntese do navegador)
        this.speak("Modo de Teste de Joystick ativado. Desative o TalkBack para melhor precisão. Toque na tela para localizar os botões.");
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    }

    async powerOn() {
        if (this.state !== 'STANDBY') return;
        
        this.state = 'BOOTING';
        this.transitionTo('boot');
        
        // Tentar travar em landscape (requer gesto do usuário, que é o clique no Power)
        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock('landscape');
            } catch (e) {
                console.warn("Não foi possível travar a orientação:", e);
            }
        }

        await this.playBootSequence();
        
        this.state = 'HUB';
        this.btnPowerOff.classList.remove('hidden');
        this.transitionTo('hub');
    }

    powerOff() {
        if (this.state === 'STANDBY') return;
        
        console.log("Desligando Dragon Treasure...");
        this.state = 'STANDBY';
        this.btnPowerOff.classList.add('hidden');
        this.transitionTo('standby');
        
        // Destravar orientação se possível
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }

    async playBootSequence() {
        this.state = 'BOOTING';
        this.transitionTo('boot');
        
        const status = document.getElementById('boot-status');
        const chest = document.getElementById('chest-boot');
        const eye = document.getElementById('dragon-eye');
        const container = document.getElementById('console-container');

        console.log("Kernel: Boot Sequence Started.");

        // 1. O Dragão acorda (Olho abre)
        status.textContent = "O Dragão desperta...";
        await this.wait(1000);
        eye.classList.remove('eye-closed');
        eye.classList.add('eye-open');
        this.speak("O Dragão desperta.");
        await this.wait(1000);

        // 2. O Dragão começa a abrir o Baú (Arpejo Progressivo)
        status.textContent = "Abrindo o Baú do Tesouro...";
        chest.classList.add('open');
        // Aqui tocaria o arpejo e o som de madeira rangendo
        await this.wait(2000);

        // 3. O Baú abre totalmente (RUGIDO + Fogo + Vibração)
        status.textContent = "RUGIDO DO DRAGÃO!";
        container.classList.add('shake');
        chest.classList.add('fire-glow');
        
        navigator.vibrate([100, 50, 500]); 
        this.speak("Graur!"); // Rugido simulado
        await this.wait(1500);
        container.classList.remove('shake');

        // 4. A Voz da Marca
        status.textContent = "CONCEGO'S DRAGON TREASURE";
        this.speak("Concego's Dragon Treasure");
        await this.wait(2000);

        this.state = 'HUB';
        this.transitionTo('hub');
    }

    transitionTo(screenKey) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenKey].classList.remove('hidden');
    }

    uploadGame() {
        // Lógica para upload do arquivo J-SOM
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const gameData = JSON.parse(event.target.result);
                    this.loadGame(gameData);
                } catch (err) {
                    alert("Erro ao ler o 'cartucho' J-SOM");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    loadGame(data) {
        this.currentGame = data;
        document.getElementById('game-info').classList.remove('hidden');
        document.getElementById('current-game-name').textContent = data.header?.title || "Jogo Desconhecido";
        
        // Injeção de Código (O Coração do Kernel)
        this.bootGame();
    }

    bootGame() {
        console.log("Kernel: Iniciando injeção de scripts...");
        
        // Cria a API CDT para o jogo
        window.CDT = {
            voice: {
                say: (text) => this.speak(text)
            },
            haptic: {
                vibrate: (pattern) => navigator.vibrate(pattern)
            },
            input: {
                button: (name) => {
                    // Retorna um estado simulado para o teste
                    const isPressed = this.input.lastPressed === name;
                    if (isPressed) this.input.lastPressed = null; // Consome o clique
                    return { justPressed: isPressed };
                }
            }
        };

        // Executa o Script de Inicialização
        if (this.currentGame.scripts && this.currentGame.scripts.init) {
            try {
                const initFn = new Function(this.currentGame.scripts.init);
                initFn();
            } catch (e) {
                console.error("Erro no script init do J-SOM:", e);
            }
        }

        // Inicia o Game Loop para o script 'update'
        this.startGameLoop();
    }

    startGameLoop() {
        const loop = () => {
            if (this.state === 'PLAYING' && this.currentGame.scripts.update) {
                try {
                    const updateFn = new Function(this.currentGame.scripts.update);
                    updateFn();
                } catch (e) {
                    console.error("Erro no script update do J-SOM:", e);
                }
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Gerenciador de Input do CDT
 * Suporta: D-Pad, Joystick Analógico Virtual e Gestos (Hadouken)
 */
class InputManager {
    constructor(console) {
        this.dt = console;
        this.active = false;
        this.touches = {}; // Rastreia toques ativos
        
        // Configuração das Zonas (em % da tela)
        this.zones = {
            movement: 0.45, // Lado esquerdo até 45%
            actions: 0.55   // Lado direito a partir de 55%
        };
    }

    activate() {
        this.active = true;
        const target = this.dt.screens.gameplay;
        
        target.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        target.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        target.addEventListener('touchend', (e) => this.handleTouch(e), { passive: false });
        
        console.log("Input Manager Ativado");
    }

    handleTouch(e) {
        if (!this.active) return;
        e.preventDefault(); // Impede scroll/zoom do navegador

        const rect = e.target.getBoundingClientRect();
        const touches = e.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            const x = (t.clientX - rect.left) / rect.width;
            const y = (t.clientY - rect.top) / rect.height;

            if (e.type === 'touchstart') {
                this.onStart(t.identifier, x, y);
            } else if (e.type === 'touchmove') {
                this.onMove(t.identifier, x, y);
            } else if (e.type === 'touchend') {
                this.onEnd(t.identifier);
            }
        }
    }

    onStart(id, x, y) {
        let buttonName = "";
        
        if (x < this.zones.movement) {
            // Zona de Movimento (Joystick Virtual)
            this.touches[id] = { type: 'move', startX: x, startY: y };
            buttonName = "Direcional";
        } else if (x > this.zones.actions) {
            // Zona de Ações
            buttonName = this.mapActionButton(x, y);
            this.touches[id] = { type: 'action', name: buttonName };
        } else {
            // Zona Central (Coringa)
            buttonName = "Dragon Eye (Coringa)";
        }

        this.feedback(buttonName);
    }

    onMove(id, x, y) {
        const touch = this.touches[id];
        if (touch && touch.type === 'move') {
            const dx = x - touch.startX;
            const dy = y - touch.startY;
            
            // Lógica de "Hadouken" (Simples: detecta direções rápidas)
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                let dir = "";
                if (Math.abs(dy) > Math.abs(dx)) {
                    dir = dy > 0 ? "Baixo" : "Cima";
                } else {
                    dir = dx > 0 ? "Frente" : "Trás";
                }
                
                if (this.dt.state === 'TEST_JOYSTICK') {
                    // No teste, só vibra sutilmente ao mudar de direção
                    navigator.vibrate(10);
                }
            }
        }
    }

    onEnd(id) {
        delete this.touches[id];
    }

    mapActionButton(x, y) {
        // Divide o lado direito em 4 quadrantes para A, B, X, Y
        // E o topo para as Asas (RW1, RW2)
        if (y < 0.2) return "Asa Direita (RW1)";
        
        if (x > 0.75) {
            return y < 0.5 ? "Botão Y" : "Botão B";
        } else {
            return y < 0.5 ? "Botão X" : "Botão A";
        }
    }

    feedback(name) {
        // Vibração Haptica
        navigator.vibrate(40);
        
        // Narração se estiver no Modo de Teste
        if (this.dt.state === 'TEST_JOYSTICK') {
            this.dt.speak(name);
        }
    }
}

// Inicializa o console ao carregar a página
window.addEventListener('load', () => {
    window.dtConsole = new DragonTreasureConsole();
});
