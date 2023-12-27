import { BRAILLE_SYMBOLS } from "./data.js";

const PATTERN_CONTAINER = document.getElementById("pattern-container");
const SYMBOLS_CONTAINER = document.getElementById("symbols-container");

class Pattern {
	private readonly patternNode: HTMLDivElement;
	private readonly cells: HTMLButtonElement[];
	private readonly symbolNode: HTMLSpanElement;
	private readonly removeNode: HTMLButtonElement;
	private readonly addNode: HTMLButtonElement;
	private value: string;

	constructor(position: number = -1) {
		this.patternNode = document.createElement("div");
		this.patternNode.classList.add("pattern");

		this.cells = [];
		this.createCellNodes();

		this.removeNode = this.createRemoveButton();
		this.patternNode.appendChild(this.removeNode);

		this.addNode = this.createAddButton();
		this.patternNode.appendChild(this.addNode);

		this.symbolNode = this.createSymbolNode();

		if (position === -1) {
			PATTERN_CONTAINER.appendChild(this.patternNode);
			SYMBOLS_CONTAINER.appendChild(this.symbolNode);
		} else {
			PATTERN_CONTAINER.insertBefore(
				this.patternNode,
				PATTERN_CONTAINER.children[position + 1],
			);
			SYMBOLS_CONTAINER.insertBefore(
				this.symbolNode,
				SYMBOLS_CONTAINER.children[position + 1],
			);
		}

		this.handleTouchButtons();

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

	createSymbolNode(): HTMLSpanElement {
		const resultCharNode = document.createElement("span");

		resultCharNode.classList.add("symbol");
		resultCharNode.textContent = "⠀"; // empty braille char

		return resultCharNode;
	}

	createRemoveButton(): HTMLButtonElement {
		const removeBtn = document.createElement("button");

		removeBtn.classList.add("remove-btn", "editor-btn");
		removeBtn.textContent = "X";
		removeBtn.title = "Remove pattern";
		removeBtn.onclick = () => this.remove();

		return removeBtn;
	}

	createAddButton(): HTMLButtonElement {
		const addBtn = document.createElement("button");

		addBtn.classList.add("add-btn", "editor-btn");
		addBtn.textContent = "+";
		addBtn.title = "Add a new pattern";
		addBtn.onclick = () => createPattern(this.getPosition());

		return addBtn;
	}

	handleTouchButtons() {
		let holdTimeout: number;
		
		this.patternNode.addEventListener('touchstart', (event) => {
			// Avoid unwanted side effects
			event.preventDefault();
	  
		  holdTimeout = setTimeout(() => {
			this.removeNode.style.opacity = "1.0";
			this.addNode.style.opacity = "1.0";
		  }, 1000);
		});
	  
		// User released the touch
		this.patternNode.addEventListener('touchend', () => {
		  clearTimeout(holdTimeout);

		  holdTimeout = setTimeout(() => {
			this.removeNode.style.opacity = "0.0";
			this.addNode.style.opacity = "0.0";
		  }, 2000);

		});
	}

	getPosition(): number {
		return Array.from(PATTERN_CONTAINER.children).indexOf(this.patternNode);
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
		this.symbolNode.textContent = this.value;
	}

	remove() {
		PATTERN_CONTAINER.removeChild(this.patternNode);
		SYMBOLS_CONTAINER.removeChild(this.symbolNode);

		if (PATTERN_CONTAINER.children.length < 1) {
			createPattern();
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

function changeColor(button: HTMLButtonElement) {
	button.classList.add("highlight");
	setTimeout(() => {
		button.classList.remove("highlight");
	}, 1000);
}

function createPattern(position: number = -1) {
	new Pattern(position);
}

function copyResult(button: HTMLButtonElement) {
	const result = Array.from(SYMBOLS_CONTAINER.children)
		.map((charNode) => charNode.textContent)
		.join("");

	copy(result);
	changeColor(button);
}

// TODO: find a way to add to 'window' without explicitly doing so
(window as any).createPattern = createPattern;
(window as any).copyResult = copyResult;

createPattern();

const gapSlider = document.getElementById("gap-slider") as HTMLInputElement;
gapSlider.addEventListener("input", function () {
	Array.from(SYMBOLS_CONTAINER.children).forEach((symbol: HTMLElement) => {
		symbol.style.marginRight = `${gapSlider.value}px`;
	});
});
