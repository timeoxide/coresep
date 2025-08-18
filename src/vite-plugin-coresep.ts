import { PluginOption } from "vite";
import type { CommandFileWrapper, VitePluginOptions } from "./models";
import * as esModuleLexer from "es-module-lexer";
import { ViteFileResolver } from "./adaptations";
import { ViteGlueGenerator } from "./adaptations/generator.vite";

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
export default function autoCoresep(options?: VitePluginOptions): PluginOption {
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
   * resolver is responsible to handle resolving files to `CommandFileWrapper`
   */
  const resolver = options?.resolver ?? new ViteFileResolver(absoluteOutDir);

  /**
   * generator is responsible to handle generating glue files.
   */
  const generator =
    options?.generator ?? new ViteGlueGenerator(absoluteOutDir, isTs);

  /**
   * A list of files tht are already added to the glue
   */
  const commandFiles = new Map<string, CommandFileWrapper>();

  return {
    /**
     * teh name of the plugin
     */
    name: "vite-plugin-coresep",

    /**
     * called once, it will retrieve all the existing commands.
     * after which `watchChange` is utilized to retrieve newly added or
     * remove deleted files from the list
     */
    async buildStart() {
      try {
        // wait for es-module-lexer to completely initialize
        await esModuleLexer.init;

        // add the folder to watch list
        this.addWatchFile(commandsDir);

        // resolve every command file under input folder
        const res = await resolver.eachCommandFile(absoluteCommandsDir);

        // add all of the resolved files to `commandFiles`
        res.forEach((e) => {
          commandFiles.set(e.absolutePath, e);
        });

        // notify the generator to update the automated glue
        await notifyGlueGenerator();
      }catch{}
    },

    /**
     * called when a file changes
     * @param id id of the file
     * @param param1 contains the event, which has taken place, create / update / delete
     * @returns promise
     */
    async watchChange(id, { event }) {
      try {
        // check if the file is in the target folder and is js or ts
        const isInInputFolder = id.startsWith(absoluteCommandsDir);

        if (!isInInputFolder || (!id.endsWith(".js") && !id.endsWith(".ts"))) {
          return;
        }

        // if the file is deleted attempt to remove it from `commandFiles`;
        if (event == "delete") {
          // since there is no draw back we will try to delete every file from
          // it without checking if it is there ;D
          commandFiles.delete(id);
        }
        // if it is updated or created check, if it is not in the list
        else {
          // try resolving it
          const cfw = await resolver.commandFile(id);

          if (!cfw) {
            // if not a command delete it
            commandFiles.delete(id);
          } else {
            // if a command add it to `commandFiles`
            commandFiles.set(id, cfw);
          }
        }

        // update the glue
        await notifyGlueGenerator();
      }catch{}
    },
  };

  async function notifyGlueGenerator() {
    if (options?.verbose) {
      console.log(
        "\x1b[32m\x1b[1m%s\x1b[0m",
        `  [coresep] \x1b[0mGenerating glue files... (${commandFiles.size} command(s).)`
      );
    }
    await generator.generateGlue([...commandFiles.values()]);
  }
}
