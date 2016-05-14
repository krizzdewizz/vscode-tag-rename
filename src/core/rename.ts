import * as parse from 'parse5';

function inRange(pos: number, start: number, len: number): boolean {
    return start < pos && pos <= (start + len + 1);
}

interface StartPositions {
    [k: string]: parse.LocationInfo;
}

export interface Match {
    name: string;
    start: number;
    end: number;
};

export function findMatchingEnd(text: string, pos: number): Match {

    const starts: StartPositions = {};
    let depth = 0;
    let startFound: { name: string, depth: number, position: number };
    let startMatch: Match;
    let endMatch: Match;

    function toId(name: string) {
        return name + depth;
    }

    const parser = new parse.SAXParser({ locationInfo: true });
    parser.on('startTag', (name: string, attrs, selfClosing, location: parse.LocationInfo) => {
        starts[toId(name)] = location;
        if (inRange(pos, location.startOffset, name.length)) {
            startFound = { name, depth, position: location.startOffset };
        }
        depth++;
    });

    parser.on('endTag', (name: string, location: parse.LocationInfo) => {
        depth--;
        if (startFound && startFound.name === name && startFound.depth === depth) {
            endMatch = { name, start: startFound.position, end: location.startOffset };
            parser.stop();
        } else if (inRange(pos, location.startOffset + 1, name.length)) {
            startMatch = { name, start: starts[toId(name)].startOffset, end: location.startOffset };
            parser.stop();
        }
    });

    parser.end(text);

    return endMatch || startMatch;
}