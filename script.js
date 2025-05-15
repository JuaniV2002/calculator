const expressionInput = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('.button');
const historyList = document.getElementById('history-list');

let expression = '';

function updateDisplay() {
  expressionInput.value = expression;
}

function evaluateExpression() {
  try {
    const result = eval(expression);
    resultDisplay.textContent = result;
    addToHistory(expression + ' = ' + result);
    expression = result.toString();
    updateDisplay();
  } catch {
    resultDisplay.textContent = 'Error';
  }
}

function addToHistory(entry) {
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const digit = btn.dataset.digit;
    const operator = btn.dataset.operator;

    if (digit !== undefined) {
      expression += digit;
    } else if (operator !== undefined) {
      expression += operator;
    } else if (btn.id === 'decimal') {
      expression += '.';
    } else if (btn.id === 'clear') {
      expression = '';
      resultDisplay.textContent = '0';
    } else if (btn.id === 'backspace') {
      expression = expression.slice(0, -1);
    } else if (btn.id === 'equals') {
      evaluateExpression();
      return;
    }

    updateDisplay();
  });
});

document.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.'].includes(e.key)) {
    expression += e.key;
  } else if (e.key === 'Enter') {
    evaluateExpression();
    return;
  } else if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
  } else if (e.key === 'Escape') {
    expression = '';
    resultDisplay.textContent = '0';
  } else {
    return;
  }
  updateDisplay();
});
