export default (module: string) =>
  `"${module}": ${module
    .replace(/-/g, "_")
    .replace(/\./g, "_")}`;
