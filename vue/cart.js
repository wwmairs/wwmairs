import { ref, onMounted, computed, inject } from "vue"

export default {
    setup() {
        const CARTNAME = "wwmairs-cart";
        const cart = inject("cart");

        onMounted(() => {
            checkInitCart();
        });

        function checkInitCart() {
            if (!(CARTNAME in localStorage)) {
                console.log("hi");
                var blankCart = {
                    "items": {},
                    "createdAt": new Date(),
                };
                cart.value = blankCart;
                saveCart();
            } else {
                getCart();
            }

        }

        function saveCart() {
            localStorage.setItem(CARTNAME, JSON.stringify(cart.value));
        }

        function getCart() {
            var fromStorage = JSON.parse(localStorage.getItem(CARTNAME));
            cart.value = fromStorage;
            return fromStorage;
        }

        function removeItem(itemId) {
            delete cart.value.items[itemId];
            saveCart();
        }

        function increaseItem(itemId) {
            cart.value.items[itemId].quantity++;
            saveCart();
        }

        function decreaseItem(itemId) {
            if (cart.value.items[itemId].quantity > 1) {
                cart.value.items[itemId].quantity--;
            } else {
                delete cart.value.items[itemId]
            }
            saveCart();
        }

        return { cart, increaseItem, decreaseItem, removeItem }
    },
    template: `
        <div class="cart">
            <h6>cart</h6>
            <div v-for="item, id in cart.items">
                <span>{{ item.name }}: <span>
                <i @click="decreaseItem(id)">--</i>
                <span>{{ item.quantity }}</span>
                <i @click="increaseItem(id)">++</i>
                <i @click="removeItem(id)">x</i>
            </div>
        </div>`
}
