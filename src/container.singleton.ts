import { ICrsContainer } from "./abstractions";
import { SYMBOLS } from "./constants/symbols.const";

/**
 * Retrieves the `crs` property attached to the global `window` object,
 * if it was previously built with the `.AsWindowProp()` method in the
 * `Factory`.
 *
 * ---
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
 * const conatiner = container(); // this returns `window.crs`
 * ...
 *
 * ```
 *
 * ---
 * @returns The `ICrsContainer` instance if built with `.AsWindowProp()`, otherwise `undefined`.
 */
export function container(): ICrsContainer {
  return (globalThis as any)[SYMBOLS.SingletonContainer];
}
