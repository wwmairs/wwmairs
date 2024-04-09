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
        <div class="entries-by-tag">
            <div class="block">
                <a :name="tagname + 's'"
                    class="noarrow"></a>
                <a :href="'/entry/' + first.id"
                   :name="first.name"
                   class="img-link noarrow">
                    <img v-for="photo in first.Photos"
                         :src="photo.path"
                         class="round-border entry-img display-imgs"/>
                </a>
            </div>
            <a :href="'/things/' + tagname" 
               class="noarrow">
                <h1 class="full-width-label"> more {{ tagname }}s </h1>
            </a>
            <div class="block grid">
                <div class="col-1">
                    <EntryTile v-for="entry, i in rest.filter((e,i)=>i%2-1)"
                               :entry="entry"></EntryTile>
                </div>
                <div :class="col-2">
                    <EntryTile v-for="entry, i in rest.filter((e,i)=>i%2)"
                               :entry="entry"></EntryTile>
                </div>
            </div>
        </div>`
}
