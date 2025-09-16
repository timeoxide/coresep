import { Command } from "./command.model";

export interface Module {
    name: string,
    commands: { [key: string]: (Command) | (() => Promise<Command>) }
}