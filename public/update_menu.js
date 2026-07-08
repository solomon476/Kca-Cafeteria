const fs = require('fs');

const originalFoodGrid = `
                <!-- Card 1 -->
                <div class="food-card" data-category="lunch">
                    <img src="images/chicken_and_rice.png" alt="Chicken &amp; Rice" class="food-img">
                    <div class="food-info">
                        <h3>Chicken &amp; Rice</h3>
                        <p class="price">KES 150</p>
                        <button class="btn-add" onclick="addToCart('Chicken & Rice', 150)">+ Add</button>
                    </div>
                </div>
                <!-- Card 2 -->
                <div class="food-card" data-category="drinks">
                    <img src="images/fresh_juice.png" alt="Fresh Juice" class="food-img">
                    <div class="food-info">
                        <h3>Fresh Juice</h3>
                        <p class="price">KES 80</p>
                        <button class="btn-add" onclick="addToCart('Fresh Juice', 80)">+ Add</button>
                    </div>
                </div>
                <!-- Card 3 -->
                <div class="food-card" data-category="lunch">
                    <img src="images/beef_burger.png" alt="Beef Burger" class="food-img">
                    <div class="food-info">
                        <h3>Beef Burger</h3>
                        <p class="price">KES 200</p>
                        <button class="btn-add" onclick="addToCart('Beef Burger', 200)">+ Add</button>
                    </div>
                </div>
                <!-- Card 4 -->
                <div class="food-card" data-category="drinks">
                    <img src="images/coffee.png" alt="Coffee" class="food-img">
                    <div class="food-info">
                        <h3>Coffee</h3>
                        <p class="price">KES 50</p>
                        <button class="btn-add" onclick="addToCart('Coffee', 50)">+ Add</button>
                    </div>
                </div>
                <!-- Card 5 -->
                <div class="food-card" data-category="breakfast">
                    <img src="images/pancakes.png" alt="Pancakes" class="food-img">
                    <div class="food-info">
                        <h3>Pancakes</h3>
                        <p class="price">KES 100</p>
                        <button class="btn-add" onclick="addToCart('Pancakes', 100)">+ Add</button>
                    </div>
                </div>
                <!-- Card 6 -->
                <div class="food-card" data-category="lunch">
                    <img src="images/fries.png" alt="Fries" class="food-img">
                    <div class="food-info">
                        <h3>Fries</h3>
                        <p class="price">KES 120</p>
                        <button class="btn-add" onclick="addToCart('Fries', 120)">+ Add</button>
                    </div>
                </div>
                <!-- Card 7 -->
                <div class="food-card" data-category="breakfast">
                    <img src="images/eggs_toast.png" alt="Eggs &amp; Toast" class="food-img">
                    <div class="food-info">
                        <h3>Eggs &amp; Toast</h3>
                        <p class="price">KES 150</p>
                        <button class="btn-add" onclick="addToCart('Eggs & Toast', 150)">+ Add</button>
                    </div>
                </div>
                <!-- Card 8 -->
                <div class="food-card" data-category="drinks">
                    <img src="images/coca_cola.png" alt="Coca Cola" class="food-img">
                    <div class="food-info">
                        <h3>Soda</h3>
                        <p class="price">KES 60</p>
                        <button class="btn-add" onclick="addToCart('Soda', 60)">+ Add</button>
                    </div>
                </div>
                <!-- Card 9 -->
                <div class="food-card" data-category="lunch">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60" alt="Pizza" class="food-img">
                    <div class="food-info">
                        <h3>Pizza Slice</h3>
                        <p class="price">KES 150</p>
                        <button class="btn-add" onclick="addToCart('Pizza Slice', 150)">+ Add</button>
                    </div>
                </div>
                <!-- Card 10 -->
                <div class="food-card" data-category="breakfast">
                    <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60" alt="Cake" class="food-img">
                    <div class="food-info">
                        <h3>Cake Slice</h3>
                        <p class="price">KES 120</p>
                        <button class="btn-add" onclick="addToCart('Cake Slice', 120)">+ Add</button>
                    </div>
                </div>
                <!-- Card 11 -->
                <div class="food-card" data-category="breakfast">
                    <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=60" alt="Donuts" class="food-img">
                    <div class="food-info">
                        <h3>Donuts (2 pcs)</h3>
                        <p class="price">KES 100</p>
                        <button class="btn-add" onclick="addToCart('Donuts (2 pcs)', 100)">+ Add</button>
                    </div>
                </div>
                <!-- Card 12 -->
                <div class="food-card" data-category="fruits">
                    <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=60" alt="Fruit Bowl" class="food-img">
                    <div class="food-info">
                        <h3>Fruit Bowl</h3>
                        <p class="price">KES 150</p>
                        <button class="btn-add" onclick="addToCart('Fruit Bowl', 150)">+ Add</button>
                    </div>
                </div>
                <!-- Card 13 -->
                <div class="food-card" data-category="lunch">
                    <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=60" alt="Indomie Noodles" class="food-img">
                    <div class="food-info">
                        <h3>Indomie Noodles</h3>
                        <p class="price">KES 80</p>
                        <button class="btn-add" onclick="addToCart('Indomie Noodles', 80)">+ Add</button>
                    </div>
                </div>
                <!-- Card 14 -->
                <div class="food-card" data-category="fruits">
                    <img src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=60" alt="Lemon Juice" class="food-img">
                    <div class="food-info">
                        <h3>Lemon Juice</h3>
                        <p class="price">KES 80</p>
                        <button class="btn-add" onclick="addToCart('Lemon Juice', 80)">+ Add</button>
                    </div>
                </div>
`;

let content = fs.readFileSync('index.html', 'utf8');
const startIndex = content.indexOf('<div class="food-grid">');
const endIndex = content.indexOf('<div class="sticky-cart"', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    let newContent = content.substring(0, startIndex + 23) + originalFoodGrid + '            </div>\n\n            ' + content.substring(endIndex);
    fs.writeFileSync('index.html', newContent, 'utf8');
    console.log("Restored original menu successfully.");
} else {
    console.error("Could not find boundaries.");
}
