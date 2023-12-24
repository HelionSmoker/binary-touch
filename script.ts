import { BRAILLE_SYMBOLS } from "./data.js";

const PATTERN_CONTAINER = document.getElementById("pattern-container");
const RESULT_CHAR_CONTAINER = document.getElementById("result-char-container");

class Pattern {
	private readonly patternNode: HTMLDivElement;
	private readonly cells: HTMLButtonElement[];
	private readonly resultCharNode: HTMLSpanElement;
	private readonly removeNode: HTMLButtonElement;
	private value: string;

	constructor() {
		this.patternNode = document.createElement("div");
		this.patternNode.classList.add("pattern");

		this.cells = [];
		this.createCellNodes();

		this.removeNode = this.createRemoveButton();
		this.patternNode.appendChild(this.removeNode);
		PATTERN_CONTAINER.appendChild(this.patternNode);

		this.resultCharNode = this.createResultNode();
		RESULT_CHAR_CONTAINER.appendChild(this.resultCharNode);
	}

	createCellNodes() {
		for (let i = 0; i < 8; i++) {
			const cell = document.createElement("button");
			cell.classList.add("cell");

			cell.onclick = () => {
				cell.classList.toggle("active");
				this.updateValue();
				this.updateResult();
			};

			this.cells.push(cell);
			this.patternNode.appendChild(cell);
		}
	}

	createResultNode(): HTMLSpanElement {
		const resultCharNode = document.createElement("span");

		resultCharNode.classList.add("result-char");
		resultCharNode.textContent = "⠀"; // empty braille char

		return resultCharNode;
	}

	createRemoveButton(): HTMLButtonElement {
		const removeNode = document.createElement("button");

		removeNode.classList.add("remove");
		removeNode.textContent = "X";
		removeNode.title = "Remove Pattern";
		removeNode.onclick = () => this.remove();

		return removeNode;
	}

	convertPattern(pattern: string, symbols: string[]): string {
		return symbols[parseInt(pattern, 2)];
	}

	updateValue() {
		const pattern = this.cells
			.map((button) => {
				return button.classList.contains("active") ? "1" : "0";
			})
			.join("");
		this.value = this.convertPattern(pattern, BRAILLE_SYMBOLS);
	}

	updateResult() {
		this.resultCharNode.textContent = this.value;
	}

	remove() {
		PATTERN_CONTAINER.removeChild(this.patternNode);
		RESULT_CHAR_CONTAINER.removeChild(this.resultCharNode);

		if (PATTERN_CONTAINER.children.length === 0) {
			addPattern();
		}
	}
}

function copy(text: string) {
	navigator.clipboard.writeText(text).then(
		function () {
			console.log(`Copied: '${text}'`);
		},
		function (err) {
			console.error("Could not copy text: ", err);
		},
	);
}

function addPattern() {
	new Pattern();
}

function copyResult() {
	const result = Array.from(RESULT_CHAR_CONTAINER.children)
		.map((charNode) => charNode.textContent)
		.join("");
	copy(result);
}

// TODO: find a way to add to 'window' without explicitly doing so
(window as any).addPattern = addPattern;
(window as any).copyResult = copyResult;

addPattern();
