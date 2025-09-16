import { IErrorer } from "@/abstractions";
import {
  CommandLoadFailed,
  CommandNotFound,
  DuplicateCommandsInNamespace,
  ErrorerErrored,
  KeyExistsInMap,
} from "@/errors";

/**
 *
 * It maps all the error codes to errors;
 * it is tested by `all error constants are thrown correctly.` test to
 * ensure it contains all of the errors.
 */
const errors = new Map<string, Error>([
  ["0x0001", ErrorerErrored],
  ["0x0002", CommandLoadFailed],
  ["0x0404", CommandNotFound],
  ["0x1001", KeyExistsInMap],
  ["0x1002", DuplicateCommandsInNamespace],
]);

/**
 *
 * The _not-so-graceful_ error manager.
 * used to lookup errors by code, add context and throw them.
 * The error codes could be looked up through `ERRORS` constants.
 *
 * # **Example Usage:**
 * ```
 * ...
 *
 * errorer
 *      .select("0x0404")
 *      .withContext('Command not found: myCommand')
 *      .throw();
 * ...
 * ```
 */
export class Errorer implements IErrorer {
  /**
   * Constructs a new `Errorer` instance.
   *
   * @param error the error that will be throw; normally selected through `.select(<error-code>)`.
   */
  constructor(private error?: Error) {}

  /**
   * Throws the currently selected error
   */
  public throw(): void {
    this.ensureError();
    throw this.error;
  }

  /**
   * Selects an error by its code. The `code` parameter should correspond to a defined error code.
   *
   * @param code The code of the error to select.
   * @returns The `Errorer` instance with the selected error.
   */
  public select(name: string): IErrorer {
    const err = errors.get(name);
    this.error = err;
    this.ensureError();
    return this;
  }

  /**
   * Adds a contextual message to the error. This message will be included in the
   * error stack trace, providing additional information about the error's origin.
   *
   * @param message The contextual message to add.
   * @returns The `Errorer` instance with the added context.
   */
  public withContext(message: string): IErrorer {
    this.ensureError();
    this.error!.stack = `${message}\n${this.error!.stack}`;
    return this;
  }

  /**
   * Ensures that an error object is assigned to the `error` property.
   * If no error has been selected, the `ErrorerErrored` error is used as a default.
   * ideally no user should ever see this! it happens when you miss to `select` the error
   * before `throw`ing it
   */
  private ensureError(): void {
    if (!this.error) this.error = errors.get("0x0001")!;
  }
}

/** Creates an global instance of the `Errorer`; casted to `IErrorer`
 * to only expose the interface
 */
const errorer = new Errorer() as IErrorer;
export { errorer };
