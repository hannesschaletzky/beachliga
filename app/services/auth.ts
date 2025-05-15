export function isAuthenticated(
  request: Request,
  AUTH_USERNAME: string,
  AUTH_PASSWORD: string
) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  return username === AUTH_USERNAME && password === AUTH_PASSWORD;
}
