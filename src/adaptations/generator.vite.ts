import { ICrsGlueGenerator } from "@/abstractions";
import { IGracefulMap } from "@/abstractions/graceful-map.abstraction";
import { GLUE } from "@/constants/glue.const";
import { File, WModule } from "@/models";
import { parse } from "jsonc-parser";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export class ViteGlueGenerator implements ICrsGlueGenerator {
  /**
   * Default constructor for the `ViteFileResolver`.
   */
  constructor(
    private outDir: string,
    private isTs: boolean,
    private isLib: boolean,
    private namespace: string
  ) {}

  /**
   * Ensures that the TypeScript configuration (`tsconfig.json`) for the current project
   * includes the generator's output directory in the `exclude` array. This prevents
   * TypeScript from processing generated files during compilation.
   *
   * - Reads and parses the project's `tsconfig.json`.
   * - Normalizes the output directory path relative to the project root.
   * - Adds the output directory to the `exclude` array if not already present.
   * - Writes the updated configuration back to `tsconfig.json` if changes were made.
   *
   * @returns A promise that resolves when the operation is complete.
   * @throws {Error} If `tsconfig.json` cannot be read or is not valid JSON.
   */
  emitTsConfigExclude(): Promise<void> {
    return (async () => {
      const tsconfigPath = path.resolve(process.cwd(), "tsconfig.json");
      let tsconfigRaw: string;
      try {
        tsconfigRaw = await readFile(tsconfigPath, "utf-8");
      } catch (e) {
        throw new Error(`Could not read tsconfig.json at ${tsconfigPath}`);
      }
      let tsconfig: any;
      try {
        tsconfig = parse(tsconfigRaw);
      } catch (e) {
        throw new Error("tsconfig.json is not valid JSON/JSONC\n" + e);
      }
      if (!Array.isArray(tsconfig.exclude)) {
        tsconfig.exclude = [];
      }
      // Normalize outDir for tsconfig (relative to project root)
      let relOutDir = path
        .relative(process.cwd(), this.outDir)
        .replace(/\\/g, "/");
      if (!tsconfig.exclude.includes(relOutDir)) {
        tsconfig.exclude.push(relOutDir);
      }
      const newTsconfigRaw = JSON.stringify(tsconfig, null, 2) + "\n";
      if (newTsconfigRaw !== tsconfigRaw) {
        await writeFile(tsconfigPath, newTsconfigRaw, "utf-8");
      }
    })();
  }

  /**
   * Writes a .gitignore file to the output directory using the template from glue/gitignore.ts.
   */
  async emitGitIgnore(): Promise<void> {
    // Import the gitignore template
    const outFile = path.resolve(this.outDir, ".gitignore");
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, GLUE.GitIgnore());
  }

  /**
   * Ensures package.json has a default export pointing to the Vite output (dist/index.js).
   * Adds the export if not already present.
   */
  async emitPackageJson(): Promise<void> {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    let pkgRaw: string;
    try {
      pkgRaw = await readFile(pkgPath, "utf-8");
    } catch (e) {
      throw new Error("Could not read package.json");
    }
    let pkg: any;
    try {
      pkg = JSON.parse(pkgRaw);
    } catch (e) {
      throw new Error("package.json is not valid JSON");
    }
    // Default Vite output for libraries is dist/index.js
    const defaultExportPath = "./dist/index.js";
    if (!pkg.exports) {
      pkg.exports = {};
    }
    // If TypeScript, always add types entry
    if (this.isTs) {
      pkg.exports["."].types = "./dist/types/lib/index.d.ts";
      // Also add top-level types field if not present
      if (!pkg.types) {
        pkg.types = "./dist/types/lib/index.d.ts";
      }
    }
    // Add default export if not present
    if (!pkg.exports["."]) {
      pkg.exports["."] = {
        import: defaultExportPath,
        require: defaultExportPath,
      };
    }
    // Always ensure import/require are present
    if (!pkg.exports["."].import) {
      pkg.exports["."].import = defaultExportPath;
    }
    if (!pkg.exports["."].require) {
      pkg.exports["."].require = defaultExportPath;
    }
    // Write back only if changed
    const newPkgRaw = JSON.stringify(pkg, null, 2) + "\n";
    if (newPkgRaw !== pkgRaw) {
      await writeFile(pkgPath, newPkgRaw, "utf-8");
    }
  }

  async generateGlue(
    modules: IGracefulMap<string, File[]>,
    libs: IGracefulMap<string, WModule[]>,
    isLib: boolean = this.isLib,
    isTs: boolean = this.isTs
  ): Promise<void> {
    // generate module files
    const moduleKeys = [...modules.keys()];

    for (let i = 0; i < moduleKeys.length; i++) {
      const module = modules.get(moduleKeys[i])!;
      await this.generateModule(moduleKeys[i], module, isTs);
    }

    // generate lib reexport files
    const libKeys = [...libs.keys()];
    for (let i = 0; i < libKeys.length; i++) {
      const modules = libs.get(libKeys[i])!;
      for (let j = 0; j < modules.length; j++) {
        const module = modules[j];
        await this.generateLibReexport(
          libKeys[i],
          module.file.exportName,
          isTs
        );
      }
    }

    if (isLib) {
      await this.generateLibGlue(libs, modules, isTs);
    } else {
      await this.generateInitializationGlue(modules, libs, isTs);
    }
  }

  async generateLibReexport(
    libName: string,
    moduleName: string,
    isTs: boolean
  ) {
    await this.generateFileWithHeader(
      `${libName}/${moduleName}.${isTs ? "ts" : "js"}`,
      path.resolve(this.outDir, "libs"),
      GLUE.ImportModulesFromLib(libName),
      GLUE.ReexportModule(moduleName)
    );
  }

  async generateModule(name: string, commands: Array<File>, isTs: boolean) {
    const commandsContent = commands
      .map((e) =>
        GLUE.CommandImportRecord(
          `${this.isLib ? this.namespace + "." : ""}${e.exportName}`,
          e.relPath!
        )
      )
      .join(",\n  ");
    await this.generateFileWithHeader(
      `${name}.${isTs ? "ts" : "js"}`,
      path.resolve(this.outDir, "modules"),
      "",
      GLUE.CreateModule(name, commandsContent)
    );
  }

  async generateInitializationGlue(
    modules: IGracefulMap<string, File[]>,
    libs: IGracefulMap<string, WModule[]>,
    isTs: boolean
  ) {
    const libImports: string[] = [];
    const libNames: { lib: string; module: string }[] = [];
    const tsFunctionsLibsArray: {
      key: string;
      libName: string;
      moduleName: string;
      commandName: string;
    }[] = [];

    const libKeys = [...libs.keys()];
    for (let i = 0; i < libKeys.length; i++) {
      const lib = libKeys[i];
      const modules = libs.get(lib)!;
      for (let j = 0; j < modules.length; j++) {
        const module = modules[j];
        libNames.push({
          lib: libKeys[i],
          module: `${lib}_${module.file.exportName}`,
        });
        libImports.push(
          GLUE.ImportLib(
            `${lib}_${module.file.exportName}`,
            `${lib}/${module.file.exportName}`,
            isTs ? "ts" : "js"
          )
        );

        for (const key in module.module.commands) {
          const command = module.module.commands[key];

          tsFunctionsLibsArray.push({
            key: `${key}`,
            commandName: command.name,
            moduleName: module.module.name,
            libName: lib,
          });
        }
      }
    }

    const modulesImports = [...modules.keys()].map((k) =>
      GLUE.ImportModule(k, `./modules/${k}`, isTs ? "ts" : "js")
    );
    const imports = [
      ...libImports,
      ...modulesImports,
      GLUE.ImportFactory(),
    ].join("\n");

    {
      // get the list of moduleNames
      const moduleNames = [...modules.keys()];
      const content = [
        GLUE.InitilizationFunction([...moduleNames], [...libNames]),
      ].join("\n");

      await this.generateFileWithHeader(
        `index.${isTs ? "ts" : "js"}`,
        this.outDir,
        imports,
        content
      );
    }
    if (isTs) {
      // Collect all files from every module as { importPath, key }
      const tsFunctionsMapArray = ([] as File[])
        .concat(...[...modules.values()])
        .map((f) => {
          const relModulePath = f.relPath!;
          // Compute absolute path as if running in ./modules
          const modulesDir = path.resolve(this.outDir, "modules");
          const d = path.resolve(modulesDir, relModulePath);
          return {
            importPath: path.relative(this.outDir, d).replace(/\\/g, "/"),
            key: f.exportName,
          };
        });

      const content = [
        ...(isTs
          ? [GLUE.TsFunctionsMap(tsFunctionsMapArray, tsFunctionsLibsArray)]
          : []),
        ...(isTs ? [GLUE.TsType()] : []),
      ].join("\n");

      await this.generateFileWithHeader(
        `coresep-env.d.ts`,
        path.resolve(this.outDir, ".."),
        "",
        content
      );
    }
  }

  async generateLibGlue(
    libs: IGracefulMap<string, WModule[]>,
    modules: IGracefulMap<string, File[]>,
    isTs: boolean
  ) {
    const tsFunctionsLibsArray: {
      key: string;
      libName: string;
      moduleName: string;
      commandName: string;
    }[] = [];
    const libKeys = [...libs.keys()];
    for (let i = 0; i < libKeys.length; i++) {
      const lib = libKeys[i];
      const modules = libs.get(lib)!;
      for (let j = 0; j < modules.length; j++) {
        const module = modules[j];
        for (const key in module.module.commands) {
          const command = module.module.commands[key];

          tsFunctionsLibsArray.push({
            key: `${key}`,
            commandName: command.name,
            moduleName: module.module.name,
            libName: lib,
          });
        }
      }
    }

    const imports = [...modules.entries()]
      .map(([k]) =>
        GLUE.ImportModule(
          k,
          `./${path
            .relative(
              path.resolve(this.outDir, ".."),
              path.resolve(this.outDir, "modules", k)
            )
            .replace(/\\/g, "/")}`,
          isTs ? "ts" : "js"
        )
      )
      .join("\n");

    const content = GLUE.CreateLib(
      this.namespace,
      [...modules.entries()]
        .map(([k]) => GLUE.ModuleImportRecord(k))
        .join(",\n\t")
    );

    await this.generateFileWithHeader(
      `index.${isTs ? "ts" : "js"}`,
      path.resolve(this.outDir, ".."),
      imports,
      content
    );

    if (isTs) {
      // Collect all files from every module as { importPath, key }
      const tsFunctionsMapArray = ([] as File[])
        .concat(...[...modules.values()])
        .map((f) => {
          const relModulePath = f.relPath!;
          // Compute absolute path as if running in ./modules
          const modulesDir = path.resolve(this.outDir, "modules");
          const d = path.resolve(modulesDir, relModulePath);
          return {
            importPath: path.relative(this.outDir, d).replace(/\\/g, "/"),
            key: f.exportName,
          };
        });

      const content = [
        ...(isTs
          ? [GLUE.TsFunctionsMap(tsFunctionsMapArray, tsFunctionsLibsArray)]
          : []),
        ...(isTs ? [GLUE.TsType()] : []),
      ].join("\n");

      await this.generateFileWithHeader(
        `coresep-env.d.ts`,
        path.resolve(this.outDir, ".."),
        "",
        content
      );
    }
  }

  /**
   * Generates a file with a header (ASCII art or similar) prepended to the content.
   * Ensures the output directory exists before writing.
   * @param name The filename (relative to outDir) to write to.
   * @param content The file content (header will be prepended).
   */
  async generateFileWithHeader(
    name: string,
    dir: string,
    imports: string,
    content: string
  ) {
    const outFile = path.resolve(dir, name);
    const finalText = await this.headerHelper(imports, content);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, finalText);
  }

  /**
   * Prepends an ASCII glue header followed by three newlines to the provided content string.
   *
   * @param content - The string content to which the header will be prepended.
   * @returns A promise that resolves to the new string with the ASCII header and content.
   */
  async headerHelper(imports: string, content: string): Promise<string> {
    if (imports && imports.trim() !== "") {
      return `${imports}\n\n${GLUE.ASCII()}\n\n${content}`;
    } else {
      return `${GLUE.ASCII()}\n\n${content}`;
    }
  }
}
