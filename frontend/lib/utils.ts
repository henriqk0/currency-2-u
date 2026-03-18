import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ZodErrorStructure = {
  errors: string[];
  properties: {
    [key: string]: {
      errors: string[];
    };
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(data: any): string {
  if (!data) return "An unknown error occurred";
  
  if (typeof data === "string") return data;

  const errorObj = data.error || data;

  if (errorObj && typeof errorObj === "object" && "properties" in errorObj) {
    const zodError = errorObj as ZodErrorStructure;
    const messages: string[] = [];

    if (zodError.errors && Array.isArray(zodError.errors)) {
      messages.push(...zodError.errors);
    }

    if (zodError.properties && typeof zodError.properties === "object") {
      for (const key in zodError.properties) {
        const prop = zodError.properties[key];
        if (prop && Array.isArray(prop.errors)) {
          messages.push(...prop.errors);
        }
      }
    }

    if (messages.length > 0) return messages.join(`. `);
  }

  if (typeof errorObj === "string") return errorObj;
  if (data.message) return data.message;
  
  return "An unknown error occurred";
}
