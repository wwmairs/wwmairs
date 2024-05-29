import { ref, watchEffect, computed, nextTick } from "vue"
import EntryTile from "/vue/entry-tile.js"


export default {
    components: {
        EntryTile,
    },
    setup(props) {
        const url = "/entries/";
        const entries = ref([]);
        const availableTags = ref([]);
        const filtered = ref([]);

        watchEffect(async () => {
            var res = await (await fetch(url)).json()
            entries.value = res.entries;
            availableTags.value = res.tags;
            filtered.value = entries.value;
        });

        function toggleTag(tag) {
            filtered.value = [];
            tag.selected = !tag.selected;
            var selected =  availableTags.value.filter((t) => {
                return t.selected;
            });
            var tags = availableTags.value.filter((t) => t.selected);
            var filteredEntries = [];
            entries.value.map((e) => {
                var include = true;
                for (var i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    var foundTag = e.Tags.find((t) => t.id == tag.id) !== undefined;
                    if (!foundTag) {
                        include = false;
                    }
                }
                if (include) {
                    filteredEntries.push(e);
                }
            });
            nextTick(() => filtered.value = filteredEntries);
        }

        return { entries, availableTags, filtered, toggleTag }
    },
    template: `
        <div class="entries-by-tag">
            <div class="tags-select">
                <span v-for="tag in availableTags"
                      :value="tag.id"
                      :selected="tag.selected"
                      @click="toggleTag(tag)"
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
