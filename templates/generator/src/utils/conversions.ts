import type { ObjectMap, Operation, Parameter } from "@apexlang/core/model";
import * as utils from "@apexlang/codegen/utils";
import { convertType } from "./types.ts";

/**
 * Convert a description to the appropriate format for the destination.
 *
 * @param description - A string description.
 * @returns A string suitable for the destination format or an empty string.
 */
export function convertDescription(description?: string): string {
  // Add your comment prefix here.
  // For Example:
  // const prefix = "//";
  const prefix = "";

  // Change or remove the max length of comments here:
  const wrapLength = 120;

  return utils.formatComment(prefix, description, wrapLength);
}

/**
 * Generate new source for an Operation
 *
 * @param op - An Operation node to convert
 * @param global - Whether this is a global operation (`func`) or a method in an interface.
 * @param config - The context's configuration.
 * @returns The new generated output for the Operation
 */
export function convertOperation(
  op: Operation,
  global: boolean,
  config: ObjectMap,
): string {
  // The name of the Operation.
  const _name = op.name;

  // A comment generated from the description.
  const _comment = convertDescription(op.description);

  // The return type of the operation, converted via `convertType()`
  const _type = convertType(op.type, config);

  // Iterate over the Operation's Parameters and generate new output.
  const _params = op.parameters.map((arg) => convertParameter(arg, config));

  if (global) {
    // Generate output for global functions here.
  } else {
    // Generate method output here.
  }

  // Combine the above to create and return new output.
  return ``;
}

/**
 * Generate new source for a Parameter
 *
 * @param param - A Parameter node to convert
 * @param config - The context's configuration.
 * @returns The new generated output for the Parameter
 */
export function convertParameter(param: Parameter, config: ObjectMap): string {
  // The name of the Parameter
  const _name = param.name;

  // The type of the Parameter, converted via `convertType()`
  const _type = convertType(param.type, config);

  // Combine the above to create and return new output here.
  return ``;
}
