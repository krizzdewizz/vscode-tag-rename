import * as parse from 'parse5';

function inRange(pos: number, start: number, len: number): boolean {
    return start < pos && pos <= (start + len + 1);
}

interface StartPositions {
    [k: string]: parse.LocationInfo;
}

export interface Match {
    length: number;
    start: number;
    end?: number; // undefined if void or self-closing
};

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_ELEMENTS = {};
['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    .forEach(it => VOID_ELEMENTS[it] = true);

function isVoidElement(name: string): boolean {
    return VOID_ELEMENTS[name.toLowerCase()];
}

const START_LEN = 1; // <
const END_LEN = 2; // </

export function findMatchingEnd(text: string, pos: number, hasVoidElements: boolean): Match {

    const starts: StartPositions = {};
    let depth = 0;
    let startFound: { name: string, depth: number, position: number };
    let startMatch: Match;
    let endMatch: Match;

    const toId = (name: string) => name + depth;
    const isVoid: (name: string) => boolean = hasVoidElements ? isVoidElement : () => false;

    const parser = new parse.SAXParser({ locationInfo: true });
    parser.on('startTag', (name: string, attrs, selfClosing, location: parse.LocationInfo) => {
        const voidd = selfClosing || isVoid(name);
        starts[toId(name)] = location;
        if (inRange(pos, location.startOffset, name.length)) {
            if (voidd) {
                startMatch = { length: name.length, start: location.startOffset + START_LEN };
                parser.stop();
            } else {
                startFound = { name, depth, position: location.startOffset };
            }
        }
        if (!voidd) {
            depth++;
        }
    });

    parser.on('endTag', (name: string, location: parse.LocationInfo) => {
        depth--;
        if (startFound && startFound.name === name && startFound.depth === depth) {
            endMatch = { length: name.length, start: startFound.position + START_LEN, end: location.startOffset + END_LEN };
            parser.stop();
        } else if (inRange(pos, location.startOffset + 1, name.length)) {
            startMatch = { length: name.length, start: starts[toId(name)].startOffset + START_LEN, end: location.startOffset + END_LEN };
            parser.stop();
        }
    });

    parser.end(text);

    return endMatch || startMatch;
}