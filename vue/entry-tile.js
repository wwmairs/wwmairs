import { ref, watchEffect, computed } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const entry = ref(props.entry)
        return { entry }
    },
    template: `
        <div class="entry-tile">
             <a :href="'/entry/' + entry.id"
                :name="entry.name"
                class="noarrow">
                 <img v-if="entry.Photos.length" 
                      :src="'/' + entry.Photos[0].path"
                      class="round-border entry-img"/>
             </a>
        </div>`
}
