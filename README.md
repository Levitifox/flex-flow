# Short Markup Converter

A tiny DSL for writing HTML-like structures with minimal syntax, plus a React-based editor/previewer that turns it into formatted HTML or TSX.

## 📦 Installation

```bash
npm install flex-flow-short-markup
```

Or with `yarn`:

```bash
yarn add flex-flow-short-markup
```

## ⚙️ Usage

Import and call the converter functions wherever you need to transform your short-markup string:

```js
import { generateFormattedHTML, generateFormattedTSX } from "flex-flow-short-markup";

const input = `
<div> main-content
  <h1> hero-head = "Welcome!" :{ font-size: 2rem; color: teal }
  <p> subtitle = "This is a demo." :{ margin-top: .5rem }
`;

console.log(generateFormattedHTML(input));
// -> formatted HTML string

console.log(generateFormattedTSX(input));
// -> formatted TSX/JSX string
```

## 📝 DSL Syntax

* **Tags:** Start with `<tagName>`.
* **Bare identifier:** A plain word after the tag becomes a `class`.
  E.g. `<div> card` → `class="card"`.
* **ID & classes:** You can still write `#id` or `.className` right after the tag.
* **Attrs:** Use bracket syntax `[key=value]` for arbitrary HTML attributes.
* **Text:** `= "Your text"` sets the element’s innerText.
* **Styles:** `:{ { prop: value; … } }` for inline CSS.
* **Indentation:** Two spaces per nesting level denote parent/child relationships.

### Example Short Markup

```txt
<div> card
  <img> thumbnail [src=avatar.png] :{ width: 100px; height: 100px; }
  <div> content
    <h2> title = "Card Title" :{ font-size: 1.5rem; }
    <p> body = "This is a short description of the card."
```

### Generated HTML

```html
<div class="card">
  <img class="thumbnail" src="avatar.png" style="width: 100px; height: 100px;" />
  <div class="content">
    <h2 class="title" style="font-size: 1.5rem;">Card Title</h2>
    <p class="body">This is a short description of the card.</p>
  </div>
</div>
```

### Generated TSX

```tsx
<div className="card">
  <img
    className="thumbnail"
    src="avatar.png"
    style={{ "width": "100px", "height": "100px" }}
  />
  <div className="content">
    <h2 className="title" style={{ "font-size": "1.5rem" }}>
      Card Title
    </h2>
    <p className="body">This is a short description of the card.</p>
  </div>
</div>
```

## 🔧 React Example

Here’s how you might wire up our converter in a React component using Monaco Editor:

```tsx
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { generateFormattedHTML, generateFormattedTSX } from "../utils/parseShortMarkup";

const ShortFormatConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `<div> main-content
\t<div> hero-section : {display: flex; gap: 2rem;}
\t\t<h1> hero-head = "Main header" : {display: flex; flex-direction: column; font-size: 2rem}
\t\t<p> some-element = "Text for example or something like that..." : {font-size: 1rem;}
\t<div> example-container
\t\t<p> some-text = "More text" : {font-size: 1rem;}`
  );
  const [outputType, setOutputType] = useState<"html" | "tsx">("html");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    try {
      if (outputType === "html") {
        setResult(generateFormattedHTML(inputText));
      } else {
        setResult(generateFormattedTSX(inputText));
      }
    } catch (err: any) {
      setResult(`// ERROR: ${err.message}`);
    }
  }, [inputText, outputType]);

  return (
    <div>
      <div>
        <button onClick={() => setOutputType("html")}>HTML</button>
        <button onClick={() => setOutputType("tsx")}>TSX</button>
      </div>
      <Editor
        height="50vh"
        defaultLanguage="plaintext"
        value={inputText}
        onChange={(value) => setInputText(value || "")}
      />
      <Editor
        height="50vh"
        defaultLanguage={outputType}
        value={result}
        options={{ readOnly: true }}
      />
    </div>
  );
};

export default ShortFormatConverter;
```

## 🚀 Extending the DSL

* Add support for ARIA or data attributes.
* Integrate markdown parsing for `textContent`.
* Build custom VSCode/Monaco syntax highlighting.

**Enjoy writing concise, readable markup!**
