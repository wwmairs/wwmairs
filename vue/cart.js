import { ref, onBeforeMount, onMounted, computed, inject, watch} from "vue"

export default {
    setup() {
        const CARTNAME = "wwmairs-cart";
        const cart = inject("cart");
        const show = ref(false)

       // watch(cart, (cart, old) => showCart());

        onMounted(() => {
        });

        onBeforeMount(() => {
            checkInitCart();
        });


        const total = computed(() => {
            var items = Object.values(cart.value.items);
            return items.reduce((t, i) => {
                return t + (i.price * i.quantity);
            }, 0);
        });

        function checkInitCart() {
            if (!(CARTNAME in localStorage)) {
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

        function toggleCart() {
            show.value = !show.value;
        }

        function showCart() {
            show.value = true;
        }

        return { 
            cart, 
            increaseItem, 
            decreaseItem, 
            removeItem,
            total,
            toggleCart,
            show
        }
    },
    template: `
        <div class="cart">
            <div class="cart-line-items"
                 :class="{ hidden: !show}">
                <div class="cart-line-item">
                    <h4>cart</h4>
                    <h4>~</h4>
                </div>
                <div v-for="item, id in cart.items"
                     class="cart-line-item">
                    <span>{{ item.name }}</span>
                    <span>
                        <input type="number" min="0" v-model="item.quantity"></input>
                        <span @click="removeItem(id)"
                           class="btn">&times;</span>
                    </span>
                    <span class="line-item-price">{{ item.price.toFixed(2) }}</span>
                </div>
                <div class="cart-line-item cart-total-line">
                    <span>total</span>
                    <span class="cart-total">\${{ total.toFixed(2) }}</span>
                </div>
                <div class="checkout-button">
                    <button>buy em'!</button>
                </div>
            </div>
            <div @click="toggleCart()" class="cart-header">
                <h2>
                    {{ show ? "X" : "cart" }}
                </h2>
            </div>
        </div>`
}
