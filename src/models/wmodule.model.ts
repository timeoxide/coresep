import { File } from "./file.model";
import { Module } from "./module.model";

export interface WModule {
  module: Module;
  file: File;
}
