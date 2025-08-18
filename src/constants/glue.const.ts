
/**
 * A constants object of string templates used to generate glue codes
 */
export const GLUE = {
  ASCII: `/*
 *  This file is auto generated and probably will be overwritten again ;D
 * 
 *  █████╗ ██╗   ██╗████████╗ ██████╗        ██████╗ ███████╗███╗   ██╗
 * ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗      ██╔════╝ ██╔════╝████╗  ██║
 * ███████║██║   ██║   ██║   ██║   ██║█████╗██║  ███╗█████╗  ██╔██╗ ██║
 * ██╔══██║██║   ██║   ██║   ██║   ██║╚════╝██║   ██║██╔══╝  ██║╚██╗██║
 * ██║  ██║╚██████╔╝   ██║   ╚██████╔╝      ╚██████╔╝███████╗██║ ╚████║
 * ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝        ╚═════╝ ╚══════╝╚═╝  ╚═══╝
 */`,

  Module: (moduleName: string, commands: string) => `
export const name = "${moduleName}";
export const commands = {
  ${commands}
}
`,
  Command: (key: string, importPath: string) =>
    `"${key}": async () => await import("${importPath}")`,

  ImportFactory: `import { container, Factory } from "coresep";`,
  ImportContainer: `import { container } from "coresep";`,

  ImportModule: (moduleName: string) =>
    `import * as ${moduleName
      .replace(/-/g, "_")
      .replace(/\./g, "_")} from "./${moduleName}";`,
  
  TsFunctionsDeclaration: (
    args: { parent: string; importPath: string; exportKey: string }[]
  ) =>
    `type FunctionMap = {
    ${args
      .map(
        (e) =>
          `"${e.parent}.${e.exportKey}": typeof import("${e.importPath}")["handler"]`
      )
      .join(",\n\t")}
}`,
  InitilizeCoresepJs: (moduleNames: string[]) =>
    `/**
 * Initialize Coresep's singlton container.
 */
export function initializeCoresep() {
  Factory.new()${moduleNames
    .map(
      (e) =>
        `\n\t\t.RegisterModule(${e.replace(/-/g, "_").replace(/\./g, "_")})`
    )
    .join("")}
    .Singlton()
    .Build();
}
`,
  TsType: () => `
type FunctionName = keyof FunctionMap;
type ArgsType<T extends FunctionName> = Parameters<FunctionMap[T]>[0];
type ResultType<T extends FunctionName> = ReturnType<FunctionMap[T]>;


/**
 * Invoke the command, with type-safty, intellisense and ease.
 * @param name your command to invoke
 * @param args arguments of the command
 * @returns the result of the command
 */
export async function invoke<T extends FunctionName>(name: T,	...args: ArgsType<T> extends undefined ? [] : [ArgsType<T>]): Promise<Awaited<ResultType<T>>> {
  return await container().invoke(name, ...args) as any;
}
`,
};
