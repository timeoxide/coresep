import { Command } from "./command.model";
import { File } from "./file.model";

export interface WCommand<TModel = void, TResult = void, TMeta = any> {
  command: Command<TModel, TResult, TMeta>;
  file: File;
}
