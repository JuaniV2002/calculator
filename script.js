const expressionInput = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('.button');
const historyList = document.getElementById('history-list');

let expression = '';

function loadHistory() {
  const saved = JSON.parse(localStorage.getItem('history') || '[]');
  saved.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

function isOperator(ch) {
  return ['+', '-', '*', '/', '^'].includes(ch);
}

function canAddDecimal() {
  const parts = expression.split(/[+\-*/^()]/);
  const last = parts[parts.length - 1];
  return !last.includes('.');
}

function updateDisplay() {
  expressionInput.value = expression;
}

function evaluateExpression() {
  try {
    const result = evaluate(expression);
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
  const entries = Array.from(historyList.querySelectorAll('li')).map(li => li.textContent);
  localStorage.setItem('history', JSON.stringify(entries));
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const digit = btn.dataset.digit;
    const operator = btn.dataset.operator;

    if (digit !== undefined) {
      expression += digit;
    } else if (operator !== undefined) {
      if (operator === '(' || operator === ')') {
        expression += operator;
      } else {
        if (expression === '' && operator !== '-') return;
        if (isOperator(expression.slice(-1))) {
          expression = expression.slice(0, -1) + operator;
        } else {
          expression += operator;
        }
      }
    } else if (btn.id === 'decimal') {
      if (canAddDecimal()) expression += '.';
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
  if (e.key >= '0' && e.key <= '9') {
    expression += e.key;
  } else if (['+', '-', '*', '/', '^'].includes(e.key)) {
    if (expression === '' && e.key !== '-') return;
    if (isOperator(expression.slice(-1))) {
      expression = expression.slice(0, -1) + e.key;
    } else {
      expression += e.key;
    }
  } else if (e.key === '.') {
    if (canAddDecimal()) expression += '.';
  } else if (e.key === '(' || e.key === ')') {
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

loadHistory();
