module.exports = (obj, ignore, obs, reject) => {
  if (Object.keys(obj).filter(key => /\D+/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys = Object.keys(obj).filter(key => /\D+/g.test(key + ''));
      obs.ignoredKeys.forEach((id) => obj[id] = null);
    } else {
      reject(new Error('A key da propriedade não pode corresponder à seguinte expressão: "/\\D+/g"'));
      return false;
    };
  };
  return true;
};