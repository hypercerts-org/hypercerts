// ex: getPath({ user: { name: 'u1' }}, "user.name")
export function getPath<
  T extends Record<string | number, any>,
  K extends Path<T>,
>(obj: T, path: K): Choose<T, K> {
  // https://stackoverflow.com/a/6394168
  return path.split(".").reduce((o, i) => o[i], obj) as any;
}

// Here there be dragons
// https://www.calebpitan.com/blog/dot-notation-type-accessor-in-typescript

type ExcludeArrayKeys<T> = T extends ArrayLike<any>
  ? Exclude<keyof T, keyof any[]>
  : keyof T;
export type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
        | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
    : never
  : never;

export type Path<T> = keyof T extends string
  ? PathImpl2<T> extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never;

export type Choose<
  T extends Record<string | number, any>,
  K extends Path<T>,
> = K extends `${infer U}.${infer Rest}`
  ? Rest extends Path<T[U]>
    ? Choose<T[U], Rest>
    : never
  : T[K];
