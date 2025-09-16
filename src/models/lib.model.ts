import { Module } from "./module.model";

export interface Lib {
  name: string;
  modules: { [key: string]: Module };
}
