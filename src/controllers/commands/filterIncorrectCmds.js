const { re } = require("mathjs");

module.exports = (commands) => {
  return Object.values(commands).map((command, index) => [Object.keys(commands)[index], command]).filter((command) => {
    if (command === null) return;
    const key = command[0];

    return (
      typeof command[1].active !== "boolean" ||
      (command[1].aliases !== null && command[1].aliases.filter(name => name === undefined || name === null || !/^(\d*[a-z]+)[\d_a-z]*$/g.test(name + '')).length) ||
      typeof command[1].cooldown !== "number" ||
      typeof command[1].created_timestamp !== "number" ||
      (command[1].description !== null && typeof command[1].description !== "string") ||
      (command[1].example !== null && typeof command[1].example !== "string") ||
      (command[1].example_url !== null && typeof command[1].example_url !== "string") ||
      (command[1].reason_inactivity !== null && typeof command[1].reason_inactivity !== "string") ||
      (command[1].how_to_use !== null && typeof command[1].how_to_use !== "string") ||
      command[1].name !== key ||
      (command[1].releases_notes !== null && (
        Object.keys(command[1].releases_notes).filter(ver => typeof ver !== "string" || /[^0-9,]/g.test(ver) || ver === '').length ||
        Object.values(command[1].releases_notes).filter((rel, index) => (
          rel !== null && (
            typeof rel !== "object" ||
            rel.length !== undefined ||
            typeof rel.name !== "string" ||
            typeof rel.v !== "string" ||
            rel.v !== Object.keys(command[1].releases_notes)[index] ||
            typeof rel.description !== "string" ||
            typeof rel.timestamp !== "number"
          )
        )).length
      )) ||
      (command[1].times_limit !== null && typeof command[1].times_limit !== "number") ||
      typeof command[1].type !== "string" ||
      typeof command[1].updated_timestamp !== "number" ||
      typeof command[1].version !== "string" || 
      /[^0-9,]/g.test(command[1].version) || 
      command[1].version === ''
    );
  });
};