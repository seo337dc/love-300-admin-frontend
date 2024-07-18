export const setAuthorization = (token?: string) => {
  if (!token) return localStorage.removeItem("Authorization")
  return localStorage.setItem("Authorization", token);
}

export const getAuthorization = (): string => {
  return localStorage.getItem("Authorization") || '';
}
