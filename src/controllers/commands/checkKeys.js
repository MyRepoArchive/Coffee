module.exports = (commands, ignore, obs, reject) => {
  if (Object.keys(commands).filter(key => !/^(\d*[a-z]+)[\d_a-z]*$/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys = Object.keys(commands).filter(key => !/^(\d*[a-z]+)[\d_a-z]*$/g.test(key + ''));
      obs.ignoredKeys.forEach((key) => commands[key] = null);
    } else {
      reject(new Error('A key da propriedade deve corresponder à seguinte expressão: "/^(\\d*[a-z]+)[\\d_a-z]*$/g"'));
      return false;
    };
  };
  return true;
};