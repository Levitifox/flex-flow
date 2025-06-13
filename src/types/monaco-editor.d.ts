declare module "@monaco-editor/react" {
    import { editor } from "monaco-editor";
    import * as React from "react";

    export interface EditorProps {
        height?: string | number;
        defaultLanguage?: string;
        defaultValue?: string;
        value?: string;
        theme?: string;
        options?: editor.IStandaloneEditorConstructionOptions;
        onChange?: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
        [key: string]: any;
    }

    declare const Editor: React.FC<EditorProps>;
    export default Editor;
}
