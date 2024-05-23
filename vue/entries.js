import { ref, watchEffect, computed } from "vue"
import EntryTile from "/vue/entry-tile.js"


export default {
    props: ["tagname"],
    components: {
        EntryTile,
    },
    setup(props) {
        const url = "/entry/tag/";
        const entries = ref([]);
        const tagname = ref(props.tagname)

        watchEffect(async () => {
            var full_url = `${url}${tagname.value}`;
            entries.value = await (await fetch(full_url)).json()
        })

        const first = computed(() => {
            return entries.value[0] ?? { "id": "", "Photos": []}
        })

        const rest = computed(() => {
            return entries.value.slice(1, 5);
        })

        return { entries, first, rest }
    },
    template: `
        <div class="entries">
            <div class="horizontal-grid">
                    <EntryTile v-for="entry in entries"
                               :entry="entry"></EntryTile>
            </div>
        </div>`
}
