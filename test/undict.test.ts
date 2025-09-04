import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnDict, dictToObject, dictToObjectJSON, type MaxDict } from '../src/undict';

// Mock implementation of MaxDict for testing
class MockDict implements MaxDict {
    name: string;
    quiet: boolean = false;
    private data: { [key: string]: any } = {};

    constructor(name: string = 'test', data: { [key: string]: any } = {}) {
        this.name = name;
        this.data = { ...data };
    }

    getkeys(): string[] | null {
        const keys = Object.keys(this.data);
        return keys.length > 0 ? keys : null;
    }

    get(key: string): any {
        return this.data[key];
    }

    contains(key: string): number {
        return key in this.data ? 1 : 0;
    }

    gettype(key: string): string {
        const value = this.data[key];
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    stringify(): string {
        return JSON.stringify(this.data);
    }

    // Helper method for testing
    setData(data: { [key: string]: any }): void {
        this.data = { ...data };
    }
}

describe('UnDict', () => {
    let mockDict: MockDict;

    beforeEach(() => {
        mockDict = new MockDict('test');
    });

    describe('toObject method', () => {
        it('should convert empty dict to empty object', () => {
            const result = UnDict.toObject(mockDict);
            expect(result).toEqual({});
        });

        it('should convert simple key-value pairs', () => {
            mockDict.setData({
                name: 'John',
                age: 30,
                active: true
            });

            const result = UnDict.toObject(mockDict);
            expect(result).toEqual({
                name: 'John',
                age: 30,
                active: true
            });
        });

        it('should handle various data types', () => {
            mockDict.setData({
                string: 'hello',
                number: 42,
                boolean: false,
                nullValue: null,
                array: [1, 2, 3],
                object: { nested: 'value' }
            });

            const result = UnDict.toObject(mockDict);
            expect(result).toEqual({
                string: 'hello',
                number: 42,
                boolean: false,
                nullValue: null,
                array: [1, 2, 3],
                object: { nested: 'value' }
            });
        });

        it('should recursively convert nested Dict objects', () => {
            const nestedDict = new MockDict('nested', { innerKey: 'innerValue' });
            const deepNestedDict = new MockDict('deep', { deepKey: 'deepValue' });

            // Make nested dict contain another dict
            nestedDict.setData({
                innerKey: 'innerValue',
                deepNested: deepNestedDict
            });

            mockDict.setData({
                topLevel: 'topValue',
                nested: nestedDict
            });

            const result = UnDict.toObject(mockDict);
            expect(result).toEqual({
                topLevel: 'topValue',
                nested: {
                    innerKey: 'innerValue',
                    deepNested: {
                        deepKey: 'deepValue'
                    }
                }
            });
        });

        it('should handle dict with no keys returning null from getkeys()', () => {
            // Override getkeys to return null
            vi.spyOn(mockDict, 'getkeys').mockReturnValue(null);

            const result = UnDict.toObject(mockDict);
            expect(result).toEqual({});
        });
    });

    describe('toObjectViaJSON method', () => {
        it('should convert dict using JSON stringify method', () => {
            mockDict.setData({
                name: 'Jane',
                score: 95.5,
                tags: ['javascript', 'typescript']
            });

            const result = UnDict.toObjectViaJSON(mockDict);
            expect(result).toEqual({
                name: 'Jane',
                score: 95.5,
                tags: ['javascript', 'typescript']
            });
        });

        it('should handle complex nested structures via JSON', () => {
            const complexData = {
                user: {
                    id: 123,
                    profile: {
                        name: 'Test User',
                        settings: {
                            theme: 'dark',
                            notifications: true
                        }
                    }
                },
                items: [
                    { id: 1, name: 'Item 1' },
                    { id: 2, name: 'Item 2' }
                ]
            };

            mockDict.setData(complexData);
            const result = UnDict.toObjectViaJSON(mockDict);
            expect(result).toEqual(complexData);
        });

        it('should throw error when JSON parsing fails', () => {
            // Mock stringify to return invalid JSON
            vi.spyOn(mockDict, 'stringify').mockReturnValue('invalid json {');

            expect(() => {
                UnDict.toObjectViaJSON(mockDict);
            }).toThrow('Failed to convert Dict to object via JSON');
        });
    });

    describe('safeConvert method', () => {
        it('should return converted object when using JSON method successfully', () => {
            mockDict.setData({ test: 'value' });

            const result = UnDict.safeConvert(mockDict, true);
            expect(result).toEqual({ test: 'value' });
        });

        it('should return converted object when using recursive method successfully', () => {
            mockDict.setData({ test: 'value' });

            const result = UnDict.safeConvert(mockDict, false);
            expect(result).toEqual({ test: 'value' });
        });

        it('should return null when JSON conversion fails', () => {
            vi.spyOn(mockDict, 'stringify').mockImplementation(() => {
                throw new Error('JSON error');
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = UnDict.safeConvert(mockDict, true);
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('Dict conversion failed:', expect.any(Error));

            consoleSpy.mockRestore();
        });

        it('should return null when recursive conversion fails', () => {
            vi.spyOn(mockDict, 'getkeys').mockImplementation(() => {
                throw new Error('getkeys error');
            });

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            const result = UnDict.safeConvert(mockDict, false);
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('Dict conversion failed:', expect.any(Error));

            consoleSpy.mockRestore();
        });

        it('should default to JSON method when no method specified', () => {
            mockDict.setData({ default: 'test' });

            const result = UnDict.safeConvert(mockDict);
            expect(result).toEqual({ default: 'test' });
        });
    });
});

describe('Utility Functions', () => {
    let mockDict: MockDict;

    beforeEach(() => {
        mockDict = new MockDict('utility-test');
    });

    describe('dictToObject', () => {
        it('should work as a wrapper for UnDict.toObject', () => {
            mockDict.setData({ utility: 'function' });

            const result = dictToObject(mockDict);
            expect(result).toEqual({ utility: 'function' });
        });
    });

    describe('dictToObjectJSON', () => {
        it('should work as a wrapper for UnDict.toObjectViaJSON', () => {
            mockDict.setData({ json: 'utility' });

            const result = dictToObjectJSON(mockDict);
            expect(result).toEqual({ json: 'utility' });
        });
    });
});

describe('Edge Cases', () => {

    let mockDict: MockDict;
    beforeEach(() => {
        mockDict = new MockDict('edge-cases');
    });
    it('should handle circular references in recursive method gracefully', () => {
        // This test simulates what might happen with circular references
        const dictA = new MockDict('a');
        const dictB = new MockDict('b');

        // Create a scenario that could cause infinite recursion
        dictA.setData({ b: dictB });
        dictB.setData({ value: 'test' });

        const result = UnDict.toObject(dictA);
        expect(result).toEqual({
            b: {
                value: 'test'
            }
        });
    });

    it('should handle very deep nesting', () => {
        const createNestedDict = (depth: number): MockDict => {
            if (depth === 0) {
                return new MockDict('leaf', { value: 'deep' });
            }
            return new MockDict(`level${depth}`, { nested: createNestedDict(depth - 1) });
        };

        const deepDict = createNestedDict(5);
        const result = UnDict.toObject(deepDict);

        // Verify the structure
        let current = result;
        for (let i = 0; i < 5; i++) {
            expect(current).toHaveProperty('nested');
            current = current.nested;
        }
        expect(current).toEqual({ value: 'deep' });
    });

    it('should handle undefined and null values correctly', () => {
        mockDict.setData({
            undefinedValue: undefined,
            nullValue: null,
            emptyString: '',
            zero: 0,
            false: false
        });

        const result = UnDict.toObject(mockDict);
        expect(result).toEqual({
            undefinedValue: undefined,
            nullValue: null,
            emptyString: '',
            zero: 0,
            false: false
        });
    });
});

describe('Performance Tests', () => {

    let mockDict: MockDict;
    beforeEach(() => {
        mockDict = new MockDict('edge-cases');
    });
    it('should handle large dictionaries efficiently', () => {
        const largeData: { [key: string]: any } = {};

        // Create a large dataset
        for (let i = 0; i < 1000; i++) {
            largeData[`key${i}`] = {
                id: i,
                name: `Item ${i}`,
                data: new Array(10).fill(i)
            };
        }

        mockDict.setData(largeData);

        const startTime = Date.now();
        const result = UnDict.toObjectViaJSON(mockDict);
        const endTime = Date.now();

        expect(Object.keys(result)).toHaveLength(1000);
        expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });
});