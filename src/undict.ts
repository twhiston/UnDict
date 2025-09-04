// Interface representing the Max/MSP Dict class structure
interface MaxDict {
    name: string;
    quiet: boolean;
    getkeys(): string[] | null;
    get(key: string): any;
    contains(key: string): number;
    gettype(key: string): string;
    stringify(): string;
}

// Type for the resulting JavaScript object
type JavaScriptObject = { [key: string]: any };

/**
 * Converts a Max/MSP Dict object to a plain JavaScript object
 */
class UnDict {
    /**
     * Converts a Dict to a JavaScript object recursively
     * @param dict - The Max/MSP Dict object to convert
     * @returns A plain JavaScript object with the same structure
     */
    static toObject(dict: MaxDict): JavaScriptObject {
        const result: JavaScriptObject = {};

        // Get all keys from the dictionary
        const keys = dict.getkeys();

        // If no keys exist, return empty object
        if (!keys || keys.length === 0) {
            return result;
        }

        // Process each key
        for (const key of keys) {
            const value = dict.get(key);

            // If the value is itself a Dict, recursively convert it
            if (value && typeof value === 'object' && 'getkeys' in value) {
                result[key] = this.toObject(value as MaxDict);
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    /**
     * Alternative method using the Dict's built-in stringify method
     * This is more efficient but relies on the Dict having proper JSON serialization
     * @param dict - The Max/MSP Dict object to convert
     * @returns A plain JavaScript object parsed from JSON
     */
    static toObjectViaJSON(dict: MaxDict): JavaScriptObject {
        try {
            const jsonString = dict.stringify();
            return JSON.parse(jsonString);
        } catch (error) {
            throw new Error(`Failed to convert Dict to object via JSON: ${error}`);
        }
    }

    /**
     * Safely converts a Dict to object with error handling
     * @param dict - The Max/MSP Dict object to convert
     * @param useJSON - Whether to use JSON method (faster) or recursive method (more reliable)
     * @returns A plain JavaScript object or null if conversion fails
     */
    static safeConvert(dict: MaxDict, useJSON: boolean = true): JavaScriptObject | null {
        try {
            if (useJSON) {
                return this.toObjectViaJSON(dict);
            } else {
                return this.toObject(dict);
            }
        } catch (error) {
            console.error('Dict conversion failed:', error);
            return null;
        }
    }
}

/**
 * Utility function for simple Dict to object conversion
 * @param dict - The Max/MSP Dict object to convert
 * @returns A plain JavaScript object
 */
function dictToObject(dict: MaxDict): JavaScriptObject {
    return UnDict.toObject(dict);
}

/**
 * Utility function using JSON method for Dict to object conversion
 * @param dict - The Max/MSP Dict object to convert
 * @returns A plain JavaScript object
 */
function dictToObjectJSON(dict: MaxDict): JavaScriptObject {
    return UnDict.toObjectViaJSON(dict);
}

// Export the class and utility functions
export { UnDict as UnDict, dictToObject, dictToObjectJSON };
export type { MaxDict, JavaScriptObject };

// Usage examples:
/*
// Example 1: Using the class method
const myDict = new Dict("myData");
const jsObject = DictConverter.toObject(myDict);

// Example 2: Using the utility function
const jsObject2 = dictToObject(myDict);

// Example 3: Using JSON method (faster for large dicts)
const jsObject3 = DictConverter.toObjectViaJSON(myDict);

// Example 4: Safe conversion with error handling
const jsObject4 = DictConverter.safeConvert(myDict, true);
if (jsObject4) {
  // Successfully converted
  console.log(jsObject4);
} else {
  // Conversion failed
  console.log("Failed to convert Dict");
}
*/