import { File, WModule } from "@/models";
import { IGracefulMap } from "./graceful-map.abstraction";

export interface ICrsGlueGenerator {
  generateGlue(
    modules: IGracefulMap<string, File[]>,
    libs: IGracefulMap<string, WModule[]>,
    isLib?: boolean,
    isTs?: boolean
  ): Promise<void>;

  emitGitIgnore(): Promise<void>;
  emitPackageJson(): Promise<void>;
  emitTsConfigExclude(): Promise<void>;
}
