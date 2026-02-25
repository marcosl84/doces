console.log('Script.js carregado com sucesso!');

let produtos = {};
let carrinho = [];
let numeroPedido = Math.floor(Math.random() * 100000) + 10000;

// Configuração das páginas
const paginas = [
    { nome: 'Tradicionais', arquivo: 'tradicionais.html' },
    { nome: 'Clássicos', arquivo: 'classicos.html' },
    { nome: 'Chocolates', arquivo: 'chocolates.html' },
    { nome: 'Montar Pedido', arquivo: 'montar.html' }
];

// Detectar página atual
function getPaginaAtual() {
    const url = window.location.href;
    for (let i = 0; i < paginas.length; i++) {
        if (url.includes(paginas[i].arquivo)) {
            return i;
        }
    }
    return 0;
}

// Criar navegação dinâmica
function criarNavegacaoPaginas() {
    const container = document.getElementById('navegacao-paginas');
    if (!container) return;
    
    container.innerHTML = '';
    const paginaAtual = getPaginaAtual();
    
    paginas.forEach((pagina, indice) => {
        const span = document.createElement('span');
        if (indice === paginaAtual) {
            span.className = 'pagina-ativa';
            span.textContent = `${indice + 1}. ${pagina.nome}`;
        } else if (indice < paginaAtual) {
            span.className = 'pagina-link';
            span.innerHTML = `<a href="${pagina.arquivo}">${indice + 1}. ${pagina.nome}</a>`;
        } else {
            span.className = 'pagina-link';
span.innerHTML = `<a href="${pagina.arquivo}">${indice + 1}. ${pagina.nome}</a>`;
        }
        container.appendChild(span);
    });
}

// Criar botões de navegação (Voltar/Avançar)
function criarBotoesNavegacao() {
    const container = document.getElementById('botoes-navegacao');
    if (!container) return;
    
    container.innerHTML = '';
    const paginaAtual = getPaginaAtual();
    
    if (paginaAtual > 0) {
        const btnVoltar = document.createElement('button');
        btnVoltar.className = 'btn-voltar';
        btnVoltar.innerHTML = `← Voltar: ${paginas[paginaAtual - 1].nome}`;
        btnVoltar.onclick = () => window.location.href = paginas[paginaAtual - 1].arquivo;
        container.appendChild(btnVoltar);
    }
    
    if (paginaAtual < paginas.length - 1) {
        const btnAvancar = document.createElement('button');
        btnAvancar.className = 'btn-avancar';
        btnAvancar.innerHTML = `Próxima: ${paginas[paginaAtual + 1].nome} →`;
        btnAvancar.onclick = () => window.location.href = paginas[paginaAtual + 1].arquivo;
        container.appendChild(btnAvancar);
    }
}

// Carregar carrinho do localStorage
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Carrega produtos do JSON
async function carregarProdutos() {
    try {
        const response = await fetch('./produtos.json');
        const data = await response.json();
        produtos = data;
        
        const url = window.location.href;
        if (url.includes('tradicionais') && document.getElementById('produtos')) {
            renderizarCategoria('tradicionais', data.tradicionais);
        } else if (url.includes('classicos') && document.getElementById('produtos')) {
            renderizarCategoria('classicos', data.classicos);
        } else if (url.includes('chocolates') && document.getElementById('produtos')) {
            renderizarCategoria('chocolates', data.chocolates);
        } else if (document.getElementById('produtos')) {
            renderizarCardapio();
        }
        
        if (document.getElementById('selecao-sabores')) {
    renderizarSelecaoSabores(data);
}
        
    } catch (error) {
        console.error('Erro ao carregar produtos.json:', error);
        produtos = {
            tradicionais: { preco: 130.00, itens: ["Brigadeiro", "Abacaxi com Coco", "Beijinho", "Casadinho", "Casadinho Sedução", "Cajuzinho", "Napolitano", "Paçoca", "Nesquik", "Confete"] },
            classicos: { preco: 155.00, itens: ["Ninho c/ Nutella", "Ferrero Rocher", "Ninho com Uva", "Charge", "Ninho c/ Morango", "Oreo", "Uva Verde", "Nesquik c/ Nutella"] },
            chocolates: { preco: 165.00, itens: ["Kit Kat", "Prestígio", "Morango c/ Chocolate", "Paçoca c/ Chocolate", "Uva c/ Chocolate", "Ouro Branco", "Confete c/ Chocolate", "Sonho de Valsa", "Abacaxi c/ Chocolate", "Sensação"] }
        };
        if (document.getElementById('produtos')) renderizarCardapio();
        if (document.getElementById('selecao-sabores')) renderizarSelecaoSabores();
    }
}

