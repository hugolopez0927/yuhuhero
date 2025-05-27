// src/services/api.ts
const BASE_URL = "http://localhost:5000/api";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string,string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  quizCompleted: boolean;
  token: string;
}

export function registerUser(name: string, phone: string, password: string): Promise<User> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, phone, password }),
  });
}

export function loginUser(phone: string, password: string): Promise<User> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export function getProfile(): Promise<Omit<User,"token">> {
  return request("/users/profile");
}

export function updateProfile(updates: Partial<Omit<User,"_id"|"token">>): Promise<Omit<User,"token">> {
  return request("/users/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
