
let users = JSON.parse(localStorage.getItem("users")) || [];
let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];



let adminEmail = "admin@gmail.com";
let adminPassword = "admin123";

function signUp() {
    let accountType = document.getElementById("account-type");
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let password = document.getElementById("password");
    let restaurant = document.getElementById("restaurant-name");

    let user = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        accountType: accountType.value
    };

    let restaurantData = {
        restaurantName: restaurant.value,
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        accountType: accountType.value
    };

    let userValid = accountType.value === "user" && name.value && email.value && phone.value && password.value;
    let restaurantValid = accountType.value === "restaurant" && name.value && email.value && phone.value && password.value && restaurant.value;

    if (userValid || restaurantValid) {
        let emailExists = false;

        if (email.value === adminEmail) {
            emailExists = true;
        }

        for (let i = 0; i < users.length; i++) {
            console.log(users[i].email);

            if (users[i].email === email.value) {
                emailExists = true;
                break;
            }
        }

        for (let j = 0; j < restaurants.length; j++) {
            console.log(restaurants[j].email);
            if (restaurants[j].email === email.value) {
                emailExists = true;
                break;
            }
        }

        if (emailExists) {
            Swal.fire({
                title: "Error",
                text: "Email already exists",
                icon: "error"
            });
            return;
        }

        if (accountType.value === "user") {
            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));
        } else {
            restaurants.push(restaurantData);
            localStorage.setItem("restaurants", JSON.stringify(restaurants));
        }

        Swal.fire({
            title: "Sign Up Success",
            text: "Redirecting to login...",
            icon: "success"
        }).then(() => {
            window.location.href = "./login.html";
        });

    } else {
        Swal.fire({
            title: "Error",
            text: "Please fill all the fields",
            icon: "error"
        });
    }
}


function login() {
    let loginEmail = document.getElementById("login-email");
    let loginPassword = document.getElementById("login-password");
    if (loginEmail.value !== "" && loginPassword.value !== "") {
        if (loginEmail.value === adminEmail && loginPassword.value === adminPassword) {
            localStorage.setItem("loggedInAdmin", JSON.stringify({ email: adminEmail, password: adminPassword, accountType: "admin", }));
            Swal.fire({
                title: "Login Success",
                text: "Redirecting to Admin Dashboard...",
                icon: "success"
            }).then(() => {
                window.location.href = "./admin.html";
            });
            return;
        }

        let userFound = users.filter(function (data) {
            return data.email === loginEmail.value && data.password === loginPassword.value;

        })
        let restaurantFound = restaurants.filter(function (data) {
            return data.email === loginEmail.value && data.password === loginPassword.value;
        })
        if (userFound.length > 0) {
            localStorage.setItem("loggedInUser", JSON.stringify(userFound[0]));
            Swal.fire({
                title: "Login Success",
                text: "Redirecting to Dashborad...",
                icon: "success"
            }).then(() => {
                window.location.href = "./user.html";
            });
        } else if (restaurantFound.length > 0) {
            localStorage.setItem("loggedInUser", JSON.stringify(restaurantFound[0]));
            Swal.fire({
                title: "Login Success",
                text: "Redirecting to Dashborad...",
                icon: "success"
            }).then(() => {
                window.location.href = "./restaurant.html";
            });
        }
        else {
            Swal.fire({
                title: "Credentials Not Match",
                text: "Check Your Email and Password",
                icon: "error"
            });
        }

    } else {
        Swal.fire({
            title: "Error",
            text: "Please fill all the fields",
            icon: "error"
        });
    }



}


function renderProduct() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    // console.log(loggedInUser);

    let userEmail = loggedInUser.email;
    // console.log(userEmail);

    let productsGrid = document.getElementById("productsGrid")
    productsGrid.innerHTML = ""


    let products = JSON.parse(localStorage.getItem("products_" + userEmail)) || [];

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-message">No products added yet</p>';
    }


    // for (let key in products) {
    //     console.log(products[key]);

    // }
    for (let i = 0; i < products.length; i++) {
        console.log(products[i]);
        console.log(i);


        let prooduct = products[i];
        let productCard = document.createElement('div');
        productCard.className = "product-card";
        productCard.innerHTML += `
    <img src="${prooduct.image}" alt="${prooduct.name}" class="product-img">
    <div class="product-info">
        <h3 class="product-name">${prooduct.name}</h3>
        <p class="product-price">Rs ${prooduct.price}</p>
        <div class="product-actions">
            <button class="edit-btn" onclick="editItem(${i})">Edit</button>
            <button class="delete-btn" onclick="delItem(${i})">Delete</button>
        </div>
    </div>
`;

        productsGrid.appendChild(productCard);

    }

}
function delItem(e) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            let userEmail = loggedInUser.email;
            let products = JSON.parse(localStorage.getItem("products_" + userEmail)) || [];


            products.splice(e, 1);

            // Update localStorage
            localStorage.setItem("products_" + userEmail, JSON.stringify(products));


            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            ).then(() => {

                renderProduct();
                
            });
        }
    });
}
let editingIndex = null;

