import { ref, onMounted, computed, inject } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const CARTNAME = "wwmairs-cart";
        const entry = ref(props.entry);
        const { cart, saveCart, getCart } = inject("cart");

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

        return { entry, addToCart, cart }
    },
    template: `
        <div class="cart-button">
            <button @click="addToCart"><i>\${{ entry.price.toFixed(2) }}</i></button>

        </div>`
}
