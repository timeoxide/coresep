import { ICrsFileResolver, ICrsGlueGenerator } from "@/abstractions";
import { Lib } from "./lib.model";

/**
 * Options for configuring the vite-plugin-coresep plugin.
 *
 * All options are optional. Defaults are shown below and reflect the plugin's internal logic.
 */
export interface VitePluginOptions {
  /**
   * Whether to use TypeScript for generated files and type support.
   * @default true
   */
  isTs?: boolean;

  /**
   * Enable verbose logging during glue generation.
   * @default false
   */
  verbose?: boolean;

  /**
   * Directory containing command modules (relative to project root).
   * @default "src/commands"
   */
  commandsDir?: string;

  /**
   * Directory where glue code will be generated (relative to project root).
   * @default "src/lib/coresep"
   */
  outDir?: string;

  /**
   * Namespace for generated glue code and modules.
   * @default "default"
   */
  namespace?: string;

  /**
   * Library-specific options.
   */
  lib?: {
    /**
     * If true, emit the exports field to package.json for the library.
     * @default false
     */
    emitPackageJson?: boolean;
  };

  /**
   * List of libraries to resolve and include in glue generation.
   * @default []
   */
  libs?: Array<Lib>;

  /**
   * If true, emit a .gitignore file to the output directory.
   * @default true
   */
  emitGitIgnore?: boolean;

  /**
   * If true, add the output directory to tsconfig.json's exclude array.
   * 
   * ___watch out!___ it causes problems with exporting types
   * @default true (if isTs is true)
   */
  emitTsConfigExclude?: boolean;

  /**
   * Custom name for the Vite plugin (for debugging or multiple plugin instances).
   * @default "vite-plugin-coresep"
   */
  customPluginName?: string;

  /**
   * If true, clear the output directory before generating glue files.
   * @default false
   */
  clearOutDir?: boolean;

  /**
   * Custom glue code generator (advanced usage).
   * If not provided, the default ViteGlueGenerator is used.
   */
  generator?: ICrsGlueGenerator;

  /**
   * Custom file resolver (advanced usage).
   * If not provided, the default ViteFileResolver is used.
   */
  resolver?: ICrsFileResolver;
}
