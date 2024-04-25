import { ref, onMounted, computed, inject } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const CARTNAME = "wwmairs-cart";
        const entry = ref(props.entry);
        const cart = inject("cart");

        onMounted(() => {
            //checkInitCart();
        });

        function addToCart() {
            if (!(entry.value.id in cart.value.items)) {
                cart.value.items[entry.value.id] = {
                    "quantity": 0,
                    "name": entry.value.name,
                    "price": entry.value.price
                };
            }
            cart.value.items[entry.value.id].quantity++;
            saveCart();
        }

        function checkInitCart() {
            if (!(CARTNAME in localStorage)) {
                var blankCart = {
                    "items" : {},
                    "createdAt" : new Date(),
                };
                cart.value = blankCart;
                saveCart()
            } else {
                console.log("getting cart");
                getCart()
            }
        }

        function getCart() {
            var fromStorage = JSON.parse(localStorage.getItem(CARTNAME));
            cart.value = fromStorage;
            return fromStorage;
        }

        function saveCart() {
            localStorage.setItem(CARTNAME, JSON.stringify(cart.value));
        }

        return { entry, addToCart, cart }
    },
    template: `
        <div class="cart-button">
            <button @click="addToCart"><i>\${{ entry.price.toFixed(2) }}</i></button>

        </div>`
}
