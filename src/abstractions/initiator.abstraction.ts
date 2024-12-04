import { Command } from "@/models";

/**
* The `IInitiator` interface defines a contract for lazy-loading and accessing commands.
* It provides a mechanism to ensure that commands are loaded before they are used, 
* which is particularly useful for lazily loaded commands.
*
* ---
* ## **Example Usage:**
*
* ```typescript
* const initiator: IInitiator<MyModel, MyResult, MyMeta> = ...;
*
* // Load the command:
* await initiator.load();
*
* // Access the loaded command:
* const command = initiator.get();
* ```
*
* ---
* @template TModel The model type for the command.
* @template TResult The result type of the command.
* @template TMeta Additional metadata associated with the command.
*/
export interface IInitiator<TModel = void, TResult = void, TMeta = any> {

    /**
     * Loads the command asynchronously.
     * 
     * ---
     * @throws {Error} If an error occurs during the loading process.
     */
    load: () => Promise<void>,

    /**
     * Gets the loaded command.
     *
     * ---
     * @returns The loaded command.
     * @throws {Error} If the command has not been loaded yet.
     */
    get: () => Command<TModel, TResult, TMeta>;
}
