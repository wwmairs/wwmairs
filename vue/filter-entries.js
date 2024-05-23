import { ref, watchEffect, computed } from "vue"
import EntryTile from "/vue/entry-tile.js"


export default {
    components: {
        EntryTile,
    },
    setup(props) {
        const url = "/entries/";
        const entries = ref([]);
        const availableTags = ref([]);

        watchEffect(async () => {
            var res = await (await fetch(url)).json()
            entries.value = res.entries;
            availableTags.value = res.tags;
        });

        const selectedTags = computed(() => {
            return availableTags.value.filter((t) => {
                return t.selected;
            });
        });

        const filtered = computed(() => {
            return entries.value.filter((e) => {
                for (var i = 0; i < selectedTags.value.length; i++) {
                    var tag = selectedTags.value[i];
                    if (!e.Tags.find((t) => t.id == tag.id)) {
                        return false;
                    }
                }
                return true;
            });
        });

        return { entries, availableTags, filtered, selectedTags }
    },
    template: `
        <div class="entries-by-tag">
            <div class="tags-select">
                <span v-for="tag in availableTags"
                      :value="tag.id"
                      :selected="tag.selected"
                      @click="tag.selected = !tag.selected"
                      :class="{ checked: tag.selected }"
                      class="tag-option">
                    {{ tag.name }}
                </span>
            </div>
            <div class="block grid">
                <EntryTile v-for="entry in filtered"
                           :entry="entry"></EntryTile>
            </div>
        </div>`
}
