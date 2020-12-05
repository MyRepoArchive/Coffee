module.exports = (members) => {
  Object.values(members).forEach((member, index) => {
    if (member === null) return;

    const key = Object.keys(members)[index];

    if (!member.created_timestamp) member.created_timestamp = Date.now();
    if (!member.money) member.money = 0;
    if (!member.score) member.score = 0;
    if (!member.id) member.id = key;
    if (!member.guild_id) member.guild_id = key.split('-')[0]
    if (!member.user_id) member.user_id = key.split('-')[1];

    members[key] = member;
  });
};