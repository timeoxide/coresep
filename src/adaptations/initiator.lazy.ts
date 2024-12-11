import { IInitiator } from "@/abstractions";
import { Command } from "@/models";
import { errorer } from "./errorer.default";
import { ERRORS } from "@/constants/errors.const";

/**
 * A lazy-loading mechanism for commands.
 *
 * This class provides a way to lazily load commands, ensuring they are only loaded when needed. 
 * It handles potential errors during the loading process and provides informative error messages.
 * 
 * ---
 * 
 * ## **Example Usage:**
 *
 * ```typescript
 * ...
 * const lazyInitiator = new LazyInitiator(async () => import('/path/to/command'), 'commandName');
 *
 * // Load the command when needed:
 * await lazyInitiator.load();
 *
 * // Access the loaded command:
 * const command = lazyInitiator.get();
 * ...
 * ```
 *
 * ---
 * @template TModel The model type for the command.
 * @template TResult The result type of the command.
 * @template TMeta Additional metadata associated with the command.
 */
export class LazyInitiator<TModel = void, TResult = void, TMeta = any> implements IInitiator<TModel, TResult, TMeta> {

    private _command?: Command<TModel, TResult, TMeta>;
    /**
     * Gets the loaded command.
     *
     * ---
     * @throws {Error} If the command has not been loaded yet.
     */
    public get command(): Command<TModel, TResult, TMeta> {
        if (!this._command) {
            errorer.select(ERRORS.CommandNotFound)
                .withContext(`Failed to find the command: ${this.commandName}. Perhaps you forgot to call \`load\` beforehand.`)
                .throw();
        }
        return this._command!;
    }


    /**
     * Constructs a new `LazyInitiator` instance.
     *
     * ---
     * @param importer An asynchronous function that returns the command to be loaded.
     * @param commandName The optional name of the command, used for error messages.
     */
    constructor(private importer: () => Promise<Command<TModel, TResult, TMeta>>, private commandName?: string) { }


    /**
     * Loads the command asynchronously.
     * 
     * ---
     * @throws {Error} If an error occurs during the loading process.
     */
    public async load(): Promise<void> {
        try {
            this._command = await this.importer();
        } catch (error: any) {
            errorer
                .select(ERRORS.CommandLoadFailed)
                .withContext(`Failed to load the command: ${this.commandName}\n${error.stack}`)
                .throw();
        }
    };

    /**
     * Returns the command, which is loaded asynchronously.
     * 
     * ---
     * @returns The command
     * @throws {Error} If the command has not been loaded yet.
     */
    get(): Command<TModel, TResult, TMeta> {
        return this.command;
    };
}