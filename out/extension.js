"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let statusBarItem;
let disposables = [];
function activate(context) {
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.name = 'Caret Counter';
    context.subscriptions.push(statusBarItem);
    // Listen for selection changes
    const selectionChangeDisposable = vscode.window.onDidChangeTextEditorSelection(updateCaretCount);
    // Listen for active editor changes
    const activeEditorChangeDisposable = vscode.window.onDidChangeActiveTextEditor(updateCaretCount);
    disposables.push(selectionChangeDisposable, activeEditorChangeDisposable);
    context.subscriptions.push(...disposables);
    // Initial update
    updateCaretCount();
}
exports.activate = activate;
function updateCaretCount() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        statusBarItem.hide();
        return;
    }
    const selections = editor.selections;
    const selectionCount = selections.length;
    // Only show when there are multiple selections
    if (selectionCount > 1) {
        // Check if all selections contain the same text (for "same word" multiselect)
        const firstSelectionText = editor.document.getText(selections[0]);
        const allSameText = selections.every(selection => {
            const text = editor.document.getText(selection);
            return text === firstSelectionText && text.length > 0;
        });
        if (allSameText && firstSelectionText.trim().length > 0) {
            statusBarItem.text = `$(selection) ${selectionCount} selections`;
            statusBarItem.tooltip = `${selectionCount} instances of "${firstSelectionText}" selected`;
            statusBarItem.show();
        }
        else {
            // Show generic count for multiple selections that aren't the same
            statusBarItem.text = `$(selection) ${selectionCount} carets`;
            statusBarItem.tooltip = `${selectionCount} selections active`;
            statusBarItem.show();
        }
    }
    else {
        statusBarItem.hide();
    }
}
function deactivate() {
    disposables.forEach(d => d.dispose());
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map