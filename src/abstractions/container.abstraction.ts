import { Command } from "@/models";

/**
 * Represents a container for commands.
 *
 * This interface provides methods to retrieve and invoke commands by their names. 
 *
 * @template TModel The model type for the command.
 * @template TResult The result type of the command.
 */
export interface ICrsContainer {

    /**
     * Retrieves a command by its name.
     *
     * ---
     * @param name The name of the command to retrieve.
     * @returns A Promise that resolves to the retrieved command.
     */
    getCommand<TModel = void, TResult = void>(name: string): Promise<Command<TModel, TResult>>;


    /**
     * Invokes a command by its name with the specified model.
     *
     * ---
     * @param name The name of the command to invoke.
     * @param model The model to pass to the command.
     * @returns A Promise that resolves to the result of the command.
     */
    invoke<TModel = void, TResult = void>(name: string, model?: TModel): Promise<TResult>;
}
