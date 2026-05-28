# 📄 Documentação de Arquitetura de Software (DAS) — Pet Shop Abelhinha

## 1. Informações Gerais do Projeto

- **Nome do Projeto**: Portal Institucional e Subsistema de Captura — Pet Shop Abelhinha
- **Contexto Escolhido**: O projeto está inserido no setor de comércio e prestação de serviços para animais de estimação (Mercado Pet). Ele engloba o desenvolvimento da interface institucional e das regras de negócio em ambiente front-end para um estabelecimento que oferece serviços integrados de Estética Animal (Banho e Tosa), Hotelaria/Daycare e Atendimento Clínico Veterinário.
- **Problema Identificado**: Estabelecimentos de saúde e estética animal enfrentam gargalos na conversão de leads e na retenção de usuários devido a processos cadastrais manuais, lentos e suscetíveis a erros de digitação (como preenchimento incorreto de endereços logísticos para serviços de leva-e-traz ou prontuários). Além disso, a falta de feedbacks em tempo real na interface (UI) gera fricção e abandono de formulários por parte dos clientes.
- **Solução Proposta**: Desenvolvimento de uma plataforma web responsiva com arquitetura descentralizada (Client-Side Rendering). A solução mitiga os erros cadastrais ao integrar de forma assíncrona a API rest da plataforma ViaCEP, realizando a validação e o preenchimento atômico dos dados de localização do usuário com base no input do CEP. A interface também conta com manipulação dinâmica do DOM para fornecer feedbacks instantâneos de sucesso e erro sem a necessidade de recarga da página, otimizando a experiência do usuário (UX).

---

## 2. Padrão Arquitetural e Estrutura de Diretórios

A aplicação adota uma topologia de caminhos relativos baseada em escopos de isolamento. As páginas acessórias são segregadas em um subdiretório para otimização de organização de ativos (_assets_).

```text
pet-shop-abelhinha/
│
├── index.html                 # Main Entry Point (Documento Raiz / Landing Page)
├── style.css                  # Core Stylesheet (Especificações Globais de Design System)
├── script.js                  # Global Controller (Lógica de Negócio e Engine assíncrona)
│
└── SubPaginas/                # Sub-modules View Layer
    ├── banho-e-tosa.html      # Sub-view: Serviço de Estética
    ├── hotel-e-creche.html    # Sub-view: Serviço de Hospedagem
    └── veterinario.html       # Sub-view: Clínico e Validação Cadastral
```

## 3. Stack Tecnológica e Dependências

- HTML5 Semântico: Estruturação do DOM utilizando tags de escopo para otimização de acessibilidade e SEO.

- CSS3 Vanilla: Implementação de pseudo-classes (:hover), transições de estado (transition), manipulação de opacidade via canais alfa (rgba), gradientes lineares e diretivas de compilação condicional (@media queries).

- Bootstrap v5.3.3 (via CDN): Framework utilitário baseado em Flexbox e Grid System de 12 colunas, além de componentes pré-estilizados com estados de pseudo-classe nativos.

- Bootstrap Icons v1.11.3 (via CDN): Biblioteca de vetores escaláveis (SVG) encapsulados em fontes icônicas.

- JavaScript ECMAScript 6 (ES6+): Mecanismo de execução assíncrona baseado em Promises, manipulação de API Web (Fetch), manipulação de eventos de DOM (Event Listeners) e serialização de objetos.

## 4. Engenharia de Módulos e Fluxos de Dados

A. Persistência de Estado Local (LocalStorage Engine)
O script realiza o gerenciamento de estado persistente e não-volátil diretamente na partição de armazenamento do User Agent (navegador).

Fluxo de Serialização (Escrita): Um Objeto Literal Javascript (meuPet) é convertido em uma string codificada via JSON.stringify() antes da invocação do método localStorage.setItem().

Fluxo de Desserialização (Leitura): O pipeline recupera a cadeia de caracteres via localStorage.getItem(), parseia o dado bruto para um objeto tipado via JSON.parse() e executa a interpolação de strings (Template Literals) para logging estruturado no console.

B. Pipeline de Captura e Injeção Dinâmica de DOM (Newsletter)
Escopo: Restrito ao elemento receptor #form-newsletter.

Mecanismo: Intercepção do ciclo de vida do evento de submissão do formulário (submit). O método event.preventDefault() é invocado para abortar o pipeline nativo de requisição HTTP POST/GET do navegador, mantendo o estado da Single Page App (SPA).

Mutação do DOM: O valor interpolado (emailInput.value) é injetado programaticamente via propriedade .innerHTML, renderizando dinamicamente componentes de feedback (.alert-success) com propriedades de sombreamento e cantos arredondados do Bootstrap.

C. Subsistema Assíncrono de Localização (ViaCEP API Integration)
O ecossistema consome de forma assíncrona um serviço web RESTful externo para otimização do fluxo de preenchimento cadastral.

[Input CEP (Blur)] ──> [Sanitização Regex] ──> [Validação de Comprimento]
│
[Preenchimento Automático do DOM] <── [Resolve Promise] <── [HTTP GET Fetch]
│
[Invocação do .focus() no Input Número]

- Gatilho Condicional: Evento de perda de foco do ponteiro (blur) no elemento input #cep.

- Sanitização de Input via Expressão Regular: Aplicação do método .replace(/\D/g, "") para expurgar caracteres não-numéricos (letras, hifens, espaços) antes do envio do payload.

- Pipeline de Execução Assíncrona (Fetch API):

- Instanciação de uma requisição HTTP via método GET para a URL parametrizada.

- Análise sintática do cabeçalho da resposta HTTP (response.ok). Caso o status de rede seja adverso, uma exceção é lançada explicitamente (throw new Error).

- Consumo do corpo da mensagem e conversão para formato objeto (response.json()).

- Gerenciamento de Exceções e Erros de Regra de Negócio: Caso a propriedade lógica .erro retorne verdadeira do servidor ViaCEP (CEP inexistente na base postal), o sistema intercepta o fluxo, invoca a função modular limparCampos() e aciona gatilhos visuais injetando as classes utilitárias .is-invalid e .text-danger no escopo do input afetado.

- Acessibilidade e Usabilidade (UX/UI): Ao resolver com sucesso a Promise do Fetch, os nós do DOM (#logradouro, #bairro, #cidade, #uf) são updated de forma atômica com as propriedades do objeto retornado. Em seguida, o ponteiro de execução do teclado é transferido via software para o elemento #numero por meio do método nativo .focus().

## 5. Diretrizes de Manutenção e Governança de Código

🚨 Regra de Escopo Relativo (Uplink de Diretório)
Devido ao isolamento das sub-views no diretório SubPaginas/, é mandatório a aplicação de operadores de resolução de escopo superior (../) em todas as tags de importação e hiperlinks. O não cumprimento dessa regra resulta em falha de resolução de caminhos (Erro HTTP 404).

🛑 Arquitetura de Script Unificado (Defensive Design contra Ponteiros Nulos)
Como o arquivo script.js é compartilhado globalmente entre documentos com topologias estruturais distintas, a manipulação direta de referências de memória de elementos não-globais deve ser encapsulada em blocos de checagem existencial (if (targetElement)). A tentativa de vinculação de ouvintes de eventos (addEventListener) em instâncias nulas (null) causará a interrupção crítica do interpretador Javascript (Runtime Error), quebrando as demais engines da aplicação.

## 6. Link do Projeto Funcional

https://abelhinha-orcin.vercel.app
