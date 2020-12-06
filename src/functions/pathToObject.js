module.exports = (path, object) => new Promise((resolve) => {
  let i = 0;
  let traject = '';
  const fullTraject = `["${path.split('/').join('"]["')}"]`
  const aninhar = (path, object) => {
    const property = path.split('/')[i]

    traject += `["${property}"]`;
    i++;

    if (typeof object[property] === "object" && path.split('/')[i] !== undefined) {
      aninhar(path, object[property], i);
    } else {
      return resolve({ result: object[property], traject, fullTraject });
    };
  };

  aninhar(path, object)
});