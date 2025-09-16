export default (key: string, importPath: string) =>
  `"${key}": async () => await import("${importPath}")`;
