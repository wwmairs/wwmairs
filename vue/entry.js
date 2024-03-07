import { ref, watchEffect, computed } from "vue"

const API_URL = "https://wwmairs.com/entry/";

export default {
    props: ["id", "entry"],
    setup(props) {
        const id = ref(props.id);
        const entry = ref(props.entry);


        watchEffect(async() => {
            const url = `${API_URL}${id.value}`
            //entry.value = await( await fetch(url)).json()

        })

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })
        return { id, entry, dateDisplay }
    },
    template: `
        <div>
            <h4>{{ entry.name }}</h4>
            <p><i>{{ dateDisplay }}</i></p>
            id is {{ id }} and name is {{ entry.name }}
        </div>`
}
