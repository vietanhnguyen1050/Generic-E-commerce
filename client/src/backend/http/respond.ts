// BE — helper tạo response JSON thống nhất.
export function ok<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return Response.json({ message, details }, { status });
}
