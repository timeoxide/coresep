export default (
  moduleNames: string[],
  libModuleNames: { lib: string; module: string }[]
) =>
  `/**
 * Initialize Coresep's singlton container.
 */
export function initializeCoresep() {
  Factory.new()${
    moduleNames.length
      ? moduleNames
          .map(
            (e) =>
              `\n\t\t.RegisterModule(${e
                .replace(/-/g, "_")
                .replace(/\./g, "_")})`
          )
          .join("")
      : ""
  }${
    libModuleNames.length
      ? libModuleNames
          .map(
            (e) =>
              `\n\t\t.RegisterModuleFromLib("${e.lib}", ${e.module
                .replace(/-/g, "_")
                .replace(/\./g, "_")})`
          )
          .join("")
      : ""
  }
    .Singlton()
    .Build();
}
`;
