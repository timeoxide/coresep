<h1 align="center">
   <b>
      Factory.
   </b>
</h1>

Factory is the class, which creates the command containers.

## Overview

When dom is loaded or your application is first loading, you will need to construct the container with `AsWindowProp` method to create the global command.

You can then organize your commands by modules ( not to be confused with es modules ) or exported commands. Modules will give you the advantage of lazy loading the commands and namespacing them.

In order to have more that a single container checkout <a href="./more-containers.md"> here </a>.

## Initialization

During the initialization of the app you will need to construct an instance of the container:

```typescript
const container = Factory.new()
   // this adds the container to the window `crs` property
   .AsWindowProp()
   // this builds and returns the container
   .Build()
```

this creates a new instance of the container and assigns it to the `crs` property of the window.

## Adding a simple command

We encourage you to use exported commands and preferably modules, but here we create a simple command:

```typescript
const myFirstCommand = {
   name: "my-command-name",
   meta: {},
   handler: () => {
      return "Hello, World!";
   }
};
```

then we register the command using `RegisterCommand` of the factory:

```typescript
Factory.new()
   // ...
   .AsWindowProp()
   // this adds a command to your container
   .RegisterCommand(myFirstCommand)
   // ...
   .Build()

```

Later we will discuss how to organize the commands better.

<br/>

<div>
   <h2><a href="./invoking-command.md">   
      Next: <i>Invoking command</i>
   </a></h2>
   
</div>

<div>
   <h2><a href="./installation.md">   
      Previous: <i>Installation</i>
   </a></h2>
</div>