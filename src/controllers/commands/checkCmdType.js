module.exports = (commands, ignore, obs, reject) => {
  if (Object.values(commands).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues = Object.values(commands).map((command, index) => [Object.keys(commands)[index], command])
        .filter(value => value === null || typeof value !== "object" || value.length !== undefined);

      Object.values(commands).forEach((command, index) => {
        const key = Object.keys(commands)[index];
        if (command === null || typeof command !== "object" || command.length !== undefined)
          commands[key] = client.db.cache.commands[key] || null;
      });
    } else {
      reject(new Error('Cada comando deve ser um objeto!'));
      return false;
    };
  };
  return true;
};