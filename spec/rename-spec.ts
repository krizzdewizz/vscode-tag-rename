import * as fs from 'fs';

import { findMatchingEnd } from '../src/core/rename';

xdescribe('rename-spec-data.ts', () => {

    // todo

    const fileName = './spec/rename-spec-data.ts';
    const content = fs.readFileSync(fileName).toString();

    it('should find matching end position', () => {
        expect(findMatchingEnd(content, 1)).toBe(1);
    });
});

describe('simple html', () => {

    const text = '<body></body>';

    it('should find no match', () => {
        expect(findMatchingEnd(text, 0)).toBeUndefined();
    });

    it('should find end', () => {
        expect(findMatchingEnd(text, 1)).toEqual({ name: 'body', start: 0, end: 6 });
    });
});

