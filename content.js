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
  if (num >= 1000000000) {
    result += `${processSegment(Math.floor(num / 1000000000))} billion `;
    num %= 1000000000;
  }
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
    if (node.parentNode && node.parentNode.offsetParent !== null) {
      const regex = /\b(\d{1,3}(,\d{3})*)\b|\b(\d{4})\b|\b(\d+)\b|%/gi;
      const originalText = node.textContent;
      const newText = originalText.replace(regex, (match, commaSeparatedNum, fourDigitNum, num) => {
        if (match === '%') {
          return ' percent ';
        } else if (commaSeparatedNum) {
          const cleanedNum = commaSeparatedNum.replace(/,/g, '');
          return numberToWords(parseInt(cleanedNum));
        } else if (fourDigitNum) {
          return numberToWords(parseInt(fourDigitNum));
        } else if (num) {
          return numberToWords(parseInt(num));
        } else {
          return match;
        }
      });

      // Log detailed information for diagnosis
      console.log(`Node: "${node.textContent.trim()}"`);
      console.log(`Original Text: "${originalText.trim()}"`);
      console.log(`New Text: "${newText.trim()}"`);

      node.textContent = newText;
    }
  }
}

// Add console log for the output of various numbers
console.log("1 in words:", numberToWords(1));
console.log("12 in words:", numberToWords(12));
console.log("123 in words:", numberToWords(123));
console.log("1645 in words:", numberToWords(1645));
console.log("1,645 in words:", numberToWords(1645));
console.log("12,345 in words:", numberToWords(12345));
console.log("123,456 in words:", numberToWords(123456));
console.log("1,234,567 in words:", numberToWords(1234567));
console.log("12,345,678 in words:", numberToWords(12345678));
console.log("123,456,789 in words:", numberToWords(123456789));
console.log("2017 in words:", numberToWords(2017));
console.log("2021 in words:", numberToWords(2021));

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
