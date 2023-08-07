/* eslint-disable @typescript-eslint/ban-types */
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? never : K;
}[keyof T];

export type NonFunctionProperties<T, TOmit extends keyof any = ''> = Pick<
  Pick<T, KeysMatching<T, Function>>,
  Exclude<keyof Pick<T, KeysMatching<T, Function>>, TOmit>
>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;
