import { ICrsFileResolver, ICrsGlueGenerator } from "@/abstractions";

export interface VitePluginOptions {
  isTs?: boolean;
  commandsDir?: string;
  outDir?: string;
  generator?: ICrsGlueGenerator;
  resolver?: ICrsFileResolver;
}
