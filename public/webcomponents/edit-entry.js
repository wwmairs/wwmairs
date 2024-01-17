class EditEntry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        
        var tagName = this.getAttribute("name");


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


        const style = document.createElement("style");
        style.textContent = this.getStyle();

        shadow.appendChild(style);

    }


    getStyle() {
        return `
        `;
    }

}

customElements.define("edit-entry", EditEntry);
