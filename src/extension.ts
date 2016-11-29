/**
 * Rename HTML/XML tags.
 */

import * as vs from 'vscode';
import * as fs from 'fs';

import { findMatchingEnd } from './core/rename';

const RENAME_PROVIDERS = ['html', 'xml', 'php'];

class RenameProvider implements vs.RenameProvider {
    provideRenameEdits(document: vs.TextDocument, position: vs.Position, newName: string, token: vs.CancellationToken): vs.WorkspaceEdit | Thenable<vs.WorkspaceEdit> {
        const found = findMatchingEnd(document.getText(), document.offsetAt(position), document.languageId !== 'xml');

        if (!found) {
            return undefined;
        }

        const edit = new vs.WorkspaceEdit();
        const startPos = found.start;
        edit.replace(document.uri, new vs.Range(document.positionAt(startPos), document.positionAt(startPos + found.length)), newName);

        const endPos = found.end;
        if (typeof endPos === 'number') {
            edit.replace(document.uri, new vs.Range(document.positionAt(endPos), document.positionAt(endPos + found.length)), newName);
        }

        return edit;
    }
}

export function activate(context: vs.ExtensionContext) {
    vs.languages.registerRenameProvider(RENAME_PROVIDERS, new RenameProvider());
}
