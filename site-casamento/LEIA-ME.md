# Nosso casamento — primeira versão

Projeto em HTML, CSS e JavaScript puro, sem instalação de pacotes.

## Abrir no VS Code
1. Extraia o ZIP.
2. No VS Code, escolha Arquivo > Abrir Pasta e selecione `site-casamento`.
3. Abra `index.html` no navegador com um duplo clique pelo Explorador de Arquivos. Não precisa de servidor para esta versão.
4. Edite, salve e atualize a página no navegador.

## Onde editar
- `config.js`: nomes, história, data, local, endereço, mapa, confirmação e galeria. Leia os exemplos comentados.
- `index.html`: estrutura e títulos das seções.
- `style.css`: cores, fontes, tamanhos e layout para celular.
- `script.js`: menu, contagem regressiva, galeria e carregamento das configurações.
- `assets/foto-principal.jpg`: foto de capa fornecida por você.

A capa usa a foto original. O enquadramento no celular é ajustado por `object-position` em `.hero-image` no CSS. Configurado para Camila e Elias, em 12/12/2026, no Espaço Rodrigues. A data usa AAAA-MM-DD e o horário usa HH:MM em campos separados no config.js. A contagem só aparece quando o horário for preenchido e o evento estiver no futuro. O link do mapa busca o endereço informado.

## Galeria
Copie as novas fotos para `assets` (use nomes sem espaços) e adicione os caminhos no array `fotos` de `config.js`. Clicar em uma foto abre a visualização ampliada; Escape fecha.

## Confirmação de presença
Esta versão não recebe nem armazena confirmações. Crie um formulário externo e coloque seu link em `presencaUrl`; o botão aparecerá automaticamente. Nenhum dado de convidado deve ser colocado no código público.

## Publicação
Os arquivos estão preparados para hospedagem estática como GitHub Pages. Envie o conteúdo desta pasta para a raiz do seu repositório, preservando `assets`. Ainda não há repositório conectado ou site publicado. O próximo passo é conectar/criar seu repositório e configurar a publicação.

## Lista de presentes
No `config.js`, preencha `presentesUrl` com o link completo da sua lista. O botão “Ver lista de presentes” aparecerá na seção Presentes. Enquanto estiver vazio, a seção mostra “em breve”.

## Fonte dos nomes
Os nomes usam Boheme Floral, fornecida por você e incluída em assets/fonts/boheme-floral.ttf. Funciona sem internet. A referência enviada informa uso pessoal gratuito, sem uso comercial.
