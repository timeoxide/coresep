import { CommandFileWrapper } from "@/models";

/**
 * Represents a container for commands.
 *
 * This interface provides methods to retrieve and invoke commands by their names.
 *
 * @template TModel The model type for the command.
 * @template TResult The result type of the command.
 */
export interface ICrsFileResolver {
  commandFile(absFile: string): Promise<CommandFileWrapper | undefined>;
  eachCommandFile(absDir: string): Promise<Array<CommandFileWrapper>>;
}
