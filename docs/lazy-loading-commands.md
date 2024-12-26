<h1 align="center">
   <b>
        Lazy Loading commands.
   </b>
</h1>

If you just have too many commands and want them to be loaded on demand, you could use the lazy loading feature.

<br />

## Requirement

To use lazy loading __*you have to use modules*__.

<br />

## Export it!

When exporting the `commands` of a module you have the option to use the command or an async function that returns a function:

```typescript
// file: src/commands/myModule/index.ts

import * as myFirstCommand from "./myFirstCommand.command";

export const name = "myModule";
export const commands = [
   // a normal and preloaded command
   myFirstCommand

   // an async and lazy-loaded command
   "mySecondCommand": async () => await import("./mySecondCommand.command")
];

```

<br />

## Invoke it!

A lazy-loaded command is invoked normally like any other command.

Remember, that all of the commands registered via a module, should be invoked using the format `moduleName.commandName` or with version `moduleName.commandName@version`.

<br />

## Name and Version

> [!IMPORTANT]
> When lazy loaing a command the provided name in the module overrides the exported name by the command itself.

It means that you need to provide the `version` in the modules as well:

```typescript

export const commands = [
   // this is the name used to invoke
   "myCommand@latest": async () => await import("./myCommand.command")
];

```

Basically the format used to invoke the lazy-loaded commands is `moduleName.<Whatever you used there>`.

<br />

<div>
   <h2><a href="./more-containers.md">   
      Next: <i>More containers</i>
   </a></h2>
</div>

<div>
   <h2><a href="./modules.md">   
      Previous: <i>Modules</i>
   </a></h2>
</div>