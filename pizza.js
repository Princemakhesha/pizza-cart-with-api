document.addEventListener("alpine:init", () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'Perfect Pizza',
            slogan: 'Deliciously Crafted, Perfectly Savored: Your Slice of Pizza Perfection!',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0.00,
            message: '',
            openCart: false,
            Login() {
                if (this.username.length > 2) {
                    localStorage['username'] = this.username;
                    this.createCart();
                } else {
                    alert("Username is too short")
                }
            },
            Logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    localStorage['username'] = '';
                }
            },
            createCart() {
                if (!this.username) {
                    // this.cartId = 'No username to create a cart'
                    return Promise.resolve();;
                }

                const cartId = localStorage['cartId'];

                if (cartId) {
                    this.cartId = cartId;
                    return Promise.resolve();
                } else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code;
                            localStorage['cartId'] = this.cartId;
                        });
                }
            },
            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL)
            },
            addPizza(pizzaId) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },
            removePizza(pizzaId) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/remove`, {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },
            pay(amount) {
                return axios.post(`https://pizza-api.projectcodex.net/api/pizza-cart/pay`,
                    {
                        "cart_code": this.cartId,
                        amount
                    });
            },
            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                });
            },

            init() {
                const storedUsername = localStorage['username'];
                if (storedUsername) {
                    this.username = storedUsername;
                }

                axios
                    .get(`https://pizza-api.projectcodex.net/api/pizzas`)
                    .then(result => {
                        // code here
                        //console.log(result.data);
                        this.pizzas = result.data.pizzas
                        //code here...
                    });

                if (!this.cartId) {
                    this
                        .createCart()
                        .then(() => {
                            this.showCartData();
                        })
                }
                // this.showCartData();
            },
            addPizzaToCart(pizzaId) {
                // alert(pizzaId)
                this.addPizza(pizzaId)
                    .then(this.showCartData())
            },
            removePizzaFromCart(pizzaId) {
                // alert(pizzaId)
                this.removePizza(pizzaId)
                    .then(this.showCartData())

            },
            payForCart() {
                // alert("pay now : " + this.paymentAmount)
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);
                        } else {
                            this.message = 'payment Received!';

                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00
                                this.cardId = ''
                                this.paymentAmount = 0;
                                localStorage['cartId'] = '';
                                this.createCart();
                            }, 3000);

                            // console.log(result.data)
                        }

                    })
            }

        }
    });
});

// Correct