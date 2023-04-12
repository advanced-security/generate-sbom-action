export function getRequiredEnvParam(paramName: string): string {
  const value = process.env[paramName]
  if (value === undefined || value.length === 0) {
    throw new Error(`${paramName} environment variable must be set`)
  }
  return value
}

export function wrapError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}
