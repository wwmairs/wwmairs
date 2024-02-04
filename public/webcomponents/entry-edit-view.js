class EntryEditView extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.entry_ = {};
    }

    connectedCallback() {

        var entryId = this.getAttribute("entryId");
        this.entry_ = _data[entryId];

        //const shadow = this.attachShadow({ mode: "open" });
        const shadow = document.createElement("div");
        this.appendChild(shadow);
        const wrapper = document.createElement("div");
        const style = document.createElement("style");
        style.textContent = this.getStyle();

        this.appendFields(["name", "description", "selling"], wrapper)


        var dateDisplay = document.createElement("p");
        var date = new Date(this.entry_.date);
        dateDisplay.innerHTML = `${date.getMonth() + 1}/${date.getFullYear()}`;
        wrapper.appendChild(dateDisplay);

        var entryTags = document.createElement("entry-tags");
        entryTags.tags = this.entry_.Tags;
        wrapper.appendChild(entryTags);

        this.appendPhotos(wrapper);

        shadow.appendChild(style);
        shadow.appendChild(wrapper);        

    }

    appendFields(fieldNames, wrapper) {
        fieldNames.map((name) => {
            var displayInput = document.createElement("display-input");
            wrapper.appendChild(displayInput);
            displayInput.setAttribute("type", "text");
            setTimeout(() => {
                displayInput.value = this.entry_[name];
            });
        })
    }

    appendPhotos(wrapper) {
        var photosWrapper = document.createElement("div");
        photosWrapper.classList.add("entry-photos");
        this.entry_.Photos.map( photo => {
            var img = document.createElement("img");
            img.classList.add("round-border", "entry-img");
            img.setAttribute("src", `../${photo.path}`); 
            photosWrapper.appendChild(img);
        });
        wrapper.appendChild(photosWrapper);
    }


    get value() {
        return this.entry_;
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
        `;
    }

}

customElements.define("entry-edit-view", EntryEditView);
