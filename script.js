import { BRAILLE_SYMBOLS } from "./data.js";
function convertPattern(pattern, symbols) {
    pattern = pattern.padEnd(8, '0');
    return symbols[parseInt(pattern, 2)];
}
console.log(convertPattern('101', BRAILLE_SYMBOLS));
