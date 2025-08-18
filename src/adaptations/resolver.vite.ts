import { ICrsFileResolver } from "@/abstractions";
import { CommandFileWrapper } from "@/models";
import { readFile } from "node:fs/promises";
import path from "path";
import fg from "fast-glob";
import * as esModuleLexer from "es-module-lexer";

export class ViteFileResolver implements ICrsFileResolver {
  /**
   * Default constructor for the `ViteFileResolver`.
   */
  constructor(private importDir: string) {}

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

  async commandFile(
    absolutePathToFile: string
  ): Promise<CommandFileWrapper | undefined> {
    const code = await readFile(absolutePathToFile, "utf-8");
    const [, exports] = esModuleLexer.parse(code);
    const hasAllExports = ["name", "handler"].every((e) =>
      exports.some((j) => j.n == e)
    );
    if (!hasAllExports) return undefined;
    const relPath = path.relative(
      path.resolve(this.importDir),
      absolutePathToFile
    );
    let importPath = "./" + relPath.replace(/\\/g, "/");
    if (importPath.endsWith(".js")) {
      importPath = importPath.slice(0, -3);
    } else if (importPath.endsWith(".ts")) {
      importPath = importPath.slice(0, -3);
    }
    const [name, version, exportKey] = await this.extractExportKey(code);
    if (name == "" || exportKey == "") return undefined;
    // Get parent folder name
    const parent = path.basename(path.dirname(absolutePathToFile));
    return {
      absolutePath: absolutePathToFile,
      importPath,
      name,
      version,
      exportKey,
      parent,
    };
  }

  async eachCommandFile(
    absolutePathToDir: string
  ): Promise<Array<CommandFileWrapper>> {
    const files = await fg(["**/*.js", "**/*.ts"], {
      cwd: absolutePathToDir,
      absolute: true,
    });

    const entries: Array<CommandFileWrapper> = [];

    for (const file of files) {
      const res = await this.commandFile(file);
      if (res) {
        entries.push(res);
      }
    }
    return entries;
  }
}
