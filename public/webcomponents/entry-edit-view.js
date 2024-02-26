class EntryEditView extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this.internals_ = this.attachInternals();
        this.entry_ = {};
        this.editable = false;
    }

    connectedCallback() {

        var entryId = this.getAttribute("entryId");
        this.entry_ = _data[entryId];
        this.editable = this.hasAttribute("editable");

        //const shadow = this.attachShadow({ mode: "open" });
        const shadow = document.createElement("div");
        this.appendChild(shadow);
        const wrapper = document.createElement("div");
        const style = document.createElement("style");
        style.textContent = this.getStyle();

        this.appendField("name", "text", wrapper);
        this.appendField("date", "date", wrapper);
        this.appendField("description", "text", wrapper);
        if (this.editable) {
            this.appendField("checkbox", "selling", wrapper);
        }


        /*
        var dateDisplay = document.createElement("p");
        var date = new Date(this.entry_.date);
        dateDisplay.innerHTML = `${date.getMonth() + 1}/${date.getFullYear()}`;
        wrapper.appendChild(dateDisplay);
        */

        var entryTags = document.createElement("entry-tags");
        entryTags.tags = this.entry_.Tags;
        wrapper.appendChild(entryTags);

        this.appendPhotos(wrapper);

        shadow.appendChild(style);
        shadow.appendChild(wrapper);        

    }

    onchange() {
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

    appendField(name, type, wrapper) {
        if (this.editable) {
            var displayInput = document.createElement("display-input");
            wrapper.appendChild(displayInput);
            displayInput.setAttribute("type", type);
            displayInput.onchange = () => { 
                this.entry_[name] = displayInput.value;
                this.onchange();
            };
            setTimeout(() => {
                displayInput.updatevalue(this.entry_[name]);
            });
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
        console.log("can't set value on entry-edit-view yet");
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
