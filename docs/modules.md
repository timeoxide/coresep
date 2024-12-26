<h1 align="center">
   <b>
        Modules.
   </b>
</h1>

Modules are just objects containing a `name` and a `commands` array.

<br />

## Create a module

To create a module ( __*Not recommended*__ ):

```typescript
const module = {
   name: "myModule",
   commands: [
      myFirstCommand
   ]
}
```

Or preferably export from a file as demonstrated blow:

```typescript
// file: src/commands/myModule/index.ts
import * as myFirstCommand from "./myFirstCommand.command";

export const name = "myModule";
export const commands = {
    myFirstCommand,
};
```

<br />

## Register it!

To register an exported module import it and use `RegisterModule` of the factory:
```typescript
import * as myModule from "./commands/myModule";

Factory.new()
   // this adds all the commands from the module to your container
   .RegisterModule(myModule)

   // ...
   .AsWindowProp()
   .Build()

```
<br />

## Invoke it!

Remember, that all of the commands registered via a module, should be invoked using the format `moduleName.commandName` or with version `moduleName.commandName@version`.

<br />

## Further

To make it easier to consume modules in the main file, you could export the modules in `commands/index.ts`:

```typescript
// file: src/commands/index.ts

export * as myFirstModule from "./myFirstModule";
export * as mySecondModule from "./mySecondModule";

```

So you can now import them normally:
```typescript

export { myFirstModule, mySecondModule } from "./commands";

```

<br />

<div>
   <h2><a href="./lazy-loading-commands.md">   
      Next: <i>Lazy loading commands</i>
   </a></h2>
</div>

<div>
   <h2><a href="./exporting-commands.md">   
      Previous: <i>Exporting commands</i>
   </a></h2>
</div>