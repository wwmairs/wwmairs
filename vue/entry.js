import { ref, watchEffect, computed } from "vue"
import Tags from "/vue/tags.js"


export default {
    props: ["entry"],
    components: {
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
        <div>
            <h4>{{ entry.name }}</h4>
            <span><i>{{ dateDisplay }}</i></span>
            <p>{{ entry.description }}</p>
            <Tags :tags="entry.Tags"></Tags>
            <div class="entry-photos">
                <img class="entry-img round-border"
                     v-for="photo in entry.Photos" 
                     :src=photopath(photo.path)>
            </div>
        </div>`
}
