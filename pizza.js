document.addEventListener("alpine:init", () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'Perfect Pizza',
            slogan: 'Deliciously Crafted, Perfectly Savored: Your Slice of Pizza Perfection!',
            pizzas: [],
            username: 'princemakhesha',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0.00,
            message: '',
            openCart: false,
            createCart() {
                const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                return axios.get(createCartURL).then(result => {
                    this.cartId = result.data.cart_code;
                })
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
                        .then((result) => {
                            this.cartId = result.data.cart_code;
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