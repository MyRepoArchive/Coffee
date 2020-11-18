const fs = require('fs');
const moment = require('moment');

module.exports = (ticket, messages) => {
  fs.writeFileSync('ticket.html', 
  `<!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket - ${ticket}</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link
      href="https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;700;800&display=swap"
      rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
  
      body {
        background-color: #36393e;
        min-height: 100vh;
        color: #b9bbbe;
        font-family: 'Mutka', Helvetica, sans-serif;
      }
  
      header#cabecalho-geral {
        display: flex;
        align-items: center;
      }
  
      #guild-icon {
        margin: 1rem;
        width: 7rem;
        border-radius: 100%;
      }
  
      .header-content {
        display: inline-block;
      }
  
      #channel-name-header {
        display: flex;
        align-items: center;
      }
  
      #channel-name-header svg {
        opacity: 0.6;
      }
  
      #qtd-msgs {
        opacity: 0.6;
      }
  
      .message {
        margin: 1rem;
        max-width: 700px;
      }
  
      .user-icon {
        width: 3rem;
        border-radius: 100%;
      }
  
      .username-and-data {
        display: inline-block;
        margin-top: 0.2rem;
        vertical-align: top;
      }
  
      .username-and-data:hover .user-metadata {
        display: inline-block;
      }
  
      .user-username {
        display: inline-block;
        font-weight: bold;
        color: #cdd1d6;
      }
  
      .user-metadata {
        position: absolute;
        margin-top: -1rem;
        margin-left: .5rem;
        display: inline-block;
        background-color: black;
        padding: 0.5rem;
        border-radius: 0.5rem;
        z-index: 2;
        color: white;
        display: none;
      }
  
      .tag-bot {
        background: rgb(85, 118, 209);
        border-radius: 0.3rem;
        padding: 0.2rem;
        display: inline-block;
        font-size: 0.7rem;
        font-weight: bold;
        color: white;
      }
  
      .message-data {
        opacity: 0.2;
        display: inline-block;
      }
  
      .conteudo-total-mensagem {
        margin-left: 3.5rem;
        margin-top: -1.5rem;
      }
  
      .container-embed {
        overflow: hidden;
        border-radius: 0.5rem;
        background: #1f2124;
        margin: 1rem 0;
      }
  
      .embed {
        border-left: 0.3rem solid greenyellow;
        padding: 0rem;
        background: #33363a;
        padding: 1.2rem;
        min-height: 10rem;
        display: grid;
        grid-template-columns: auto 8rem;
        grid-gap: 1rem;
      }
  
      .embed-author {
        display: flex;
        align-items: center;
        color: white;
        font-size: 0.8rem;
        margin-bottom: 1rem;
      }
  
      .embed-author-img {
        width: 1.5rem;
        border-radius: 100%;
      }
  
      .embed-author-value {
        display: inline-block;
        margin-left: 0.5rem;
      }
  
      .embed-thumbnail {
        float: right;
      }
  
      .embed-thumbnail-img {
        width: 8rem;
        border-radius: 0.4rem;
      }
  
      .embed-title {
        color: white;
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
  
      .embed-description {
        margin-bottom: 1rem;
      }
  
      .embed-field-title {
        font-size: 1rem;
        color: white;
        margin-bottom: 1rem;
      }
  
      .embed-field-value {
        margin-bottom: 1rem;
      }
  
      .embed-image {
        display: block;
        margin: auto;
      }
  
      .embed-image-img {
        max-width: 100%;
        border-radius: .4rem;
      }
  
      .embed-footer {
        font-size: 0.8rem;
        display: flex;
        align-items: center;
      }
  
      .embed-footer-img {
        width: 1.3rem;
        border-radius: 100%;
        margin-right: 0.2rem;
      }
  
      .embed-footer-value, .embed-footer-timestamp {
        opacity: 0.7;
        display: inline-block;
        margin-left: 0.3rem;
      }
  
      .code-block {
        background: #1f2124;
        border: 1px solid black;
        font-family: monospace;
        padding: 0.5rem;
        border-radius: .3rem;
        line-height: 1.2rem;
      }
  
      .message-content {
        display: inline-block;
      }
  
      .code {
        background: #1f2124;
        font-family: monospace;
        padding: 0 .3rem;
        display: inline;
      }
  
      .bold {
        font-weight: bolder;
      }
  
      .italico {
        font-style: italic;
      }
  
      .sublinhado {
        text-decoration: underline;
      }
  
      .riscado {
        text-decoration: line-through;
      }
    </style>
    </head>
    
    <body>
    <header id="cabecalho-geral">
      <img
        src="${messages[0].guild.iconURL()}"
        alt="Guild Icon" id="guild-icon">
      <div class="header-content">
        <h1 id="guild-name-header">${messages[0].guild.name}</h1>
        <h2 id="channel-name-header">
          <svg width="24" height="24" viewBox="0 0 24 24" class="icon-1DeIlz"><path
              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
              d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001
              17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759
              15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001
              9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759
              7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677
              3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3
              10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968
              3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3
              18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711
              7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9
              20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474
              15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799
              17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709
              21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14
              17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094
              21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
          ${messages[0].channel.name}
        </h2>
        <p id="qtd-msgs"><span id="num-msgs">${messages.length}</span> mensagens</p>
      </div>
    </header>
    <hr>
    
    <main>
      ${messages.map(message => {
        return (`
          <div class="message">
          <header class="cabecalho-mensagem">
            <img
              src="${message.author.displayAvatarURL()}"
              alt="" class="user-icon">
            <div class="username-and-data">
              <p class="user-username">${message.author.username}</p>
              <div class="user-metadata">
                <p class="user-metadata-tag">${message.author.tag}</p>
                <p class="user-metadata-id">${message.author.id}</p>
              </div>
              ${message.author.bot ? `<div class="tag-bot">BOT</div>` : ''}
              <span class="message-data">${moment(message.createdTimestamp).locale('pt').format('llll')}</span>
            </div>
          </header>
          <div class="conteudo-total-mensagem">
          <p class="message-content">${message.content}</p>
          ${message.embeds.map(embed => {
            return (`
            <div class="container-embed">
            <div class="embed" style="border-color: ${embed.color};">
              <div class="embed-left-side">
                ${embed.author ? `<div class="embed-author">
                ${embed.author.}
                <p class="embed-author-value">Author da Embed</p>
              </div>`}

                <div class="embed-title">
                  <p class="embed-title-value">Título da embed</p>
                </div>

                <div class="embed-description">
                  Descrição de toda a embed!!<br>Lorem ipsum dolor sit, amet
                  consectetur adipisicing elit. Eligendi omnis explicabo
                  suscipit rerum laudantium. Minus exercitationem, cum magni
                  sed, voluptatum totam similique ex recusandae consectetur
                  excepturi, nulla quisquam obcaecati neque.
                </div>

                <div class="embed-field">
                  <h3 class="embed-field-title">Título da field</h3>
                  <p class="embed-field-value">Valor da field<br>Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Error in odit
                    adipisci maxime officiis quibusdam nihil, ipsam obcaecati
                    ipsa debitis, qui veritatis aut dicta commodi laudantium
                    non! Ullam, dolorum reprehenderit.</p>
                </div>

                <div class="embed-image">
                  <img
                    src="https://www.popsci.com/resizer/QgEMm6gNVXFYEFCmonq-Tp9_D7g=/760x506/cloudfront-us-east-1.images.arcpublishing.com/bonnier/3NIEQB3SFVCMNHH6MHZ42FO6PA.jpg"
                    alt="" class="embed-image-img">
                </div>
              </div>

              <div class="embed-thumbnail">
                <img
                  src="https://cdn.discordapp.com/icons/425864977996578816/a_d14e0f77585fe273923d784856448b19.webp"
                  alt="" class="embed-thumbnail-img">
              </div>

              <div class="embed-footer">
                <img
                  src="https://cdn.discordapp.com/avatars/403925985847934976/7f41b812a99d42a786e84a76489c45b7.webp"
                  alt="" class="embed-footer-img">
                <p class="embed-footer-value">Rodapé da embed aqui!</p>
                <p class="embed-footer-timestamp"> • Ontem as 18:30</p>
              </div>
            </div>
          </div>
            `)
          })}
        </div>
        `)
      })}`
  )
};