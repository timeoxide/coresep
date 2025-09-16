import ascii from "./glue/ascii";
import command_import_record from "./glue/command_import_record";
import create_lib from "./glue/create_lib";
import create_module from "./glue/create_module";
import gitignore from "./glue/gitignore";
import import_container from "./glue/import_container";
import import_factory from "./glue/import_factory";
import import_lib from "./glue/import_lib";
import import_module from "./glue/import_module";
import import_modules_from_lib from "./glue/import_modules_from_lib";
import initialization_function from "./glue/initialization_function";
import initialization_types from "./glue/initialization_types";
import module_import_record from "./glue/module_import_record";
import reexport_module from "./glue/reexport_module";
import ts_functions_map from "./glue/ts_functions_map";

/**
 * A constants object of string templates used to generate glue codes
 */
export const GLUE = {
  // design
  ASCII: ascii,

  // file generation
  CreateModule: create_module,
  CreateLib: create_lib,
  ReexportModule: reexport_module,
  GitIgnore: gitignore,

  // segmentation
  CommandImportRecord: command_import_record,
  ModuleImportRecord: module_import_record,
  ImportModulesFromLib: import_modules_from_lib,
  ImportLib: import_lib,
  ImportFactory: import_factory,
  ImportContainer: import_container,
  ImportModule: import_module,
  TsFunctionsMap: ts_functions_map,
  InitilizationFunction: initialization_function,
  TsType: initialization_types,
};
