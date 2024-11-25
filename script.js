// Math functions
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) return 'Error';
  return a / b;
}

// Operate function
function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      return null;
  }
}

// Variables for operation
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let shouldResetDisplay = false;

// Display element
const display = document.getElementById('display');

// Button event listeners
document.querySelectorAll('.digit').forEach((button) =>
  button.addEventListener('click', () => appendNumber(button.dataset.digit))
);

document.querySelectorAll('.operator').forEach((button) =>
  button.addEventListener('click', () => setOperator(button.dataset.operator))
);

document.getElementById('equals').addEventListener('click', evaluate);
document.getElementById('clear').addEventListener('click', clearDisplay);
document.getElementById('decimal').addEventListener('click', appendDecimal);
document.getElementById('backspace').addEventListener('click', deleteNumber);

window.addEventListener('keydown', handleKeyboardInput);

function appendNumber(number) {
  if (display.textContent === '0' || shouldResetDisplay) resetDisplay();
  display.textContent += number;
}

function resetDisplay() {
  display.textContent = '';
  shouldResetDisplay = false;
}

function clearDisplay() {
  display.textContent = '0';
  firstOperand = '';
  secondOperand = '';
  currentOperator = null;
}

function appendDecimal() {
  if (shouldResetDisplay) resetDisplay();
  if (display.textContent.includes('.')) return;
  display.textContent += '.';
}

function deleteNumber() {
  if (display.textContent.length === 1) {
    display.textContent = '0';
  } else {
    display.textContent = display.textContent.slice(0, -1);
  }
}

function setOperator(operator) {
  if (currentOperator !== null) evaluate();
  firstOperand = display.textContent;
  currentOperator = operator;
  shouldResetDisplay = true;
}

function evaluate() {
  if (currentOperator === null || shouldResetDisplay) return;
  secondOperand = display.textContent;
  display.textContent = roundResult(
    operate(currentOperator, firstOperand, secondOperand)
  );
  currentOperator = null;
}

function roundResult(number) {
  return Math.round(number * 1000) / 1000;
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === '.') appendDecimal();
  if (e.key === '=' || e.key === 'Enter') evaluate();
  if (e.key === 'Backspace') deleteNumber();
  if (e.key === 'Escape') clearDisplay();
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    setOperator(e.key);
  }
}