import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { generateFormattedHTML, generateFormattedTSX } from "../utils/parseShortMarkup";

const ShortFormatConverter: React.FC = () => {
    const [inputText, setInputText] = useState<string>(
        `<div> main-container#root.theme-dark[data-role=app]
\t<header> site-header.sticky#mainHeader[role=banner] :{ background-color: var(--primary-color); height: var(--header-height); }
\t\t<h1> page-title = "Welcome to Short Markup" :{ font-size: 2rem; color: white; }
\t<nav> main-nav.horizontal[aria-label="Main"] :{ padding: 1rem; }
\t\t<a> home-link[href=/] = "Home" :{ margin-right: 1rem; }
\t\t<a> about-link[href=/about] = "About" :{ margin-right: 1rem; }
\t<section> intro-section#intro[id=section-intro] :{ padding: 2rem; }
\t\t<p> intro-text = "This paragraph demonstrates all DSL features." :{ margin: 1rem 0; }
\t\t<img> hero-image.thumbnail[src=hero.png][alt="Hero image"] :{ width: 100%; height: auto; }
\t<footer> site-footer.footer[data-footer=main] :{ background: var(--bg-secondary); padding: 1rem; }
\t\t<p> copy = "© 2025 My Company" :{ font-size: 0.875rem; color: var(--text-muted); }`,
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
    };

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 21,
        padding: { top: 16, bottom: 16 },
        lineNumbers: "on" as const,
        scrollBeyondLastLine: false,
        renderWhitespace: "selection" as const,
        folding: false,
        automaticLayout: true,
        wordWrap: "on" as const,
        wrappingStrategy: "advanced" as const,
        tabSize: 4,
    };

    const editorWillMount = (monaco: any) => {
        monaco.languages.register({ id: "shortMarkup" });
        monaco.languages.setMonarchTokensProvider("shortMarkup", {
            tokenizer: {
                root: [
                    [/<[A-Za-z][\w-]*>/, "keyword"],
                    [/[#.][\w-]+/, "delimiter"],
                    [/\[[^\]]+\]/, "attribute.value"],
                    [/=\s*"[^"]*"/, "string"],
                    [/:{[^}]+\}/, "keyword.delimiter"],
                    [/\s+/, "white"],
                ],
            },
        });
        monaco.editor.defineTheme("shortMarkupTheme", {
            base: "vs",
            inherit: true,
            rules: [
                { token: "keyword", foreground: "0000FF" },
                { token: "delimiter", foreground: "800080" },
                { token: "attribute.value", foreground: "FF0000" },
                { token: "string", foreground: "B22222" },
                { token: "keyword.delimiter", foreground: "008800" },
            ],
            colors: {},
        });
    };

    return (
        <div className="converter">
            <div className="converter-controls">
                <div className="radio-group">
                    <label>
                        <input type="radio" checked={outputType === "html"} onChange={() => setOutputType("html")} /> HTML
                    </label>
                    <label>
                        <input type="radio" checked={outputType === "tsx"} onChange={() => setOutputType("tsx")} /> TSX
                    </label>
                </div>
                <button onClick={copyToClipboard} title="Copy to clipboard">
                    Copy
                </button>
            </div>

            <div className="converter-container">
                <div className="editor-panel">
                    <Editor
                        height="100%"
                        defaultLanguage="shortMarkup"
                        theme="shortMarkupTheme"
                        value={inputText}
                        onChange={value => setInputText(value || "")}
                        beforeMount={editorWillMount}
                        options={editorOptions}
                    />
                </div>

                <div className="output-panel">
                    <Editor
                        height="100%"
                        defaultLanguage={outputType}
                        theme="vs-light"
                        value={result}
                        options={{
                            ...editorOptions,
                            readOnly: true,
                            domReadOnly: true,
                            renderValidationDecorations: "off",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ShortFormatConverter;
