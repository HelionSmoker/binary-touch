import { BRAILLE_SYMBOLS } from "./data.js";
const PATTERN_CONTAINER = document.getElementById("pattern-container");
const SYMBOLS_CONTAINER = document.getElementById("symbols-container");


class Pattern {
    constructor(position = -1) {
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
        }
        else {
            PATTERN_CONTAINER.insertBefore(this.patternNode, PATTERN_CONTAINER.children[position + 1]);
            SYMBOLS_CONTAINER.insertBefore(this.symbolNode, SYMBOLS_CONTAINER.children[position + 1]);
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
    createSymbolNode() {
        const resultCharNode = document.createElement("span");
        resultCharNode.classList.add("symbol");
        resultCharNode.textContent = "⠀"; // empty braille char
        return resultCharNode;
    }
    createRemoveButton() {
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn", "editor-btn");
        removeBtn.textContent = "X";
        removeBtn.title = "Remove pattern";
        removeBtn.onclick = () => this.remove();
        return removeBtn;
    }
    createAddButton() {
        const addBtn = document.createElement("button");
        addBtn.classList.add("add-btn", "editor-btn");
        addBtn.textContent = "+";
        addBtn.title = "Add a new pattern";
        addBtn.onclick = () => createPattern(this.getPosition());
        return addBtn;
    }
    handleTouchButtons() {
        let holdTimeout;
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
    getPosition() {
        return Array.from(PATTERN_CONTAINER.children).indexOf(this.patternNode);
    }

    patternToSymbol(pattern) {
        /*
        Converts a binary Braille pattern into its corresponding Unicode symbol.
    
        Takes in a string representing the binary pattern of a Braille character.
        It expects a string of length 8, where each character is either '0' or '1'.
    
        Returns the Unicode character corresponding to the Braille pattern.
        */

        // Define the starting point for Braille patterns in Unicode.
        const blankBraille = "⠀".charCodeAt(0);

        /*
        Rearrange the pattern for proper Unicode conversion.
        Given a pattern like this,          we want to convert it to this:
        ┌───┰───┐                           ┌───┰───┐
        │ 1 │ 5 │                           │ 8 │ 5 │
        │ 2 │ 6 │                           │ 7 │ 4 │
        │ 3 │ 7 │                           │ 6 │ 3 │
        │ 4 │ 8 │                           │ 2 │ 1 │
        └───┴───┘                           └───┴───┘
        
        Given how unicode sorted the symbols, the first 3 bits from the left reffer to the
        first 3 cells; the next 3 bits reffer to cell 5, 6, 7; bit 7 to cell 4; bit 8 to cell 8.
        */
       console.log(pattern)
        // let unicodePattern = `${pattern[7]}${pattern[3]}${pattern[6]}${pattern[5]}${pattern[4]}${pattern[2]}${pattern[1]}${pattern[0]}`
        let rowPattern =     `${pattern[0]}${pattern[2]}${pattern[4]}${pattern[6]}${pattern[1]}${pattern[3]}${pattern[5]}${pattern[7]}`
        let unicodePattern = `${rowPattern[7]}${rowPattern[3]}${rowPattern[6]}${rowPattern[5]}${rowPattern[4]}${rowPattern[2]}${rowPattern[1]}${rowPattern[0]}`
        // let unicodePattern = `${rowPattern[7]}${rowPattern[6]}${rowPattern[4]}${rowPattern[1]}${rowPattern[3]}${rowPattern[5]}${rowPattern[2]}${rowPattern[0]}`
        console.log(pattern,  'row', rowPattern , 'uni', unicodePattern )

        // Convert the pattern to the corresponding Unicode character.
        return String.fromCharCode(blankBraille + parseInt(unicodePattern, 2));
    }

    updateValue() {
        const pattern = this.cells
            .map((button) => {
                return button.classList.contains("active") ? "1" : "0";
            })
            .join("");
        this.value = this.patternToSymbol(pattern, BRAILLE_SYMBOLS);
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
function copy(text) {
    navigator.clipboard.writeText(text).then(function () {
        console.log(`Copied: '${text}'`);
    }, function (err) {
        console.error("Could not copy text: ", err);
    });
}
function changeColor(button) {
    button.classList.add("highlight");
    setTimeout(() => {
        button.classList.remove("highlight");
    }, 1000);
}
function createPattern(position = -1) {
    new Pattern(position);
}
function copyResult(button) {
    const result = Array.from(SYMBOLS_CONTAINER.children)
        .map((charNode) => charNode.textContent)
        .join("");
    copy(result);
    changeColor(button);
}
// TODO: find a way to add to 'window' without explicitly doing so
window.createPattern = createPattern;
window.copyResult = copyResult;
createPattern();
