module.exports = (users) => {
  Object.values(users).forEach((user, index) => {
    if (user === null) return;

    const key = Object.keys(users)[index];

    if (!user.admin) user.admin = false;
    if (!user.consecutive_days) user.consecutive_days = 0;
    if (!user.daily_timestamp) user.daily_timestamp = 0;
    if (!user.job) user.job = 0;
    if (!user.created_timestamp) user.created_timestamp = Date.now();
    if (!user.money) user.money = 0;
    if (!user.id) user.id = key;

    users[key] = user;
  });
};