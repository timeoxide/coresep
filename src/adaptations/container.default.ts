import type { ICrsContainer } from "@/abstractions";
import { IInitiator } from "@/abstractions/initiator.abstraction";
import { Command } from "@/models";
import { errorer } from "./errorer.default";
import { ERRORS } from "@/constants/errors.const";

/**
 * An implementation of the `ICrsContainer` interface.
 * 
 * This container is used to hold commands, and invoke them on demand.
 * Lazy loaded commands will be loaded on demand.
 */
export class DefaultContainer implements ICrsContainer {

    /**
     * Default constructor for the `DefaultContainer`.
     */
    constructor(private initiators: Map<string, IInitiator>) { }


    /**
     * Loads and gets the command.
     * 
     * ---
     * @param name the name of the command and its respective module; example: `myModule.myCommand@version`.
     * @returns the loaded command.
     */
    public async getCommand<TModel = void, TResult = void, TMeta = any>(name: string): Promise<Command<TModel, TResult>> {

        const initiator = this.initiators.get(name) as IInitiator<TModel, TResult, TMeta>;
        if (!initiator)
            errorer
                .select(ERRORS.CommandNotFound)
                .withContext(`present initiators: ${JSON.stringify(this.initiators.keys())}`)
                .throw();

        await initiator.load();
        return initiator.get();
    }


    /**
     * Loads, and tehn invokes the command.
     * 
     * ---
     * @param name the name of the command and its respective module; example: `myModule.myCommand@version`.
     * @param model the model to invoke the command with.
     * @returns the result of the command.
     */
    public async invoke<TModel = any | undefined, TResult = any | undefined>(name: string, model?: TModel): Promise<TResult> {
        const command = await this.getCommand<TModel, TResult>(name);
        const commandHandler: any = command.handler;
        let result = await Promise.resolve(commandHandler(model));
        return result;
    }
}
