const API_URL = "https://site-inspection-backend.onrender.com";

export interface CreateUserRequest {
  user_id: string;
  username: string;
  password: string;
  role: string;
  project_id?: number;
}

export const createUser = async (
  userData: CreateUserRequest,
  token: string | null
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Failed to create user: ${response.status} - ${errorData}`
    );
  }

  return await response.json();
};

export const deleteUser = async (
  userId: number,
  token: string | null
) => {
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `Failed to delete user: ${response.status} - ${errorData}`
    );
  }

  return await response.json();
};
