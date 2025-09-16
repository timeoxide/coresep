export default (moduleName: string, dir: string, ext: string) =>
  `import * as ${moduleName
    .replace(/-/g, "_")
    .replace(/\./g, "_")} from "${dir}.${ext}";`;
