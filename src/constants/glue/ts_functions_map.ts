export default (
  args: { importPath: string; key: string }[],
  libCommands: {
    key: string;
    libName: string;
    moduleName: string;
    commandName: string;
  }[]
) =>
  `type FunctionMap = {
  ${args
    .map((e) => `"${e.key}": typeof import("${e.importPath}")["handler"]`)
    .join(",\n\t")}
  ${libCommands
    .map(
      (e) =>
        `"${e.key}": Awaited<ReturnType<typeof import("${e.libName}").modules["${e.moduleName}"]["commands"]["${e.commandName}"]>>["handler"]`
    )
    .join(",\n\t")}
}`;