function editItem(index) {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;

    let products = JSON.parse(localStorage.getItem("products_" + userEmail)) || [];
    let product = products[index];


    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productImage").value = product.image;
    document.getElementById("productId").value = product.id;

    editingIndex = index;
}
function addProduct() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;

    let productName = document.getElementById("productName");
    let productPrice = document.getElementById("productPrice");
    let productDescription = document.getElementById("productDescription");
    let productCategory = document.getElementById("productCategory");
    let productImage = document.getElementById("productImage");

    let product = {
        id: editingIndex !== null ? parseInt(document.getElementById("productId").value) : Math.floor(Math.random() * 1000000),
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value,
        category: productCategory.value,
        image: productImage.value
    };

    let fieldsCheck = productName.value !== "" && productPrice.value !== "" &&
        productDescription.value !== "" && productCategory.value !== "" &&
        productImage.value !== "";

    if (fieldsCheck) {
        let products = JSON.parse(localStorage.getItem("products_" + userEmail)) || [];

        let msg;
        if (editingIndex !== null) {
            products[editingIndex] = product;
            msg = "Product Updated";
            editingIndex = null; 
        } else {
            products.push(product);
            msg = "Product Added";
        }

        localStorage.setItem("products_" + userEmail, JSON.stringify(products));

        Swal.fire({
            title: msg,
            text: "Product Saved Successfully",
            icon: "success"
        }).then(() => {
            productName.value = "";
            productPrice.value = "";
            productDescription.value = "";
            productCategory.value = "";
            productImage.value = "";
            document.getElementById("productId").value = "";

            renderProduct();
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Please fill all the fields",
            icon: "error"
        });
    }
}

let allProducts = [];
function renderFoodItems() {
    const foodGrid = document.getElementById('foodGrid');
    foodGrid.innerHTML = '';

    let restaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
    // let allProducts = [];

    // Loop through each restaurant
    for (let i = 0; i < restaurants.length; i++) {
        let restaurant = restaurants[i];
        let restaurantEmail = restaurant.email;
        let restaurantName = restaurant.restaurantName;

        let products = JSON.parse(localStorage.getItem("products_" + restaurantEmail)) || [];

        // Loop through each product of this restaurant
        for (let j = 0; j < products.length; j++) {
            let product = products[j];
            product.restaurantName = restaurantName;
            allProducts.push(product);
        }
    }

    localStorage.setItem("allProduct", JSON.stringify(allProducts));

    if (allProducts.length === 0) {
        foodGrid.innerHTML = '<p class="empty-cart-message">No products found</p>';

    } else {

    }

    for (let k = 0; k < allProducts.length; k++) {
        let product = allProducts[k];
        console.log(product.id);

        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML += `
            <img src="${product.image}" alt="${product.name}" class="food-img">
            <div class="food-info">
                <h3 class="food-name">${product.name}</h3>
                <h3 class="food-name">${"Restaurant " + product.restaurantName}</h3>
                <p class="food-desc">${product.description}</p>
                <p class="food-price">Rs ${product.price}</p>
                <button class="add-to-cart" onclick="addCart(${k})">Add to Cart</button>
            </div>
        `;
        foodGrid.appendChild(foodCard);
    }
}
function addCart(e) {
    let allProducts = JSON.parse(localStorage.getItem("allProduct")) || [];
    let product = allProducts[e];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];


    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        Swal.fire({

            icon: 'info',
            title: 'Item already in cart',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    let cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        quantity: 1
    };

    cart.push(cartItem);
    localStorage.setItem("cart_" + userEmail, JSON.stringify(cart));

    updateCartCount();
    cartItems();

    Swal.fire({

        icon: 'success',
        title: 'Added to cart',
        showConfirmButton: false,
        timer: 1500
    });
}


function updateCartCount() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];
    let cartCountt = document.getElementById("cartCount");

    // ✅ Sum of all item quantities
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountt.innerHTML = totalItems;
}


function cartItems() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];
    let cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = '';
        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">Rs ${item.price}</p>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <p class="remove-item" data-id="${item.id}">Remove</p>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }


        attachCartEvents();

        updateCartSummary();
    }
}
cartItems()

