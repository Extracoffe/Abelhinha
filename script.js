// ==========================================
// PARTE 1: LocalStorage (Simulação/Exemplo)
// ==========================================
const meuPet = { nome: "Thor", porte: "Grande", tipo: "Cachorro" };
localStorage.setItem("dados_do_pet", JSON.stringify(meuPet));

const petSalvo = localStorage.getItem("dados_do_pet");
if (petSalvo) {
  const petObjeto = JSON.parse(petSalvo);
  console.log(`Bem-vindo de volta, dono do ${petObjeto.nome}!`);
}

// ==========================================
// PARTE 2: Newsletter (Apenas se existir na página)
// ==========================================
const formNewsletter = document.getElementById("form-newsletter");
const emailInput = document.getElementById("email-input");
const mensagemSucesso = document.getElementById("mensagem-sucesso");

// O 'if' garante que o script não quebre nas páginas que não têm a newsletter
if (formNewsletter && emailInput && mensagemSucesso) {
  formNewsletter.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value;

    mensagemSucesso.innerHTML = `
      <div class="alert alert-success d-flex align-items-center justify-content-center border-0 shadow-sm rounded" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        <span>Obrigado por se inscrever! Ficaremos felizes em falar com o seu pet no e-mail: <strong>${email}</strong></span>
      </div>
    `;

    emailInput.value = "";
  });
}

// ==========================================
// PARTE 3: API ViaCEP (Apenas se existir na página)
// ==========================================
const inputCep = document.getElementById("cep");

if (inputCep) {
  inputCep.addEventListener("blur", function () {
    const cep = this.value.replace(/\D/g, "");
    const mensagemErro = document.getElementById("mensagem-cep");

    // Limpa estados e mensagens anteriores
    mensagemErro.innerText = "";
    mensagemErro.className = "mt-3 text-center fw-medium";
    this.classList.remove("is-invalid", "is-valid");

    // Valida se o CEP tem exatamente 8 dígitos
    if (cep.length !== 8) {
      if (cep.length > 0) {
        mensagemErro.innerText =
          "Por favor, insira um CEP válido com 8 dígitos.";
        mensagemErro.classList.add("text-danger");
        this.classList.add("is-invalid");
      }
      return;
    }

    // Mensagem visual de carregamento nos campos de endereço
    const campos = ["logradouro", "bairro", "cidade", "uf"];
    campos.forEach((id) => {
      const campo = document.getElementById(id);
      if (campo) campo.value = "Carregando...";
    });

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Erro na rede ao buscar o CEP.");
        return response.json();
      })
      .then((data) => {
        if (data.erro) {
          mensagemErro.innerText = "CEP não encontrado no sistema.";
          mensagemErro.classList.add("text-danger");
          this.classList.add("is-invalid");
          limparCampos();
        } else {
          // Preenche os campos com o retorno da API
          document.getElementById("logradouro").value = data.logradouro || "";
          document.getElementById("bairro").value = data.bairro || "";
          document.getElementById("cidade").value = data.localidade || "";
          document.getElementById("uf").value = data.uf || "";

          // Adiciona feedback visual positivo no input
          this.classList.add("is-valid");

          // Joga o foco direto no campo Número
          const campoNumero = document.getElementById("numero");
          if (campoNumero) campoNumero.focus();
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        mensagemErro.innerText =
          "Erro ao buscar o CEP. Tente novamente mais tarde.";
        mensagemErro.classList.add("text-danger");
        this.classList.add("is-invalid");
        limparCampos();
      });
  });
}

function limparCampos() {
  const campos = ["logradouro", "bairro", "cidade", "uf"];
  campos.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) campo.value = "";
  });
}

// ==========================================
// PARTE 4: Submit do Formulário de Contato / CEP
// ==========================================
const formContato = document.getElementById("form-contato");

if (formContato) {
  formContato.addEventListener("submit", function (e) {
    e.preventDefault();

    const mensagemErroOuSucesso = document.getElementById("mensagem-cep");
    const logradouroVal = document.getElementById("logradouro").value;

    // Garante que a API rodou com sucesso antes de permitir o envio
    if (!logradouroVal || logradouroVal === "Carregando...") {
      mensagemErroOuSucesso.innerText =
        "Por favor, insira um CEP válido antes de confirmar.";
      mensagemErroOuSucesso.className =
        "mt-3 text-center fw-medium text-danger";
      return;
    }

    // Sucesso na validação do DOM
    mensagemErroOuSucesso.innerText =
      "🎉 Endereço confirmado com sucesso! Entraremos em contato.";
    mensagemErroOuSucesso.className =
      "mt-3 text-center fw-bold text-success fs-5";

    // Reseta o formulário após 5 segundos
    setTimeout(() => {
      formContato.reset();
      mensagemErroOuSucesso.innerText = "";
      const inputCepEl = document.getElementById("cep");
      if (inputCepEl) inputCepEl.classList.remove("is-valid", "is-invalid");
    }, 5000);
  });
}
