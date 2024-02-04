class DisplayInput extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.value_ = "";
        this.display_;
        this.input_
        this.type_ = "text";
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.innerHTML = this.getStyle();
        shadow.appendChild(style);
        this.type_ = this.getAttribute("type");
        this.display_ = document.createElement("span");
        this.input_ = document.createElement("input");
        this.input_.setAttribute("type", this.type);
        this.input_.onchange = (e) => { this.value = e.target.value };
        this.input_.classList.add("hidden");
        this.display_.onmouseover = () => this.showInput();
        //this.display_.onmouseout = () => this.showDisplay();
        shadow.appendChild(this.input_)
        shadow.appendChild(this.display_)
        setTimeout(() => {
            this.input_.style.width = this.display_.offsetWidth + "px";
        });
    }

    showInput() {
        this.display_.classList.add("hidden");
        this.input_.classList.remove("hidden");
    }

    showDisplay() {
        this.display_.classList.remove("hidden");
        this.input_.classList.add("hidden");
    }

    formatDate(datestring) {
        var date = new Date(datestring);
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }


    get value() {
        return this.value_;
    }

    set value(val) {
        this.value_ = val;
        if (this.type_ == "date") {
            this.display_.innerHTML = this.formatDate(val);
        } else {
            this.display_.innerHTML = val;
        }
        this.input_.value = val;
        this.showDisplay();
        this.input_.style.width = this.display_.offsetWidth + "px";
        this.onchange();
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
            input {
                font-family: ocr-a-std, monospace;
            }
            span {
                padding: 4px 2px;
            }
            .hidden {
                display: none;
            }
        `;
    }

}

customElements.define("display-input", DisplayInput);
