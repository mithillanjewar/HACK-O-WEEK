class ItemNode:
    def __init__(self, item_id, name, price):
        self.item_id = item_id
        self.name = name
        self.price = price
        self.next = None

class ShoppingCart:
    def __init__(self):
        self.head = None

    def insert_at_head(self, item_id, name, price):
        """Inserts a new item at the beginning of the cart (head)"""
        new_node = ItemNode(item_id, name, price)
        new_node.next = self.head
        self.head = new_node
        print(f"[Added] {name} at the head of the cart.")

    def insert_at_tail(self, item_id, name, price):
        """Inserts a new item at the end of the cart (tail)"""
        new_node = ItemNode(item_id, name, price)
        if not self.head:
            self.head = new_node
            print(f"[Added] {name} at the tail of the cart.")
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
        print(f"[Added] {name} at the tail of the cart.")

    def remove_by_id(self, item_id):
        """Removes an item from the cart by its ID"""
        current = self.head
        previous = None

        while current is not None:
            if current.item_id == item_id:
                if previous is None: # The node to remove is the head
                    self.head = current.next
                else:
                    previous.next = current.next
                print(f"[Removed] Item '{current.name}' (ID: {item_id}).")
                return
            previous = current
            current = current.next
        
        print(f"[Error] Item with ID {item_id} not found in the cart.")

    def display(self):
        """Displays all items in the cart and the total cost"""
        if not self.head:
            print("\nThe cart is empty.\n")
            return

        current = self.head
        total_price = 0.0
        
        print("\n" + "="*40)
        print("          SHOPPING CART          ")
        print("="*40)
        print(f"{'ID':<5} | {'Item Name':<15} | {'Price':<10}")
        print("-" * 40)
        
        while current:
            print(f"{current.item_id:<5} | {current.name:<15} | ${current.price:<10.2f}")
            total_price += current.price
            current = current.next
            
        print("-" * 40)
        print(f"TOTAL COST: ${total_price:.2f}")
        print("="*40 + "\n")


# ------------------------------
# Example Usage
# ------------------------------
if __name__ == "__main__":
    cart = ShoppingCart()

    # 1. Insert items at the tail
    cart.insert_at_tail(101, "Laptop", 1200.00)
    cart.insert_at_tail(102, "Mouse", 45.50)

    # 2. Insert item at the head
    cart.insert_at_head(103, "Keyboard", 80.00)

    # 3. Display the total list
    cart.display()

    # 4. Remove an item by ID
    cart.remove_by_id(102)

    # 5. Display the cart again
    cart.display()
    
    # 6. Try to remove an ID that doesn't exist
    cart.remove_by_id(999)
