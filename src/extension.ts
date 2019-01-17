// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let STACK: string[] = [];
    let TRASH: string[] = [];
    let copy = vscode.commands.registerCommand('extension.copypaste.copy', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let selection = new vscode.Range(editor.selection.start, editor.selection.end);
            let text = editor.document.getText(selection);
            STACK.push(text);
            vscode.window.showInformationMessage(STACK.join('\n'));
        }
    });
    context.subscriptions.push(copy);
    let paste = vscode.commands.registerCommand('extension.copypaste.paste', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let start = editor.selection.start;
            let selection = new vscode.Range(start, editor.selection.end);
            editor.edit((editBuilder) => {
                editBuilder.delete(selection);
                let text: string = STACK.pop() || '';
                editBuilder.insert(start, text);
                TRASH.push(text);
            });
        }
    });
    context.subscriptions.push(paste);
}

// this method is called when your extension is deactivated
export function deactivate() { }
