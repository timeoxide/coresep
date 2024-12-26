<h1 align="center">
   <b>
        Give me more.
   </b>
</h1>

If for some reason you need more than one container, you can just export a container from a file. just do not call `AsWindowProp`, to avoid overriding the global container ( if there is any ): 

```typescript
export const myOtherContainer = Factory.new()
   // Register your commands and modules here...

   // Since `AsWindowProp` was not called
   // it won't override `window.crs` property.
   .Build()
```

<br />

## Use it!

You can use it just like the exported invoke function as demonstrated blow:

```typescript

import { container } from "/path/to/your/container";

const result = await container.invoke("myModule.myCommand@latest");
```

<br />

<div>
   <h2><a href="./lazy-loading-commands.md">   
      Previous: <i>Lazy loading commands</i>
   </a></h2>
</div>