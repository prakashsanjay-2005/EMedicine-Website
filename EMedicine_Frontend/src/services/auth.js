import { jwtDecode } from "jwt-decode";

export const getUserId = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const decoded = jwtDecode(token);

  return decoded[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
};

export const getRole = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));

  return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};