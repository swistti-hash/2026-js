const clockDigits = document.querySelectorAll(".digit");
const second = document.querySelector(".second");

// Каждая пара — [строка, столбец]. Нумерация начинается с нуля.
const digits = {
  "0": [
    ["0","1"], ["0","2"], ["0","3"], ["1","0"], ["1","4"],
    ["2","0"], ["2","4"], ["3","0"], ["3","4"], ["4","0"],
    ["4","4"], ["5","0"], ["5","4"], ["6","0"], ["6","4"],
    ["7","0"], ["7","4"], ["8","1"], ["8","2"], ["8","3"]
  ],
  "1": [
    ["0","2"], ["1","1"], ["1","2"], ["2","0"], ["2","2"],
    ["3","2"], ["4","2"], ["5","2"], ["6","2"], ["7","2"],
    ["8","0"], ["8","1"], ["8","2"], ["8","3"], ["8","4"]
  ],
  "2": [
    ["0","1"], ["0","2"], ["0","3"], ["1","0"], ["1","4"],
    ["2","4"], ["3","4"], ["4","2"], ["4","3"], ["5","1"],
    ["6","0"], ["7","0"], ["8","0"], ["8","1"], ["8","2"],
    ["8","3"], ["8","4"]
  ],
  "3": [
    ["0","0"], ["0","1"], ["0","2"], ["0","3"], ["1","4"],
    ["2","4"], ["3","4"], ["4","1"], ["4","2"], ["4","3"],
    ["5","4"], ["6","4"], ["7","4"], ["8","0"], ["8","1"],
    ["8","2"], ["8","3"]
  ],
  "4": [
    ["0","0"], ["0","4"], ["1","0"], ["1","4"], ["2","0"],
    ["2","4"], ["3","0"], ["3","4"], ["4","0"], ["4","1"],
    ["4","2"], ["4","3"], ["4","4"], ["5","4"], ["6","4"],
    ["7","4"], ["8","4"]
  ],
  "5": [
    ["0","0"], ["0","1"], ["0","2"], ["0","3"], ["0","4"],
    ["1","0"], ["2","0"], ["3","0"], ["4","0"], ["4","1"],
    ["4","2"], ["4","3"], ["5","4"], ["6","4"], ["7","4"],
    ["8","0"], ["8","1"], ["8","2"], ["8","3"]
  ],
  "6": [
    ["0","1"], ["0","2"], ["0","3"], ["1","0"], ["2","0"],
    ["3","0"], ["4","0"], ["4","1"], ["4","2"], ["4","3"],
    ["5","0"], ["5","4"], ["6","0"], ["6","4"], ["7","0"],
    ["7","4"], ["8","1"], ["8","2"], ["8","3"]
  ],
  "7": [
    ["0","0"], ["0","1"], ["0","2"], ["0","3"], ["0","4"],
    ["1","4"], ["2","4"], ["3","3"], ["4","2"], ["5","2"],
    ["6","1"], ["7","1"], ["8","1"]
  ],
  "8": [
    ["0","1"], ["0","2"], ["0","3"], ["1","0"], ["1","4"],
    ["2","0"], ["2","4"], ["3","0"], ["3","4"], ["4","1"],
    ["4","2"], ["4","3"], ["5","0"], ["5","4"], ["6","0"],
    ["6","4"], ["7","0"], ["7","4"], ["8","1"], ["8","2"],
    ["8","3"]
  ],
  "9": [
    ["0","1"], ["0","2"], ["0","3"], ["1","0"], ["1","4"],
    ["2","0"], ["2","4"], ["3","0"], ["3","4"], ["4","1"],
    ["4","2"], ["4","3"], ["4","4"], ["5","4"], ["6","4"],
    ["7","4"], ["8","1"], ["8","2"], ["8","3"]
  ]
};

function createTable(rows, columns) {
  let str = "<table>";
  for (let i = 0; i < rows; i++) {
    str = str + "<tr>";
    for (let j = 0; j < columns; j++) {
      str = str + `<td data-i="${i}" data-j="${j}"></td>`;
    }
    str = str + "</tr>";
  }
  str = str + "</table>";
  return str;
}

function drawDigit(el, digit) {
  el.innerHTML = createTable(9, 5);
  let array = digits[digit];

  for (let k = 0; k < array.length; k++) {
    let i = array[k][0];
    let j = array[k][1];
    let cell = el.querySelector(`td[data-i="${i}"][data-j="${j}"]`);
    cell.className = "marked";
  }
}

function updateClock() {
  let date = new Date();
  let hours = String(date.getHours());
  let minutes = String(date.getMinutes());

  // У часов и минут должно быть по две цифры.
  if (hours.length < 2) {
    hours = "0" + hours;
  }
  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  let time = hours + minutes;
  for (let i = 0; i < 4; i++) {
    drawDigit(clockDigits[i], time[i]);
  }
}

function createClickableTable(el, rows, columns) {
  let array = [];
  let object = {};

  el.innerHTML = createTable(rows, columns);
  el.innerHTML += '<button>SAVE</button> <input aria-label="Цифра">';

  const btn = el.querySelector("button");
  const input = el.querySelector("input");

  btn.addEventListener("click", function () {
    object[input.value] = JSON.stringify(array);
    console.log(object);
  });

  el.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() != "td") {
      return;
    }

    let i = e.target.dataset.i;
    let j = e.target.dataset.j;

    if (!array.find(function (item) {
      return item[0] == i && item[1] == j;
    })) {
      array.push([i, j]);
      e.target.className = "marked";
    } else {
      e.target.className = "";
      array = array.filter(function (item) {
        return item[0] != i || item[1] != j;
      });
    }
    console.log(JSON.stringify(array));
  });
}

createClickableTable(second, 9, 5);
updateClock();
setInterval(updateClock, 1000);
