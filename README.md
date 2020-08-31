# Coffe

![Banner Coffee](image/coffee-zorro-16x9.png)

[Português](#Português) |
[English](#English)

## Português
Um Bot para o Discord de código aberto, que usa a biblioteca [Discord.js](https://discord.js.org/#/)!

### Aviso
**Antes de tudo, para seu bot funcionar corretamente, modifique o arquivo *config.json* para *info.json*! (RECOMENDADO)**

**Ou você pode entrar em todos os arquivos que requerem o *info.json* e modificar a linha:**
```js
const config = require("./info.json");
```
para:
```js
const config = require("./config.json");
```

#### Links
[Como usar](#Como-usar) |
[Criando bot no Discord](#Criando-bot-no-discord) |
[Emojis personalizados](#Emojis-personalizados) | 
[Comandos do bot](#Comandos-do-bot)

### Como usar?
Para rodar o bot na sua máquina, primeiramente você deve ter instalado o **NodeJS**, e ter [criado um bot na área de desenvolvedor do Discord](#Criando-bot-no-discord).

Após esses dois passos concluídos, copie o *token* do seu bot, e cole na área reservada para o token no arquivo **info.json** dentro dos arquivos do bot.

Neste mesmo arquivo **info.json**, você vai perceber que existem outras informações que tem uma descrição do que deve ser colocado alí, preencha-as corretamente!

Se você estiver utilizando o **Visual Studio Code** como editor de códigos, nele abra a pasta do bot, em seguida abra o terminal, e execute dentro do terminal o seguinte comando:
```
node index.js
```

Se deseja rodar o bot usando o **PowerShell**, primeiro entre atravez do PowerShell na pasta do seu bot (use cd caminho_da_pasta), em seguida execute o comando:
```
node index.js
```

E pronto, seu bot ficará online, mostrando no terminal a quantidade de pessoas, de servidores e de canais, também vai ser exibida uma lista com o nome de todos os servidores que o bot está presente!

**LEMBRE-SE que seu bot só ficará online enquanto sua máquina estiver ligada, ou até o momento que você parar de rodar o bot (pode usar *"CTRL + C"* dentro do terminal para parar o bot).**

### Criando bot no discord
Você precisa criar uma aplicação no discord para que o código tenha onde "rodar". Se não sabe fazer isso siga esses passos:

1. Acesse o [site oficial do discord](https://discord.com/new)
2. Procure a *"Área de desenvolvedores"*
    ![dev-area](image/devarea-br.PNG)
3. Dentro do portal do Desenvolvedor clique em *"Applications"/"Aplicações"*!
    ![applications](image/developer-aplications.PNG)
4. Clique em *"New Applications"/"Nova aplicação"*
    ![new-app](image/new-app.PNG)
5. Coloque o nome do seu bot e clique em *"Create"/"Criar"*
    ![create-name](image/create-name.PNG)
6. Do lado esquerdo, clique em *"Bot"*, logo em seguida em *"Add Bot"* e confirme!
    ![add-bot](image/add-bot.PNG)
    ![comfirm-add-bot](image/confirm-add-bot.PNG)
7. Pronto! Seu bot foi criado, agora copie o **Token** e cole no **config.json** do seu bot!
    ![token](image/token.PNG)

### Emojis personalizados

O **Coffee** usa uma vasta quantidade de emojis personalizados, e esses emojis só estão acessíveis nos servidores de emoji em que a minha instância do bot está, mas para não deixá-los de lado, eu disponibilizei na pasta *Emojis*, que fica dentro da pasta *Image*, todas as imagens que são usadas pelo **Coffee** em forma de emoji.
Para você consegui usar normalmente, adicione em algum servidor que seu bot esteja, todas essas imagens, na área de emojis do discord, em seguida, você vai alterar todas as ocorrências dos emojis personalizados que a minha instância usa, para os emojis personalizados da sua instância.
Se você usa o *Visual Studio Code* como editor de códigos, existe no canto superior esquerdo, abaixo da aba de arquivos, uma lupa que possibilita você alterar todas as ocorrências de alguma frase ou palavra do seu projeto inteiro, por outra frase ou palavra.

### Comandos do bot

* Diversão
    * avatar
        
        Mostra para o usuário o avatar dele ou de outro membro do servidor
        
        Modo de usar:
        
        Mostrando o próprio avatar: *_avatar*
        
        Mostrando o avatar de outro membro do servidor: *_avatar @membro*
        
        ou: *_avatar usernameDoMembro*

* Moderação
    * unmute
        
        Possibilita o usuário citado de falar no servidor novamente!
        
        Modo de usar:
        
        __Mencionando o(s) usuário(s)__ *_unmute @user1 @user2*
        
        **Pelo username ou apelido:** *_unmute username1 \ apelido1*
        
        OBS: *O motivo para o unmute não é obrigatório, mas caso utilize, coloque-o entre crases ("`")*

    * ban
        
        Bane o(s) usuário(s) mencionado(s) do servidor!
        
        Modo de usar:
        
        Mencionando o(s) usuário(s): *_ban @user1 @user2 \`motivo do banimento\` \`5\`*
        
        Pelo username ou apelido: *_ban username1 \ apelido1 \`motivo do banimento\`  \`3\`*
        
        OBS: *Nem o motivo do banimento nem a quantidade de dias para deletar mensagens são obrigatórios, mas se for utilizá-los, coloque-os entre "`" (crases) e após os usuários a serem banidos, na sequência (motivo, dias)!*
        
        *Para colocar a quantidade de dias para deletar mensagens você deve colocar um motivo (obrigatoriamente)!*

    * kick

        Expulsa o(s) usuário(s) mencionado(s) do servidor!
        
        Modo de usar:
        
        Mencionando o(s) usuário(s): *_kick @user1 @user2 \`motivo da expulsão\`*
        
        Pelo username ou apelido: *_kick username1 \ apelido1 \`motivo da expulsão\`*
        
        OBS: *O motivo da expulsão não é obrigatório, mas se for utilizá-lo, coloque-o entre "`" (crases) e após os usuários a serem expulsos!*

    * mute

        Impossibilita o usuário citado de falar no servidor!
        
        Modo de usar:
        
        __Mencionando o(s) usuário(s)__ *_mute @user1 @user2 \`motivo\`*
        
        __Pelo username ou apelido:__ *_mute username1 \ apelido1*
        
        OBS: *O motivo para o mute não é obrigatório, mas caso utilize, coloque-o entre crases ("`")*

* Geral
    * calculator

        Calculadora para quando você precisar fazer uma conta rápida
        
        Modo de usar:
        
        __Soma:__ *3+3* ```6```
        
        __Subtração:__ *2-3* ```-1```
        
        __Multiplicação:__ _2*5_ ```10```
        
        __Divisão:__ *50 / 2* ```25```
        
        __Resto da divisão (módulo):__ *100 % 3* ```1```

        __Potência:__ _5 **2_ ```25```
        
        OBS: Para usar essa funcionalidade do bot, não é necessário o uso do prefixo, nem de nenhum comando antes, basta digitar a operação matemática no chat e o bot lhe mostra o reultado.

    * desc

        Mostra a descrição de cada comando!
        
        Modo de usar: **_desc kick**

    * ajuda

        Comando usado quando o usuário necessita de ajuda ou precisa saber os comandos do bot

    * invite

        Meu link de convite para me adicionar em algum outro servidor

    * ping

        O ping é utilizado para saber se eu estou na ativa e saber quanto tempo eu demoro para responder minhas solicitações.

    * say

        "Faça das suas as minhas palavras"
        
        Como usar:
        
        __No mesmo canal:__ *_say O que deve ser dito por mim*
        
        __Em outro canal do servidor:__ *_say #outro-canal O que deve ser dito por mim*
        
        __Usando Embed no mesmo canal:__ *_say \`embed\` Título da embed \ Descrição da embed \ #f5f5f5*
        
        __Usando Embed em outro canal:__ *_say #outro-canal \`embed\` Título da embed \ Descrição da embed \ #808080*
        
        OBS: *Se você for utilizar embed na sua mensagem, coloque o termo **"embed"** entre crases. O título da embed é obrigatório, mas a descrição e a cor não são. Se você ficou confuso do que deve ser colocado no ultimo campo da embed, aquilo deve ser a cor em **hex** que a embed deve assumir. Como você também deve ter percebido, os campos da embed devem ser separados com "**\\**" (barra invertida)!*

* Informativo
    * commandlist

        Exibe em uma Embed uma lista com o nome prímário de todos os comandos do bot!

    * info

        Exibe para o usuário alguma informações bacanas do bot, como número de comandos, de usuários, de canais, servidores, etc...

    * serverinfo

        Mostra algumas informações sobre o servidor em que foi utilizado o comando

* Gerenciamento
    * createchannel

        Comando que cria um novo canal no servidor em que foi executado!
        
        Modo de usar: **_createChannel nome-do-canal voice**
        
        OBS: *Se você quiser alterar o tipo do canal mas quiser manter o nome padrão que ele gera, use **\`auto\`** (entre crases) no lugar do nome do canal.*

    * deletechannel

        Você pode utilizar esse comando para deletar um canal de algum servidor que você tenha a devida permissão.
        
        Modo de usar:
        
        Mencionando o canal: *_deletechannel #nome-do-canal-1 #nome-do-canal-2*
        
        Ditando o ID do canal: *_deletechannel id_do_canal_1 id_do_canal_2*

* Contato com os desenvolvedores
    * report

        Se você encontrou algum bug ou coisa que você acredita que não esteja funcionando como deveria, basta usar o comando para que os devenvolvedores fiquem a par do problema e o resolva.
        
        Como usar: *_report seu report vai aqui*

    * sugerir

        Se você gostaria de ver alguma nova funcionalidade no bot que ainda não tenha, ou qualquer tipo de feature, basta usar o comando para que os devenvolvedores fiquem a par da sugestão e possa prontamente atender aos seus pedidos.
        
        Como usar: *_sugerir sua sugestão vai aqui*
[...]README INCOMPLETO

---

## English
An open source Discord Bot, using the [Discord.js](https://discord.js.org/#/) library!

### Warning
**First of all, for your bot to work correctly, modify the file *config.json* to *info.json*! (RECOMMENDED)**

**Or you can enter all files that require *info.json* and modify the line:**
```js
const config = require("./info.json");
```
for:
```js
const config = require("./config.json");
```

#### Links
[How to use](#How-to-use) |
[Creating bot on Discord](#Creating-bot-on-discord) |
[Custom Emojis](#Custom-emojis) |
[Bot commands](#Bot-commands)

### How to use?
To run the bot on your machine, you must first have installed **NodeJS**, and [created a bot in the Discord developer area](#Creating-bot-on-discord).

After these two steps are completed, copy the *token* of your bot, and paste it in the area reserved for the token in the file **info.json** inside the files of the bot.

In this same file **info.json**, you will notice that there is other information that has a description of what should be placed there, fill it in correctly!

If you are using **Visual Studio Code** as a code editor, open the bot folder there, then open the terminal, and run the following command inside the terminal:
```
node index.js
```

If you want to run the bot using **PowerShell**, first enter PowerShell in your bot folder (use cd path_of_folder), then run the command:
```
node index.js
```

And ready, your bot will be online, showing in the terminal the number of people, servers and channels, it will also be displayed a list with the name of all the servers that the bot is present!

**REMEMBER that your bot will only be online while your machine is on, or until the moment you stop running the bot (you can use * "CTRL + C" * inside the terminal to stop the bot).**

### Creating bot on discord
You need to create an application on discord so that the code has nowhere to "run". If you don't know how to do this, follow these steps:

1. Visit the [official discord website](https://discord.com/new)
2. Search for the *"Developer Area"*
    ![dev-area](image/devarea-en.PNG)
3. Within the Developer portal click on *"Applications"*!
    ![applications](image/developer-aplications.PNG)
4. Click *"New Applications"*
    ![new-app](image/new-app.PNG)
5. Enter the name of your bot and click *"Create"*
    ![create-name](image/create-name.PNG)
6. On the left side, click on *"Bot"*, then on *"Add Bot"* and confirm!
    ![add-bot](image/add-bot.PNG)
    ![comfirm-add-bot](image/confirm-add-bot.PNG)
7. Ready! Your bot has been created, now copy the **Token** and paste it into the **config.json** of your bot!
    ![token](image/token.PNG)

### Custom emojis

**Coffee** uses a vast amount of personalized emojis, and these emojis are only accessible on the emoji servers my bot instance is on, but in order not to leave them aside, I made it available in the *Emojis* folder, located in the *Image* folder, all the images that are used by **Coffee** in the form of an emoji.
For you to be able to use normally, add on some server that your bot is, all these images, in the discord emoji area, then you will change all occurrences of the personalized emojis that my instance uses, to the personalized emojis of yours instance.
If you use *Visual Studio Code* as a code editor, there is a magnifying glass in the upper left corner, below the file tab, that allows you to change all occurrences of any phrase or word in your entire project, by another phrase or word.

### Bot commands

* Fun
     * avatar
        
        Shows the user the avatar of him or another member of the server
        
        How to use:
        
        Showing his own avatar: *_avatar*
        
        Showing the avatar of another server member: *_avatar @member*
        
        or: *_avatar usernameOfMember*

* Moderation
    * unmute
        
        Enables the mentioned user to speak on the server again!
        
        How to use:
        
        __Mentioning the user(s)__ *_unmute @user1 @user2*
        
        **By username or nickname:** *_unmute username1 \ nickname1*
        
        NOTE: *The reason for the unmute is not mandatory, but if you use it, put it between back quotes ("`")*

    * ban
        
        Ban the mentioned user(s) from the server!
        
        How to use:
        
        Mentioning the user(s): *_ban @user1 @user2 \ \`reason for the ban\` \`5\`*
        
        By username or nickname: *_ban username1 \ nickname1 \`reason for the ban\` \`3\`*
        
        NOTE: *Neither the reason for the ban nor the number of days to delete messages are mandatory, but if you are going to use them, put them between "`" (back quotes) and after the users to be banned, in sequence (reason, days)!*
        
        *To put the number of days to delete messages you must put a reason (mandatory)!*

    * kick

        Kicks the mentioned user(s) off the server!
        
        How to use:
        
        Mentioning the user(s): *_kick @user1 @user2 \`reason for expulsion\`*
        
        By username or nickname: *_kick username1 \ nickname1 \`reason for expulsion\`*
        
        NOTE: *The reason for the expulsion is not mandatory, but if you are going to use it, put it between "`"(backslashes) and after the users to be expelled!*

    * mute

        It is impossible for the mentioned user to speak on the server!
        
        How to use:
        
        __Mentioning the user(s)__ *_mute @user1 @user2 \`reason\`*
        
        __By username or nickname:__ *_mute username1 \ nickname1*
        
        NOTE: *The reason for the mute is not mandatory, but if you use it, put it between back quotes ("`")*

* General
    * calculator

        Calculator for when you need to make a quick account 
        
        How to use:
        
        __Sum:__ *3 + 3* ```6```
        
        __Subtraction:__ *2-3* ```-1```
        
        __Multiplication:__ _2 * 5_ ```10```
        
        __Division:__ *50/2* ```25```
        
        __Rest of division (module):__ *100 % 3* ```1```

        __Power:__ _5 **2_ ```25```
        
        NOTE: To use this bot functionality, it is not necessary to use the prefix, nor any command before, just type the mathematical operation in the chat and the bot shows you the result.

    * desc

        Shows the description of each command!
        
        How to use: **_desc kick**

    * help

        Command used when the user needs help or needs to know bot commands

    * invite

        My invitation link to add me on some other server

    * ping

        Ping is used to find out if I am active and to know how long it takes me to answer my requests.

    * say

        "Make mine my words"
        
        How to use:
        
        __On the same channel:__ *_say What should be said by me*
        
        __On another server channel:__ *_say #another-channel What should I say*
        
        __Using Embed on the same channel:__ *_say \`embed\` embed title \ embed description \ #f5f5f5*
        
        __Using Embed on another channel:__ *_say #other-channel \`embed\` embed title \ embed description \ #808080*
        
        NOTE: *If you are going to use embed in your message, put the term **"embed"** between back quotes. The embed title is mandatory, but the description and color are not. If you were confused about what should be placed in the last field of the embed, that should be the color in **hex** that the embed should assume. As you may have also noticed, the embed fields must be separated with "**\\**" (backslash)!*

* Informative
    * commandlist

        Displays a list with the primary name of all bot commands in an Embed!

    * info

        Displays to the user some nice information about the bot, such as number of commands, users, channels, servers, etc...

    * serverinfo

        Shows some information about the server where the command was used

* Management
    * createchannel

        Command that creates a new channel on the server on which it was executed!
        
        How to use: **_createChannel channel-name voice**
        
        NOTE: *If you want to change the channel type but want to keep the default name it generates, use **\`auto\`** (between back quotes) in place of the channel name.*

    * deletechannel

        You can use this command to delete a channel from any server for which you have permission.
        
        How to use:
        
        Mentioning the channel: *_deletechannel #channel-name-1 #channel-name-2*
        
        Dictating the channel ID: *_deletechannel channel_id_1 channel_id_2*

* Contact with developers
     * report

         If you found a bug or something that you believe is not working as it should, just use the command so that developers are aware of the problem and solve it.
        
         How to use: *_report your report goes here*

     * sugerir

         If you would like to see some new functionality in the bot that you do not have yet, or any type of feature, just use the command so that developers are aware of the suggestion and can promptly fulfill your requests.
        
         How to use: *_sugerir your suggestion goes here*
[...]INCOMPLETE RADME
