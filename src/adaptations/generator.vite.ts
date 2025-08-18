import { ICrsGlueGenerator } from "@/abstractions";
import { GLUE } from "@/constants/glue.const";
import { CommandFileWrapper } from "@/models";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export class ViteGlueGenerator implements ICrsGlueGenerator {
  /**
   * Default constructor for the `ViteFileResolver`.
   */
  constructor(
    private outDir: string,
    private isTs: boolean
  ) {}

  async generateGlue(
    commands: Array<CommandFileWrapper>
  ): Promise<void> {
    const modules = commands.reduce(
      (v: Map<string, CommandFileWrapper[]>, c: CommandFileWrapper) => {
        if (v.has(c.parent)) {
          v.set(c.parent, [...v.get(c.parent)!, c]);
        } else {
          v.set(c.parent, [c]);
        }
        return v;
      },
      new Map<string, CommandFileWrapper[]>()
    );
    for (let i = 0; i < modules.size; i++) {
      const commands = modules.get([...modules.keys()][i])!;
      await this.generateGlueModuleHelper(
        commands[0].parent,
        commands
      );
    }
    await this.generateInitializationGlue(modules);
  }

  async generateGlueModuleHelper(
    module: string,
    commands: Array<CommandFileWrapper>
  ): Promise<void> {
    const outFile = path.resolve(
      this.outDir,
      `${module}.${this.isTs ? "ts" : "js"}`
    );

    const commandsText = commands
      .map((e) =>
        GLUE.Command(
          `${module}.${e.exportKey}`,
          e.importPath
        )
      )
      .join(",\n\t");
    const moduleText = GLUE.Module(module, commandsText);
    const finalText = `${GLUE.ASCII}\n\n\n${moduleText}`;
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, finalText);
  }

  async generateInitializationGlue(
    modules: Map<string, CommandFileWrapper[]>
  ) {
    const importText = [
      ...[...modules.keys()].map((e) => GLUE.ImportModule(e)),
      
    ].join("\n");

    const initializeCoresepText = GLUE.InitilizeCoresepJs(
      [...modules.keys()]
    );
    const firstHalf = `${GLUE.ImportFactory}\n${importText}\n\n\n${GLUE.ASCII}\n\n\n${initializeCoresepText}`;

    const outFile = path.resolve(
      this.outDir,
      `index.${this.isTs ? "ts" : "js"}`
    );

    const finalText = this.isTs
      ? `${firstHalf}\n\n\n${GLUE.TsFunctionsDeclaration(
          [...modules.entries()].flatMap((e) => e[1])
        )}${GLUE.TsType()}`
      : firstHalf;

    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, finalText);
  }
}
