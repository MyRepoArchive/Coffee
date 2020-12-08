const mysql = require('mysql');
const fs = require('fs');

const connection  = mysql.createConnection({
  database: 'teste',
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect();

connection.query('select * from users', (err, result) => {
  if (err) throw err;

  const obj = {};
  const formated = result.map(reg => {
    return {
      admin: false,
      consecutive_days: reg.consecutive_days,
      daily_timestamp: reg.daily_timestamp,
      id: reg.iduser,
      job: 0,
      money: reg.bankmoney
    };
  });

  formated.forEach(reg => {
    obj[reg.id] = reg;
  });

  let i = 0

  const newObj = require('../../Outros/backup_seg_7_de_dez_de_2020_as_1130.json').members

  const duplicates = Object.keys(require('../../Outros/backup_seg_7_de_dez_de_2020_as_1130.json').members).filter(id => {
    return formated.map(x => x.id).includes(id);
  })

  const b = formated.filter(h => {
    return !Object.keys(require('../../Outros/backup_seg_7_de_dez_de_2020_as_1130.json').members).includes(h.id)
  })



  formated.forEach(t => {
    console.log(newObj[t.id] ? true: false)
    newObj[t.id] = obj[t.id]
  });

  console.log(obj)

  fs.writeFileSync('sps.json', JSON.stringify(obj, null, 2));
});
