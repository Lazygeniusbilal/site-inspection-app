const API_URL = "http://127.0.0.1:8000";

export interface ChatMessage {
  id: number;
  message: string;
  sender_username: string;
  project_id: number;
  timestamp: string;
}

export const sendMessage = async (
  message: string,
  project_id: number,
  sender_username: string,
  token: string | null
) => {
  const formdata = new FormData();
  formdata.append("message", message);
  formdata.append("project_id", project_id.toString());
  formdata.append("sender_username", sender_username);

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/chats/send_message`, {
    method: "POST",
    headers,
    body: formdata,
  });

  if (!response.ok) throw new Error("Failed to send message!");
  return await response.json();
};

export const fetchMessages = async (
  project_id: number,
  token: string | null
) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/chats/get_messages?project_id=${project_id}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch messages!");
  return await response.json();
};
