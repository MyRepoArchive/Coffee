module.exports = (commands) => {
  Object.values(commands).forEach((command, index) => {
    if (command === null) return;

    if (command.aliases === undefined || 
      command.aliases === null ||
      typeof command.aliases !== "object" ||
      typeof command.aliases.length !== "number" || 
      !command.aliases.length) command.aliases = null;
    if (!command.cooldown) command.cooldown = 0;
    if (command.description === undefined || command.description === '') command.description = null;
    if (command.example === undefined || command.example === '') command.example = null;
    if (command.example_url === undefined || command.example_url === '') command.example_url = null;
    if (command.reason_inactivity === undefined || command.reason_inactivity === '') command.reason_inactivity = null;
    if (command.how_to_use === undefined || command.how_to_use === '') command.how_to_use = null;
    if (!command.releases_notes || 
      typeof command.releases_notes !== "object" || 
      command.releases_notes.length !== undefined || 
      !Object.keys(command.releases_notes).length) command.releases_notes = null;
    if (command.times_limit === undefined) command.times_limit = 1;

    commands[index] = command;
  });
};