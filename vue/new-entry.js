import { ref, watchEffect, computed } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const entry = props.entry ? ref(props.entry) : ref(init());
        const imageUpload = ref(null);

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })

        function photopath(path) {
            return `../${path}`
        }


        function init() {
            var date = new Date();
            date = `${date.getYear()}-${date.getMonth()}-${date.getDate()}`;
            return {
                "available": 0,
                "date": date,
                "description": "",
                "edition": 1,
                "link": "",
                "name": "",
                "selling": false,
                "price": null,
            }
        }

        function filesAdded() {
            console.log(imageUpload.value.files);
        }

        function save() {
            var formData = new FormData();

            for (var key in entry.value) {
                formData.append(key, entry[key]);
                console.log(key, entry[key]);
            }

            formData.append("imageUpload", imageUpload.value.files);

            var options = {
                method: "POST",
                body: formData 
            };


            fetch("/entry/save", options)
                .then( res => {
                    console.log(res);
                });
        }

        return { entry, dateDisplay, photopath, filesAdded, imageUpload, save}
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
            <div>
                <label for="imageUpload"></label>
                <input ref="imageUpload" 
                       @change="filesAdded()"
                       id="imageUpload" 
                       type="file" 
                       multiple="multiple"/>
            </div>
            <div>
                <label for="save-button"></label>
                <button id="save-button" @click="save()">save</button>
            </div>
        </div>`
}
