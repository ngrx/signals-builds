export declare function excludeKeys<Obj extends Record<string, unknown>, Keys extends string[]>(obj: Obj, keys: Keys): Omit<Obj, Keys[number]>;
