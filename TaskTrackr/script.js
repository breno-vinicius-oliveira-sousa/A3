let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let usuarioLogado = localStorage.getItem("usuarioLogado") || null;
let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [
  { usuario: "admin", senha: "1234" },
  { usuario: "marcio", senha: "senha" }
];

function salvarTarefasNoStorage() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

window.onload = function () {
  if (!usuarioLogado && !window.location.href.includes("login.html")) {
    window.location.href = "login.html";
    return;
  }

  if (window.location.href.includes("index.html")) {
    document.body.insertAdjacentHTML("afterbegin", `
      <div style="text-align:center; margin-bottom: 10px;">
        <h2>Bem-vindo, ${usuarioLogado} <button onclick="logout()">Sair</button></h2>
        <label>Filtrar por prioridade:
          <select id="filtroPrioridade" onchange="renderizarTarefas()">
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </label>
        <input type="text" id="pesquisaTarefa" placeholder="Pesquisar tarefa..." oninput="renderizarTarefas()" style="margin-left:10px; padding:6px; border-radius:4px; border:1px solid #ccc; width:200px;">
      </div>
    `);
    renderizarTarefas();
  }
};

function adicionarTarefa() {
  const nome = document.getElementById("nome").value;
  const descricao = document.getElementById("descricao").value;
  const prioridade = document.getElementById("prioridade").value;

  if (!nome || !descricao) {
    alert("Preencha todos os campos");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    nome,
    descricao,
    prioridade,
    status: "A Fazer",
    usuario: usuarioLogado
  };

  tarefas.push(novaTarefa);
  salvarTarefasNoStorage();
  renderizarTarefas();
  limparFormulario();
}
function renderizarTarefas() {
  const filtro = document.getElementById("filtroPrioridade")?.value || "";
  const pesquisa = document.getElementById("pesquisaTarefa")?.value.toLowerCase() || "";
  const colunas = ["aFazer", "emProgresso", "concluido"];
  colunas.forEach(col => document.getElementById(col).innerHTML = "");

  tarefas
    .filter(t =>
      t.usuario === usuarioLogado &&
      (filtro === "" || t.prioridade === filtro) &&
      (t.nome.toLowerCase().includes(pesquisa) || t.descricao.toLowerCase().includes(pesquisa))
    )
    .forEach(tarefa => {
      const card = document.createElement("div");
      card.className = `card ${tarefa.prioridade.toLowerCase()}`;
      card.innerHTML = `
        <h4>${tarefa.nome}</h4>
        <p>${tarefa.descricao}</p>
        <small>Prioridade: ${tarefa.prioridade}</small>
        <div>
          <button onclick="mudarStatus(${tarefa.id}, 'A Fazer')">A Fazer</button>
          <button onclick="mudarStatus(${tarefa.id}, 'Em Progresso')">Em Progresso</button>
          <button onclick="mudarStatus(${tarefa.id}, 'Concluído')">Concluído</button>
          <button onclick="excluirTarefa(${tarefa.id})">🗑️ Excluir</button>
        </div>
      `;

      const coluna =
        tarefa.status === "A Fazer" ? "aFazer" :
        tarefa.status === "Em Progresso" ? "emProgresso" : "concluido";

      document.getElementById(coluna).appendChild(card);
    });
}

function mudarStatus(id, novoStatus) {
  tarefas = tarefas.map(t =>
    t.id === id ? { ...t, status: novoStatus } : t
  );
  salvarTarefasNoStorage();
  renderizarTarefas();
}

function excluirTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvarTarefasNoStorage();
  renderizarTarefas();
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("prioridade").value = "Baixa";
}

function loginUsuario() {
  const nomeUsuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!nomeUsuario || !senha) {
    alert("Digite nome de usuário e senha");
    return;
  }

  const valido = usuariosRegistrados.find(u => u.usuario === nomeUsuario && u.senha === senha);

  if (valido) {
    localStorage.setItem("usuarioLogado", nomeUsuario);
    window.location.href = "index.html";
  } else {
    alert("Usuário ou senha inválidos");
  }
}

function cadastrarUsuario() {
  const novoUsuario = document.getElementById("novoUsuario").value;
  const novaSenha = document.getElementById("novaSenha").value;

  if (!novoUsuario || !novaSenha) {
    alert("Preencha todos os campos para cadastro");
    return;
  }

  const existe = usuariosRegistrados.find(u => u.usuario === novoUsuario);
  if (existe) {
    alert("Usuário já existe");
    return;
  }

  usuariosRegistrados.push({ usuario: novoUsuario, senha: novaSenha });
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));
  alert("Usuário cadastrado com sucesso!");
  document.getElementById("novoUsuario").value = "";
  document.getElementById("novaSenha").value = "";
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}
