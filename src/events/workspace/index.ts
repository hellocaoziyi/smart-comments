import { Position, Range, TextDocument, TextEditorEdit, window, workspace } from 'vscode';

import defaultConfig from '../../config/default.config';
import { checkLineStartsWith, getConfigOptionCount, getModify } from '../../utils/index';

// Last save time
let lastSaveTime = 0;

// Last save file name
let lastFileName = '';

/**
 * File did save event handler
 */
export const onDidSaveTextDocument = (document: TextDocument) => {
  if (document.fileName === lastFileName) {
    const currentTime = new Date().getTime();
    const timeInterval = currentTime - lastSaveTime;
    if (timeInterval <= 5 * 1000) {
      return;
    }
  }

  lastSaveTime = new Date().getTime();
  lastFileName = document.fileName;

  // Get configuration from user settings
  const smartHeaderConfig = workspace.getConfiguration('smartHeader');
  const format = (smartHeaderConfig && smartHeaderConfig.format) || defaultConfig.format;
  const header = (smartHeaderConfig && smartHeaderConfig.header) || defaultConfig.header;

  // Selected activated file the very first time the command is executed
  const activeTextEditor = window.activeTextEditor;

  // Get modify entity
  const modifyEntity = getModify({ format, header }, document.fileName);
  const modifyTime = modifyEntity.modifyTime;
  const modifier = modifyEntity.modifier;

  const length = getConfigOptionCount(header);
  if (length > document.lineCount) {
    // Fixed line index out of document range
    return;
  }
  
  let mofidyTimeRange = new Range(new Position(0, 0), new Position(0, 0));
  let modifierRange = new Range(new Position(0, 0), new Position(0, 0));
  const modifyTimeStartsWith = modifyEntity.modifyTime.matchPrefix;
  const modifierStartsWith = modifyEntity.modifier.matchPrefix;

  for (let index = 0; index < length; index++) {
    // Get line text
    const linetAt = document.lineAt(index);
    const line = linetAt.text;

    // tslint:disable-next-line:max-line-length
    const isMofidyTimeLine = checkLineStartsWith(line, modifyTimeStartsWith);
    if (isMofidyTimeLine) {
      mofidyTimeRange = linetAt.range;
      continue;
    }

    const isModifierLine = checkLineStartsWith(line, modifierStartsWith);
    if (isModifierLine) {
      modifierRange = linetAt.range;
    }
  }

  const isUpdateModifyTime = !mofidyTimeRange.isEmpty && modifyTime.key && modifyTime.value;
  const isUpdateModifier = !modifierRange.isEmpty && modifier.key && modifier.value;

  if (!isUpdateModifyTime && !isUpdateModifier) {
    return;
  }

  // Update header
  activeTextEditor?.edit((editBuilder: TextEditorEdit) => {
    if (isUpdateModifyTime) {
      editBuilder.replace(mofidyTimeRange, modifyTime.value);
    }

    if (isUpdateModifier) {
      editBuilder.replace(modifierRange, modifier.value);
    }
  });
  setTimeout(() => {
    document.save();
  }, 200);
};