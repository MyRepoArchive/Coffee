module.exports = (channels, ignore, obs, reject) => {
  if (Object.keys(channels).filter(key => /\D+/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys = Object.keys(channels).filter(key => /\D+/g.test(key + ''));
      obs.ignoredKeys.forEach((id) => channels[id] = null);
    } else {
      reject(new Error('A key da propriedade não pode corresponder à seguinte expressão: "/\\D+/g"'));
      return false;
    };
  };
  return true;
};