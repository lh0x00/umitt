/* @flow */

export const defineProperty = (object: Object, key: string, value: any) => {
  Object.defineProperty(object, key, {
    value,
    enumerable: false,
    configurable: true,
  })
}

export const keysOf = (object: Object): string[] => Object.keys(object)

export const createEmptyObject = () => Object.create(null)
