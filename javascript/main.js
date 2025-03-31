// Dicionário de traduções
const translations = {
  'pt-BR': {
    mainTitle: 'Vector search + Multimodal Embeddings',
    descriptionText: 'Encontre o seu vídeo favorito com poucas palavras',
    searchPlaceholder: 'Digite o que você lembra sobre o vídeo...',
    loadingText: 'Procurando o seu vídeo...',
    resultTitle: 'Resultados da sua busca',
    noResults: 'Nenhum vídeo encontrado para esta busca. Tente usar outras palavras-chave.'
  },
  'en': {
    mainTitle: 'Vector search + Multimodal Embeddings',
    descriptionText: 'Find your favorite video with a few words',
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

// Função para realizar a busca
function startSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  
  // Se o usuário não digitou nada, não faz a busca
  if (!searchInput) return;
  
  // Oculta resultados anteriores e mostra o spinner de carregamento
  document.getElementById("resultArea").style.display = "none";
  document.getElementById("loadingArea").style.display = "flex";
  
  // URL da API original
  const originalApiUrl = `https://search-teste-676835578786.us-central1.run.app/search?q=${encodeURIComponent(searchInput)}`;
  
  // URL com proxy CORS para evitar problemas de CORS
  const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalApiUrl)}`;
  
  // Tentar também com outros proxies CORS conhecidos
  const backupCorsProxies = [
    `https://cors-anywhere.herokuapp.com/${originalApiUrl}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(originalApiUrl)}`
  ];
  
  console.log('Tentando acessar via proxy CORS principal:', corsProxyUrl);
  
  // Implementar um sistema de tentativas múltiplas
  tryFetch(corsProxyUrl, 'POST')
    .catch(error => {
      console.log('Proxy CORS principal falhou:', error);
      return backupCorsProxies.reduce((promise, proxyUrl, index) => {
        return promise.catch(error => {
          console.log(`Tentando proxy CORS alternativo #${index + 1}:`, proxyUrl);
          return tryFetch(proxyUrl, 'POST');
        });
      }, Promise.reject(error));
    })
    .catch(error => {
      console.log('Todos os proxies CORS falharam, tentando método no-cors...', error);
      return fetch(originalApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Accept': 'application/json' }
      })
      .then(() => {
        console.log('Usando dados mockados como fallback');
        return getMockDataForQuery(searchInput);
      });
    })
    .then(data => {
      console.log('Dados recebidos:', data);
      displayResults(data);
    })
    .catch(finalError => {
      console.error('Todas as tentativas falharam:', finalError);
      handleSearchError(finalError);
    });
}

// Função de utilidade para tentar buscar dados com tratamento consistente
function tryFetch(url, method = 'GET') {
  return fetch(url, {
    method: method,
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Verificar se a resposta contém um objeto allorigins que precisa ser extraído
    if (url.includes('allorigins.win')) {
      return response.json().then(data => {
        if (data && data.contents) {
          try {
            return JSON.parse(data.contents);
          } catch (e) {
            console.error('Erro ao fazer parse do conteúdo de allorigins:', e);
            return data;
          }
        }
        return data;
      });
    }
    
    return response.json().then(data => {
      console.log('Resposta da API:', data);
      return data;
    });
  });
}

// Função para tratar erros de busca
function handleSearchError(error) {
  console.error('Erro ao buscar vídeos:', error);
  
  document.getElementById("loadingArea").style.display = "none";
  document.getElementById("resultArea").style.display = "block";
  
  const videoGrid = document.getElementById("videoGrid");
  videoGrid.innerHTML = "";
  
  const currentLang = localStorage.getItem('language') || 'pt-BR';
  
  // Analisar o tipo de erro para fornecer uma mensagem mais específica
  let errorMessage = '';
  
  if (error.message.includes('Failed to fetch')) {
    if (currentLang === 'pt-BR') {
      errorMessage = 'Não foi possível conectar à API. Isso pode ser causado por um problema de CORS (Cross-Origin Resource Sharing). Verifique sua conexão com a internet ou tente usar um proxy CORS.';
    } else {
      errorMessage = 'Unable to connect to the API. This may be caused by a CORS (Cross-Origin Resource Sharing) issue. Check your internet connection or try using a CORS proxy.';
    }
  } else if (error.message.includes('NetworkError')) {
    if (currentLang === 'pt-BR') {
      errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
    } else {
      errorMessage = 'Network error. Check your internet connection.';
    }
  } else if (error.message.includes('timeout')) {
    if (currentLang === 'pt-BR') {
      errorMessage = 'Tempo limite excedido. A API demorou muito para responder.';
    } else {
      errorMessage = 'Request timeout. The API took too long to respond.';
    }
  } else {
    if (currentLang === 'pt-BR') {
      errorMessage = 'Ocorreu um erro ao buscar os vídeos: ' + error.message;
    } else {
      errorMessage = 'An error occurred while searching for videos: ' + error.message;
    }
  }
  
  videoGrid.innerHTML = `
    <div class="no-results">
      <p>${errorMessage}</p>
      <div class="error-details" style="margin-top: 10px; font-size: 0.9rem; color: var(--color-text-secondary);">
        <p>${currentLang === 'pt-BR' ? 'Detalhes técnicos:' : 'Technical details:'} ${error.toString()}</p>
        <p>${currentLang === 'pt-BR' ? 'Usando dados mockados como fallback...' : 'Using mocked data as fallback...'}</p>
      </div>
    </div>
  `;
  
  // Tentar usar dados mockados após mostrar o erro
  setTimeout(() => {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
      const mockData = getMockDataForQuery(searchInput);
      displayResults(mockData);
    }
  }, 3000);
}

