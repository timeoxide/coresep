export default (moduleName: string, commands: string) => `
export const name = "${moduleName}";
export const commands = {
  ${commands}
}
`;
