module.exports = (commands) => new Promise((resolve, reject) => {

  if (typeof commands !== "object" || commands.length !== undefined)
    return reject(new Error('O parâmetro "commands" deve ser um objeto'))

  if (Object.keys(commands).filter(key => !/^(\d*[a-z]+)[\d_a-z]*$/g.test(key + '')).length)
    return reject(new Error('A key da propriedade deve corresponder à seguinte expressão: "/^(\\d*[a-z]+)[\\d_a-z]*$/g"'));

  if (Object.values(commands).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length)
    return reject(new Error('O valor deve ser um objeto!'));

  if (Object.values(commands).filter((command) => (
    command === null ||
    command === undefined ||
    typeof command !== "object" ||
    command.length !== undefined
  )).length) return reject(new Error('Cada comando deve ser um objeto!'));

  Object.values(commands).forEach((command, index) => {
    if (command.aliases === undefined || !command.aliases.length) command.aliases = null;
    if (!command.cooldown) command.cooldown = 0;
    if (command.description === undefined || command.description === '') command.description = null;
    if (command.example === undefined || command.example === '') command.example = null;
    if (command.example_url === undefined || command.example_url === '') command.example_url = null;
    if (command.reason_inactivity === undefined || command.reason_inactivity === '') command.reason_inactivity = null;
    if (command.how_to_use === undefined || command.how_to_use === '') command.how_to_use = null;
    if (!command.releases_notes || typeof command.releases_notes !== "object") command.releases_notes = null;
    if (command.times_limit === undefined) command.times_limit = 1;
    commands[index] = command;
  });

  Object.values(commands).filter((command, index) => {
    const key = Object.keys(commands)[index];

    return (
      typeof command.active !== "boolean" ||
      (command.aliases !== null && (
        typeof command.aliases !== "object" ||
        typeof command.aliases.length !== "number" ||
        command.aliases.filter(name => name === undefined || name === null || !/^(\d*[a-z]+)[\d_a-z]*$/g.test(name + '')).length
      )) ||
      typeof command.cooldown !== "number" ||
      typeof command.created_timestamp !== "number" ||
      (command.description !== null && typeof command.description !== "string") ||
      (command.example !== null && typeof command.example !== "string") ||
      (command.example_url !== null && typeof command.example_url !== "string") ||
      (command.reason_inactivity !== null && typeof command.reason_inactivity !== "string") ||
      (command.how_to_use !== null && typeof command.how_to_use !== "string") ||
      command.name !== key ||
      !releases_notes.isValid(command.releases_notes) ||
      (command.times_limit !== null && typeof command.times_limit !== "number") ||
      typeof command.type !== "string" ||
      typeof command.updated_timestamp !== "number" ||
      versionFilter(command.version)
    );
  });
  
  if (predefinedStructures(path) && predefinedStructures(path).isValid(obj)) {
    client.db.ref(path).update(obj);

    createInCache();

    client.emit('createInDb', path, obj, force);

    resolve((await pathToObject(path, client.db.cache)).result);
  } else if (force) {
    client.db.ref(path).update(obj);

    createInCache();

    client.emit('createInDb', path, obj, force);

    resolve((await pathToObject(path, client.db.cache)).result);
  } else {
    reject(new Error('Não existe uma estrutura pre-definida para esses dados!'));
  }
 
  function createInCache() {
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      eval(`client.db.cache${cachePath.traject}["${key}"] = ${JSON.stringify(value)}`);
    });
  };
});