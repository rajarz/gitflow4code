"use strict";
var vscode = require('vscode');
var gitflowUtils = require('../helpers/gitflowUtils');
function run(outChannel) {
    if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document)
        return;
    gitflowUtils.getGitRepositoryPath(vscode.window.activeTextEditor.document.fileName).then(function (gitRepositoryPath) {
        gitflowUtils.getStatus(gitRepositoryPath).then(showStatus, genericErrorHandler);
        function showStatus(log) {
            if (log.length === 0) {
                vscode.window.showInformationMessage('Nothing to show');
                return;
            }
            outChannel.append(log);
            outChannel.show();
        }
        function genericErrorHandler(error) {
            if (error.code && error.syscall && error.code === 'ENOENT' && error.syscall === 'spawn git')
                vscode.window.showErrorMessage('Cannot find git installation');
            else {
                outChannel.appendLine(error);
                outChannel.show();
                vscode.window.showErrorMessage('There was an error, please view details in output log');
            }
        }
    }).catch(function (error) {
        if (error.code && error.syscall && error.code === 'ENOENT' && error.syscall === 'spawn git')
            vscode.window.showErrorMessage('Cannot find git installation');
        else {
            outChannel.appendLine(error);
            outChannel.show();
            vscode.window.showErrorMessage('There was an error, please view details in output log');
        }
    });
}
exports.run = run;
//# sourceMappingURL=gitStatus.js.map