function renderizarCategoria(categoria, dados) {
    const container = document.getElementById('produtos');
    if (!container) return;
    container.innerHTML = '';
    const section = document.createElement('div');
    
    // Ordenar itens por ordem alfabética
    const itensOrdenados = dados.itens.sort();
    
    section.innerHTML = `<h3>${categoria.charAt(0).toUpperCase() + categoria.slice(1)} (R$ ${dados.preco.toFixed(2).replace('.', ',')} o cento)</h3>`;
    itensOrdenados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `<h4>${item}</h4><p>R$ ${dados.preco.toFixed(2).replace('.', ',')}</p><button onclick="adicionarAoCarrinho('${categoria}', '${item}', ${dados.preco})">Adicionar</button>`;
        section.appendChild(card);
    });
    container.appendChild(section);
}

function renderizarCardapio() {
    const container = document.getElementById('produtos');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(produtos).forEach(categoria => {
        const section = document.createElement('div');
        
        // Ordenar itens por ordem alfabética
        const itensOrdenados = produtos[categoria].itens.sort();
        
        section.innerHTML = `<h3>${categoria.charAt(0).toUpperCase() + categoria.slice(1)} (R$ ${produtos[categoria].preco.toFixed(2).replace('.', ',')} o cento)</h3>`;
        itensOrdenados.forEach(item => {
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `<h4>${item}</h4><p>R$ ${produtos[categoria].preco.toFixed(2).replace('.', ',')}</p><button onclick="adicionarAoCarrinho('${categoria}', '${item}', ${produtos[categoria].preco})">Adicionar</button>`;
            section.appendChild(card);
        });
        container.appendChild(section);
    });
}

function renderizarSelecaoSabores(data) {
    const container = document.getElementById('selecao-sabores');
    if (!container) return;
    container.innerHTML = '';
    
    const categorias = ['tradicionais', 'classicos', 'chocolates'];
    const nomes = {'tradicionais': 'Tradicionais', 'classicos': 'Clássicos', 'chocolates': 'Chocolates'};
    
    // Verifica se é a página de montar
    const url = window.location.href;
    const éPaginaMontar = url.includes('montar');
    
    categorias.forEach(function(categoria) {
        if (!data[categoria]) return;
        
        // Ordenar itens por ordem alfabética
        const itensOrdenados = data[categoria].itens.sort();
        
        // Título da categoria
        const titulo = document.createElement('h3');
        if (éPaginaMontar) {
            titulo.textContent = nomes[categoria];
        } else {
            titulo.textContent = nomes[categoria] + ' (R$ ' + data[categoria].preco.toFixed(2).replace('.', ',') + ' o cento)';
        }
        titulo.style.marginTop = '20px';
        container.appendChild(titulo);
        
        // Checkboxes (usando itensOrdenados)
        itensOrdenados.forEach(function(item) {
            const div = document.createElement('div');
            div.className = 'sabor-checkbox';
            const precoUnitario = (data[categoria].preco / 100 * 20).toFixed(2).replace('.', ',');
            div.innerHTML = '<input type="checkbox" id="' + item.replace(/\s/g, '_') + '" value="' + categoria + '"><label for="' + item.replace(/\s/g, '_') + '">' + item + ' (R$ ' + precoUnitario + ' por 20 un.)</label>';
            container.appendChild(div);
        });
    });
}

function adicionarAoCarrinho(categoria, item, preco) {
    carrinho.push({ categoria, item, preco, quantidade: 1 });
    salvarCarrinho();
    atualizarCarrinho();
    alert(`${item} adicionado ao carrinho!`);
}

function adicionarMontagem() {
    const selecionados = document.querySelectorAll('#selecao-sabores input:checked');
    if (selecionados.length === 0) return alert('Selecione pelo menos um sabor.');
    selecionados.forEach(checkbox => {
        const categoria = checkbox.value;
        const item = checkbox.id.replace(/_/g, ' ');
        const precoUnitario = produtos[categoria].preco / 100;
        carrinho.push({ categoria, item, preco: precoUnitario, quantidade: 20 });
    });
    salvarCarrinho();
    atualizarCarrinho();
    alert('Montagem adicionada ao carrinho!');
}

function atualizarCarrinho() {
    const contador = carrinho.length;
    const contadorEl = document.getElementById('contador-carrinho');
    if (contadorEl) contadorEl.textContent = contador;
    
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        const textoCarrinho = btnCarrinho.querySelector('span');
        if (textoCarrinho) {
            textoCarrinho.textContent = contador > 0 ? `${contador}` : '0';
        }
    }
    
    const itens = document.getElementById('itens-carrinho');
    if (!itens) return;
    itens.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        itens.innerHTML += `<div class="item-carrinho">${item.item} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')} <button onclick="removerDoCarrinho(${index})">Remover</button></div>`;
    });
    const totalEl = document.getElementById('total-carrinho');
    if (totalEl) totalEl.textContent = total.toFixed(2).replace('.', ',');
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function copiarChavePix() {
    const chave = '42984033899';
    navigator.clipboard.writeText(chave).then(() => {
        alert('Chave PIX copiada!');
    }).catch(() => {
        alert('Erro ao copiar chave PIX.');
    });
}

