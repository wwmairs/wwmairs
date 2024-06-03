import { ref, watchEffect, onMounted, computed } from "vue"


export default {
    props: ["id"],
    setup(props) {
        const url = "/entry/get/";
        const entryID = props.id;
        const entry = ref({"tags": []});
        
        watchEffect(async() => {
            if (entryID !== "") {
                var full_url = `${url}${entryID}`;
                var res = await (await fetch(full_url)).json();
                entry.value = res.entry;
                entry.value.tags = entry.value.Tags.map((x) => x.id);
                entry.value.date = justDateFromISO(entry.value.date);
            }
        });


        const imageUpload = ref(null);
        const availableTags = ref([])

        onMounted(() => {
            fetch("/tags.json")
            .then(res => res.json())
            .then(json => availableTags.value = json);
        })

        const dateDisplay = computed(() => {
            var date = new Date(entry.value.date);
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
        })

        function justDateFromISO(str) {
            var date = str.includes("0000-00-00") ? new Date() : new Date(str);
            return date.toISOString().substring(0, 10);
        }

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


        function save() {
            var formData = new FormData();

            for (var key in entry.value) {
                formData.append(key, entry.value[key]);
            }

            for (var i = 0; i < imageUpload.value.files.length; i++) {
                var file = imageUpload.value.files[i];
                formData.append("imageUpload", file)
            }


            var options = {
                method: "POST",
                body: formData 
            };


            fetch("/entry/save", options)
                .then( res => {
                    console.log(res);
                    window.location.reload();
                })
                .catch( err => {
                    console.error(err);
                });
        }

        return { 
            entry, 
            dateDisplay, 
            justDateFromISO,
            availableTags,
            toggleTag,
            photopath, 
            imageUpload, 
            save
        }
    },
    template: `
        <div class="entry">
            <div class="entry-photos">
                <img class="entry-img round-border"
                     v-for="photo in entry.Photos"
                     :src=photopath(photo.path)>
            </div>
            <div class="small-box">
                <div>
                    <label for="name-input">name:</label>
                    <input v-model="entry.name" 
                           placeholder="name"
                           id="name-input" type="text"/>
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
                <div style="grid-column: 1/3">
                    <label for="tags-input"></label>
                    <div id="tags-input" class="tag-select">
                        <span v-for="tag in availableTags"
                                :value="tag.id"
                                :selected="entry.tags.includes(tag.id)"
                                @click="toggleTag(tag.id)"
                                :class="{ checked: entry.tags.includes(tag.id) }"
                                class="tag-option">
                                {{ tag.name }}
                        </span>
                    </div>
                </div>
                <div>
                    <label for="save-button"></label>
                    <button id="save-button" @click="save()">save</button>
                </div>
            </div>
        </div>`

}
