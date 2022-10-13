import {PrimitiveName} from "@apexlang/core/model";

export const convertSignedToUnsigned = (type: string, value: any) => {
  switch (type) {
    case PrimitiveName.U8:
      return `value & 0xff`;
    case PrimitiveName.U64:
      return `Long.toUnsignedString(${value})`;
    case PrimitiveName.U32:
      return `${value} & 0x00000000ffffffffL`;
    case PrimitiveName.U16:
      return `${value} & 0xffff`;
    default:
      return `${value}`;
  }
}