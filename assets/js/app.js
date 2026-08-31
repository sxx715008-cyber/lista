const DONA = {
    nome: "Dorikelly Sofia Ximenes Soares",
    senha: "18102008",
    pix: "COLOQUE-SUA-CHAVE-PIX-AQUI",
    telefone: "5500000000000"
};

let produtos = [
    {
        id:1,
        categoria:"Cozinha",
        icone:"🍳",
        nome:"Jogo de panelas",
        descricao:"Jogo de panelas para a nova cozinha.",
        imagem:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:2,
        categoria:"Cozinha",
        icone:"☕",
        nome:"Jogo de xícaras",
        descricao:"Conjunto de xícaras para café.",
        imagem:"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:3,
        categoria:"Quarto",
        icone:"🛏️",
        nome:"Jogo de cama",
        descricao:"Jogo de cama para o quarto.",
        imagem:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:4,
        categoria:"Banheiro",
        icone:"🛁",
        nome:"Kit de toalhas",
        descricao:"Kit de toalhas para o banheiro.",
        imagem:"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:5,
        categoria:"Sala",
        icone:"🛋️",
        nome:"Almofadas decorativas",
        descricao:"Almofadas para deixar a sala mais aconchegante.",
        imagem:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:6,
        categoria:"Decoração",
        icone:"✨",
        nome:"Vaso decorativo",
        descricao:"Vaso para decoração da casa.",
        imagem:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:7,
        categoria:"Lavanderia",
        icone:"🧺",
        nome:"Cesto para roupas",
        descricao:"Cesto organizador para a lavanderia.",
        imagem:"https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    },
    {
        id:8,
        categoria:"Quarto",
        icone:"💡",
        nome:"Abajur",
        descricao:"Abajur para o quarto.",
        imagem:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        link:"https://www.google.com",
        recebido:false
    }
];

const STORAGE_KEY = "listaNovaCasaState";
let usuarioAtual = null;
let produtoSelecionado = null;
let tipoPresente = null;
let visitas = [];

function carregarEstadoSalvo() {
    try {
        const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (!salvo) return;

        if (Array.isArray(salvo.produtos)) {
            produtos = salvo.produtos.map((produto) => ({ ...produto, recebido: Boolean(produto.recebido) }));
        }

        if (Array.isArray(salvo.visitas)) {
            visitas = salvo.visitas;
        }
    } catch (erro) {
        console.error("Erro ao carregar estado salvo:", erro);
    }
}

function salvarEstado() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ produtos, visitas }));
    } catch (erro) {
        console.error("Erro ao salvar estado:", erro);
    }
}

carregarEstadoSalvo();

function loginConvidado() {
    const nome = document.getElementById("guestName").value.trim();
    const relacao = document.getElementById("guestRelation").value.trim();

    if (!nome || !relacao) {
        alert("Preencha seu nome e diga o que você é da Dorikelly.");
        return;
    }

    usuarioAtual = {
        nome,
        relacao,
        dona:false
    };

    abrirApp();
}

function abrirLoginDona() {
    document.getElementById("ownerModal").classList.remove("hidden");
}

function fecharLoginDona() {
    document.getElementById("ownerModal").classList.add("hidden");
}

function loginDona() {
    const nome = document.getElementById("ownerName").value.trim();
    const senha = document.getElementById("ownerPassword").value;

    if (nome === DONA.nome && senha === DONA.senha) {
        usuarioAtual = {
            nome: DONA.nome,
            relacao: "Dona da lista",
            dona: true
        };

        fecharLoginDona();
        abrirApp();
        document.getElementById("adminTab").classList.remove("hidden");
    } else {
        alert("Nome completo ou senha incorretos.");
    }
}

function abrirApp() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("welcome").innerText = "Olá, " + usuarioAtual.nome + "!";

    renderizarProdutos();
    renderizarJaTenho();
    renderizarAdmin();
}

function logout() {
    usuarioAtual = null;
    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("adminTab").classList.add("hidden");
}

function aba(nome, botao) {
    document.getElementById("lista").classList.add("hidden");
    document.getElementById("tenho").classList.add("hidden");
    document.getElementById("admin").classList.add("hidden");

    document.getElementById(nome).classList.remove("hidden");

    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    botao.classList.add("active");
}

function registrarVisita() {
    if (!usuarioAtual) return;

    const visita = {
        nome: usuarioAtual.nome,
        relacao: usuarioAtual.relacao,
        tipo: usuarioAtual.dona ? "dona" : "convidado",
        horario: new Date().toLocaleString("pt-BR")
    };

    visitas = [visita, ...visitas].slice(0, 20);
    salvarEstado();
    renderizarNotificacoes();
}

function renderizarNotificacoes() {
    const container = document.getElementById("adminNotifications");
    if (!container) return;

    if (visitas.length === 0) {
        container.innerHTML = '<p style="color:#888;line-height:1.5;">Nenhuma entrada registrada ainda.</p>';
        return;
    }

    container.innerHTML = visitas.map((visita) => `
        <div class="notification-item">
            <strong>${visita.nome}${visita.tipo === "dona" ? " (dona)" : ""}</strong>
            <span>${visita.relacao}</span>
            <small>${visita.horario}</small>
        </div>
    `).join("");
}