// Função para obter dados mockados baseados na consulta
function getMockDataForQuery(query) {
  query = query.toLowerCase();
  
  // Lista de palavras-chave para categorizar as consultas
  const catKeywords = ['gato', 'gatos', 'felino', 'felinos', 'cat', 'cats'];
  const foodKeywords = ['comida', 'alimento', 'culinária', 'receita', 'food', 'recipe'];
  const travelKeywords = ['viagem', 'viajar', 'turismo', 'travel', 'tourist'];
  
  let category = 'geral';
  
  // Determinar a categoria com base nas palavras-chave
  if (catKeywords.some(keyword => query.includes(keyword))) {
    category = 'gatos';
  } else if (foodKeywords.some(keyword => query.includes(keyword))) {
    category = 'comida';
  } else if (travelKeywords.some(keyword => query.includes(keyword))) {
    category = 'viagem';
  }
  
  // Dados mockados por categoria
  const mockDataMap = {
    'gatos': [
      {
        videoTitle: "Gato brincando com bola de lã",
        videoUrl: "assets/videos/video1.mp4",
        mainCategory: ["Animais de Estimação"],
        tags: ["gato", "brincadeira", "diversão", "animal"]
      },
      {
        videoTitle: "Gato dormindo ao sol",
        videoUrl: "assets/videos/video2.mp4",
        mainCategory: ["Animais de Estimação"],
        tags: ["gato", "sono", "relaxamento", "fofo"]
      },
      {
        videoTitle: "Gatinhos recém-nascidos",
        videoUrl: "assets/videos/video3.mp4",
        mainCategory: ["Animais de Estimação"],
        tags: ["gato", "filhotes", "fofura", "família"]
      }
    ],
    'comida': [
      {
        videoTitle: "Receita de bolo de chocolate",
        videoUrl: "assets/videos/video2.mp4",
        mainCategory: ["Culinária"],
        tags: ["receita", "doce", "sobremesa", "chocolate"]
      },
      {
        videoTitle: "Prato de massa italiana",
        videoUrl: "assets/videos/video3.mp4",
        mainCategory: ["Culinária"],
        tags: ["massa", "italiano", "jantar", "gastronomia"]
      }
    ],
    'viagem': [
      {
        videoTitle: "Passeio pela praia",
        videoUrl: "assets/videos/video1.mp4",
        mainCategory: ["Turismo"],
        tags: ["praia", "férias", "verão", "relaxamento"]
      },
      {
        videoTitle: "Visita a museu histórico",
        videoUrl: "assets/videos/video3.mp4",
        mainCategory: ["Turismo"],
        tags: ["museu", "cultura", "história", "arte"]
      }
    ],
    'geral': [
      {
        videoTitle: "Vídeo relacionado a: " + query,
        videoUrl: "assets/videos/video1.mp4",
        mainCategory: ["Diversos"],
        tags: [query, "pesquisa", "resultado"]
      },
      {
        videoTitle: "Conteúdo sobre: " + query,
        videoUrl: "assets/videos/video2.mp4",
        mainCategory: ["Diversos"],
        tags: ["informação", "conhecimento", query]
      }
    ]
  };
  
  return mockDataMap[category];
}

// Função para exibir os resultados na tela
function displayResults(videos) {
  const videoGrid = document.querySelector('.video-grid');
  videoGrid.innerHTML = '';

  // Esconder a área de loading
  document.getElementById("loadingArea").style.display = "none";

  // Se não houver vídeos ou o array estiver vazio
  if (!videos || videos.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `
      <p>Nenhum vídeo encontrado para a sua busca</p>
    `;
    videoGrid.appendChild(noResults);
    return;
  }

  // Se houver vídeos, exibe-os
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    
    // URL do vídeo
    const videoUrl = video.videoUrl;
    
    // Criar o elemento para o vídeo
    const link = document.createElement("a");
    link.href = videoUrl;
    link.target = "_blank";
    link.className = "video-link";
    
    // Criar o elemento de vídeo
    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.muted = true;
    videoElement.controls = true;
    videoElement.playsinline = true;
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.classList.add("result-video");
    videoElement.setAttribute('poster', 'assets/images/thumbnail.jpg');
    
    // Adiciona evento para reproduzir o vídeo ao passar o mouse
    videoElement.addEventListener('mouseenter', () => {
      videoElement.play();
    });
    
    // Pausa o vídeo quando o mouse sai
    videoElement.addEventListener('mouseleave', () => {
      videoElement.pause();
    });
    
    // Adicionar vídeo ao link
    link.appendChild(videoElement);
    
    // Adicionar o link ao card
    card.appendChild(link);
    
    videoGrid.appendChild(card);
  });

  // Mostrar a área de resultados e esconder o loading
  document.querySelector('.result-area').style.display = 'block';
  document.getElementById("loadingArea").style.display = "none";
}

// Função para obter um vídeo local aleatoriamente
function getLocalVideoUrl() {
  const randomIndex = Math.floor(Math.random() * 3) + 1;
  return `assets/videos/video${randomIndex}.mp4`;
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