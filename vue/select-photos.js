import { ref, computed } from "vue"

export default {
    props: ["current-photos"],
    setup(props) {

        const photos = ref(props.current-photos)
        return {
            photos
        }
    },
    template: `
        <div>
        </div>
    `
}

