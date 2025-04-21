import { container } from "./container.singleton";

/**
 * Invokes a registered command in the commands container.
 * it retrives the container from `container` function.
 *
 * ---
 * 
 * # **Example Usage:**
 * ```typescript
 * 
 * Factory.new()
 *      // register you modules here
 *      .RegisterModule(<your module>)
 *      // necessary for this function to work
 *      .AsWindowProp()
 *      // builds and adds container to window prop ( because `.AsWindowProp()` was called )
 *      .Build()
 * 
 * ...
 * const result = 
 *      invoke<TypeOfYourModel, TypeOfYourResult>(
 *          "myCommand", // the name of a registerd command
 *          {} // the optional model to pass to your command
 *      );
 * ...
 * 
 * ```
 * 
 * ---
 * @param name The name of the command to invoke.
 * @param model Optional model to pass to the function.
 * @returns The result of the invoked function.
 */
export async function invoke<TModel = any | undefined, TResult = any>(name: string, model?: TModel): Promise<TResult> {
    return await container().invoke(name, model);
}