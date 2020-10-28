const array = [
  {
    id: 0,
    name: 'oi'
  },
  {
    id: 1,
    name: 'ola'
  },
  {
    id: 3,
    name: 'hello'
  }
];

console.log(array);

array[array.findIndex(value => value.id === 4)] = 'cabrito';

console.log(array);