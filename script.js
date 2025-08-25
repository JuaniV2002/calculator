class AdvancedCalculator {
  constructor() {
    this.expression = '';
    this.memory = 0;
    this.history = [];
    this.isScientificMode = false;
    this.isDarkTheme = false;
    
    this.initializeElements();
    this.initializeEventListeners();
    this.loadSettings();
    this.updateDisplay();
  }

  initializeElements() {
    this.expressionInput = document.getElementById('expression');
    this.resultDisplay = document.getElementById('result');
    this.historyList = document.getElementById('history-list');
    this.memoryIndicator = document.getElementById('memory-indicator');
    this.scientificButtons = document.getElementById('scientific-buttons');
    this.buttons = document.querySelectorAll('.button');
    
    // Control buttons
    this.themeToggle = document.getElementById('theme-toggle');
    this.scientificToggle = document.getElementById('scientific-toggle');
    this.copyResultBtn = document.getElementById('copy-result');
    this.clearHistoryBtn = document.getElementById('clear-history');
    this.clearExpressionBtn = document.getElementById('clear-expression');
  }

  initializeEventListeners() {
    // Button click events
    this.buttons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleButtonClick(e));
    });

    // Control button events
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.scientificToggle.addEventListener('click', () => this.toggleScientificMode());
    this.copyResultBtn.addEventListener('click', () => this.copyResult());
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    this.clearExpressionBtn.addEventListener('click', () => this.clearExpression());

    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // History click events
    this.historyList.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        const parts = e.target.textContent.split(' = ');
        if (parts.length === 2) {
          this.expression = parts[0];
          this.updateDisplay();
        }
      }
    });
  }

  handleButtonClick(e) {
    const btn = e.target;
    const digit = btn.dataset.digit;
    const operator = btn.dataset.operator;
    const functionName = btn.dataset.function;
    const constant = btn.dataset.constant;

    if (digit !== undefined) {
      this.addToExpression(digit);
    } else if (operator !== undefined) {
      this.addToExpression(operator);
    } else if (functionName !== undefined) {
      this.addFunction(functionName);
    } else if (constant !== undefined) {
      this.addConstant(constant);
    } else {
      this.handleSpecialButtons(btn.id);
    }

    this.updateDisplay();
  }

  handleSpecialButtons(buttonId) {
    switch (buttonId) {
      case 'decimal':
        this.addToExpression('.');
        break;
      case 'clear':
        this.clearAll();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'equals':
        this.calculate();
        return;
      case 'memory-clear':
        this.memoryClear();
        break;
      case 'memory-recall':
        this.memoryRecall();
        break;
      case 'memory-add':
        this.memoryAdd();
        break;
      case 'memory-subtract':
        this.memorySubtract();
        break;
    }
  }

  addToExpression(value) {
    // Prevent multiple consecutive operators
    if (this.isOperator(value) && this.isOperator(this.expression.slice(-1))) {
      this.expression = this.expression.slice(0, -1) + value;
    } else {
      this.expression += value;
    }
  }

  addFunction(functionName) {
    const functions = {
      'sin': 'Math.sin(',
      'cos': 'Math.cos(',
      'tan': 'Math.tan(',
      'log': 'Math.log10(',
      'ln': 'Math.log(',
      'sqrt': 'Math.sqrt(',
      'pow': '^2',
      'abs': 'Math.abs('
    };
    
    if (functionName === 'pow') {
      this.expression += '^2';
    } else {
      this.expression += functions[functionName];
    }
  }

  addConstant(constant) {
    const constants = {
      'π': Math.PI.toString(),
      'e': Math.E.toString()
    };
    this.expression += constants[constant];
  }

  isOperator(char) {
    return ['+', '-', '*', '/', '(', ')'].includes(char);
  }

  clearAll() {
    this.expression = '';
    this.resultDisplay.textContent = '0';
  }

  clearExpression() {
    this.expression = '';
    this.updateDisplay();
  }

  backspace() {
    this.expression = this.expression.slice(0, -1);
  }

  calculate() {
    if (!this.expression) return;

    try {
      // Replace mathematical symbols and functions
      let processedExpression = this.preprocessExpression(this.expression);
      
      // Safe evaluation using Function constructor instead of eval
      const result = this.safeEvaluate(processedExpression);
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      const roundedResult = this.roundResult(result);
      this.resultDisplay.textContent = roundedResult;
      this.addToHistory(this.expression + ' = ' + roundedResult);
      this.expression = roundedResult.toString();
      
      // Add animation effect
      this.animateResult();
      
    } catch (error) {
      this.resultDisplay.textContent = 'Error';
      this.animateError();
    }
  }

  preprocessExpression(expr) {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^2/g, '**2')
      .replace(/π/g, Math.PI)
      .replace(/e(?![0-9])/g, Math.E);
  }

  safeEvaluate(expression) {
    // Whitelist of allowed characters and functions
    const allowedPattern = /^[0-9+\-*/.() \t\n\r,Math.sincostalogqrtabsPIE]+$/;
    
    if (!allowedPattern.test(expression)) {
      throw new Error('Invalid characters in expression');
    }

    // Use Function constructor for safer evaluation
    return Function('"use strict"; return (' + expression + ')')();
  }

  roundResult(result) {
    // Round to avoid floating point precision issues
    return Math.round(result * 1000000000000) / 1000000000000;
  }

  animateResult() {
    this.resultDisplay.style.transform = 'scale(1.05)';
    this.resultDisplay.style.color = '#10b981';
    setTimeout(() => {
      this.resultDisplay.style.transform = 'scale(1)';
      this.resultDisplay.style.color = 'var(--text-display)';
    }, 200);
  }

  animateError() {
    this.resultDisplay.style.transform = 'translateX(-5px)';
    this.resultDisplay.style.color = '#ef4444';
    setTimeout(() => {
      this.resultDisplay.style.transform = 'translateX(5px)';
    }, 100);
    setTimeout(() => {
      this.resultDisplay.style.transform = 'translateX(0)';
      this.resultDisplay.style.color = 'var(--text-display)';
    }, 200);
  }

  // Memory functions
  memoryClear() {
    this.memory = 0;
    this.updateMemoryIndicator();
  }

  memoryRecall() {
    this.expression += this.memory.toString();
    this.updateDisplay();
  }

  memoryAdd() {
    try {
      const currentResult = this.safeEvaluate(this.preprocessExpression(this.expression));
      this.memory += currentResult;
      this.updateMemoryIndicator();
    } catch (error) {
      // If current expression is invalid, try to add the displayed result
      const displayedResult = parseFloat(this.resultDisplay.textContent);
      if (!isNaN(displayedResult)) {
        this.memory += displayedResult;
        this.updateMemoryIndicator();
      }
    }
  }

  memorySubtract() {
    try {
      const currentResult = this.safeEvaluate(this.preprocessExpression(this.expression));
      this.memory -= currentResult;
      this.updateMemoryIndicator();
    } catch (error) {
      const displayedResult = parseFloat(this.resultDisplay.textContent);
      if (!isNaN(displayedResult)) {
        this.memory -= displayedResult;
        this.updateMemoryIndicator();
      }
    }
  }

  updateMemoryIndicator() {
    if (this.memory !== 0) {
      this.memoryIndicator.classList.remove('hidden');
    } else {
      this.memoryIndicator.classList.add('hidden');
    }
  }

  // Theme functions
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    this.themeToggle.textContent = this.isDarkTheme ? '☀️' : '🌙';
    this.saveSettings();
  }

  toggleScientificMode() {
    this.isScientificMode = !this.isScientificMode;
    this.scientificButtons.classList.toggle('hidden', !this.isScientificMode);
    this.scientificToggle.textContent = this.isScientificMode ? '🔢' : '🧮';
    this.saveSettings();
  }

  // Utility functions
  copyResult() {
    const result = this.resultDisplay.textContent;
    navigator.clipboard.writeText(result).then(() => {
      // Show feedback
      const originalText = this.copyResultBtn.textContent;
      this.copyResultBtn.textContent = '✓';
      setTimeout(() => {
        this.copyResultBtn.textContent = originalText;
      }, 1000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  }

  clearHistory() {
    this.history = [];
    this.historyList.innerHTML = '';
    this.saveSettings();
  }

  addToHistory(entry) {
    this.history.unshift(entry);
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20);
    }
    
    const li = document.createElement('li');
    li.textContent = entry;
    li.style.animation = 'fadeIn 0.3s ease-out';
    this.historyList.prepend(li);
    
    // Remove excess items from DOM
    while (this.historyList.children.length > 20) {
      this.historyList.removeChild(this.historyList.lastChild);
    }
    
    this.saveSettings();
  }

  updateDisplay() {
    this.expressionInput.value = this.expression || '0';
  }

  handleKeydown(e) {
    e.preventDefault();
    
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
      this.addToExpression(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      this.calculate();
      return;
    } else if (e.key === 'Backspace') {
      this.backspace();
    } else if (e.key === 'Escape') {
      this.clearAll();
    } else if (e.key === 'c' || e.key === 'C') {
      this.clearAll();
    } else if (e.ctrlKey && e.key === 'c') {
      this.copyResult();
      return;
    } else {
      return;
    }
    
    this.updateDisplay();
  }

  // Settings persistence
  saveSettings() {
    const settings = {
      isDarkTheme: this.isDarkTheme,
      isScientificMode: this.isScientificMode,
      memory: this.memory,
      history: this.history
    };
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
  }

  loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('calculatorSettings') || '{}');
      
      if (settings.isDarkTheme) {
        this.toggleTheme();
      }
      
      if (settings.isScientificMode) {
        this.toggleScientificMode();
      }
      
      if (settings.memory) {
        this.memory = settings.memory;
        this.updateMemoryIndicator();
      }
      
      if (settings.history && Array.isArray(settings.history)) {
        this.history = settings.history;
        this.history.forEach(entry => {
          const li = document.createElement('li');
          li.textContent = entry;
          this.historyList.appendChild(li);
        });
      }
    } catch (error) {
      console.log('No previous settings found');
    }
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedCalculator();
});
