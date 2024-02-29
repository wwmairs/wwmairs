class EntryEditView extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.entry_ = {};
        this.editable = false;
        this.editing_ = false;
        this.displayInputs = [];
    }

    connectedCallback() {

        var entryId = this.getAttribute("entryId");
        if (!entryId) { 
            this.entry_ = {
                "name": null,
                "date": null,
                "description": null,
                "Tags": [],
                "Photos": [],
                "selling": null,
                "price": null,
                "edition": null,
                "available": null
            };
            this.editing_ = true;
        } else {
            this.entry_ = _data[entryId];
        }
        this.editable = this.hasAttribute("editable");

        //const shadow = this.attachShadow({ mode: "open" });
        const shadow = document.createElement("div");
        this.appendChild(shadow);
        const wrapper = document.createElement("div");
        const appendField = this.appendFieldFnForWrapper(wrapper);
        const style = document.createElement("style");
        style.textContent = this.getStyle();


        appendField("name", "text");
        appendField("date", "date");
        appendField("description", "text");


        var entryTags = document.createElement("entry-tags");
        entryTags.tags = this.entry_.Tags;
        wrapper.appendChild(entryTags);

        if (this.editable) {
            appendField("selling", "checkbox");
            appendField("price", "number");
            appendField("edition", "number");
            appendField("available", "number");
            var editButton = document.createElement("button");
            editButton.onclick = () => this.toggleEditing();
            editButton.innerHTML = "edit";
            wrapper.appendChild(editButton);
        }

        this.appendPhotos(wrapper);

        shadow.appendChild(style);
        shadow.appendChild(wrapper);        

        setTimeout(() => {
            this.updateDisplayInputs();
        });
    }

    appendFieldFnForWrapper(wrapper) {
        return (name, type) => {
            if (this.editable) {
                var displayInput = document.createElement("display-input");
                wrapper.appendChild(displayInput);
                displayInput.setAttribute("type", type);
                displayInput.setAttribute("name", name);
                displayInput.onchange = () => { 
                    this.entry_[name] = displayInput.value;
                    this.onchange();
                };
                setTimeout(() => {
                    displayInput.updatevalue(this.entry_[name]);
                });
                this.displayInputs.push(displayInput);
            } else {
                var p = document.createElement("p");
                var val =  this.entry_[name];
                if (type == "date") {
                    var date = new Date(val);
                    val = `${date.getMonth() + 1}/${date.getFullYear()}`;
                }
                p.innerText = val;
                wrapper.appendChild(p);
            }
        }
        
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
    
    // important methods

    onchange() {
        console.log(this.value);
    }

    save() {
        var request = { 
            method: "POST", 
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.value)
        };
        fetch("/entry/save", request)
        .then((res) => console.log(res))
        .error((res) => console.error(res));
    }


    // ui config helpers

    showDisplay() {
        this.displayInputs.map((el) => el.showDisplay());
    }

    showInput() {
        this.displayInputs.map((el) => el.showInput());
    }

    updateDisplayInputs() {
        if (this.editing_) {
            this.showInput();
        } else {
            this.showDisplay();
        }
    }

    toggleEditing() {
        this.editing = !this.editing;
    }

    // getters & setters

    get editing() {
        return this.editing_;
    }

    set editing(val) {
        this.editing_ = val;
        this.updateDisplayInputs();
    }

    get value() {
        return this.entry_;
    }

    set value(tags) {
        console.log(tags);
        console.log("can't set value on entry-edit-view yet");
    }

    // form validation boilerplate

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
