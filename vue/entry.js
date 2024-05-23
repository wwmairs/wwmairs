import { ref, watchEffect, computed } from "vue"
import CartButton from "/vue/cart-button.js"
import Tags from "/vue/tags.js"


export default {
    props: ["id"],
    components: {
        CartButton,
        Tags
    },
    setup(props) {
        const url = "/entry/get/";
        const entryID = props.id;
        const entry = ref({"name": "loading", "description": "...", "date": "0000-00-00T00:00:00.000Z"});

        watchEffect(async() => {
            var full_url = `${url}${entryID}`;
            var res = await (await fetch(full_url)).json();
            entry.value = res.entry;
        });

        
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
            <div class="entry-details">
                <h4>
                    <a :href="'/entry/' + entry.id"
                       class="noarrow">
                       {{ entry.name }}
                    </a>
                </h4>
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
        </div>`
}
