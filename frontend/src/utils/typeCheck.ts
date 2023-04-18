export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isBlob(value: any): value is Blob {
  return value instanceof Blob;
}

