import { ref, watch, watchEffect, computed } from "vue"
import  risoColors  from "/public/riso-colors.js"


export default {
    props: ["tags", "clickable", "onclick"],
    setup(props) {
        const tags = ref([]);
        const clickable = props.clickable;
        const onclick = props.onclick;

        console.log(onclick);

        watch(props, async (newProps, oldProps) => {
            var _tags = newProps.tags ?? [];
            _tags.map((tag) => {
                tag.colorInfo = risoColors.find((clr) => clr.name.toLowerCase() == tag.name.toLowerCase());
            });

            _tags.sort((a, b) => !a.colorInfo && b.colorInfo ? -1 : 0);
            tags.value = _tags;
        });


        function tagstyle(tag) {
            return `background: ${tag.colorInfo ? tag.colorInfo.hex : "initial" };`
        }

        function photopath(path) {
            return `../${path}`
        }
        return { tags, tagstyle, clickable, onclick }
    },
    template: `
        <div class="tags">
            <span v-for="tag in tags" 
                  :value="tag.id"
                  :selected="tag.selected"
                  @click="onclick(tag)"
                  :class="{ 'tag-option': clickable, checked: tag.selected }"
                  class="tag" 
                  :style="tagstyle(tag)">
                {{ tag.colorInfo ? "" : tag.name }}
            </span>
        </div>`
}
