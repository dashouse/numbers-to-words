function numberToWords(num) {
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
  
    if (num === 0) return 'zero';
  
    const processSegment = (number) => {
      if (number < 20) return a[number];
      if (number < 100) return `${b[Math.floor(number / 10)]} ${a[number % 10]}`.trim();
      if (number < 1000) return `${a[Math.floor(number / 100)]} hundred${number % 100 !== 0 ? ' ' + processSegment(number % 100) : ''}`.trim();
      return '';
    };
  
    let result = '';
    if (num >= 1000000) {
      result += `${processSegment(Math.floor(num / 1000000))} million `;
      num %= 1000000;
    }
    if (num >= 1000) {
      result += `${processSegment(Math.floor(num / 1000))} thousand `;
      num %= 1000;
    }
    result += processSegment(num);
    return result.trim() + ' ';
  }
  
  function numberToDigits(num) {
    return num.split('').map(digit => numberToWords(parseInt(digit))).join(' ');
  }
  
  function replaceNumbersWithWords(rootNode) {
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null, false);
  
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const regex = /\b(\d+)(k|m|bn)\b|(\d{1,3}(,\d{3})*)(\.\d+)?|(\d{2,})\b|%/gi;
      const originalText = node.textContent;
      const newText = originalText.replace(regex, (match, num, suffix, largeNum, _, decimalNum, digitNum) => {
        if (match === '%') {
          return ' percent ';
        } else if (suffix === 'k') {
          const numPart = parseInt(num);
          return `${numberToWords(numPart * 1000)}thousand `;
        } else if (suffix === 'm' && !largeNum) {
          const numPart = parseInt(num);
          return `${numberToWords(numPart)} million `;
        } else if (suffix === 'bn') {
          const numPart = parseInt(num);
          return `${numberToWords(numPart * 1000000000)}billion `;
        } else if (largeNum) {
          const cleanedMatch = largeNum.replace(/,/g, '');
          const integerPart = numberToWords(parseInt(cleanedMatch));
          return integerPart;
        } else if (digitNum) {
          return numberToDigits(digitNum);
        } else {
          return match;
        }
      });
  
      node.textContent = newText;
    }
  }
  
  let isEnabled = false;
  const rootNode = document.body;
  
  function toggleScript() {
    if (isEnabled) {
      location.reload();
    } else {
      replaceNumbersWithWords(rootNode);
      isEnabled = true;
    }
  }
  
  const button = document.createElement('button');
  button.id = 'toggleButton';
  button.textContent = 'Number to Words';
  button.style.position = 'fixed';
  button.style.bottom = '24px';
  button.style.right = '24px';
  button.style.zIndex = '1000';
  button.style.padding = '10px';
  button.style.backgroundColor = '#333333';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.fontFamily = 'sans-serif';
  button.addEventListener('click', toggleScript);
  
  document.body.appendChild(button);
  