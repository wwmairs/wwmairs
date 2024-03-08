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
            return entries.value.slice(1);
        })

        return { entries, first, rest }
    },
    template: `
        <div class="entries-by-tag">
            <div class="block">
                <a :href="'/entry/' + first.id"
                   :name="first.name"
                   class="img-link noarrow">
                    <img v-if="first.Photos.length"
                         :src="first.Photos[0].path"
                         class="round-border entry-img"/>
                </a>
            </div>
            <a :href="'/things/' + tagname" 
               class="noarrow">
                <h1 class="full-width-label"> more {{ tagname }}s </h1>
            </a>
            <div class="block">
                <EntryTile v-for="entry in rest"
                           :entry="entry"></EntryTile>
            </div>
        </div>`
}
