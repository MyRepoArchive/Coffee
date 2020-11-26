module.exports = (a, b) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  };

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    if (typeof a[propName] === 'object' && a[propName].length === undefined && typeof b[propName] === 'object' && b[propName].length === undefined) {
      if (!module.exports(a[propName], b[propName])) return false;
    } else if (a[propName] !== b[propName]) return false;
  };

  return true;
}