function renderizarProdutos() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    const categorias = {};

    produtos.filter((produto) => !produto.recebido).forEach((produto) => {
        if (!categorias[produto.categoria]) {
            categorias[produto.categoria] = { icone: produto.icone, produtos: [] };
        }
        categorias[produto.categoria].produtos.push(produto);
    });

    Object.keys(categorias).forEach((categoria) => {
        const section = document.createElement("div");
        section.className = "category";
        section.innerHTML = `
            <div class="category-title">
                ${categorias[categoria].icone}
                ${categoria}
            </div>
            <div class="products"></div>
        `;

        const productContainer = section.querySelector(".products");

        categorias[categoria].produtos.forEach((produto) => {
            productContainer.innerHTML += `
                <article class="product">
                    <img class="product-image" src="${produto.imagem}" alt="${produto.nome}">
                    <div class="product-body">
                        <div class="product-name">${produto.nome}</div>
                        <div class="product-description">${produto.descricao}</div>
                        <a class="product-link" href="${produto.link}" target="_blank" rel="noreferrer">🔗 Ver produto na plataforma</a>
                        <div class="product-actions">
                            <button class="buy-button" type="button" onclick="escolherPresente(${produto.id}, 'comprar')">🛍️ Quero comprar</button>
                            <button class="money-button" type="button" onclick="escolherPresente(${produto.id}, 'dinheiro')">💰 Dar em dinheiro</button>
                        </div>
                        ${produto.reservadoPor ? `<div style="margin-top:12px;color:#d9c36b;font-size:12px;">Reservado por: ${produto.reservadoPor}</div>` : ""}
                    </div>
                </article>
            `;
        });

        container.appendChild(section);
    });
}

function escolherPresente(id, tipo) {
    produtoSelecionado = produtos.find((produto) => produto.id === id);
    tipoPresente = tipo;

    if (!produtoSelecionado) return;

    document.getElementById("giftModal").classList.remove("hidden");

    const pixArea = document.getElementById("pixArea");

    if (tipo === "dinheiro") {
        document.getElementById("giftTitle").innerText = "💰 Dar em dinheiro";
        document.getElementById("giftMessage").innerText = "Você escolheu dar em dinheiro o valor referente a: " + produtoSelecionado.nome + ".";
        pixArea.classList.remove("hidden");
        document.getElementById("pixKey").innerText = DONA.pix;
        document.getElementById("contactLink").innerText = DONA.telefone;
        document.getElementById("contactLink").href = "https://wa.me/" + DONA.telefone;
    } else {
        document.getElementById("giftTitle").innerText = "🛍️ Quero comprar";
        document.getElementById("giftMessage").innerText = "Você escolheu comprar: " + produtoSelecionado.nome + ". Clique em confirmar para registrar sua escolha.";
        pixArea.classList.add("hidden");
    }
}

function copiarPix() {
    if (!navigator.clipboard) {
        alert("Copiar automático não está disponível neste navegador.");
        return;
    }

    navigator.clipboard.writeText(DONA.pix).then(() => {
        alert("Chave PIX copiada!");
    }).catch(() => {
        alert("Não foi possível copiar automaticamente. Copie a chave manualmente.");
    });
}

function confirmarPresente() {
    if (!produtoSelecionado) return;

    const nome = produtoSelecionado.nome;
    const escolha = tipoPresente === "comprar" ? "Quero comprar" : "Dar o valor em dinheiro";

    if (usuarioAtual) {
        produtoSelecionado.reservadoPor = usuarioAtual.nome;
        produtoSelecionado.opcao = escolha;
        produtoSelecionado.dataEscolha = new Date().toISOString();
    }

    salvarEstado();
    renderizarProdutos();
    renderizarAdmin();

    alert("Escolha registrada! ❤️\n\nProduto: " + nome + "\nOpção: " + escolha + "\n\nObrigada pelo carinho!");
    fecharPresente();
}

function fecharPresente() {
    document.getElementById("giftModal").classList.add("hidden");
    produtoSelecionado = null;
    tipoPresente = null;
}

function renderizarJaTenho() {
    const container = document.getElementById("alreadyHave");
    const itens = produtos.filter((produto) => produto.recebido);

    if (itens.length === 0) {
        container.innerHTML = '<p style="color:#888;line-height:1.5;">Ainda não há itens marcados como "já tenho".</p>';
        return;
    }

    container.innerHTML = itens.map((produto) => `
        <div class="have-item">
            <span>${produto.nome}</span>
            <span class="have-check">✓ Já tenho</span>
        </div>
    `).join("");
}

function renderizarAdmin() {
    if (!usuarioAtual || !usuarioAtual.dona) return;

    const container = document.getElementById("adminProducts");
    container.innerHTML = "";

    produtos.forEach((produto) => {
        container.innerHTML += `
            <div class="admin-item">
                <div>
                    <strong>${produto.nome}</strong>
                    <small>${produto.categoria}${produto.reservadoPor ? ` • ${produto.opcao || "Escolhido"} por ${produto.reservadoPor}` : ""}</small>
                </div>
                <button class="${produto.recebido ? "not-received" : "received"}" type="button" onclick="alternarRecebido(${produto.id})">
                    ${produto.recebido ? "Voltar para lista" : "Já tenho"}
                </button>
            </div>
        `;
    });

    renderizarNotificacoes();
}

function alternarRecebido(id) {
    const produto = produtos.find((item) => item.id === id);
    if (!produto) return;

    produto.recebido = !produto.recebido;
    salvarEstado();
    renderizarProdutos();
    renderizarJaTenho();
    renderizarAdmin();
}

window.addEventListener("DOMContentLoaded", () => {
    renderizarProdutos();
    renderizarJaTenho();
    renderizarAdmin();
    renderizarNotificacoes();
});
