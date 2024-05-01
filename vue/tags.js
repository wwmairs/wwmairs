import { ref, watch, watchEffect, computed } from "vue"
import  risoColors  from "/public/riso-colors.js"


export default {
    props: ["tags"],
    setup(props) {
        const tags = ref([]);

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
        return { tags, tagstyle}
    },
    template: `
        <div class="tags">
            <span v-for="tag in tags" class="tag" :style="tagstyle(tag)">
                {{ tag.colorInfo ? "" : tag.name }}
            </span>
        </div>`
}
