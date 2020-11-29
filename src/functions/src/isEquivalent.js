module.exports = (a, b) => {
  if (typeof a !== typeof b) return false;

  if (typeof a === "function") return false;

  if (typeof a === "string" || typeof a === "number" || typeof a === "boolean" || typeof a === "undefined") {
    if (a === b) return true
    else return false;
  };

  if (a === null && b === null) return true;
  if (a === true && b !== null) return false;
  if (a !== null && b === null) return false;

  if (typeof a === "object" && a.length === undefined && b.length === undefined) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) return false;

    if(aProps.filter((propName) => {
      return !module.exports(a[propName], b[propName]);
    }).length) return false;
    return true;
  } else if (typeof a === "object" && typeof a.length === "number" && typeof b.length === "number") {
    if (a.length !== b.length) return false;

    if (a.filter((item, index) => {
      return !module.exports(item, b[index]);
    }).length) return false;
    return true;
  } else return true;
};