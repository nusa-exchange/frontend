export default function() {
  const base = {};
  const isValidStyleNode = function(node) {
    return node instanceof HTMLStyleElement && node.sheet.cssRules.length > 0;
  };

  const timestamp = () => {
    return Date.now() || +new Date();
  };

  const strAttr = function(name, value, depth) {
    return "\t".repeat(depth) + name + ": " + value + ";\n";
  };

  const strNode = function(name, value, depth) {
    let cssString = "\t".repeat(depth) + name + " {\n";
    cssString += base.toCSS(value, depth + 1);
    cssString += "\t".repeat(depth) + "}\n";
    return cssString;
  };

  base.init = function() {
    // String functions
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };

    String.prototype.repeat = function(n) {
      return new Array(1 + n).join(this);
    };
  };
  base.init();

  const selX = /([^\s;{}][^;{}]*)\{/g;
  const endX = /\}/g;
  const lineX = /([^;{}]*);/g;
  const commentX = /\/\*[\s\S]*?\*\//g;
  const lineAttrX = /([^:]+):([^;]*);/;

  // This is used, a concatenation of all above. We use alternation to
  // capture.
  const altX = /(\/\*[\s\S]*?\*\/)|([^\s;{}][^{}]*(?=\{))|(\})|([^;{}]+;(?!\s*\*\/))/gim;

  // Capture groups
  const capComment = 1;
  const capSelector = 2;
  const capEnd = 3;
  const capAttr = 4;

  const isEmpty = function(x) {
    return typeof x == "undefined" || x.length == 0 || x == null;
  };

  const isCssJson = function(node) {
    return !isEmpty(node) ? node.attributes && node.children : false;
  };

  /**
   * Input is css string and current pos, returns JSON object
   *
   * @param cssString
   *            The CSS string.
   * @param args
   *            An optional argument object. ordered: Whether order of
   *            comments and other nodes should be kept in the output. This
   *            will return an object where all the keys are numbers and the
   *            values are objects containing "name" and "value" keys for each
   *            node. comments: Whether to capture comments. split: Whether to
   *            split each comma separated list of selectors.
   */
  base.toJSON = function(cssString, args) {
    const node = {
      children: {},
      attributes: {}
    };
    let match = null;
    let count = 0;

    if (typeof args == "undefined") {
      args = {
        ordered: false,
        comments: false,
        stripComments: false,
        split: false
      };
    }
    if (args.stripComments) {
      args.comments = false;
      cssString = cssString.replace(commentX, "");
    }

    while ((match = altX.exec(cssString)) != null) {
      if (!isEmpty(match[capComment]) && args.comments) {
        // Comment
        const add = match[capComment].trim();
        node[count++] = add;
      } else if (!isEmpty(match[capSelector])) {
        // New node, we recurse
        const name = match[capSelector].trim();
        // This will return when we encounter a closing brace
        const newNode = base.toJSON(cssString, args);
        if (args.ordered) {
          const obj = {};
          obj["name"] = name;
          obj["value"] = newNode;
          // Since we must use key as index to keep order and not
          // name, this will differentiate between a Rule Node and an
          // Attribute, since both contain a name and value pair.
          obj["type"] = "rule";
          node[count++] = obj;
        } else {
          let bits;
          if (args.split) {
            bits = name.split(",");
          } else {
            bits = [name];
          }
          for (let i = 0; i < bits.length; i++) {
            const sel = bits[i].trim();
            if (sel in node.children) {
              for (const att in newNode.attributes) {
                node.children[sel].attributes[att] = newNode.attributes[att];
              }
            } else {
              node.children[sel] = newNode;
            }
          }
        }
      } else if (!isEmpty(match[capEnd])) {
        // Node has finished
        return node;
      } else if (!isEmpty(match[capAttr])) {
        const line = match[capAttr].trim();
        const attr = lineAttrX.exec(line);
        if (attr) {
          // Attribute
          const name = attr[1].trim();
          const value = attr[2].trim();
          if (args.ordered) {
            const obj = {};
            obj["name"] = name;
            obj["value"] = value;
            obj["type"] = "attr";
            node[count++] = obj;
          } else {
            if (name in node.attributes) {
              const currVal = node.attributes[name];
              if (!(currVal instanceof Array)) {
                node.attributes[name] = [currVal];
              }
              node.attributes[name].push(value);
            } else {
              node.attributes[name] = value;
            }
          }
        } else {
          // Semicolon terminated line
          node[count++] = line;
        }
      }
    }

    return node;
  };

  /**
   * @param {Any} node
   *            A JSON node.
   * @param {Number} depth
   *            The depth of the current node; used for indentation and
   *            optional.
   * @param {Boolean} breaks
   *            Whether to add line breaks in the output.
   */
  base.toCSS = function(node, depth = 0, breaks = false) {
    let cssString = "";
    if (node.attributes) {
      for (const i in node.attributes) {
        const att = node.attributes[i];
        if (att instanceof Array) {
          for (let j = 0; j < att.length; j++) {
            cssString += strAttr(i, att[j], depth);
          }
        } else {
          cssString += strAttr(i, att, depth);
        }
      }
    }
    if (node.children) {
      let first = true;
      for (const i in node.children) {
        if (breaks && !first) {
          cssString += "\n";
        } else {
          first = false;
        }
        cssString += strNode(i, node.children[i], depth);
      }
    }
    return cssString;
  };

  /**
   * @param data
   *            You can pass css string or the CSSJS.toJSON return value.
   * @param id (Optional)
   *            To identify and easy removable of the style element
   * @param replace (Optional. defaults to TRUE)
   *            Whether to remove or simply do nothing
   * @return HTMLLinkElement
   */
  base.toHEAD = function(data, id, replace) {
    const head = document.getElementsByTagName("head")[0];
    const xnode = document.getElementById(id);
    const _xnodeTest = xnode !== null && xnode instanceof HTMLStyleElement;

    if (isEmpty(data) || !(head instanceof HTMLHeadElement)) return;
    if (_xnodeTest) {
      if (replace === true || isEmpty(replace)) {
        xnode.removeAttribute("id");
      } else return;
    }
    if (isCssJson(data)) {
      data = base.toCSS(data);
    }

    let node = document.createElement("style");
    node.type = "text/css";

    if (!isEmpty(id)) {
      node.id = id;
    } else {
      node.id = "cssjson_" + timestamp().toString();
    }
    if (node.styleSheet) {
      node.styleSheet.cssText = data;
    } else {
      node.appendChild(document.createTextNode(data));
    }

    head.appendChild(node);

    if (isValidStyleNode(node)) {
      if (_xnodeTest) {
        xnode.parentNode.removeChild(xnode);
      }
    } else {
      node.parentNode.removeChild(node);
      if (_xnodeTest) {
        xnode.setAttribute("id", id);
        node = xnode;
      } else return;
    }

    return node;
  };

  // Alias

  if (typeof window != "undefined") {
    window.createCSS = base.toHEAD;
  }

  // Helpers
  return base;
}
