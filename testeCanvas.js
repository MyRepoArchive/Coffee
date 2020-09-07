const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont('arvo.ttf', { family: "Arvo" })
const canvas = createCanvas(512, 200)
const ctx = canvas.getContext('2d')
const fs = require('fs')


loadImage('./image/profile-v1.png').then(image => {
  ctx.drawImage(image, 0, 0, 512, 200)

  ctx.font = '20px "Arvo"'
  ctx.fillStyle = '#e4263c'
  ctx.fillText('1520', 320, 108)
  ctx.font = '15px "Arvo"'
  ctx.fillText('11', 250, 152)
  ctx.fillText('40', 400, 152)
  ctx.font = '900 20px Arial'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Canguru Milk', 165, 67)

  fs.writeFile('./image/perfil.png', canvas.toBuffer(), err => {})
}) 