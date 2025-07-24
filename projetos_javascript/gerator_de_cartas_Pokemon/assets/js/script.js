const coresTipo = {
    normal: "#95afc0",
    fighting: "#30336b",
    flying: "#81ecec",
    poison: "#6c5ce7",
    ground: "#EFB549",
    rock: "#2d3436",
    bug: "#26de81",
    ghost: "#a55eea",
    steel: "#b8b8d0",
    fire: "#f0932b",
    water: "#0190FF",
    grass: "#00b894",
    electric: "#fed330",
    psychic: "#a29bfe",
    ice: "#74b9ff",
    dragon: "#ffeaa7",
    dark: "#705848",
    fairy: "#FF0069"
};

const typeSymbols = {
    normal: "●",
    fighting: "⚔️",
    flying: "🕊️",
    poison: "☠️",
    ground: "🏜️",
    rock: "🗿",
    bug: "🐛",
    ghost: "👻",
    steel: "⚙️",
    fire: "🔥",
    water: "💧",
    grass: "🌿",
    electric: "⚡",
    psychic: "🔮",
    ice: "❄️",
    dragon: "🐉",
    dark: "🌑",
    fairy: "🌸"
};

const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const btnGerar = document.getElementById("btn");

let pokemonAtual = null;
let chart = null;

// Função para mostrar estado de loading
function mostrarLoading() {
    card.innerHTML = `
        <div class="loading">
            <img src="assets/img/pokeball.png" class="loading-pokeball">
            <p>Carregando...</p>
        </div>
    `;
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    card.innerHTML = `
        <div class="error">
            <p>${mensagem}</p>
            <button onclick="obterDadosPokemon()">Tentar novamente</button>
        </div>
    `;
}

// Obter dados do Pokémon
async function obterDadosPokemon() {
    try {
        mostrarLoading();
        
        const id = Math.floor(Math.random() * 898) + 1;
        const response = await fetch(`${url}${id}`);
        
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        
        const data = await response.json();
        
        if (!data || !data.sprites || !data.types || !data.stats) {
            throw new Error("Dados do Pokémon incompletos na API");
        }

        pokemonAtual = data;
        gerarCarta(data);
    } catch (error) {
        console.error("Erro ao obter Pokémon:", error);
        mostrarErro("Falha ao carregar Pokémon. Tente novamente.");
    }
}

// Obter a melhor imagem disponível
function obterImagemPokemon(data, shiny = false) {
    try {
        if (shiny) {
            return data.sprites.other?.["official-artwork"]?.front_shiny || 
                   data.sprites.front_shiny ||
                   data.sprites.other?.home?.front_shiny ||
                   data.sprites.other?.["official-artwork"]?.front_default ||
                   data.sprites.front_default;
        }
        return data.sprites.other?.["official-artwork"]?.front_default || 
               data.sprites.front_default ||
               data.sprites.other?.home?.front_default;
    } catch {
        return 'assets/img/pokeball.png';
    }
}

// Criar background do tipo
function criarTypeBackground(tipos) {
    const div = document.createElement("div");
    div.className = "type-background-split";
    
    // Obter cores dos tipos
    const typeColors = tipos.map(t => coresTipo[t.type?.name] || "#95afc0");
    
    if (typeColors.length === 1) {
        div.classList.add("single");
        div.style.setProperty('--type1', typeColors[0]);
    } else {
        div.classList.add("double");
        div.style.setProperty('--type1', typeColors[0]);
        div.style.setProperty('--type2', typeColors[1]);
    }
    
    return div;
}

