export interface ElementNode {
    tag: string;
    attrs: Record<string, string>;
    styles?: Record<string, string>;
    textContent?: string;
    children: ElementNode[];
}

function parseStyleBlock(css: string): Record<string, string> {
    return css
        .split(/;+/)
        .map(rule => rule.trim())
        .filter(Boolean)
        .reduce<Record<string, string>>((out, rule) => {
            const [prop, val] = rule.split(/:\s*/, 2).map(s => s.trim());
            if (prop && val) out[prop] = val;
            return out;
        }, {});
}

/**
 * Parses a single line of the DSL into:
 *  - indent
 *  - tag
 *  - optional bare identifier (class)
 *  - any [.class|#id] identifiers
 *  - any [key=val] attrs
 *  - optional ="text content"
 *  - optional :{ css… }
 */
const LINE_RE =
    /^(?<indent>\s*)<(?<tag>[A-Za-z][\w-]*)>(?:\s+(?<bare>[\w-]+))?(?<idAndClasses>(?:[#.][\w-]+)*)(?<bracketAttrs>(?:\s*\[[^\]]+\])*)(?:\s*=\s*"(?<text>[^"]*)")?(?:\s*:\{(?<css>[^}]+)\})?\s*$/;

function parseBracketAttrs(raw: string): Record<string, string> {
    const out: Record<string, string> = {};
    const pairs = raw.match(/\[[^\]]+\]/g) || [];
    const PAIR_RE = /^\[([^\]=]+)=([^\]]+)\]$/;
    for (const pair of pairs) {
        const m = PAIR_RE.exec(pair);
        if (m) {
            const [, key, value] = m;
            out[key] = value;
        }
    }
    return out;
}

export function parseShortMarkup(input: string): ElementNode[] {
    const lines = input
        .replace(/\t/g, "  ")
        .split("\n")
        .map(l => l.replace(/\s+$/, ""))
        .filter(l => l.trim().length > 0);

    const root: ElementNode[] = [];
    const stack: { node: ElementNode; indent: number }[] = [];

    for (const rawLine of lines) {
        const m = LINE_RE.exec(rawLine);
        if (!m || !m.groups) {
            throw new Error(`Invalid syntax: "${rawLine}"`);
        }
        const { indent, tag, bare, idAndClasses, bracketAttrs, text, css } = m.groups;

        if (/[^ ]/.test(indent) || indent.length % 2 !== 0) {
            throw new Error(`Invalid indentation (use 2 spaces per level): "${rawLine}"`);
        }
        const level = indent.length / 2;

        const attrs: Record<string, string> = {};

        if (bare) {
            attrs.class = bare;
        }

        for (const token of idAndClasses.match(/[#.][\w-]+/g) || []) {
            if (token.startsWith("#")) {
                attrs.id = token.slice(1);
            } else {
                attrs.class = (attrs.class ? attrs.class + " " : "") + token.slice(1);
            }
        }

        Object.assign(attrs, parseBracketAttrs(bracketAttrs));

        const styles = css ? parseStyleBlock(css) : undefined;

        const node: ElementNode = {
            tag,
            attrs,
            styles,
            textContent: text,
            children: [],
        };

        while (stack.length && stack[stack.length - 1].indent >= level) {
            stack.pop();
        }
        if (stack.length === 0) {
            root.push(node);
        } else {
            stack[stack.length - 1].node.children.push(node);
        }
        stack.push({ node, indent: level });
    }

    return root;
}

function renderAttrs(attrs: Record<string, string>, styles: Record<string, string> | undefined, asJSX: boolean): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(attrs)) {
        const name = asJSX && key === "class" ? "className" : key;
        parts.push(`${name}="${value}"`);
    }

    if (styles) {
        if (asJSX) {
            const entries = Object.entries(styles)
                .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
                .join(", ");
            parts.push(`style={{ ${entries} }}`);
        } else {
            const cssText = Object.entries(styles)
                .map(([k, v]) => `${k}: ${v};`)
                .join(" ");
            parts.push(`style="${cssText}"`);
        }
    }

    return parts.length ? " " + parts.join(" ") : "";
}

function formatNode(node: ElementNode, asJSX: boolean, depth = 0): string {
    const pad = "  ".repeat(depth);
    const attrs = renderAttrs(node.attrs, node.styles, asJSX);
    const tag = node.tag;

    if (asJSX && !node.textContent && node.children.length === 0) {
        return `${pad}<${tag}${attrs} />`;
    }

    const open = `<${tag}${attrs}>`;
    const close = `</${tag}>`;

    if (!node.textContent && node.children.length === 0) {
        return `${pad}${open}${close}`;
    }

    let inner = "";
    if (node.textContent) {
        inner += `\n${pad}  ${node.textContent}`;
    }
    if (node.children.length) {
        inner += "\n" + node.children.map(child => formatNode(child, asJSX, depth + 1)).join("\n");
    }
    inner += `\n${pad}`;

    return `${pad}${open}${inner}${close}`;
}

export function generateFormattedHTML(input: string): string {
    const tree = parseShortMarkup(input);
    return tree.map(n => formatNode(n, false)).join("\n");
}

export function generateFormattedTSX(input: string): string {
    const tree = parseShortMarkup(input);
    return tree.map(n => formatNode(n, true)).join("\n");
}
