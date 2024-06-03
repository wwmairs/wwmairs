import { ref, watchEffect, computed } from "vue"


export default {
    setup(props) {
        const hidden = ref(false);

        function dismissMessage() {
            hidden.value = true;
        }


        return { dismissMessage, hidden }
    },
    template: `
        <div :class="[{hidden: hidden}, 'msg']">
            <slot>
            </slot>
            <span @click="dismissMessage" 
                  style="padding-left: 1rem;
                         position: relative;
                         top: -.25rem;
                         float: right">&times;</span>
        </div>`
}
