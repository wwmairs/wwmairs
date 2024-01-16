import colors from "/public/riso-colors.json" assert { type: "json" };

class EntryTag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // check data
        // set style
        var tagName = this.getAttribute("name");
        this.colorInfo = colors.find((color) => color.name.toLowerCase() == tagName.toLowerCase());
        console.log(this.colorInfo);

        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "tag");

        const info = document.createElement("span");
        if (!this.colorInfo) { 
            info.textContent = this.getAttribute("name");
        }

        const style = document.createElement("style");
        style.textContent = this.getStyle();

        shadow.appendChild(style);
        wrapper.appendChild(info);
        shadow.appendChild(wrapper);

    }

    getStyle() {
        return `
            .tag {
                display: inline-block;
                border: 1px solid black;
                border-radius: 1em;
                background: ${this.colorInfo ? this.colorInfo.hex : "initial"};
                padding: .25em;
                margin: .25em;
                min-width: .75em;
                min-height: .75em;
            }
        `;
    }

}

customElements.define("entry-tag", EntryTag);
