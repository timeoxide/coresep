import * as myFirstCommand from "./myFirstCommand.command"

export const name = "myModule";
export const commands = {
    /**
     *  The following command is inserted based on it's exported name and version
     */
    myFirstCommand,

    /**
     * The followinf command is inserted bsed on the key provided here and loaded on demand.
     * @returns The Command.
     */
    "mySecondCommand@1.0.0": async () => await import("./mySecondCommand.command")
}