import {BRAILLE_SYMBOLS, ASCII_TO_BRAILLE} from "./data.js"

function convertPattern(pattern: string, symbols: string[]): string {
	pattern = pattern.padEnd(8, '0');
	return symbols[parseInt(pattern, 2)];
}

console.log(convertPattern('101', BRAILLE_SYMBOLS))