declare module "react-syntax-highlighter/dist/esm/styles/prism" {
    const styles: { [key: string]: { [key: string]: string } };
    export const solarizedlight: typeof styles;
    export const tomorrow: typeof styles;
    // Add other themes as needed
}

declare module "react-syntax-highlighter" {
    import { ReactNode } from "react";

    export interface SyntaxHighlighterProps {
        language?: string;
        style?: { [key: string]: { [key: string]: string } };
        children?: ReactNode;
        [key: string]: any;
    }

    export const Prism: React.FC<SyntaxHighlighterProps>;
    export const Light: React.FC<SyntaxHighlighterProps>;
}
