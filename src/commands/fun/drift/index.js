const gifs = [
  'https://i.pinimg.com/originals/3a/12/4c/3a124c8b9a6845956451d0984bc8aa98.gif',
  'https://media2.giphy.com/media/Tfn2qCnq3JK8g/giphy.gif',
  'https://media1.giphy.com/media/o6S51npJYQM48/giphy.gif',
  'https://i.imgur.com/KbgHAjn.gif',
  'https://media2.giphy.com/media/k2evHZ2EvAV5m/giphy.gif',
  'https://media1.tenor.com/images/92f4f29da631cf7fb4cca6a6fdfad935/tenor.gif?itemid=18407224',
  'https://steamuserimages-a.akamaihd.net/ugc/170414298190195352/4DDF157696838B72AE3BE393D04021D6445B8A75/'
]

module.exports = {
  config: require('./src/config'),

  run({ message, permissions }) {
    if (permissions.has('SEND_MESSAGES')) message.channel.send(gifs[Math.round(Math.random() * 6)])
  }
}