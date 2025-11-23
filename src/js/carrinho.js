if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

var totalAmount = "0,00";

function ready() {
  const removerProdutos = document.getElementsByClassName("btnremove");
  for (var i = 0; i < removerProdutos.length; i++) {
    removerProdutos[i].addEventListener("click", removerProduto);
  }

  const quantidadeInputs = document.getElementsByClassName("quantidade");
  for (var i = 0; i < quantidadeInputs.length; i++) {
    quantidadeInputs[i].addEventListener("change", verificarQuantidade);
  }

  const botoesAdicionar = document.getElementsByClassName("btnAdicionar");
  for (var i = 0; i < botoesAdicionar.length; i++) {
    botoesAdicionar[i].addEventListener("click", adicionarProdutoCarrinho);
  }

  const botaoComprar = document.querySelector(".alinhamento .btn");
  if (botaoComprar && botaoComprar.innerText === "Finalizar compra") {
    botaoComprar.addEventListener("click", finalizarCompra);
  }

  carregarCarrinho();

  if (document.querySelector(".carrinho")) {
    atualizarValor();
  }
}

function adicionarProdutoCarrinho(event) {
  const botao = event.target;
  const card = botao.parentElement;

  const produtoImagem = card.querySelector(".imagemProduto").src;
  const produtoNome = card.querySelector(".nomeProduto").innerText;
  const produtoPreco = card.querySelector(".precoProduto").innerText;

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const produtoExistente = carrinho.find((item) => item.nome === produtoNome);

  if (produtoExistente) {
    produtoExistente.quantidade++;
    alert("Quantidade atualizada no carrinho!");
  } else {
    carrinho.push({
      imagem: produtoImagem,
      nome: produtoNome,
      preco: produtoPreco,
      quantidade: 1,
    });
    alert("Produto adicionado ao carrinho!");
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const gridCarrinho = document.querySelector(".carrinho .grid");

  if (!gridCarrinho) return;

  gridCarrinho.innerHTML = "";

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinho.length === 0) {
    gridCarrinho.innerHTML = "<p>Seu carrinho está vazio!</p>";
    atualizarValor();
    return;
  }

  carrinho.forEach((produto, index) => {
    let novoCard = document.createElement("div");
    novoCard.classList.add("card");
    novoCard.dataset.index = index;

    novoCard.innerHTML = `
      <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
      />
      <h3>${produto.nome}</h3>
      <p class="preco">${produto.preco}</p>
      <input
        type="number"
        class="quantidade"
        min="0"
        max="99"
        value="${produto.quantidade}"
      />
      <button class="btnremove">Remover do carrinho</button>
    `;

    gridCarrinho.appendChild(novoCard);

    novoCard
      .querySelector(".btnremove")
      .addEventListener("click", removerProduto);
    novoCard
      .querySelector(".quantidade")
      .addEventListener("change", verificarQuantidade);
  });

  atualizarValor();
}

function removerProduto(event) {
  const card = event.target.closest(".card");
  const index = card.dataset.index;

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  carregarCarrinho();
}

function verificarQuantidade(event) {
  const input = event.target;
  const card = input.closest(".card");
  const index = card.dataset.index;

  if (input.value === "0" || input.value === "") {
    removerProduto(event);
    return;
  }

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  if (carrinho[index]) {
    carrinho[index].quantidade = parseInt(input.value);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  atualizarValor();
}

function atualizarValor() {
  let PrecoFinal = 0;
  const cards = document.querySelectorAll(".carrinho .card");

  cards.forEach((card) => {
    const precoTexto = card
      .querySelector(".preco")
      .innerText.replace("R$", "")
      .replace(",", ".")
      .trim();
    const quantidade = parseInt(card.querySelector(".quantidade").value);

    PrecoFinal += parseFloat(precoTexto) * quantidade;
  });

  PrecoFinal = PrecoFinal.toFixed(2);
  totalAmount = PrecoFinal.replace(".", ",");

  const elementoTotal = document.querySelector("#Pagamento span");

  if (elementoTotal) {
    elementoTotal.innerText = "R$ " + totalAmount;
  }
}

function finalizarCompra(event) {
  event.preventDefault();

  if (totalAmount === "0,00") {
    alert("Seu carrinho está vazio!");
  } else {
    alert(
      `Obrigado pela sua compra!\nValor do pedido: R$ ${totalAmount}\n\nVolte sempre :)`
    );

    localStorage.removeItem("carrinho");
    carregarCarrinho();
    atualizarValor();
  }
}
