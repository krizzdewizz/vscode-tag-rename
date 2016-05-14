/**
 * Rename HTML/XML tags.
 */

import * as vs from 'vscode';
import * as fs from 'fs';

import { findMatchingEnd } from './core/rename';

class RenameProvider implements vs.RenameProvider {
    provideRenameEdits(document: vs.TextDocument, position: vs.Position, newName: string, token: vs.CancellationToken): vs.WorkspaceEdit | Thenable<vs.WorkspaceEdit> {
        const found = findMatchingEnd(document.getText(), document.offsetAt(position));

        if (!found) {
            return undefined;
        }

        const edit = new vs.WorkspaceEdit();
        const startPos = found.start + 1;
        edit.replace(document.uri, new vs.Range(document.positionAt(startPos), document.positionAt(startPos + found.name.length)), newName);

        const endPos = found.end + 2;
        edit.replace(document.uri, new vs.Range(document.positionAt(endPos), document.positionAt(endPos + found.name.length)), newName);
        return edit;
    }
}

export function activate(context: vs.ExtensionContext) {
    vs.languages.registerRenameProvider(['html', 'xml'], new RenameProvider());
}
