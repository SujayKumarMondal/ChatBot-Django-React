import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:7004";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Utility function for handling errors
function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const axiosError = err as AxiosError;
    throw new Error(
      axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message
    );
  } else if (err instanceof Error) {
    throw new Error(err.message);
  }
  throw new Error("An unknown error occurred!");
}

// 🔹 Prompt GPT
export async function promptGPT(data: { chat_id: string; content: string }, token: string) {
  try {
    const response = await api.post("/prompt_gpt/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Get messages of a chat
export async function getChatMessages(chatId: string, token: string) {
  if (!chatId) return [];
  try {
    const response = await api.get(`/get_chat_messages/${chatId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Today's chats
export async function getTodaysChats(token: string) {
  try {
    const response = await api.get("/todays_chat/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Yesterday's chats
export async function getYesterdaysChats(token: string) {
  try {
    const response = await api.get("/yesterdays_chat/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Last 7 days chats
export async function getSevenDaysChats(token: string) {
  try {
    const response = await api.get("/seven_days_chat/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Delete chat
export async function deleteChat(chatId: string, token: string) {
  try {
    const response = await api.delete(`/delete_chat/${chatId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// ======================= Profile Management =======================

// 🔹 Get user profile
export async function getUserProfile(token: string) {
  try {
    const response = await api.get("/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Update user profile
export async function updateUserProfile(
  data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  },
  token: string
) {
  try {
    const response = await api.put("/api/profile/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Upload profile image
export async function uploadProfileImage(
  file: File,
  token: string
) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await axios.post(
      `${BASE_URL}/api/profile/upload-image/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Change password
export async function changePassword(
  data: {
    old_password: string;
    new_password: string;
  },
  token: string
) {
  try {
    const response = await api.post("/api/profile/change-password/", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}

// 🔹 Delete account
export async function deleteAccount(token: string) {
  try {
    const response = await api.delete("/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: unknown) {
    handleError(err);
  }
}