function abrirCarrinho() {  
    const modal = document.getElementById('modal-carrinho');
    if (modal) {
        modal.style.display = 'block';
        atualizarCampoBairro();
        atualizarFrete();
        atualizarTotalComFrete();
    }
}

function fecharCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    if (modal) {
        modal.style.display = 'none';
    }
}
// ... (código anterior até linha ~265)

// ===== FUNÇÕES GLOBAIS (fora do DOMContentLoaded) =====

function atualizarCampoBairro() {
    const tipoSelect = document.getElementById('tipo-entrega');
    const bairroField = document.getElementById('bairro-frete');
    if (!tipoSelect || !bairroField) return;
    bairroField.style.display = tipoSelect.value === 'entrega' ? 'block' : 'none';
    bairroField.required = tipoSelect.value === 'entrega';
    
    
}

function atualizarFrete() {
    const tipoSelect = document.getElementById('tipo-entrega');
    const bairroSelect = document.getElementById('bairro-frete');
    const valorFreteEl = document.getElementById('valor-frete');
    
    if (!tipoSelect || !bairroSelect || !valorFreteEl) return;
    
    if (tipoSelect.value === 'retirada') {
        valorFreteEl.textContent = '0,00';
    } else {
        const bairro = bairroSelect.value;
        const valorFrete = calcularFrete(bairro);
        if (typeof valorFrete === 'number') {
            valorFreteEl.textContent = valorFrete.toFixed(2).replace('.', ',');
        } else {
            valorFreteEl.textContent = valorFrete;
        }
    }
}

function abrirCarrinho() {  
    const modal = document.getElementById('modal-carrinho');
    if (modal) {
        modal.style.display = 'block';
        atualizarCampoBairro();
        atualizarFrete();
    }
}

// ... (resto do código)
function atualizarTotalComFrete() {
    const valorFreteEl = document.getElementById('valor-frete');
    const valorFreteDisplay = document.getElementById('valor-frete-display');
    const totalComFreteEl = document.getElementById('total-com-frete');
    const totalCarrinhoEl = document.getElementById('total-carrinho');
    
    if (!totalCarrinhoEl) return;
    
    const subtotal = parseFloat(totalCarrinhoEl.textContent.replace(',', '.')) || 0;
    let frete = 0;
    
    if (valorFreteEl) {
        const tipoSelect = document.getElementById('tipo-entrega');
        if (tipoSelect && tipoSelect.value === 'entrega') {
            const textoFrete = valorFreteEl.textContent.replace(',', '.');
            const valor = parseFloat(textoFrete);
            if (!isNaN(valor) && valor !== 0) {
                frete = valor;
            }
        }
    }
    
    const total = subtotal + frete;
    
    if (valorFreteDisplay) {
        valorFreteDisplay.textContent = 'R$ ' + frete.toFixed(2).replace('.', ',');
    }
    
    if (totalComFreteEl) {
        totalComFreteEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    criarNavegacaoPaginas();
    criarBotoesNavegacao();
    
    const tipoSelect = document.getElementById('tipo-entrega');
    const bairroField = document.getElementById('bairro-frete');
    const pagamentoSelect = document.getElementById('pagamento');
    const pixContainer = document.getElementById('pix-container');
    const trocoContainer = document.getElementById('troco-container');
    const precisaTrocoSelect = document.getElementById('precisa-troco');
    const trocoParaInput = document.getElementById('troco-para');

    // Funções de atualização
    function atualizarCampoPagamento() {
        if (!pagamentoSelect || !pixContainer || !trocoContainer) return;
        pixContainer.style.display = pagamentoSelect.value === 'PIX' ? 'block' : 'none';
        trocoContainer.style.display = pagamentoSelect.value === 'Dinheiro' ? 'block' : 'none';
    }

    function atualizarValorTroco() {
        if (!precisaTrocoSelect || !trocoParaInput) return;
        trocoParaInput.style.display = precisaTrocoSelect.value === 'sim' ? 'block' : 'none';
    }

    // ▼▼ ADICIONE OS LISTENERS COM AS TRÊS FUNÇÕES ▼▼
    if (tipoSelect) {
        tipoSelect.addEventListener('change', atualizarCampoBairro);
        tipoSelect.addEventListener('change', atualizarFrete);
        tipoSelect.addEventListener('change', atualizarTotalComFrete);
    }
    
    if (bairroField) {
        bairroField.addEventListener('change', atualizarFrete);
        bairroField.addEventListener('change', atualizarTotalComFrete);
    }
    
    if (pagamentoSelect) {
        pagamentoSelect.addEventListener('change', atualizarCampoPagamento);
    }
    
    if (precisaTrocoSelect) {
        precisaTrocoSelect.addEventListener('change', atualizarValorTroco);
    }

    // Inicializar
    if (tipoSelect) atualizarCampoBairro();
    if (pagamentoSelect) atualizarCampoPagamento();
    if (precisaTrocoSelect) atualizarValorTroco();
});
function atualizarFrete() {
    const tipoSelect = document.getElementById('tipo-entrega');
    const bairroSelect = document.getElementById('bairro-frete');
    const valorFreteEl = document.getElementById('valor-frete');
    
    if (!tipoSelect || !bairroSelect || !valorFreteEl) return;
    
    if (tipoSelect.value === 'retirada') {
        valorFreteEl.textContent = '0,00';
    } else {
        const bairro = bairroSelect.value;
        const valorFrete = calcularFrete(bairro);
        if (typeof valorFrete === 'number') {
            valorFreteEl.textContent = valorFrete.toFixed(2).replace('.', ',');
        } else {
            valorFreteEl.textContent = valorFrete;
        }
    }
}
function calcularFrete(bairro) {
    const fretes = {
        "centro": 5.00, "cartom": 8.00, "vila zezo": 8.00, 
        "tangara": 7.00, "vila nova": 8.00, "saida p/irati": 8.00, 
        "morro das pedras": 9.00, "vila brasil": 10.00, 
        "parque industrial": 10.00, "agua verde": 8.00, "brasilia": 6.00
    };
    const bairroNormalizado = normalizar(bairro);
    if (bairroNormalizado === "outros/ não listado") return "a confirmar";
    return fretes[bairroNormalizado] || 10.00;
}


