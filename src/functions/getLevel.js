module.exports = (points) => {
  points = Number(points);
  let lv = 1;

  for (let i = (2 ** lv) * 10; i <= points; i = (2 ** lv) * 10) {
    lv++;
  };
  
  return lv;
};