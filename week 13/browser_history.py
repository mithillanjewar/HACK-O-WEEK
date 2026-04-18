class BrowserHistory:
    def __init__(self, homepage: str):
        # We use two stacks to manage history
        self.back_stack = []
        self.forward_stack = []
        self.current_page = homepage

    def visit(self, url: str) -> None:
        """Visits a new URL."""
        print(f"Visiting: {url}")
        # Push the current page to the back stack
        self.back_stack.append(self.current_page)
        # Update current page
        self.current_page = url
        # Clear forward history when a new page is visited
        self.forward_stack.clear()

    def back(self) -> str:
        """Navigates back to the previous URL."""
        if not self.back_stack:
            print("No history to go back to.")
            return self.current_page
        
        # Push the current page to the forward stack
        self.forward_stack.append(self.current_page)
        # Pop from back stack and set as current
        self.current_page = self.back_stack.pop()
        
        print(f"Went back to: {self.current_page}")
        return self.current_page

    def forward(self) -> str:
        """Navigates forward to the next URL."""
        if not self.forward_stack:
            print("No forward history.")
            return self.current_page
            
        # Push the current page to the back stack
        self.back_stack.append(self.current_page)
        # Pop from forward stack and set as current
        self.current_page = self.forward_stack.pop()
        
        print(f"Went forward to: {self.current_page}")
        return self.current_page

    def peek(self) -> str:
        """Returns the current page without navigating."""
        return self.current_page

# --- Example Usage ---
if __name__ == "__main__":
    print("--- Browser History Simulation ---")
    history = BrowserHistory("https://google.com")
    print(f"Current (peek): {history.peek()}\n")
    
    # User visits a few pages
    history.visit("https://github.com")
    history.visit("https://stackoverflow.com")
    print(f"\nCurrent (peek): {history.peek()}\n")
    
    # User clicks 'Back' twice
    history.back()
    history.back()
    print(f"Current (peek): {history.peek()}\n")
    
    # User clicks 'Forward'
    history.forward()
    print(f"Current (peek): {history.peek()}\n")
    
    # User visits a new page, which clears forward history
    history.visit("https://youtube.com")
    history.forward() # Should show no forward history
    print(f"Current (peek): {history.peek()}\n")
