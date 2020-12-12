const { create, all } = require('mathjs');
const authValues = Object.values(require('../../../../config/auth.json'));

module.exports = async (expressao) => {
  const math = create(all);

  if (!expressao) return false;

  const limitedEvaluate = math.evaluate;

  math.import({
    import: function () { return false },
    createUnit: function () { return false },
    evaluate: function () { return false },
    parse: function () { return false },
    simplify: function () { return false },
    derivative: function () { return false },
    format: function () { return false },
    zeros: function () { return false },
    ones: function () { return false },
    identity: function () { return false },
    range: function () { return false },
    matrix: function () { return false }
  }, { override: true });

  let result;

  try {
    result = limitedEvaluate(expressao);
  } catch (e) {
    return false;
  };

  if (result === null || result === undefined || typeof result === "function") return false;
  if (authValues.filter(vl => `${result}`.includes(vl)).length) return false;
  if (result === Infinity || result === -Infinity || result + '' === 'NaN') result = 'Não é possível determinar';

  return result;
};