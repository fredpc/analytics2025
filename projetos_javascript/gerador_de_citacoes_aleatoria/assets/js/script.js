function criarParticulas() {
    for (let i = 0; i < 15; i++) {
      const particula = document.createElement('div');
      particula.className = 'particle';
      particula.style.width = Math.random() * 4 + 2 + 'px';
      particula.style.height = particula.style.width;
      particula.style.left = Math.random() * 100 + '%';
      particula.style.top = Math.random() * 100 + '%';
      particula.style.animationDelay = Math.random() * 6 + 's';
      particula.style.animationDuration = (Math.random() * 3 + 4) + 's';
      document.body.appendChild(particula);
    }
}

criarParticulas();

let citacao = document.getElementById("quote");
let autor = document.getElementById("author");
let botao = document.getElementById("btn");

const url = "https://api.quotable.io/random";

let obterCitacao = () => {
    botao.classList.add('loading');
    botao.textContent = '';
    
    citacao.style.opacity = '0.5';
    autor.style.opacity = '0.5';

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        return response.json();
      })
      .then((item) => {
        setTimeout(() => {
          citacao.innerText = item.content;
          autor.innerText = item.author;
          
          citacao.style.opacity = '1';
          autor.style.opacity = '1';
          
          botao.classList.remove('loading');
          botao.textContent = 'Nova Citação';
        }, 300);
      })
      .catch((error) => {
        console.error("Erro ao buscar citação:", error);
        setTimeout(() => {
          citacao.innerText = "Falha ao carregar citação. Tente novamente.";
          autor.innerText = "Erro";
          citacao.style.opacity = '1';
          autor.style.opacity = '1';
          botao.classList.remove('loading');
          botao.textContent = 'Tentar Novamente';
        }, 300);
      });
};

citacao.style.transition = 'opacity 0.3s ease-in-out';
autor.style.transition = 'opacity 0.3s ease-in-out';

let botaoCopiar = document.getElementById("btn-copy");

if (botaoCopiar) {
  botaoCopiar.addEventListener("click", () => {
    const quote = citacao.innerText;
    const author = autor.innerText;
    const textToCopy = `"${quote}" - ${author}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Feedback visual temporário
      const originalHTML = botaoCopiar.innerHTML;
      botaoCopiar.innerHTML = '<i class="fas fa-check"></i>';
      botaoCopiar.style.background = 'linear-gradient(145deg, #4caf50, #388e3c)';
      
      setTimeout(() => {
        botaoCopiar.innerHTML = originalHTML;
        botaoCopiar.style.background = 'linear-gradient(145deg, #3a7ca5, #2c5d7a)';
      }, 2000);
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      alert('Não foi possível copiar a citação. Tente novamente.');
    });
  });
}

if (citacao && autor && botao && botaoCopiar) {
    window.addEventListener("load", obterCitacao);
    botao.addEventListener("click", obterCitacao);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !botao.classList.contains('loading')) {
        obterCitacao();
      }
    });
} else {
    console.error("Um ou mais elementos não encontrados no DOM");
}