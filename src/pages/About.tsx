import React from "react";

const About: React.FC = () => {
    return (
        <div className="container prose mx-auto p-6">
            <h1>Short Markup Converter</h1>
            <p>
                A tiny DSL for writing HTML-like structures with minimal syntax, plus a React-based editor/previewer that turns it into formatted HTML or TSX.
            </p>

            <h2>📦 Installation</h2>
            <pre>
                <code>{`npm install flex-flow-short-markup`}</code>
            </pre>
            <p>
                Or with <code>yarn</code>:
            </p>
            <pre>
                <code>{`yarn add flex-flow-short-markup`}</code>
            </pre>

            <h2>⚙️ Usage</h2>
            <p>Import and call the converter functions wherever you need to transform your short-markup string:</p>
            <pre>
                <code>{`import { generateFormattedHTML, generateFormattedTSX } from "flex-flow-short-markup";

const input = \`
<div> main-content
  <h1> hero-head = "Welcome!" :{ font-size: 2rem; color: teal }
  <p> subtitle = "This is a demo." :{ margin-top: .5rem }
\`;

console.log(generateFormattedHTML(input));
// -> formatted HTML string

console.log(generateFormattedTSX(input));
// -> formatted TSX/JSX string
`}</code>
            </pre>

            <h2>📝 DSL Syntax</h2>
            <ul>
                <li>
                    <strong>Tags:</strong> Start with <code>&lt;tagName&gt;</code>.
                </li>
                <li>
                    <strong>Bare identifier:</strong> A plain word after the tag becomes a <code>class</code>. E.g. <code>{`<div> card`}</code> →{" "}
                    <code className="inline-code">{`class="card"`}</code>.
                </li>
                <li>
                    <strong>ID &amp; classes:</strong> You can still write <code>{`#id`}</code> or <code>{`.className`}</code> right after the tag.
                </li>
                <li>
                    <strong>Attrs:</strong> Use bracket syntax <code>{`[key=value]`}</code> for arbitrary HTML attributes.
                </li>
                <li>
                    <strong>Text:</strong> <code>= "Your text"</code> sets the element’s innerText.
                </li>
                <li>
                    <strong>Styles:</strong> <code>:{`{ prop: value; ... }`}</code> for inline CSS.
                </li>
                <li>
                    <strong>Indentation:</strong> Two spaces per nesting level denote parent/child relationships.
                </li>
            </ul>

            <h3>Example Short Markup</h3>
            <pre>
                <code>{`<div> card
  <img> thumbnail [src=avatar.png] :{ width: 100px; height: 100px; }
  <div> content
    <h2> title = "Card Title" :{ font-size: 1.5rem; }
    <p> body = "This is a short description of the card."
`}</code>
            </pre>

            <h3>Generated HTML</h3>
            <pre>
                <code>{`<div class="card">
  <img class="thumbnail" src="avatar.png" style="width: 100px; height: 100px;" />
  <div class="content">
    <h2 class="title" style="font-size: 1.5rem;">Card Title</h2>
    <p class="body">This is a short description of the card.</p>
  </div>
</div>`}</code>
            </pre>

            <h3>Generated TSX</h3>
            <pre>
                <code>{`<div className="card">
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
</div>`}</code>
            </pre>

            <h2>🔧 React Example</h2>
            <p>Here’s how you might wire up our converter in a React component using Monaco Editor:</p>
            <pre>
                <code>{`import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { generateFormattedHTML, generateFormattedTSX } from "../utils/parseShortMarkup";

const ShortFormatConverter: React.FC = () => {
    const [inputText, setInputText] = useState<string>(
        \`<div> main-content
\t<div> hero-section : {display: flex; gap: 2rem;}
\t\t<h1> hero-head = "Main header" : {display: flex; flex-direction: column; font-size: 2rem}
\t\t<p> some-element = "Text for example or something like that..." : {font-size: 1rem;}
\t<div> example-container
\t\t<p> some-text = "More text" : {font-size: 1rem;}\`,
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
            setResult(\`// ERROR: \${err.message}\`);
        }
    }, [inputText, outputType]);`}</code>
            </pre>

            <h2>🚀 Extending the DSL</h2>
            <ul>
                <li>Add support for ARIA or data attributes.</li>
                <li>
                    Integrate markdown parsing for <code>textContent</code>.
                </li>
                <li>Build custom VSCode/Monaco syntax highlighting.</li>
            </ul>

            <p>
                <strong>Enjoy writing concise, readable markup!</strong>
            </p>
        </div>
    );
};

export default About;