function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function enviarPedido() {
    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const numeroCasa = document.getElementById('numero-casa').value.trim();
    const referencia = document.getElementById('referencia').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const tipo = document.getElementById('tipo-entrega').value;
    const bairro = tipo === 'entrega' ? document.getElementById('bairro-frete').value : 'N/A';
    const pagamento = document.getElementById('pagamento').value;
    const precisaTroco = pagamento === 'Dinheiro' ? document.getElementById('precisa-troco').value : 'N/A';
    const trocoPara = (pagamento === 'Dinheiro' && precisaTroco === 'sim') ? document.getElementById('troco-para').value.trim() : 'N/A';
    const observacoes = document.getElementById('observacoes').value.trim();

    if (!nome || !endereco || !numeroCasa || !telefone) return alert('Preencha todos os campos obrigatórios.');
    if (!/^\d{11}$/.test(telefone)) return alert('Telefone deve ter exatamente 11 dígitos numéricos.');
    if (tipo === 'entrega' && (!bairro || bairro === '')) return alert('Selecione um bairro válido para entrega.');
    if (pagamento === 'Dinheiro' && precisaTroco === 'sim' && (!trocoPara || isNaN(trocoPara))) return alert('Preencha o valor do troco corretamente.');

    const frete = tipo === 'entrega' ? calcularFrete(bairro) : 0.00;
    const subtotal = parseFloat(document.getElementById('total-carrinho').textContent.replace(',', '.'));
    const total = typeof frete === 'number' ? subtotal +frete : 'a confirmar';
    
    const mensagem = `Pedido ${numeroPedido}\nCliente: ${nome}\nEndereço: ${endereco}\nNúmero: ${numeroCasa}\nReferência: ${referencia || 'N/A'}\nTelefone: ${telefone}\nTipo: ${tipo}\nBairro: ${bairro}\nPagamento: ${pagamento}\nTroco: ${precisaTroco === 'sim' ? `Sim, para R$ ${trocoPara}` : precisaTroco === 'não' ? 'Não' : 'N/A'}\nObservações: ${observacoes || 'N/A'}\nItens:\n${carrinho.map(i => `${i.item} x${i.quantidade} - R$ ${(i.preco * i.quantidade).toFixed(2)}`).join('\n')}\nSubtotal: R$ ${subtotal.toFixed(2)}\nFrete: ${typeof frete === 'number' ? `R$ ${frete.toFixed(2)}` : 'a confirmar'}\nTotal: ${typeof total === 'number' ? `R$ ${total.toFixed(2)}` : total}`;
    
    window.open(`https://wa.me/5542984033899?text=${encodeURIComponent(mensagem)}`, '_blank');
    
    alert('Pedido enviado! Número: ' + numeroPedido);
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCarrinho();
}

// Iniciar
carregarCarrinho();
carregarProdutos();