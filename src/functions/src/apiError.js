module.exports = (e) => {
  const resErro = e.response ? (e.response.data ? JSON.stringify(e.response.data, null, 4) : '') : '';

  return (
    JSON.stringify(e, null, 4) + '\n' + resErro
  );
};