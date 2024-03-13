import { ref, onMounted, computed } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const CARTNAME = "wwmairs-cart";
        const entry = ref(props.entry);
        const cart = ref({});

        onMounted(() => {
            checkInitCart();
        });

        function addToCart() {
            if (!cart.value.hasOwnProperty(entry.value.id)) {
                cart.value[entry.value.id] = {
                    "quantity": 0,
                    "name": entry.name,
                    "price": entry.price
                };
            }
            cart.value[entry.value.id].quantity++;
            saveCart();
        }


        function checkInitCart() {
            if (!localStorage.hasOwnProperty(CARTNAME)) {
                var blankCart = {
                    "items" : {},
                    "createdAt" : new Date(),
                };
                cart.value = blankCart;
                saveCart()
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
            <button @click="addToCart"><i>\${{ entry.price.toFixed(2) }}</button>

        </div>`
}
