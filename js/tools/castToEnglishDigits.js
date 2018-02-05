export function persianArabicToEnglishDigits (input) {
  if (typeof input !== "undefined") {
    input = input.toString();
    var result = '';
    var perDiff = 1776 - 48;
    var arDiff = 1632 - 48;
    for (var i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) >= 1776 && input.charCodeAt(i) <= 1785 ) {
        result = result + String.fromCharCode(input.charCodeAt(i) - perDiff);
      } else if (input.charCodeAt(i) >= 1632 && input.charCodeAt(i) <= 1641 ) {
        result = result + String.fromCharCode(input.charCodeAt(i) - arDiff);
      } else {
        result = result + input[i];
      }
    }
    return result;
  }
  return '';
}
