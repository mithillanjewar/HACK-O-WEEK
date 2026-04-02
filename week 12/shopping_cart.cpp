#include <iostream>
#include <string>
#include <iomanip>

using namespace std;

// Node structure to represent each item in the cart
struct ItemNode {
    int id;
    string name;
    double price;
    ItemNode* next;

    ItemNode(int id, string name, double price) {
        this->id = id;
        this->name = name;
        this->price = price;
        this->next = nullptr;
    }
};

class ShoppingCart {
private:
    ItemNode* head;

public:
    ShoppingCart() {
        head = nullptr;
    }

    // Insert an item at the beginning of the list
    void insert_at_head(int id, string name, double price) {
        ItemNode* newNode = new ItemNode(id, name, price);
        newNode->next = head;
        head = newNode;
        cout << "[Added] " << name << " at the head of the cart." << endl;
    }

    // Insert an item at the end of the list
    void insert_at_tail(int id, string name, double price) {
        ItemNode* newNode = new ItemNode(id, name, price);
        if (head == nullptr) {
            head = newNode;
        } else {
            ItemNode* temp = head;
            while (temp->next != nullptr) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
        cout << "[Added] " << name << " at the tail of the cart." << endl;
    }

    // Remove an item by its unique ID
    void remove_by_id(int id) {
        if (head == nullptr) {
            cout << "Cart is empty. Cannot remove." << endl;
            return;
        }

        // If the item to be removed is the head node
        if (head->id == id) {
            ItemNode* temp = head;
            head = head->next;
            cout << "[Removed] Item " << temp->name << " (ID: " << id << ")" << endl;
            delete temp;
            return;
        }

        ItemNode* current = head;
        ItemNode* previous = nullptr;

        while (current != nullptr && current->id != id) {
            previous = current;
            current = current->next;
        }

        // If the item ID was not found
        if (current == nullptr) {
            cout << "[Error] Item with ID " << id << " not found." << endl;
            return;
        }

        previous->next = current->next;
        cout << "[Removed] Item " << current->name << " (ID: " << id << ")" << endl;
        delete current;
    }

    // Display all items and the total cost
    void display() {
        if (head == nullptr) {
            cout << "\nThe cart is empty.\n" << endl;
            return;
        }

        ItemNode* temp = head;
        double total = 0.0;
        
        cout << "\n========================================" << endl;
        cout << "             SHOPPING CART              " << endl;
        cout << "========================================" << endl;
        cout << left << setw(6) << "ID" << "| " << setw(15) << "Item Name" << "| Price" << endl;
        cout << "----------------------------------------" << endl;
        
        while (temp != nullptr) {
            cout << left << setw(6) << temp->id << "| " 
                 << setw(15) << temp->name << "| $" 
                 << fixed << setprecision(2) << temp->price << endl;
                 
            total += temp->price;
            temp = temp->next;
        }
        cout << "----------------------------------------" << endl;
        cout << "TOTAL COST: $" << total << endl;
        cout << "========================================\n" << endl;
    }

    // Destructor to free memory
    ~ShoppingCart() {
        ItemNode* current = head;
        while (current != nullptr) {
            ItemNode* next = current->next;
            delete current;
            current = next;
        }
    }
};

int main() {
    ShoppingCart cart;

    // 1. Insert items at the tail
    cart.insert_at_tail(101, "Laptop", 1200.00);
    cart.insert_at_tail(102, "Mouse", 45.50);

    // 2. Insert an item at the head
    cart.insert_at_head(103, "Keyboard", 80.00);
    
    // 3. Display the cart
    cart.display();

    // 4. Remove an item by ID
    cart.remove_by_id(102);
    
    // 5. Display the cart again
    cart.display();
    
    // 6. Try to remove an item that doesn't exist
    cart.remove_by_id(999);

    return 0;
}
