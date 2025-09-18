// import { type PluginOption } from "vite";
import type { VitePluginOptions, File, WModule } from "./models";
import * as esModuleLexer from "es-module-lexer";
import { ViteFileResolver } from "./adaptations";
import { ViteGlueGenerator } from "./adaptations/generator.vite";
import { GracefulMap } from "./adaptations/graceful-map.default";
import { emptyDirSync } from "fs-extra";

/**
 * trims . and \ and ./ from the start and replaces \ with /
 * @param input the path
 * @returns prepared path
 */
function preparePath(input: string): string {
  return input.replace(/\\/g, "/").replace(/^(\.\/|[./]+)/, "");
}

/**
 *
 * Manages your commands on its own, Just sit back and relax.
 * #### ___Oh! and don't forget to call `initializeCoresep`___
 *
 * @param options options can be provided for controlling glue codes'
 *                directory and commands' directory
 *
 * @returns the plugin
 */
export default function autoCoresep(options?: VitePluginOptions): any {
  /**
   * namespace
   */
  const namespace = options?.namespace ?? "default";

  /**
   * Are we doin typescript?
   */
  const isTs = options?.isTs ?? true;

  /**
   * the folder from which all the commands are retrieved
   */
  const commandsDir = preparePath(options?.commandsDir ?? "src/commands");

  /**
   * the folder in which the glue will be generated
   */
  const outDir = preparePath(options?.outDir ?? "src/lib/coresep");

  /**
   * the absolute path to output directory
   */
  const absoluteOutDir = `${preparePath(process.cwd())}/${outDir}`;

  /**
   * the absolute path to input folder
   */
  const absoluteCommandsDir = `${preparePath(process.cwd())}/${commandsDir}`;

  /**
   * is it a library or an application
   */
  const isLib = !!options?.lib;

  /**
   * should it emit the export to the `package.json` file
   */
  const libShouldEmitPackageJson = options?.lib?.emitPackageJson ?? false;

  /**
   * should it emit a gitignore to the outDir
   */
  const shouldEmitGitIgnore = options?.emitGitIgnore ?? true;

  /**
   * should it emit outDir to `tsconfig.json`'s exclude
   * it causes problems with exporting types, watch out!
   */
  const shouldEmitTsConfigExclude = options?.emitTsConfigExclude ?? false;

  /**
   * resolver is responsible to handle resolving files to `CommandFileWrapper`
   */
  const resolver =
    options?.resolver ??
    new ViteFileResolver(absoluteOutDir, absoluteCommandsDir);

  /**
   * generator is responsible to handle generating glue files.
   */
  const generator =
    options?.generator ??
    new ViteGlueGenerator(absoluteOutDir, isTs, isLib, namespace);

  /**
   * A list of files tht are already added to the glue
   */
  const modules = new GracefulMap<string, File[]>("modules");

  /**
   * the libs
   */
  const libs = new GracefulMap<string, WModule[]>("libs");

  return {
    /**
     * the name of the plugin
     */
    name: options?.customPluginName ?? "vite-plugin-coresep",

    /**
     * called once, it will retrieve all the existing commands.
     * after which `watchChange` is utilized to retrieve newly added or
     * remove deleted files from the list
     */
    async buildStart() {
      try {
        // If clearOutDir is set, empty the output directory
        if (options?.clearOutDir) {
          /**
           * Clears the output directory before generating glue files.
           * Uses fs-extra's emptyDirSync for safety and cross-platform support.
           */
          emptyDirSync(absoluteOutDir);
        }

        // wait for es-module-lexer to completely initialize
        await esModuleLexer.init;

        // add the folder to watch list
        this.addWatchFile(commandsDir);

        // resolve every command file under input folder
        const res = await resolver.resolveModules(absoluteCommandsDir);

        // add all of the resolved files to `commandFiles`
        for (const [k, v] of res.entries()) {
          modules.set(k, v);
        }

        // resolve the libs from input
        const libsRes = await resolver.resolveLibs(options?.libs ?? []);

        // add all of the resolved files to `commandFiles`
        for (const [k, v] of libsRes.entries()) {
          libs.set(k, v);
        }

        // notify the generator to update the automated glue
        await notifyGlueGenerator();
      } catch (error) {
        console.log(
          "\x1b[31m\x1b[1m%s\x1b[0m",
          `  [coresep] \x1b[0mError: ${error}`
        );
      }
    },

    /**
     * called when a file changes
     * @param id id of the file
     * @param param1 contains the event, which has taken place, create / update / delete
     * @returns promise
     */
    async watchChange(id: any, { event }: any) {
      try {
        // check if the file is in the target folder and is js or ts
        const isInInputFolder = id.startsWith(absoluteCommandsDir);

        if (!isInInputFolder || (!id.endsWith(".js") && !id.endsWith(".ts"))) {
          return;
        }

        // if the file is deleted attempt to remove it from all modules by absPath
        if (event == "delete") {
          for (const [modKey, files] of modules.entries()) {
            const idx = files.findIndex((f) => f.absPath === id);
            if (idx !== -1) {
              files.splice(idx, 1);
              // If the module is now empty, remove the module key
              if (files.length === 0) {
                modules.delete(modKey);
              } else {
                modules.set(modKey, files);
              }
              break;
            }
          }
        }
        // if it is updated or created check, if it is not in the list
        else {
          // try resolving it
          const file = await resolver.commandFile(id);

          if (!file) {
            // if not a command delete it
            for (const [modKey, files] of modules.entries()) {
              const idx = files.findIndex((f) => f.absPath === id);
              if (idx !== -1) {
                files.splice(idx, 1);
                // If the module is now empty, remove the module key
                if (files.length === 0) {
                  modules.delete(modKey);
                } else {
                  modules.set(modKey, files);
                }
                break;
              }
            }
          } else {
            // Add or update the file in the correct module (namespace)
            const namespace = file.parent.replace(/[\/]/g, ".");
            modules.update(
              namespace,
              (arr: File[]) => {
                // Remove any previous file with the same exportName
                const filtered = arr.filter(
                  (f) => f.exportName !== file.exportName
                );
                filtered.push(file);
                return filtered;
              },
              [file]
            );
          }
        }

        // update the glue
        await notifyGlueGenerator();
      } catch (error) {
        console.log(
          "\x1b[31m\x1b[1m%s\x1b[0m",
          `  [coresep] \x1b[0mError: ${error}`
        );
      }
    },
  };

  async function notifyGlueGenerator() {
    if (options?.verbose) {
      const totalFiles = [...modules.values()].reduce(
        (sum, arr) => sum + arr.length,
        0
      );
      console.log(
        "\x1b[32m\x1b[1m%s\x1b[0m",
        `  [coresep] \x1b[0mGenerating glue files...`
      );
      console.log(
        "\x1b[32m\x1b[1m%s\x1b[0m",
        `  [coresep] \x1b[0m${modules.size} module(s).`
      );
      console.log(
        "\x1b[32m\x1b[1m%s\x1b[0m",
        `  [coresep] \x1b[0m${totalFiles} command(s).`
      );
    }

    await generator.generateGlue(modules, libs, isLib, isTs);
    if (libShouldEmitPackageJson) {
      await generator.emitPackageJson();
    }
    if (shouldEmitGitIgnore) {
      await generator.emitGitIgnore();
    }
    if (shouldEmitTsConfigExclude) {
      await generator.emitTsConfigExclude();
    }
  }
}
