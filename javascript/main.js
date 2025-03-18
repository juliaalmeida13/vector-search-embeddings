// Dicionário de traduções
const translations = {
  'pt-BR': {
    mainTitle: 'Vector search + Multimodal Embeddings',
    descriptionText: 'Digite o que você lembra sobre o vídeo e nós o encontraremos para você',
    searchPlaceholder: 'Digite o que você lembra sobre o vídeo...',
    loadingText: 'Procurando o seu vídeo...',
    resultTitle: 'Resultados da sua busca',
    noResults: 'Nenhum vídeo encontrado para esta busca. Tente usar outras palavras-chave.'
  },
  'en': {
    mainTitle: 'Vector search + Multimodal Embeddings',
    descriptionText: 'Type what you remember about the video and we will find it for you',
    searchPlaceholder: 'Type what you remember about the video...',
    loadingText: 'Searching for your video...',
    resultTitle: 'Search results',
    noResults: 'No videos found for this search. Try using other keywords.'
  }
};

// Tela de carregamento inicial (Splash Screen)
document.addEventListener('DOMContentLoaded', function() {
  const splashScreen = document.getElementById('splashScreen');
  
  // Simular tempo de carregamento (2.5 segundos)
  setTimeout(function() {
    splashScreen.classList.add('hidden');
    
    // Remover completamente após a animação de fade out
    setTimeout(function() {
      splashScreen.style.display = 'none';
    }, 500); // Tempo igual à duração da transição CSS
  }, 2500);
});

// Função para atualizar os textos da interface
function updateLanguage(lang) {
  const texts = translations[lang];
  
  // Atualizar os textos
  document.getElementById('mainTitle').textContent = texts.mainTitle;
  document.getElementById('descriptionText').textContent = texts.descriptionText;
  document.getElementById('searchInput').placeholder = texts.searchPlaceholder;
  document.getElementById('loadingText').textContent = texts.loadingText;
  document.getElementById('resultTitle').textContent = texts.resultTitle;
  
  // Atualizar o atributo lang do html
  document.documentElement.lang = lang;
  
  // Salvar a preferência no localStorage
  localStorage.setItem('language', lang);
  
  // Atualizar a classe ativa no seletor de idioma
  const options = document.querySelectorAll('.language-option');
  options.forEach(option => {
    option.classList.toggle('active', option.dataset.lang === lang);
  });
}

// Adicionar eventos aos botões de idioma
document.querySelectorAll('.language-option').forEach(option => {
  option.addEventListener('click', () => {
    updateLanguage(option.dataset.lang);
  });
});

// Verificar se há um idioma salvo no localStorage
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
  updateLanguage(savedLanguage);
}

// Código do tema - alternância entre claro e escuro
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Verificar se há um tema salvo no localStorage
const currentTheme = localStorage.getItem('theme');

