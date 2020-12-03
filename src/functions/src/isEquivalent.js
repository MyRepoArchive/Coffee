module.exports = (a, b) => new Promise((resolve, reject) => {
  function run(a, b) {
    if (typeof a !== typeof b) return resolve(false);

    if (typeof a === "function") return resolve(false);

    if (typeof a === "string" || typeof a === "number" || typeof a === "boolean" || typeof a === "undefined") {
      if (a === b) return resolve(true)
      else return resolve(false);
    };

    if (a === null && b === null) return resolve(true);
    if (a === true && b !== null) return resolve(false);
    if (a !== null && b === null) return resolve(false);

    if (typeof a === "object" && a.length === undefined && b.length === undefined) {
      const aProps = Object.getOwnPropertyNames(a);
      const bProps = Object.getOwnPropertyNames(b);

      if (aProps.length !== bProps.length) return resolve(false);

      if (aProps.filter((propName) => {
        return !run(a[propName], b[propName]);
      }).length) return resolve(false);
      return resolve(true);
    } else if (typeof a === "object" && typeof a.length === "number" && typeof b.length === "number") {
      if (a.length !== b.length) return resolve(false);

      if (a.filter((item, index) => {
        return !run(item, b[index]);
      }).length) return resolve(false);
      return resolve(true);
    } else return resolve(true);
  };

  run(a, b);
});