const CACHE_NAME = 'cdt-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './engine.js',
    './manifest.json',
    './assets/sounds/dragon_roar.mp3',
    './assets/sounds/chest_opening.mp3',
    './assets/sounds/concegos_dragon_treasure.mp3'
];

// Instalação: Cacheia os arquivos essenciais
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// Fetch: Serve do cache ou busca na rede
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
