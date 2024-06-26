import { ref, onBeforeMount, onMounted, computed, inject, watch } from "vue"

export default {
    setup() {
        const { 
            cart, 
            checkInitCart, 
            saveCart, 
            getCart, 
            removeItem,
            setItemQuantity,
        } = inject("cart");
        const show = ref(false)
        const updated = ref(false);


        onMounted(() => {
            watch(cart, (cart, old) => showUpdated(), {deep: true});
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


        function toggleCart() {
            show.value = !show.value;
            updated.value = false;
        }

        function showCart() {
            show.value = true;
        }

        function showUpdated() {
             updated.value = true && !show.value;
        }

        return { 
            cart, 
            removeItem,
            setItemQuantity,
            total,
            toggleCart,
            show,
            updated
        }
    },
    template: `
        <div :class="{ cart, hidden: Object.keys(cart.items).length == 0}">
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
                        <input type="number" min="0" 
                               v-model="item.quantity"
                               @change="setItemQuantity(id, item.quantity)"></input>
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
                    <a class="button noarrow" href="/checkout">buy em'!</a>
                </div>
            </div>
            <div @click="toggleCart()" class="cart-header">
                <h2>
                    {{ show ? "X" : "cart" }}
                </h2>
                <span v-if="updated"
                      class="red-badge">
                </span>
            </div>
        </div>`
}
