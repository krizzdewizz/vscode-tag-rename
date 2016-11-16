import * as fs from 'fs';

import { findMatchingEnd } from '../src/core/rename';

describe('no-end-tag.html', () => {

    const fileName = './spec-env/no-end-tag.html';
    const content = fs.readFileSync(fileName).toString();

    it('should find matching end position', () => {
        expect(findMatchingEnd(content, 1, true)).toEqual({ length: 7, start: 1, end: 90 });
        expect(findMatchingEnd(content, 13, true)).toEqual({ length: 3, start: 10, end: 84 }); // div
        expect(findMatchingEnd(content, 27, true)).toEqual({ length: 3, start: 27, end: 78 }); // div
        expect(findMatchingEnd(content, 44, true)).toEqual({ length: 4, start: 44, end: 51 }); // span
        expect(findMatchingEnd(content, 60, true)).toEqual({ length: 5, start: 57 }); // input
        expect(findMatchingEnd(content, 64, true)).toEqual({ length: 4, start: 64, end: 71 }); // span
        expect(findMatchingEnd(content, 79, true)).toEqual({ length: 3, start: 27, end: 78 }); // div
        expect(findMatchingEnd(content, 84, true)).toEqual({ length: 3, start: 10, end: 84 }); // div
    });
});

describe('simple html', () => {

    const text = '<body></body>';

    it('should find no match', () => {
        expect(findMatchingEnd(text, 0, true)).toBeUndefined();
    });

    it('should find end', () => {
        expect(findMatchingEnd(text, 1, true)).toEqual({ length: 4, start: 1, end: 8 });
    });
});

