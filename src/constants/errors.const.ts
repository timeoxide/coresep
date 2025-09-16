/**
 * A constants object of error codes for each error.
 * These error codes are used to identify and categorize different types
 * of errors within the application.
 */
export const ERRORS = {
    /**
     * Indicates an internal error within the error handling mechanism itself.
     */
    ErrorerErrored: "0x0001",
    /**
     * Indicates a failure to load a specific command.
     */
    CommandLoadFailed: "0x0002",
    /**
     * Indicates that a requested command was not found.
     */
    CommandNotFound: "0x0404",
    /**
     * Indicates an attempt to set a key that already exists in an immutable map.
     */
    KeyExistsInMap: "0x1001",
    /**
     * Indicates that two or more commands have the same name within a namespace.
     */
    DuplicateCommandsInNamespace: "0x1002",
};