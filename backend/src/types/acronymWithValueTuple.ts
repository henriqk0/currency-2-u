import { Acronyms } from "./acronyms"


// first number from NumberTuple: value at first acronym
// second number from NumberTuple: value at second acronym
export type NumberTuple = [number, number]

interface SecondKeyAcronymPlusThisValueFirstAcronym {
  [key: string]: NumberTuple;
}

export interface ConversionTableDictFormatted {
  [key: string]: SecondKeyAcronymPlusThisValueFirstAcronym;
}
