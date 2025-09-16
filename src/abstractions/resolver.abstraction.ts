import { File, WModule } from "@/models";
import { IGracefulMap } from "./graceful-map.abstraction";
import { Lib } from "@/models/lib.model";

/**
 * Represents a container for commands.
 *
 * This interface provides methods to retrieve and invoke commands by their names.
 *
 * @template TModel The model type for the command.
 * @template TResult The result type of the command.
 */
export interface ICrsFileResolver {
  commandFile(absFile: string): Promise<File | undefined>;
  eachCommandFile(absDir: string): Promise<Array<File>>;
  resolveModules(absDir: string): Promise<IGracefulMap<string, File[]>>;
  resolveLibs(libs: Array<Lib>): Promise<IGracefulMap<string, WModule[]>>;
}
