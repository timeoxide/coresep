import { ICrsFileResolver, ICrsGlueGenerator } from "@/abstractions";

export interface VitePluginOptions {
  isTs?: boolean;
  verbose?: boolean;
  commandsDir?: string;
  namespace?: string;
  outDir?: string;
  generator?: ICrsGlueGenerator;
  resolver?: ICrsFileResolver;
}
