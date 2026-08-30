const API_BASE_URL = "http://localhost:5000/api";


// ============================================
// CREATE TICKET
// ============================================

export const createTicket = async (ticketData) => {
  const response = await fetch(
    `${API_BASE_URL}/tickets`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(ticketData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to create ticket"
    );
  }

  return data;
};


// ============================================
// GET ALL TICKETS
// ============================================

export const getTickets = async () => {
  const response = await fetch(
    `${API_BASE_URL}/tickets`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch tickets"
    );
  }

  return data;
};


// ============================================
// GET ONE TICKET
// ============================================

export const getTicket = async (ticketId) => {
  const response = await fetch(
    `${API_BASE_URL}/tickets/${encodeURIComponent(ticketId)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch ticket"
    );
  }

  return data;
};