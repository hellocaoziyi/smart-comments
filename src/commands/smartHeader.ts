import defaultConfig from '../config/default.config';
import ErrorType from '../enums/errorType';
import { generateHeaderTemplate } from '../utils/index';
import * as vscode from 'vscode';

const smartHeader = () => {
  // Get configuration from user settings
  const smartHeaderConfig = vscode.workspace.getConfiguration('smartHeader');
  const format = (smartHeaderConfig && smartHeaderConfig.format) || defaultConfig.format;
  const header = (smartHeaderConfig && smartHeaderConfig.header) || defaultConfig.header;

  // Selected activated file the very first time the command is executed
  const activeTextEditor = vscode.window.activeTextEditor;

  activeTextEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
    try {
      const filePath = activeTextEditor.document.fileName;
      const headerTemplate = generateHeaderTemplate({format, header}, filePath);

      // Insert Header
      editBuilder.insert(new vscode.Position(0, 0), headerTemplate);
    } catch (error) {
      throw (new Error(ErrorType.InsertFailure));
    }
  });
};

export default smartHeader;
