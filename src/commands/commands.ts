import CommandType from '../enums/commandType';
import ICommand from '../models/command';
import smartHeader from './smartHeader';

const commandList = new Map<CommandType, ICommand>([
  [CommandType.smartHeader, {handler: smartHeader}],
]);

export default commandList;