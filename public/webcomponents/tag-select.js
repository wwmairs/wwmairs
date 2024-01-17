class TagSelect extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // get options
        // id = option value
        // name = option textContent

        // set style
        var tagName = this.getAttribute("name");

        const shadow = this.attachShadow({ mode: "open" });

        setTimeout(()=>{
            this.options = this.children;
            this.options.forEach((x) => {
                console.log(x.innerText)
                var tag = document.createElement("span")
                tag.innerText = x.innerText;
                tag.setAttribute("class", "tag-option");
                tag.setAttribute("value", x.value);
                tag.setAttribute("selected", x.selected);
                tag.onclick = () => toggleTag(x);
                shadow.appendChild(tag);
            });
        });


        // const info = document.createElement("span");
        // if (!this.colorInfo) { 
        //     info.textContent = this.getAttribute("name");
        // }

        const style = document.createElement("style");
        style.textContent = this.getStyle();

        shadow.appendChild(style);

    }

    toggleTag(tag) {

    }

    getStyle() {
        return `
            .tag-option {
                display: inline-block;
                background: ${this.colorInfo ? this.colorInfo.hex : "initial"};
                padding: .25em;
                margin: .25em;
                min-width: .75em;
                min-height: .75em;
            }

            .tag-option:checked {
                border: 1px solid black;
                border-radius: 1em;
            }
        `;
    }

}

customElements.define("tag-select", TagSelect);