// Gerar carta do Pokémon
function gerarCarta(data) {
    try {
        const imgNormal = obterImagemPokemon(data, false);
        const imgShiny = obterImagemPokemon(data, true);
        const nomePokemon = data.name ? 
            data.name[0].toUpperCase() + data.name.slice(1) : 
            "Desconhecido";
        
        const stats = {
            hp: data.stats[0]?.base_stat || 0,
            attack: data.stats[1]?.base_stat || 0,
            defense: data.stats[2]?.base_stat || 0,
            speed: data.stats[5]?.base_stat || 0,
            specialAttack: data.stats[3]?.base_stat || 0,
            specialDefense: data.stats[4]?.base_stat || 0
        };

        const tipoPrincipal = data.types[0]?.type?.name || "normal";
        const corTema = coresTipo[tipoPrincipal] || "#95afc0";

        card.innerHTML = `
            <h2 class="poke-name">${nomePokemon}</h2>
            <div class="pokemon-images">
                <div class="pokemon-img-container">
                    <img src="${imgNormal}" class="pokemon-img" 
                         alt="${nomePokemon} (Normal)"
                         onerror="this.onerror=null;this.src='assets/img/pokeball.png'"/>
                    <span class="version-label">
                        <img src="assets/img/pokeball.png" alt="Normal">
                        NORMAL
                    </span>
                </div>
                <div class="pokemon-img-container">
                    <img src="${imgShiny}" class="pokemon-img" 
                         alt="${nomePokemon} (Shiny)"
                         onerror="this.onerror=null;this.src='assets/img/pokeball.png'"/>
                    <span class="version-label">
                        <img src="assets/img/shiny.png" alt="Shiny">
                        SHINY
                    </span>
                </div>
            </div>
            <div class="types"></div>
        `;

        // Adiciona o background do tipo
        card.appendChild(criarTypeBackground(data.types));
        adicionarTipos(data.types);
        criarGraficoStats([
            stats.attack,
            stats.defense,
            stats.speed,
            stats.specialAttack,
            stats.specialDefense,
            stats.hp
        ], corTema);
        
    } catch (error) {
        console.error("Erro ao gerar carta:", error);
        mostrarErro("Erro ao exibir Pokémon");
    }
}

// Adicionar tipos com ícones e texto
function adicionarTipos(tipos) {
    try {
        const typesContainer = document.querySelector(".types");
        typesContainer.innerHTML = '';
        
        if (!tipos || !tipos.length) {
            const badge = document.createElement("div");
            badge.className = "type-badge";
            badge.style.backgroundColor = "#95afc0";
            badge.innerHTML = `
                <img src="assets/img/types/normal.png" alt="normal">
                <span>Normal</span>
            `;
            typesContainer.appendChild(badge);
            return;
        }
        
        tipos.forEach((item) => {
            const tipo = item.type?.name || "normal";
            const badge = document.createElement("div");
            badge.className = "type-badge";
            badge.style.backgroundColor = coresTipo[tipo] || "#95afc0";
            badge.innerHTML = `
                <img src="assets/img/types/${tipo}.png" alt="${tipo}"
                     onerror="this.onerror=null;this.src='assets/img/types/normal.png'">
                <span>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
            `;
            typesContainer.appendChild(badge);
        });
    } catch (error) {
        console.error("Erro ao adicionar tipos:", error);
    }
}

// Criar gráfico de estatísticas
function criarGraficoStats(stats, cor) {
    try {
        const ctx = document.getElementById('statsCanvas').getContext('2d');
        
        if (chart) chart.destroy();
        
        chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Ataque', 'Defesa', 'Velocidade', 'Ataque Esp.', 'Defesa Esp.', 'HP'],
                datasets: [{
                    data: stats,
                    backgroundColor: `${cor}40`,
                    borderColor: cor,
                    borderWidth: 2,
                    pointBackgroundColor: cor,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                        suggestedMin: 0,
                        suggestedMax: Math.max(150, ...stats) + 10,
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label || ''} ${context.raw}`
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Erro ao criar gráfico:", error);
    }
}

// Event Listeners
btnGerar.addEventListener("click", obterDadosPokemon);

// Inicialização
document.addEventListener("DOMContentLoaded", obterDadosPokemon);