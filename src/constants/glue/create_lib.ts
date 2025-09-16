export default (libName: string, modules: string) => `
export const name = "${libName}";
export const modules = {
  ${modules}
};
`;