// Se houver um tema salvo, aplicá-lo
if (currentTheme) {
  document.body.classList.toggle('light-theme', currentTheme === 'light');
  // Atualizar os ícones
  if (currentTheme === 'light') {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
} else {
  // Se não houver tema salvo, usar a preferência do sistema
  const shouldUseDarkMode = prefersDarkScheme.matches;
  document.body.classList.toggle('light-theme', !shouldUseDarkMode);
  // Atualizar os ícones com base na preferência do sistema
  if (!shouldUseDarkMode) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

// Função para alternar o tema
function toggleTheme() {
  const isLightTheme = document.body.classList.toggle('light-theme');
  
  // Salvar a preferência no localStorage
  localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  
  // Alternar ícones
  if (isLightTheme) {
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  } else {
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  }
}

// Adicionar evento de clique para alternar o tema
themeToggle.addEventListener('click', toggleTheme);

// Carrossel com rotação posicional (centro → esquerda → direita → centro)
let currentSlide = 1; // Começamos com o segundo item (índice 1) ativo
const carouselItems = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = carouselItems.length;

// Posições para os vídeos (0 = esquerda, 1 = centro, 2 = direita)
let positions = [0, 1, 2]; // Inicialmente, slide 0 está à esquerda, 1 no centro, 2 à direita

function updateCarouselPositions() {
  // Remover todas as classes de posição existentes
  carouselItems.forEach(item => {
    item.classList.remove('position-left', 'position-center', 'position-right');
    const video = item.querySelector('video');
    video.pause();
  });
  
  // Aplicar as novas classes de posição
  for (let i = 0; i < totalSlides; i++) {
    if (positions[i] === 0) {
      carouselItems[i].classList.add('position-left');
    } else if (positions[i] === 1) {
      carouselItems[i].classList.add('position-center', 'active');
      // Reproduz o vídeo central
      const video = carouselItems[i].querySelector('video');
      video.currentTime = 0;
      video.play();
    } else if (positions[i] === 2) {
      carouselItems[i].classList.add('position-right');
    }
  }
}

// Função para rotacionar as posições no sentido desejado
function rotatePositions() {
  // Implementando a rotação: centro → esquerda → direita → centro
  // Criamos um novo array de posições
  let newPositions = new Array(totalSlides);
  
  for (let i = 0; i < totalSlides; i++) {
    if (positions[i] === 0) { // esquerda vai para direita
      newPositions[i] = 2;
    } else if (positions[i] === 1) { // centro vai para esquerda
      newPositions[i] = 0;
    } else if (positions[i] === 2) { // direita vai para centro
      newPositions[i] = 1;
    }
  }
  
  positions = newPositions;
  updateCarouselPositions();
}

// Substituir a função showSlide anterior
function showSlide(index) {
  // Encontrar qual posição o slide desejado tem atualmente
  const currentPosition = positions[index];
  
  // Se o slide já está no centro, não faz nada
  if (currentPosition === 1) return;
  
  // Número de rotações necessárias para trazer o slide para o centro
  let rotationsNeeded = 0;
  
  if (currentPosition === 0) { // Slide está à esquerda
    rotationsNeeded = 2; // Precisa de 2 rotações: esquerda → direita → centro
  } else if (currentPosition === 2) { // Slide está à direita
    rotationsNeeded = 1; // Precisa de 1 rotação: direita → centro
  }
  
  // Aplicar o número necessário de rotações
  for (let i = 0; i < rotationsNeeded; i++) {
    rotatePositions();
  }
}

// Avançar para o próximo slide usando a rotação
function nextSlide() {
  rotatePositions();
}

// Iniciar o carrossel quando a página carregar
window.addEventListener('load', () => {
  // Aplicar as posições iniciais
  updateCarouselPositions();
  
  // Definir um intervalo fixo de 6 segundos para a troca automática dos slides
  const autoplayInterval = setInterval(() => {
    nextSlide();
  }, 6000);
});

// API simulada para busca de vídeos
const fakeAPI = {
  // Banco de dados de vídeos simulado
  videos: [
    { 
      id: 1, 
      title: "Dançando na praia",
      title_en: "Dancing on the beach",
      keywords: ["dança", "praia", "verão", "amigos", "diversão"],
      keywords_en: ["dance", "beach", "summer", "friends", "fun"],
      videoUrl: "assets/videos/video1.mp4", 
      instagramLink: "https://www.instagram.com/p/Cx12345abcd/",
      thumbnail: "assets/videos/video1.mp4"
    },
    { 
      id: 2, 
      title: "Viagem a Paris",
      title_en: "Trip to Paris",
      keywords: ["viagem", "paris", "frança", "torre eiffel", "turismo"],
      keywords_en: ["travel", "paris", "france", "eiffel tower", "tourism"],
      videoUrl: "assets/videos/video2.mp4", 
      instagramLink: "https://www.instagram.com/p/Cy67890efgh/",
      thumbnail: "assets/videos/video2.mp4"
    },
    { 
      id: 3, 
      title: "Receita de bolo de chocolate",
      title_en: "Chocolate cake recipe",
      keywords: ["receita", "bolo", "chocolate", "culinária", "sobremesa"],
      keywords_en: ["recipe", "cake", "chocolate", "cooking", "dessert"],
      videoUrl: "assets/videos/video3.mp4", 
      instagramLink: "https://www.instagram.com/p/Cz24680ijkl/",
      thumbnail: "assets/videos/video3.mp4"
    },
    { 
      id: 4, 
      title: "Meditação matinal",
      title_en: "Morning meditation",
      keywords: ["meditação", "mindfulness", "relaxamento", "manhã", "bem-estar"],
      keywords_en: ["meditation", "mindfulness", "relaxation", "morning", "wellness"],
      videoUrl: "assets/videos/video1.mp4", 
      instagramLink: "https://www.instagram.com/p/Da35791mnop/",
      thumbnail: "assets/videos/video1.mp4"
    },
    { 
      id: 5, 
      title: "Tutorial de maquiagem",
      title_en: "Makeup tutorial",
      keywords: ["maquiagem", "beleza", "tutorial", "make", "cosmético"],
      keywords_en: ["makeup", "beauty", "tutorial", "cosmetics", "glamour"],
      videoUrl: "assets/videos/video2.mp4", 
      instagramLink: "https://www.instagram.com/p/Eb46802qrst/",
      thumbnail: "assets/videos/video2.mp4"
    },
    { 
      id: 6, 
      title: "Passeio de bicicleta",
      title_en: "Bicycle ride",
      keywords: ["bicicleta", "esporte", "natureza", "exercício", "ar livre"],
      keywords_en: ["bicycle", "sport", "nature", "exercise", "outdoors"],
      videoUrl: "assets/videos/video3.mp4", 
      instagramLink: "https://www.instagram.com/p/Fc57913uvwx/",
      thumbnail: "assets/videos/video3.mp4"
    },
    { 
      id: 7, 
      title: "Festa de aniversário",
      title_en: "Birthday party",
      keywords: ["festa", "aniversário", "celebração", "amigos", "bolo"],
      keywords_en: ["party", "birthday", "celebration", "friends", "cake"],
      videoUrl: "assets/videos/video1.mp4", 
      instagramLink: "https://www.instagram.com/p/Gd68024yzab/",
      thumbnail: "assets/videos/video1.mp4"
    }
  ],
  
  // Método para simular a busca de vídeos por palavras-chave
  search: function(query) {
    // Obter o idioma atual
    const currentLang = localStorage.getItem('language') || 'pt-BR';
    const isEnglish = currentLang === 'en';
    
    // Converter para minúsculas para facilitar a comparação
    const queryLower = query.toLowerCase();
    
    // Dividir a consulta em palavras para melhorar a correspondência
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 2);
    
    // Se não há termos de busca válidos, retornar array vazio
    if (queryTerms.length === 0) {
      return [];
    }
    
    // Para cada vídeo, verificar correspondência com título e palavras-chave
    const results = this.videos.map(video => {
      let score = 0;
      const titleLower = isEnglish ? video.title_en.toLowerCase() : video.title.toLowerCase();
      const keywordsArray = isEnglish ? video.keywords_en : video.keywords;
      
      // Verificar correspondência no título
      queryTerms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 3; // Maior peso para correspondências no título
        }
      });
      
      // Verificar correspondência nas palavras-chave
      keywordsArray.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        queryTerms.forEach(term => {
          if (keywordLower.includes(term) || term.includes(keywordLower)) {
            score += 1;
          }
        });
      });
      
      return { video, score };
    });
    
    // Filtrar resultados com pontuação > 0 e ordenar por relevância
    const filteredResults = results
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.video);
    
    // Limitar a 5 resultados no máximo
    return filteredResults.slice(0, 5);
  }
};

