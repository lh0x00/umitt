/* @flow */

export const defineProperty = (object: Object, key: string, value: any) => {
  Object.defineProperty(object, key, {
    value,
    enumerable: false,
  })
}
