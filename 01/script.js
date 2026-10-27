"use strict";

// Описания цифр: [строка, столбец], как в редакторе из практики.
// Координаты — строки, поскольку dataset возвращает строковые значения.
const digits = {"0":[["0","1"],["0","2"],["0","3"],["1","0"],["1","4"],["2","0"],["2","4"],["3","0"],["3","4"],["4","0"],["4","4"],["5","0"],["5","4"],["6","0"],["6","4"],["7","0"],["7","4"],["8","1"],["8","2"],["8","3"]],"1":[["0","2"],["1","1"],["1","2"],["2","0"],["2","2"],["3","2"],["4","2"],["5","2"],["6","2"],["7","2"],["8","0"],["8","1"],["8","2"],["8","3"],["8","4"]],"2":[["0","1"],["0","2"],["0","3"],["1","0"],["1","4"],["2","4"],["3","4"],["4","2"],["4","3"],["5","1"],["6","0"],["7","0"],["8","0"],["8","1"],["8","2"],["8","3"],["8","4"]],"3":[["0","0"],["0","1"],["0","2"],["0","3"],["1","4"],["2","4"],["3","4"],["4","1"],["4","2"],["4","3"],["5","4"],["6","4"],["7","4"],["8","0"],["8","1"],["8","2"],["8","3"]],"4":[["0","0"],["0","4"],["1","0"],["1","4"],["2","0"],["2","4"],["3","0"],["3","4"],["4","0"],["4","1"],["4","2"],["4","3"],["4","4"],["5","4"],["6","4"],["7","4"],["8","4"]],"5":[["0","0"],["0","1"],["0","2"],["0","3"],["0","4"],["1","0"],["2","0"],["3","0"],["4","0"],["4","1"],["4","2"],["4","3"],["5","4"],["6","4"],["7","4"],["8","0"],["8","1"],["8","2"],["8","3"]],"6":[["0","1"],["0","2"],["0","3"],["1","0"],["2","0"],["3","0"],["4","0"],["4","1"],["4","2"],["4","3"],["5","0"],["5","4"],["6","0"],["6","4"],["7","0"],["7","4"],["8","1"],["8","2"],["8","3"]],"7":[["0","0"],["0","1"],["0","2"],["0","3"],["0","4"],["1","4"],["2","4"],["3","3"],["4","2"],["5","2"],["6","1"],["7","1"],["8","1"]],"8":[["0","1"],["0","2"],["0","3"],["1","0"],["1","4"],["2","0"],["2","4"],["3","0"],["3","4"],["4","1"],["4","2"],["4","3"],["5","0"],["5","4"],["6","0"],["6","4"],["7","0"],["7","4"],["8","1"],["8","2"],["8","3"]],"9":[["0","1"],["0","2"],["0","3"],["1","0"],["1","4"],["2","0"],["2","4"],["3","0"],["3","4"],["4","1"],["4","2"],["4","3"],["4","4"],["5","4"],["6","4"],["7","4"],["8","1"],["8","2"],["8","3"]]};

function createTable(rows, columns, editable = false) {
  let str = "<table aria-hidden=\"true\">";
  if (editable) str = "<table class=\"editor-grid\" aria-label=\"Поле рисования цифры\">";
  for (let i = 0; i < rows; i++) {
    str += "<tr>";
    for (let j = 0; j < columns; j++) {
      str += `<td data-i="${i}" data-j="${j}">`;
      if (editable) {
        str += `<button class="cell" type="button" aria-label="Строка ${i + 1}, столбец ${j + 1}" aria-pressed="false"></button>`;
      }
      str += "</td>";
    }
    str += "</tr>";
  }
  return str + "</table>";
}

function paintCells(element, coordinates) {
  element.querySelectorAll("td").forEach(function (cell) {
    const marked = coordinates.some(function (item) {
      return item[0] === cell.dataset.i && item[1] === cell.dataset.j;
    });
    cell.classList.toggle("marked", marked);
    const button = cell.querySelector("button");
    if (button) button.setAttribute("aria-pressed", String(marked));
  });
}

function drawDigit(element, digit) {
  element.innerHTML = createTable(9, 5);
  paintCells(element, digits[digit]);
}

function getTimeDigits(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return (hours + minutes).split("");
}

const clock = document.querySelector("#clock");
const clockDigits = clock.querySelectorAll(".digit");
let previousTime = "";

function updateClock(force = false) {
  const values = getTimeDigits(new Date());
  const time = values.join("");
  if (!force && time === previousTime) return;
  values.forEach(function (digit, index) {
    drawDigit(clockDigits[index], digit);
  });
  clock.setAttribute("aria-label", `Текущее время ${time.slice(0, 2)}:${time.slice(2)}`);
  previousTime = time;
}

function drawGallery() {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = "";
  for (let digit = 0; digit <= 9; digit++) {
    const figure = document.createElement("figure");
    const picture = document.createElement("div");
    drawDigit(picture, String(digit));
    const caption = document.createElement("figcaption");
    caption.textContent = String(digit);
    figure.append(picture, caption);
    gallery.append(figure);
  }
}

// Развитие createClickableTable из занятия: выбор цифры, SAVE и вывод JSON.
function createClickableTable(el, rows, columns) {
  let array = [];
  el.innerHTML = `<div class="editor-layout"><div class="drawing">${createTable(rows, columns, true)}</div>
    <div class="controls"><label for="digit-select">Цифра </label><select id="digit-select"></select>
    <button class="save" type="button">SAVE</button>
    <p class="message" role="status">Нажимайте на клетки, чтобы изменить рисунок.</p></div></div>
    <label for="digit-json">Описания всех цифр (JSON)</label>
    <textarea id="digit-json" readonly spellcheck="false"></textarea>`;
  const select = el.querySelector("select");
  const drawing = el.querySelector(".drawing");
  const output = el.querySelector("textarea");
  const message = el.querySelector(".message");

  for (let digit = 0; digit <= 9; digit++) {
    const option = document.createElement("option");
    option.value = String(digit);
    option.textContent = String(digit);
    select.append(option);
  }

  function loadDigit() {
    // Копия массива: рисунок применяется только после SAVE.
    array = digits[select.value].map(function (item) { return item.slice(); });
    paintCells(drawing, array);
    message.textContent = "Нажимайте на клетки, чтобы изменить рисунок.";
  }

  select.addEventListener("change", loadDigit);
  drawing.addEventListener("click", function (event) {
    const cell = event.target.closest("td");
    if (!cell || !drawing.contains(cell)) return;
    const i = cell.dataset.i;
    const j = cell.dataset.j;
    if (!array.find(function (item) { return item[0] === i && item[1] === j; })) {
      array.push([i, j]);
    } else {
      array = array.filter(function (item) { return item[0] !== i || item[1] !== j; });
    }
    paintCells(drawing, array);
    message.textContent = "Рисунок изменён. Нажмите SAVE, чтобы применить.";
  });

  el.querySelector(".save").addEventListener("click", function () {
    digits[select.value] = array.map(function (item) { return item.slice(); });
    output.value = JSON.stringify(digits);
    drawGallery();
    updateClock(true);
    message.textContent = `Цифра ${select.value} сохранена до перезагрузки страницы.`;
  });

  output.value = JSON.stringify(digits);
  loadDigit();
}

drawGallery();
createClickableTable(document.querySelector(".second"), 9, 5);
updateClock();
setInterval(updateClock, 1000);
