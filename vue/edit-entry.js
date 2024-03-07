import { ref, onMounted, computed } from "vue"


export default {
    props: ["entry"],
    setup(props) {
        const entry = props.entry ? ref(props.entry) : ref(init());
        const imageUpload = ref(null);
        const availableTags = ref([])
        entry.value.tags = entry.value.Tags.map((x) => x.id);

        onMounted(() => {
            fetch("/tags.json")
            .then(res => res.json())
            .then(json => availableTags.value = json);
        })

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })

        function photopath(path) {
            return `../${path}`
        }

        function toggleTag(tagID) {
            var index = entry.value.tags.indexOf(tagID);
            if (index == -1) {
                entry.value.tags.push(tagID);
            } else {
                entry.value.tags.splice(index, 1);
            }
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
                "Tags": [],
            }
        }

        function save() {
            var formData = new FormData();

            for (var key in entry.value) {
                formData.append(key, entry.value[key]);
            }

            for (var i = 0; i < imageUpload.value.files.length; i++) {
                var file = imageUpload.value.files[i];
                console.log(file)
                formData.append("imageUpload", file)
            }


            var options = {
                method: "POST",
                body: formData 
            };


            fetch("/entry/save", options)
                .then( res => {
                    console.log(res);
                })
                .catch( err => {
                    console.error(err);
                });
        }

        return { 
            entry, 
            dateDisplay, 
            availableTags,
            toggleTag,
            photopath, 
            imageUpload, 
            save
        }
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
                       id="imageUpload" 
                       type="file" 
                       multiple="multiple"/>
            </div>
            <div>
                <label for="tags-input"></label>
                <div id="tags-input" class="tag-select">
                    <option v-for="tag in availableTags"
                            :value="tag.id"
                            :selected="entry.tags.includes(tag.id)"
                            @click="toggleTag(tag.id)"
                            class="tag-option">
                            {{ tag.name }}
                    </option>
                </div>
            </div>
            <div>
                <label for="save-button"></label>
                <button id="save-button" @click="save()">save</button>
            </div>
        </div>`
}
