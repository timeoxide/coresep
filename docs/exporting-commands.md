<h1 align="center">
   <b>
        Exporting commands.
   </b>
</h1>

Exporting commands instead of defining them inline leads to better organized code, as well as cleaner code in general. Also you are probably here only to separate your commands from the rest of the code.

<br />

## Structure

I personally organize my code like this:

```
| src
   | commands
      > myFirstCommand.command.ts
      | myModule
         > mySecondCommand.command.ts
```

I use `.command.ts`, The names and extensions of the files and folders are irrelevant to the functionality of the container or factory.

<br />

## Export it!

The names of the exports are vital to the functionality of the container. Export the following from a file:

```typescript
// file: src/commands/myFirstCommand.command.ts

export const name = "myFirstCommand";

export const version = "latest";

export const meta = {};

export const handler = (name: string) => {
    return `Hello, ${name}!`;
};
```

Naturally the version is optional.

<br />

## Use it!
To use an exported command you can simply import it as demonstrated here:

```typescript
import * as myFirstCommand from "./myFirstCommand.command"

// It's just the same thing as the command we have defined before.
// console.log(myFirstCommand.name)
// console.log(myFirstCommand.version)
// console.log(myFirstCommand.meta)
// console.log(myFirstCommand.handler)

```

<br />

<div>
   <h2><a href="./modules.md">   
      Next: <i>Modules</i>
   </a></h2>
</div>

<div>
   <h2><a href="./invoking-command.md">   
      Previous: <i>Invoking command</i>
   </a></h2>
</div>