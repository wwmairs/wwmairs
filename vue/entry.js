import { ref, watchEffect, computed } from "vue"
import Cart from "/vue/cart.js"
import CartButton from "/vue/cart-button.js"
import Tags from "/vue/tags.js"


export default {
    props: ["entry"],
    components: {
        Cart,
        CartButton,
        Tags
    },
    setup(props) {
        const entry = ref(props.entry);

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })

        function photopath(path) {
            return `../${path}`
        }
        return { entry, dateDisplay, photopath}
    },
    template: `
        <div class="entry">
            <div class="entry-photos">
                <img class="entry-img round-border"
                     v-for="photo in entry.Photos" 
                     :src=photopath(photo.path)>
            </div>
            <div class="entry-detils">
                <a :href="'/entry/' + entry.id"
                   class="noarrow">
                    <h4>{{ entry.name }}</h4>
                </a>
                <span><i>{{ dateDisplay }}</i></span>
                <Tags :tags="entry.Tags"></Tags>
                <p>{{ entry.description }}</p>
                <span v-if="entry.edition != 'null'" >
                    <i>edition of {{ entry.edition }}</i>
                </span>
                <p v-if="entry.selling">
                    <CartButton :entry="entry"></CartButton>
                </p>
            </div>
            <Cart></Cart>
        </div>`
}
