const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { commands } = req.body;

  if (!commands) return res.status(400).send({ error: msgs.missProps });
  if (typeof commands !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!commands.length) return res.status(400).send({ error: msgs.emptyArray });
  if (commands.find(command => 
    !command.name || 
    !command.aliases || 
    typeof command.aliases !== "object" || 
    !command.type || 
    command.description === undefined || 
    command.description === null || 
    !command.created_timestamp || 
    !command.releases_notes || 
    typeof command.releases_notes !== "object"
  )) return res.status(400).send({ error: msgs.missPropsInAnItem });

  commands.forEach((command, index) => {
    if (!command.how_to_use) commands[index].how_to_use = null;
    if (!command.cooldown) commands[index].cooldown = 0;
    if (!command.example) commands[index].example = null;
    if (!command.example_url) commands[index].example_url = null;
    if (!command.updated_timestamp) commands[index].updated_timestamp = null;
    if (!command.version) commands[index].version = '1.0';
    if (command.times_limit === undefined) commands[index].times_limit = 1;
    if (!command.reason_inactivity) commands[index].reason_inactivity = null;
    command.active ? commands[index].active = 1 : commands[index].active = 0;
  });

  const sql = `INSERT INTO commands (name, aliases, type, description, how_to_use, cooldown, example, example_url, created_timestamp, updated_timestamp, version, releases_notes, times_limit, active, reason_inactivity) VALUES ${commands.map(command => {
    return `('${command.name}', '${JSON.stringify(command.aliases)}', '${command.type}', '${command.description}', ${command.how_to_use ? `'${command.how_to_use}'` : null}, '${command.cooldown}', ${command.example ? `'${command.example}'` : null}, ${command.example_url ? `'${command.example_url}'` : null}, '${command.created_timestamp}', ${command.updated_timestamp ? `'${command.updated_timestamp}'` : null}, '${command.version}', '${JSON.stringify(command.releases_notes)}', '${command.times_limit}', '${command.active}', ${command.reason_inactivity ? `'${command.reason_inactivity}'` : null})`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    commands.forEach((command, index) => commands[index].id = result.insertId + index);

    if (cache.commands.length) cache.commands.push(...commands);

    return res.json({ result, sql, commands });
  });
};