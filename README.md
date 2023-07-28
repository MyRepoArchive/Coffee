# Coffe

!!!!! PROJETO DESCONTINUADO!

![Banner Coffee](src/image/coffee-zorro-16x9.png)

Um Bot para o Discord de código aberto, que usa a biblioteca [Discord.js](https://discord.js.org/#/)!


#### Links
[Como usar](#Como-usar)

### Como usar?
Para rodar o bot na sua máquina, primeiramente você deve ter instalado o **NodeJS** (versões acima do 16.0.0), e ter [criado um bot na área de desenvolvedor do Discord](https://discord.com/developers/applications).

Para funcionar corretamente você também precisará criar um servidor no Discord que vai ser a "casa" do seu bot. Lá ele vai te informar de tudo o que está acontecendo com ele. Lembre-se de conceder acesso para visualização das mensagens apenas para pessoas que você deseja, pois o bot pode enviar nesse servidor informações confidenciais à maioria dos usuários. Neste servidor você precisa obrigatoriamente criar um canal de logs para o o bot, ele deve ser do tipo texto (`text`) e o bot precisa ter permissão para ler e enviar mensagens no canal. 

O bot utiliza banco de dados MySql que é gratúito, mas para funcionar, você precisa de um servidor MySql rodando. Recomendo que se você estiver rodando localmente, utilize algum servidor local como WampServer ou XAMPP.

A estrutura do banco de dados está no arquivo [estrutura.sql](./estrutura.sql).

Você também precisa criar na raíz do projeto um arquivo chamado **.env**, que contém as informações de acesso ao seu bot.

O conteúdo do seu arquivo deve ser da seguinte forma:

```
PREFIX=AQUI_O_PREFIX_DO_SEU_BOT
OWNERS=IDS_DOS_DONOS_DO_BOT_OU_PESSOAS_QUE_TERÃO_ACESSO_A_COMANDOS_ADMINISTRATIVOS_DO_BOT_SEPARADOS_POR_VÍRGULA_SEM_ESPAÇO
TOKEN=TOKEN_DO_BOT_DISPONÍVEL_EM_https://discord.com/developers/applications
MAIN_LOG_CHANNEL=ID_DO_CANAL_DE_LOGS_DO_BOT
MYSQL_USER=USUARIO_MYSQL_PARA_CONEXÃO_(RECOMENDADO_QUE_POSSUA_TODAS_AS_PERMISSÕES)
MYSQL_PASSWORD=SENHA_DO_USUÁRIO_MYSQL
MYSQL_HOST=HOST_DO_SERVIDOR_MYSQL_(PROVAVELMENTE_SERÁ_localhost_SE_ESTIVER_RODANDO_LOCALMENTE)
MYSQL_DATABASE=NOME_DA_BASE_DE_DADOS_DO_BOT
MYSQL_PORT=PORTA_DO_SERVIDOR_MYSQL_(PROVAVELMENTE_SERÁ_3306_SE_ESTIVER_RODANDO_LOCALMENTE)(SE_FOR_3306_NÃO_É_NECESSÁRIO_COLOCAR)
SYNC_CACHE_INTERVAL=INTERVALO_DE_SINCRONIZAÇÃO_DE_CACHE_EM_SEGUNDOS_DEFAULT_15(OPCIONAL)
```

Lembre-se também de instalar as dependências do projeto com o comando:
```
npm install
```
ou, caso possua o yarn instalado na máquina:
```
yarn install
```

Para rodar o bot em ambiente de deselvolvimento você pode executar o comando: `npm run dev` ou, caso possua yarn: `yarn dev`.
Para rodar o bot em ambiente de produção você pode executar o comando: `npm run start` ou, caso possua yarn: `yarn start`.


**LEMBRE-SE que seu bot só ficará online enquanto sua máquina estiver ligada, ou até o momento que você parar de rodar o bot (pode usar *"CTRL + C"* dentro do terminal para parar o bot).**

### Emojis personalizados

O bot utiliza alguns emojis personalizados para mostrar informações ao usuário, eles podem ser encontrados em [src/image/emojis](src/image/emojis). É importante que no servidor do seu bot possua esses emojis (as imagens podem ser diferentes, mas precisam ter o mesmo nome). Após subir os emojis para o servidor, você deve atualizar o arquivo [emojis.json](./src/utils/emojis.json) com os IDs dos emojis.
