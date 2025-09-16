import { ICrsFileResolver } from "@/abstractions";
import { File, Module, WModule } from "@/models";
import { readFile } from "node:fs/promises";
import path from "path";
import fg from "fast-glob";
import * as esModuleLexer from "es-module-lexer";
import { IGracefulMap } from "@/abstractions/graceful-map.abstraction";
import { GracefulMap } from "./graceful-map.default";
import { errorer } from "./errorer.default";
import { ERRORS } from "@/constants/errors.const";
import { Lib } from "@/models/lib.model";

export class ViteFileResolver implements ICrsFileResolver {
  /**
   * Default constructor for the `ViteFileResolver`.
   */
  constructor(private importDir: string, private commandsDir: string) {}

  async resolveLibs(
    libs: Array<Lib>
  ): Promise<IGracefulMap<string, WModule[]>> {
    const result = new GracefulMap<string, WModule[]>("libs");
    for (const lib of libs) {
      const wmodules: WModule[] = [];
      for (const modKey in lib.modules) {
        const module: Module = {
          name: lib.modules[modKey].name,
          commands: lib.modules[modKey].commands,
        };
        const file: File = {
          exportName: lib.modules[modKey].name,
          parent: `${lib.name}`,
        };
        wmodules.push({
          file,
          module,
        });
      }
      if (wmodules.length > 0) {
        result.set(lib.name, wmodules);
      }
    }
    return result;
  }

  async resolveModules(
    absolutePathToDir: string
  ): Promise<IGracefulMap<string, File[]>> {
    const files = await this.eachCommandFile(absolutePathToDir);
    // Group commands by parent (namespace) using GracefulMap's Update
    const namespaces = new GracefulMap<string, File[]>("modules");
    for (const file of files) {
      const namespace = file.parent.replace(/[\/]/g, ".");
      if (
        namespaces.get(namespace)?.some((e) => e.exportName == file.exportName)
      ) {
        errorer
          .select(ERRORS.DuplicateCommandsInNamespace)
          .withContext(
            `Duplicate command ('${file.exportName}') found in namespace '${namespace}'.`
          )
          .throw();
      } else {
        namespaces.update(
          namespace,
          (c) => {
            c.push(file);
            return c;
          },
          []
        );
      }
    }
    return namespaces;
  }

  async extractExportKey(code: string): Promise<[string, string, string]> {
    // super naive, for now — could be improved with a real parser
    const nameMatch = code.match(/export\s+const\s+name\s*=\s*['"`](.*?)['"`]/);
    const versionMatch = code.match(
      /export\s+const\s+version\s*=\s*['"`](.*?)['"`]/
    );

    if (nameMatch) {
      return [
        nameMatch[1],
        versionMatch?.[1] ?? "",
        versionMatch?.[1] ? `${nameMatch[1]}@${versionMatch[1]}` : nameMatch[1],
      ];
    }

    return ["", "", ""];
  }

  async commandFile(absolutePathToFile: string): Promise<File | undefined> {
    const code = await readFile(absolutePathToFile, "utf-8");
    const [, exports] = esModuleLexer.parse(code);
    const hasAllExports = ["name", "handler"].every((e) =>
      exports.some((j) => j.n == e)
    );
    if (!hasAllExports) return undefined;
    const relPath = path.relative(
      path.resolve(this.importDir, "modules"),
      absolutePathToFile
    );
    let importPath = "./" + relPath.replace(/\\/g, "/");
    const [, , exportKey] = await this.extractExportKey(code);
    if (exportKey == "") return undefined;
    const commandsDirAbs = path.resolve(this.commandsDir);
    let afterCommandsDir = path
      .relative(commandsDirAbs, absolutePathToFile)
      .replace(/\\[^\\]*$/, "")
      .replace(/\\/g, ".");
    return {
      absPath: absolutePathToFile,
      relPath: importPath,
      exportName: `${afterCommandsDir}.${exportKey}`,
      parent: afterCommandsDir,
    };
  }

  async eachCommandFile(absolutePathToDir: string): Promise<Array<File>> {
    const files = await fg(["**/*.js", "**/*.ts"], {
      cwd: absolutePathToDir,
      absolute: true,
    });

    const entries: Array<File> = [];

    for (const file of files) {
      const res = await this.commandFile(file);
      if (res) {
        entries.push(res);
      }
    }
    return entries;
  }
}
