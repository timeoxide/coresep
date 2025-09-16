export default (moduleName: string) => `
export const name = modules["${moduleName}"].name;
export const commands = modules["${moduleName}"].commands
`;
