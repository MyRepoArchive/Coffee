module.exports = (saldoLocal, saldoGlobal, avatarURL) => {
  const saldoTotal = saldoLocal + saldoGlobal;
  const borderColor = saldoTotal >= 0 ? '#45fa81' : '#fa4550';
  
  return `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Saldo layout</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Rokkitt:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

    <style>
      html, body {
        display: flex;
        height: 100vh;
        width: 100vw;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        background-color: #36393f;
      }

      * {
        box-sizing: border-box;
      }

      #background-full {
        background-color: #23252e;
        width: 490px;
        height: 250px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: solid 3px white;
      }

      #background-lv1 {
        width: 460px;
        height: 220px;
        border-radius: 20px;
        border: 3px dashed ${borderColor};
        display: grid;
        padding: 20px 20px 0;
        grid-template-areas: "profile titleLocal"
                            "profile local"
                            "titleGlobal titleGlobal"
                            "global global";
        grid-template-rows: 17px 83px 17px 1fr;
        grid-template-columns: 100px 1fr;
      }

      #perfil-foto {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        border: 3px solid ${borderColor};
        grid-area: "profile";
      }

      #saldo-local-title {
        color: white;
        font-family: Comfortaa;
        font-weight: 600;
        font-size: 12pt;
        margin: 0;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        grid-area: titleLocal;
      }

      #saldo-local {
        font-size: 30pt;
        font-family: 'Courier Prime';
        letter-spacing: -2px;
        color: white;
        text-align: center;
        grid-area: local;
        margin: auto auto;
        font-weight: bold;
      }

      #saldo-global-title {
        color: white;
        font-family: Comfortaa;
        font-weight: 600;
        font-size: 12pt;
        margin: 0;
        display: inline-block;
        text-align: center;
        grid-area: titleGlobal;
      }

      #saldo-local-sifrao, #saldo-global-sifrao {
        margin-right: 7px;
        font-family: Rokkitt;
        font-weight: normal;
        letter-spacing: 0;
      }

      #saldo-local-sifrao, #saldo-local-float {
        font-size: 20pt;
      }

      #saldo-global-sifrao, #saldo-global-float {
        font-size: 15pt;
      }

      #saldo-local-float, #saldo-global-float {
        font-weight: normal;
      }

      #saldo-local-virgula, #saldo-global-virgula {
        font-weight: 100;
        letter-spacing: -7px;
        font-size: 0.6em;
      }

      #saldo-global {
        font-size: 25pt;
        letter-spacing: -2px;
        font-family: 'Courier Prime';
        color: white;
        text-align: center;
        grid-area: global;
        margin: auto auto;
        font-weight: 700;
      }

      #sm-1 {
        display: ${saldoLocal >= 0 ? 'none' : 'inline'};
      }

      #sm-2 {
        display: ${saldoGlobal >= 0 ? 'none' : 'inline'};
      }

      .sinal-menor {
        font-weight: 200;
        color: rgba(255, 255, 255, 0.5);
      }
    </style>
  </head>
  <body>
    <div id="background-full">
      <div id="background-lv1">
        <img
          src="${avatarURL}"
          alt="" id="perfil-foto">
        <h1 id="saldo-local-title">Saldo local</h1>
        <p id="saldo-local"><span id="saldo-local-sifrao">C$</span><span
            id="saldo-local-int"><span class="sinal-menor" id="sm-1">-</span>${parseInt(`${saldoLocal}`.startsWith('-') ? `${saldoLocal}`.slice(1) : saldoLocal).toLocaleString('pt-br')}</span><span id="saldo-local-virgula">,</span><span id="saldo-local-float">${saldoLocal.toFixed(2).split('.')[1]}</span></p>

        <h1 id="saldo-global-title">Saldo bancário</h1>
        <p id="saldo-global"><span id="saldo-global-sifrao">C$</span><span
            id="saldo-global-int"><span class="sinal-menor" id="sm-2">-</span>${parseInt(`${saldoGlobal}`.startsWith('-') ? `${saldoGlobal}`.slice(1) : saldoGlobal).toLocaleString('pt-br')}</span><span id="saldo-global-virgula">,</span><span
            id="saldo-global-float">${saldoGlobal.toFixed(2).split('.')[1]}</span></p>
      </div>
    </div>
  </body>
</html>`
}