const meuPet = { nome: "Thor", porte: "Grande", tipo: "Cachorro" };

localStorage.setItem("dados_do_pet", JSON.stringify(meuPet));

const petSalvo = localStorage.getItem("dados_do_pet");
if (petSalvo) {
  const petObjeto = JSON.parse(petSalvo);
  console.log(`Bem-vindo de volta, dono do ${petObjeto.nome}!`);
}

const formNewsletter = document.getElementById("form-newsletter");
const emailInput = document.getElementById("email-input");

formNewsletter.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value;

  alert(
    `Obrigado por submeter o contato! Ficaremos felizes em falar com o seu pet. : ${email}`,
  );
  emailInput.value = "";
});
