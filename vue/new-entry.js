import { ref, watchEffect, computed } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const entry = props.entry ? ref(props.entry) : ref(init());

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })

        function photopath(path) {
            return `../${path}`
        }


        function init() {
            return {
                "available": 0,
                "date": new Date().toDateString(),
                "description": "",
                "edition": 1,
                "link": "",
                "name": "",
                "selling": false,
                "price": null
            }
        }

        function save() {
        }

        return { entry, dateDisplay, photopath, save}
    },
    template: `
        <div>
            <div>
                <label for="name-input">name:</label>
                <input v-model="entry.name" id="name-input" type="text"/>
            </div>
            <div>
                <label for="date-input">date</label>
                <input v-model="entry.date" id="date-input" type="date"/>
            </div>
            <div>
                <label for="edition-input">edition</label>
                <input v-model="entry.edition" id="edition-input" type="number"/>
            </div>
            <div>
                <label for="selling-input">selling:</label>
                <input v-model="entry.selling" id="selling-input" type="checkbox"/>
            </div>
            <div>
                <label for="price-input">price</label>
                <input v-model="entry.price" 
                       :disabled="!entry.selling" 
                       id="price-input" 
                       type="number"/>
            </div>
            <div>
                <label for="available-input">available</label>
                <input v-model="entry.available" 
                       :disabled="!entry.selling" 
                       id="available-input"
                       type="number"/>
            </div>
            <div>
                <label for="link-input">link</label>
                <input v-model="entry.link" id="link-input" type="text"/>
            </div>
            <div>
                <label for="description-textarea">description</label>
                <textarea v-model="entry.description" id="description-textarea"/>
            </div>
            <div class="entry-photos">
                <img class="entry-img round-border"
                     v-for="photo in entry.Photos" 
                     :src=photopath(photo.path)>
            </div>
        </div>`
}
