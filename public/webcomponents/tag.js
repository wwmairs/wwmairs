import colors from "/public/riso-colors.json" assert { type: "json" };

class Tag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // check data
        // set style

        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "tag");

        const info = document.createElement("span");
        info.textContent = this.getAttribute("name");

        const style = document.createElement("style");
        style.textContent = this.getStyle();

        shadow.appendChild(style);
        wrapper.appendChild(info);
        shadow.appendChild(wrapper);

    }

    getStyle() {
        var tagName = this.getAttribute("name");
        var colorInfo = colors.find((color) => color.name == tagName.toLower());
    }

}

customElements.define("tag", Tag);
