import { Command } from "./command.model";

export interface CommandModule {
    name: string,
    commands: { [key: string]: (Command) | (() => Promise<Command>) }
}