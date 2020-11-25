const fs = require('fs');
const moment = require('moment');
let podeIr = 0;

module.exports = (message, name) => {
  fs.writeFileSync(name, 
  `<!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>message</title>
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

      .message-quote-bar {
        background: #b9bbbe85;
        border-radius: 5rem;
        width: 0.25rem;
        height: 1.3rem;
        margin-right: 0.3rem;
        display: inline-block;
        margin-bottom: -0.3rem;
      }
    </style>
    </head>
    
    <body>
    
    
    <main>
      
          <div class="message">
          <header class="cabecalho-mensagem">
            <img
              src="${message.author.displayAvatarURL}"
              alt="" class="user-icon">
            <div class="username-and-data">
              <p class="user-username">${message.author.username.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>')}</p>
              <div class="user-metadata">
                <p class="user-metadata-tag">${message.author.tag.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>')}</p>
                <p class="user-metadata-id">${message.author.id}</p>
              </div>
              ${message.author.bot ? `<div class="tag-bot">BOT</div>` : ''}
              <span class="message-data">${moment(message.createdTimestamp).locale('pt').format('llll')}</span>
            </div>
          </header>
          <div class="conteudo-total-mensagem">
          <p class="message-content">${message.content.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>').replace(/  /g, '&nbsp;').split('').map((item, index, arr) => {
            if (podeIr === 0) {
              if (index === 0 && (item === '&' && arr[index+1] === 'g' && arr[index+2] === 't' && arr[index+3] === ';')) {
                
                podeIr = 3;
                return '<span class="message-quote-bar"></span>';
                
              } else if (item === '&' && arr[index+1] === 'g' && arr[index+2] === 't' && arr[index+3] === ';' && (arr[index - 1] === '>' && arr[index - 2] === 'r' && arr[index - 3] === 'b' && arr[index - 4] === '<')) {
                
                  podeIr = 3
                  return '<span class="message-quote-bar"></span>';
                
              } else {
                return item;
              };
            } else {
              podeIr--
            };
          }).join('')}</p>
          
        </div>
        </div>
      </main>
  </body>
</html>`
      
  )
};