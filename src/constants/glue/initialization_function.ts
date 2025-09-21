export default (
  moduleNames: string[],
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
  }
    .Singlton()
    .Build();
}
`;
