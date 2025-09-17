export default () => `
type FunctionName = keyof FunctionMap;
type ArgsType<T extends FunctionName> = Parameters<FunctionMap[T]>[0];
type ResultType<T extends FunctionName> = ReturnType<FunctionMap[T]>;

declare module "coresep" {
  /**
   * Invoke the command, with type-safty, intellisense and ease.
   * @param name your command to invoke
   * @param args arguments of the command
   * @returns the result of the command
   */
  export function invoke<T extends FunctionName>(
    name: T,
    args?: ArgsType<T> extends undefined ? [] : [ArgsType<T>],
    containerName?: string
  ): Promise<Awaited<ResultType<T>>>;

  export { container, factory, Factory } from "coresep";
}
`;
