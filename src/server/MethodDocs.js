import _ from "lodash";


const extractDescription = (lines) => {
    let description = [];
    for (let line of _.clone(lines)) {
      line = line.trim();
      if (line.startsWith("@param") || line.startsWith("@return")) { break; }
      description.push(line);
      lines.shift();
    }
    return description.join("\n").replace(/\n*$/, "");
};



const extractParameters = (lines) => {
    let current;
    let params = {};

    for (let line of _.clone(lines)) {
      line = line.trim();
      if (line.startsWith("@return")) { break; }

      // Is this the start of a new parameter?
      if (line.startsWith("@param")) {
        line = line.replace(/^\@param/, "").trim();

        // Get the type details.
        let match = line.match(/\{.*\}/);
        let type;
        if (match) {
          type = match[0].replace("{", "").replace("}", "").trim();
          line = line.substring(match[0].length, line.length).trim();
        }

        // Get the parameter name.
        let index = line.indexOf(" ");
        let name = line.substring(0, index).replace(/\:$/, "").trim();
        line = line.substring(index, line.length).trim().replace("-", "").trim();

        // Store state.
        current = undefined;
        if (name) {
          current = name;
          params[current] = { name: name, description: "" };
          if (type) { params[current].type = type; }
        }
      }

      // Append the parameter description.
      if (current) {
        let description = (params[current].description + ` ${ line }`).trim();
        params[current].description = description;
        lines.shift();
      }
    }

    // Finish up.
    return params;
};




/**
 * Represents the documentation details for a method.
 */
export default class MethodDocs {
  /**
   * Constructor
   * @param {string} raw: The raw documentation string for the method.
   */
  constructor(raw) {
    this.params = {};
    if (!_.isEmpty(raw)) {
      const lines = raw.split("\n");
      this.description = extractDescription(lines);
      this.params = extractParameters(lines);
    }
  }
}
