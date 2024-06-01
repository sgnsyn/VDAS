const generate_id = (type) => {
  let pk = "";
  const arr = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
  ];
  for (let i = 0; i < 8; i++) {
    let index = Math.floor(Math.random() * 35);
    pk += arr[index];
  }
  return type + pk;
};
module.exports = generate_id;
