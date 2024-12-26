<h1 align="center">
   <b>
        Invoking command.
   </b>
</h1>


## Invoke it!
To facilitate invoking a command you can use the exported `invoke` function:

```typescript
import { invoke } from "coresep";

const model = {} 
const result = await invoke("myCommand", model);
```

The model is optional. If used, it will be passed to your command's handler.

The `invoke` function accepts two generics:

```typescript
const model: TModel = {};
const result: TResult = await invoke<TModel, TResult>("myCommand", model);
```
<br />

## Version
You can add the optional `version` to your command as demonstrated blow:
```typescript
...

// the command that we will register with factory
const command = {
   name: "myCommand",
   version: "1.0.0",
   meta: {},
   handler: () => {}
}

...
// don't forget to register the command :)
```

When trying to invoke this command you will need to invoke it with the format `commmandName@version`:
```typescript
const result = await invoke("myCommand@1.0.0");
```

Since version is literally just a string, you could also use something different: 
```typescript
const result = await invoke("myCommand@latest");
```
<br />

## Modules
Later You will also learn about modules. To invoke a command from a module we use this format `moduleName.commandName@version` :
```typescript
const result = await invoke("myModule.myCommand@latest");
```

<br />

<div>
   <h2><a href="./exporting-commands.md">   
      Next: <i>Exporting commands</i>
   </a></h2>
</div>

<div>
   <h2><a href="./factory.md">   
      Previous: <i>Factory</i>
   </a></h2>
</div>