function attachCartEvents() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];

    let plusButtons = document.getElementsByClassName("quantity-btn plus");
    for (let i = 0; i < plusButtons.length; i++) {
        plusButtons[i].onclick = function () {
            let id = parseInt(this.getAttribute("data-id"));
            for (let j = 0; j < cart.length; j++) {
                if (cart[j].id === id) {
                    cart[j].quantity++;
                    break;
                }
            }
            localStorage.setItem("cart_" + userEmail, JSON.stringify(cart));
            cartItems();
            // updateCartCount();
        };
    }

    let minusButtons = document.getElementsByClassName("quantity-btn minus");
    for (let i = 0; i < minusButtons.length; i++) {
        minusButtons[i].onclick = function () {
            let id = parseInt(this.getAttribute("data-id"));
            for (let j = 0; j < cart.length; j++) {
                if (cart[j].id === id) {
                    if (cart[j].quantity > 1) {
                        cart[j].quantity--;
                    } else {
                        cart.splice(j, 1);
                    }
                    break;
                }
            }
            localStorage.setItem("cart_" + userEmail, JSON.stringify(cart));
            cartItems();
            updateCartCount();
        };
    }

    let removeItems = document.getElementsByClassName("remove-item");
    for (let i = 0; i < removeItems.length; i++) {
        removeItems[i].onclick = function () {
            let id = parseInt(this.getAttribute("data-id"));
            for (let j = 0; j < cart.length; j++) {
                if (cart[j].id === id) {
                    cart.splice(j, 1);
                    break;
                }
            }
            localStorage.setItem("cart_" + userEmail, JSON.stringify(cart));
            cartItems();
            updateCartCount();
        };
    }
}


function closee() {
    document.getElementById("checkoutSidebar").style.display = "none";
    // alert("hello")
}
function toggleCart() {
    // alert("hello")
    document.getElementById("checkoutSidebar").style.display = "block";
    // document.getElementById("cartSidebar").style.display = "block";
}

function updateCartSummary() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }

    let deliveryFee = 99;
    let total = subtotal + deliveryFee;

    // DOM elements update karein
    document.getElementById("subtotal").innerText = "Rs " + subtotal;
    document.getElementById("total").innerText = "Rs " + total;
}
cartItems();
updateCartSummary();

function checkOut() {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let userEmail = loggedInUser.email;
    let cart = JSON.parse(localStorage.getItem("cart_" + userEmail)) || [];

    if (cart.length === 0) {
        Swal.fire({
            title: 'Empty Cart',
            text: 'Your cart is empty. Please add items before checkout.',
            icon: 'warning'
        });
        return;
    }

    let totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    let deliveryFee = 99;
    let grandTotal = totalAmount + deliveryFee;

    Swal.fire({
        title: 'Confirm Order',
        html: `
            <div style="text-align:left; margin:10px 0;">
                <p><strong>Items:</strong> ${cart.length}</p>
                <p><strong>Subtotal:</strong> Rs ${totalAmount}</p>
                <p><strong>Delivery Fee:</strong> Rs ${deliveryFee}</p>
                <p><strong>Total:</strong> Rs ${grandTotal}</p>
            </div>
            <p>Are you sure you want to place this order?</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#e21b70',
        cancelButtonColor: '#666',
        confirmButtonText: 'Place Order',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Create new order
            let newOrder = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                items: cart,
                totalAmount: grandTotal
            };

            // Save to orders
            let existingOrders = JSON.parse(localStorage.getItem("order_" + userEmail)) || [];
            existingOrders.push(newOrder);
            localStorage.setItem("order_" + userEmail, JSON.stringify(existingOrders));

            localStorage.removeItem("cart_" + userEmail);

            // Update UI
            updateCartCount();
            cartItems();
            updateCartSummary();

            Swal.fire({
                title: 'Order Placed!',
                text: 'Your order has been placed successfully',
                icon: 'success'
            }).then(() => {

                closee();
            });
        }
    });
}
function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from your account",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e21b70',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("loggedInAdmin");

            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out',
                icon: 'success'
            }).then(() => {

                window.location.href = "./login.html";
            });
        }
    });
}


function searchItem() {

    var searchInput = document.getElementById("search").value.toLowerCase();

    var foodGrid = document.getElementById("foodGrid");
    

    let allProducts = JSON.parse(localStorage.getItem("allProduct")) || [];
    

    var searchResults = allProducts.filter(function(product) {
        return (
            product.name.toLowerCase().includes(searchInput) ||
            product.description.toLowerCase().includes(searchInput) ||
            product.restaurantName.toLowerCase().includes(searchInput) ||
            product.price.toString().includes(searchInput)
        );
    });


    foodGrid.innerHTML = '';

    // If no results found
    if (searchResults.length === 0) {
        foodGrid.innerHTML = '<p class="empty-message">No items found matching your search</p>';
        return;
    }

    // Display the search results
    searchResults.forEach(product => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="food-img">
            <div class="food-info">
                <h3 class="food-name">${product.name}</h3>
                <h3 class="food-name">${"Restaurant " + product.restaurantName}</h3>
                <p class="food-desc">${product.description}</p>
                <p class="food-price">Rs ${product.price}</p>
                <button class="add-to-cart" onclick="addCart(${allProducts.indexOf(product)})">Add to Cart</button>
            </div>
            
        `;
        foodGrid.appendChild(foodCard);
    });
}
