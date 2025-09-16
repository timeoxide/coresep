export default (namespace: string) => `
type FunctionName = keyof FunctionMap;
type ArgsType<T extends FunctionName> = Parameters<FunctionMap[T]>[0];
type ResultType<T extends FunctionName> = ReturnType<FunctionMap[T]>;


/**
 * Invoke the command, with type-safty, intellisense and ease.
 * @param name your command to invoke
 * @param args arguments of the command
 * @returns the result of the command
 */
export async function invoke<T extends FunctionName>(name: T,	...args: ArgsType<T> extends undefined ? [] : [ArgsType<T>]): Promise<Awaited<ResultType<T>>> {
  return await container("${namespace}").invoke(name, ...args) as any;
}
`;
