import * as vscode from 'vscode';

let statusbar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

export function activate(context: vscode.ExtensionContext) {
    // Initialize
    let STACK: string[] = [],
        TRASH: string[] = [];

    statusbar_item.show();
    statusbar_item.command = 'extension.stackedcopypaste.clear';
    function LOG() {
        statusbar_item.text = `Stacked Copy Paste: ${STACK.length}`;
    }
    LOG();

    // Copy
    const copy = vscode.commands.registerCommand('extension.stackedcopypaste.copy', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = new vscode.Range(editor.selection.start, editor.selection.end);
            const text = editor.document.getText(selection);
            STACK.push(text);
            LOG();
        }
    });
    context.subscriptions.push(copy);

    // Cut
    const cut = vscode.commands.registerCommand('extension.stackedcopypaste.cut', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = new vscode.Range(editor.selection.start, editor.selection.end);
            const text = editor.document.getText(selection);
            editor.edit(editBuilder => {
                editBuilder.delete(selection);
            });
            STACK.push(text);
            LOG();
        }
    });
    context.subscriptions.push(cut);


    // Paste
    const paste = vscode.commands.registerCommand('extension.stackedcopypaste.paste', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const start = editor.selection.start;
            const selection = new vscode.Range(start, editor.selection.end);
            editor.edit((editBuilder) => {
                editBuilder.delete(selection);
                const text: string = STACK.pop() || '';
                editBuilder.insert(start, text);
                TRASH.push(text);
                LOG();
            });
        }
    });
    context.subscriptions.push(paste);

    // Undo
    const undo = vscode.commands.registerCommand('extension.stackedcopypaste.undo', () => {
        const text = TRASH.pop();
        if (text) { 
            STACK.push(text);
            LOG();
        }
    });
    context.subscriptions.push(undo);


    // Clear
    let clear = vscode.commands.registerCommand('extension.stackedcopypaste.clear', () => {
        STACK = [];
        TRASH = [];
        LOG();
    });
    context.subscriptions.push(clear);
}

export function deactivate() {
    statusbar_item.dispose();
}
