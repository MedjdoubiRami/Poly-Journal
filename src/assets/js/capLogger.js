
/**
 * TODO : Compléter la classe en fonction des tests unitaires fournis
 */
import Logger from './logger.js';  // Assuming CapLogger extends Logger
import { LOG_LEVEL } from './consts.js';

export default class CapLogger extends Logger {
    #maxSize;

    constructor(maxSize = Infinity) {
        super();  // Call the parent class constructor (Logger)
        this.#maxSize = maxSize < 1 ? Infinity : maxSize;  // Ensure maxSize is valid
    }

    get maxSize() {
        return this.#maxSize;
    }

    set maxSize(size) {
        this.changeMaxSize(size);
    }

    // Override the add method to implement the cap functionality
    add(logText, logLevel) {
        // Call the parent class's add method to add the log
        super.add(logText, logLevel);

        // If the number of logs exceeds maxSize, remove the oldest logs
        if (this.logs.length > this.#maxSize) {
            this.logs.splice(0, this.logs.length - this.#maxSize);  // Remove oldest logs
        }
    }

    // Method to change the maxSize and adjust logs if necessary
    changeMaxSize(newSize) {
        if (newSize < 1) {
            this.#maxSize = Infinity;
        } else {
            this.#maxSize = newSize;
        }

        // If reducing maxSize, trim the logs array
        if (this.logs.length > this.#maxSize) {
            this.logs.splice(0, this.logs.length - this.#maxSize);  // Remove oldest logs
        }
    }
}
