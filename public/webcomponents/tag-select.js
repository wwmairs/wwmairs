class TagSelect extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.value_ = [];
        this.tags = [];
    }

    connectedCallback() {
        const style = document.createElement("style");
        style.textContent = this.getStyle();

        setTimeout(()=>{
            this.options = this.children;
            this.options.forEach((x) => {
                x.classList.add("tag-option");
                x.onclick = () => this.toggleTag(x);
            });
        });

    }

    toggleTag(tag) {
        if (tag.selected) {
            tag.removeAttribute("selected");
        } else {
            tag.setAttribute("selected", "true");
        }
        this.internals_.setFormValue(this.value);
    }

    get value() {
        var selectedTags = [];
        [...this.options].filter((x) => {
            return x.selected ? selectedTags.push(x.value) : 0;
        });
        this.value_ = selectedTags;
        return selectedTags;
    }

    set value(tags) {
        console.log(tags);
    }

    get form() { return this.internals_.form; }
    get name() { return this.getAttribute('name'); }
    get type() { return this.localName; }
    get validity() {return this.internals_.validity; }
    get validationMessage() {return this.internals_.validationMessage; }
    get willValidate() {return this.internals_.willValidate; }

    checkValidity() { return this.internals_.checkValidity(); }
    reportValidity() {return this.internals_.reportValidity(); }j


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
