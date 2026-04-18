class BrowserHistory {
    /**
     * @param {string} homepage
     */
    constructor(homepage) {
        this.backStack = [];
        this.forwardStack = [];
        this.currentPage = homepage;
    }

    /** 
     * @param {string} url
     * @return {void}
     */
    visit(url) {
        console.log(`Visiting: ${url}`);
        this.backStack.push(this.currentPage);
        this.currentPage = url;
        // Clears forward stack on new visit
        this.forwardStack = [];
    }

    /** 
     * @return {string}
     */
    back() {
        if (this.backStack.length === 0) {
            console.log("No history to go back to.");
            return this.currentPage;
        }
        
        this.forwardStack.push(this.currentPage);
        this.currentPage = this.backStack.pop();
        console.log(`Went back to: ${this.currentPage}`);
        return this.currentPage;
    }

    /** 
     * @return {string}
     */
    forward() {
        if (this.forwardStack.length === 0) {
            console.log("No forward history.");
            return this.currentPage;
        }
        
        this.backStack.push(this.currentPage);
        this.currentPage = this.forwardStack.pop();
        console.log(`Went forward to: ${this.currentPage}`);
        return this.currentPage;
    }

    /**
     * @return {string}
     */
    peek() {
        return this.currentPage;
    }
}

// --- Example Usage ---
console.log("--- Browser History Simulation ---");
const history = new BrowserHistory("https://google.com");
console.log(`Current (peek): ${history.peek()}\n`);

history.visit("https://github.com");
history.visit("https://stackoverflow.com");
console.log(`\nCurrent (peek): ${history.peek()}\n`);

history.back();
history.back();
console.log(`Current (peek): ${history.peek()}\n`);

history.forward();
console.log(`Current (peek): ${history.peek()}\n`);

history.visit("https://youtube.com");
history.forward(); // No forward history available
console.log(`Current (peek): ${history.peek()}\n`);
