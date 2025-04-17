import type { Command, CommandModule } from "@/models"
import type { ICrsContainer } from "./container.abstraction"

/**
 * Represents a factory for creating `ICrsContainer` instances.
 *
 * This interface provides methods to configure and build the container.
 * 
 * ---
 * @template TModel The model type for the commands.
 * @template TResult The result type of the commands.
 */
export interface ICrsFactory {

    /**
    * Builds the `ICrsContainer` instance with the configured commands and modules.
    *
    * ---
    * @returns The built `ICrsContainer` instance.
    */
    Build(): ICrsContainer;

    /**
     * Configures the factory to assign the container to window properties.
     *
     * ---
     * @returns The configured factory instance.
     */
    Singlton(): ICrsFactory;

    /**
     * Registers a command to be included in the container.
     *
     * ---
     * @param command The command to register.
     * @returns The configured factory instance.
     */
    RegisterCommand(command: Command): ICrsFactory;

    /**
     * Registers a module containing commands to be included in the container.
     *
     * ---
     * @param module The module containing commands.
     * @returns The configured factory instance.
     */
    RegisterModule(module: CommandModule): ICrsFactory;
}
