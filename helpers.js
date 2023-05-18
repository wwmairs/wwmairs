import fs from "node:fs"

function getJSON(filename, fn) {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
}

export default getJSON
