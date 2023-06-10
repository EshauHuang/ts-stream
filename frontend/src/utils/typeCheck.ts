export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBlob(value: unknown): value is Blob {
  return value instanceof Blob;
}

