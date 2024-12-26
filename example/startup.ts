import { Factory } from "../src";
import { callCommand } from "./callCommand";
import { myModule } from "./commands";
import * as myFirstCommand from "./commands/myModule/myFirstCommand.command"

export function configure() {
  Factory.new()
    .RegisterModule(myModule)
    .AsWindowProp()
    .Build()
}

export function startup() {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <h1>Command Responsibility Segregation</h1>
      <div class="card">
        <button id="call_command" type="button"> Call Command </button>
      </div>
    </div>
  `
  document.getElementById("call_command")?.addEventListener("click", callCommand);
}


