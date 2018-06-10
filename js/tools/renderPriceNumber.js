export function renderPriceNumberCommaBetween (input) {
  if (typeof input !== "undefined") {
    var input = parseInt(input);
    if (input < 1000) {
      return String(input);
    }
    input = Math.ceil(input / 1000);
    input = input * 1000;
    input = String(input);
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + ',' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + ',' + res;
    return res;
  }
  return '';
}

export function renderPriceNumberSlashBetween (input) {
  if (typeof input !== "undefined") {
    var input = parseInt(input);
    if (input < 1000) {
      return String(input);
    }
    input = Math.ceil(input / 1000);
    input = input * 1000;
    input = String(input);
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + '/' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + '/' + res;
    return res;
  }
  return '';
}
