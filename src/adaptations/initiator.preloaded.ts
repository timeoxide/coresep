import { IInitiator } from "@/abstractions";
import { Command } from "@/models";

/**
 * A preloaded initiator that provides immediate access to a command.
 *
 * This class is used when a command is already available and doesn't require lazy loading.
 * It implements the `IInitiator` interface, allowing it to be used in scenarios where a lazy-loading initiator is expected.
 *
 * ---
 * ## **Example Usage:**
 *
 * ```typescript
 * ...
 * const initiator = new PreloadedInitiator(myCommand);
 * const command = initiator.get();
 * ...
 * ```
 *
 * ---
 * @template TModel The model type for the command.
 * @template TResult The result type of the command.
 * @template TMeta Additional metadata associated with the command.
 */
export class PreloadedInitiator<TModel = void, TResult = void, TMeta = any> implements IInitiator<TModel, TResult, TMeta> {

    /**
     * Creates a new `PreloadedInitiator` instance.
     *
     * ---
     * @param command The command to be used.
     * @returns A new `PreloadedInitiator` instance.
     */
    constructor(private _command: Command<TModel, TResult, TMeta>) { }

    /**
     * A no-op method that fulfills the `IInitiator` interface requirement.
     * This method does nothing, as the command is already preloaded.
     */
    load = async () => void 0;

    /**
     * Gets the preloaded command.
     *
     * ---
     * @returns The preloaded command.
     * @throws {Error} If the command has not been loaded yet.
     */
    get = () => this._command;
}