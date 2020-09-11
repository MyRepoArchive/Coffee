const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "credits",
  name2: "creditos",
  name3: "emojiscredits",
  name4: "creditemojis",
  name5: "emojicredits",
  name6: "creditsemojis",
  name7: "criadoresemojis",
  type: "Informativo",
  description: `Veja de onde que foram tirados todos os emojis que eu uso!`,

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const iconsets = '[sport-achievment-badges](https://www.iconfinder.com/iconsets/sport-achievment-badges)\n[web-and-media-1](https://www.iconfinder.com/iconsets/web-and-media-1)\n[business-and-office-50](https://www.iconfinder.com/iconsets/business-and-office-50)\n[award-flat-3](https://www.iconfinder.com/iconsets/award-flat-3)\n[feather](https://www.iconfinder.com/iconsets/feather)\n[whcompare-isometric-web-hosting-servers](https://www.iconfinder.com/iconsets/whcompare-isometric-web-hosting-servers)\n[free-simple-line-mix](https://www.iconfinder.com/iconsets/free-simple-line-mix)\n[letters-and-numbers-1](https://www.iconfinder.com/iconsets/letters-and-numbers-1)\n[date-and-time-fill-outline](https://www.iconfinder.com/iconsets/date-and-time-fill-outline)\n'
    const iconfinder = '[firebase_google_icon](https://www.iconfinder.com/icons/1175544/firebase_google_icon/)\n[calculator](https://www.iconfinder.com/search/?q=calculator&price=free&preview_size=128)'
    const iconIcons = '[arquivo-tipo-mongo](https://icon-icons.com/pt/icone/arquivo-tipo-mongo/130383)\n[javascript](https://icon-icons.com/pt/icone/javascript/130900)\n[arquivo-tipo-html](https://icon-icons.com/pt/icone/arquivo-tipo-html/130541)\n[business-card-id-id](https://icon-icons.com/icon/business-card-id-id/)\n[ação-chutar-bota-sapato](https://icon-icons.com/pt/icone/a%C3%A7%C3%A3o-chutar-bota-sapato/54220)'
    const credits = '[rubyinside](https://medium.com/rubyinside/whats-new-in-ruby-2-7-79c98b265502)\n[React_(JavaScript)](https://pt.wikipedia.org/wiki/React_(JavaScript)\n[python](https://python.br.uptodown.com/windows)\n[node-js](https://br.bitdegree.org/tutoriais/node-js/)\n[nodejs-logo-clipart](https://www.pikpng.com/pngvi/immiTTh_js-logo-nodejs-logo-clipart/)\n[Antu_mysql-workbench](https://commons.wikimedia.org/wiki/File:Antu_mysql-workbench.svg)\n[mariadb-e-ramfs](https://m04m.com/2016/11/04/mariadb-e-ramfs/)\n[kotlin-1](https://worldvectorlogo.com/logo/kotlin-1)\n[java_226777](https://www.flaticon.com/free-icon/java_226777)\n[the-go-programming-language](https://chicoary.wordpress.com/2015/12/31/the-go-programming-language/)\n[reward-achievement-css-trophy-badge-award-css3-97876](https://www.shareicon.net/reward-achievement-css-trophy-badge-award-css3-97876)\n<http://duplabs.com/>\n<https://github.com/FortAwesome/Font-Awesome/issues/14021>'
    const credits2 = '[loading-gif-transparent-10](https://www.blogson.com.br/como-executar-um-gif-durante-o-carregamento-da-pagina-loading/loading-gif-transparent-10/)\n[coin-icon](https://opengameart.org/content/coin-icon)\n[coins-bank-cents-currency-financial-dollar](http://www.myiconfinder.com/icon/coins-bank-cents-currency-financial-dollar/18841)\n[loading-fef1f20](https://www.guaruja.sp.gov.br/loading-fef1f20)\n[discord](https://discord.com/)\n[gold-medal-free-icon-gold-medal-icon-png](https://www.clipartmax.com/middle/m2H7K9m2H7A0m2A0_gold-medal-free-icon-gold-medal-icon-png/)'
    
    const creditEmbed = new Discord.MessageEmbed()
      .setColor(hex.blue2)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle('Perfil')
      .setDescription('[avatar_coffee_cup_zorro_icon](https://www.iconfinder.com/icons/4043245/avatar_coffee_cup_zorro_icon)')
      .addField('Iconfinder', '**Iconsets**\n'+iconsets+'**Iconfinder**\n'+iconfinder)
      .addField('Icon-icons', iconIcons)
      .addField('Outros', credits)
      .addField('\u200b', credits2)
      .setFooter(`Sistema de créditos ${client.user.username}`, client.user.displayAvatarURL())
    run(message, client, creditEmbed, emojis.alertcircleamarelo)
  }
}