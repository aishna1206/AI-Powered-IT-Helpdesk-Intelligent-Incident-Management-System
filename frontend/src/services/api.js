const API_BASE_URL =
  "http://localhost:5000/api";


const getAuthToken = () => {
  return localStorage.getItem(
    "authToken"
  );
};


const authenticatedRequest =
  async (url, options = {}) => {

    const token =
      getAuthToken();


    const headers = {
      ...(options.headers || {}),
    };


    if (token) {

      headers.Authorization =
        `Bearer ${token}`;

    }


    const response =
      await fetch(
        url,
        {
          ...options,
          headers,
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Request failed"
      );

    }


    return data;

  };


// ============================================
// AUTH
// ============================================

export const registerUser =
  async (userData) => {

    return authenticatedRequest(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            userData
          ),
      }
    );

  };


export const loginUser =
  async (credentials) => {

    return authenticatedRequest(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            credentials
          ),
      }
    );

  };


export const getCurrentUser =
  async () => {

    return authenticatedRequest(
      `${API_BASE_URL}/auth/me`
    );

  };


// ============================================
// TICKETS
// ============================================

export const createTicket =
  async (ticketData) => {

    return authenticatedRequest(
      `${API_BASE_URL}/tickets`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            ticketData
          ),
      }
    );

  };


export const getTickets =
  async () => {

    return authenticatedRequest(
      `${API_BASE_URL}/tickets`
    );

  };


export const getTicket =
  async (ticketId) => {

    return authenticatedRequest(
      `${API_BASE_URL}/tickets/${encodeURIComponent(
        ticketId
      )}`
    );

  };


export const updateTicket =
  async (
    ticketId,
    updates
  ) => {

    return authenticatedRequest(
      `${API_BASE_URL}/tickets/${encodeURIComponent(
        ticketId
      )}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            updates
          ),
      }
    );

  };


// ============================================
// USERS
// ============================================

export const getUsers =
  async () => {

    return authenticatedRequest(
      `${API_BASE_URL}/users`
    );

  };