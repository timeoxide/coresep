export default (moduleName: string, libName: string, ext: string) =>
  `import * as ${moduleName
    .replace(/-/g, "_")
    .replace(/\./g, "_")} from "./libs/${libName}.${ext}";`;