// Função para realizar a busca
function startSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  
  // Se o usuário não digitou nada, não faz a busca
  if (!searchInput) return;
  
  // Oculta resultados anteriores e mostra o spinner de carregamento
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("loadingArea").style.display = "flex";
  
  // Simular um atraso da API para demonstração
  setTimeout(() => {
    const results = fakeAPI.search(searchInput);
    displayResults(results);
  }, 1500);
}

// Função para exibir os resultados na tela
function displayResults(videos) {
  // Obter o idioma atual
  const currentLang = localStorage.getItem('language') || 'pt-BR';
  const isEnglish = currentLang === 'en';
  
  // Esconde o loading
  document.getElementById("loadingArea").style.display = "none";
  
  // Mostra a área de resultados
  document.getElementById("resultArea").style.display = "block";
  
  // Limpa os resultados anteriores
  const videoGrid = document.getElementById("videoGrid");
  videoGrid.innerHTML = "";
  
  // Se não encontrou nenhum resultado
  if (videos.length === 0) {
    videoGrid.innerHTML = `
      <div class="no-results">
        <p>${translations[currentLang].noResults}</p>
      </div>
    `;
    return;
  }
  
  // Adiciona cada vídeo à grid
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    
    const link = document.createElement("a");
    link.href = video.instagramLink;
    link.target = "_blank";
    
    const videoElement = document.createElement("video");
    videoElement.src = video.videoUrl;
    videoElement.muted = true;
    videoElement.classList.add("result-video");
    
    const titleElement = document.createElement("h3");
    titleElement.textContent = isEnglish ? video.title_en : video.title;
    titleElement.className = "video-title";
    
    // Adiciona evento para reproduzir o vídeo ao passar o mouse
    videoElement.addEventListener('mouseenter', () => {
      videoElement.play();
    });
    
    // Pausa o vídeo quando o mouse sai
    videoElement.addEventListener('mouseleave', () => {
      videoElement.pause();
    });
    
    link.appendChild(videoElement);
    link.appendChild(titleElement);
    card.appendChild(link);
    videoGrid.appendChild(card);
  });
}

// Adicionar evento de tecla Enter no campo de busca
document.getElementById("searchInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    startSearch();
  }
});

// Adicionar evento de clique ao botão de busca (revisado)
document.addEventListener('DOMContentLoaded', function() {
  const searchIcon = document.querySelector('.search-icon');
  if (searchIcon) {
    searchIcon.addEventListener('click', function() {
      startSearch();
    });
  }
}); 