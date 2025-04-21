import { CommandFileWrapper } from "@/models";

export interface ICrsGlueGenerator {
  generateGlue(commands: Array<CommandFileWrapper>): Promise<void>;
  generateInitializationGlue(modules: Map<string, CommandFileWrapper[]>): Promise<void>;
}
