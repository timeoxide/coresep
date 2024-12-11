import type { ICrsContainer, ICrsFactory } from "@/abstractions";
import { IInitiator } from "@/abstractions/initiator.abstraction";
import { Command, CommandModule } from "@/models";
import { PreloadedInitiator } from "./initiator.preloaded";
import { LazyInitiator } from "./initiator.lazy";
import { DefaultContainer } from "./container.default";

/**
 * An implementation of the `ICrsFactory` interface used to create container.
 *
 * This factory allows registering commands and modules, and builds container
 * instances based on the configuration and provided commands.
 */
export class DefaultFactory implements ICrsFactory {

    // #region props

    /**
     * Flag indicating if the container will be assigned to `window.crs`.
     */
    private _asWindowProp: boolean = false;

    /**
     * Internal map storing registered initiators for commands.
     */
    private _initiators: Map<string, IInitiator> = new Map();

    /**
     * Getter for the internal map of registered initiators.
     * 
     * ---
     * @returns The map of registered initiators.
     */
    public get initiators(): Map<string, IInitiator> {
        return this._initiators;
    }
    // #endregion


    /**
     * Default constructor for the `DefaultFactory`.
     */
    constructor() { }


    /**
     * Factory method to create a new instance of `DefaultFactory`.
     * Use this to chain the commands.
     * 
     * ---
     * ## **Example Usage:**
     * ```typescript
     * ...
     * const container = Factory.new()
     *      .RegisterModule(myModule)
     *      .AsWindowProp()
     *      .build()
     * ...
     * ```
     * 
     * ---
     * @returns A new instance of `DefaultFactory`.
     */
    public static new() { return new DefaultFactory() };


    /**
     * Builds a new `ICrsContainer` instance with the registered commands and
     * modules. if `AsWindowProp` is called. it will also assign it to
     * `window.crs`.
     * 
     * ---
     * @returns The built `ICrsContainer` instance.
     */
    public Build(): ICrsContainer {
        const container = new DefaultContainer(this.initiators);
        if (this._asWindowProp) {
            (window as any)["crs"] = container;
        }
        return container;
    }


    /**
     * Configures the factory to assign the container to `window.crs` during the build.
     * 
     * ---
     * @returns The configured factory instance.
     */
    public AsWindowProp() {
        this._asWindowProp = true;
        return this;
    }


    /**
     * Registers a single command to be added to container.
     * 
     * The command is registered with its name and version (if available) as the key, 
     * and wrapped in a `PreloadedInitiator`. Hence it will not load asynchronously.
     * 
     * ---
     * @param command The command to register.
     * @returns The configured factory instance.
     */
    public RegisterCommand(command: Command) {
        this.initiators.set(`${command.name}${command.version ? '@' : ''}${command.version ?? ''}`, new PreloadedInitiator(command));
        return this;
    }


    /**
     * Registers a module containing multiple commands with the factory. 
     * 
     * Dependending on the type of the registered command (lazy or eager),
     * it uses the correct initiator to hold the command for usage
     * 
     * ---
     * @param module The module containing commands to register.
     * @returns The configured factory instance.
     */
    public RegisterModule(module: CommandModule) {
        for (const key in module.commands) {
            if (!Object.prototype.hasOwnProperty.call(module.commands, key)) { continue; }
            const command = module.commands[key];
            if (typeof command == 'function') {
                const name = `${module.name}.${key}`;
                this.initiators.set(name, new LazyInitiator(command, name));
            }
            else {
                this.initiators.set(`${command.name}${command.version ? '@' : ''}${command.version ?? ''}`, new PreloadedInitiator(command));
            }
        }
        return this;
    }
}
