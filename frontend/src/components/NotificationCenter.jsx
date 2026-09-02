import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Ticket,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getTickets } from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./NotificationCenter.css";

function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  const storageKey = `helpdesk-read-notifications-${user?.email || "guest"}`;

  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadTickets = async () => {
      try {
        setLoading(true);

        const data = await getTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();

    const interval = setInterval(loadTickets, 30000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const markAsRead = (notificationId) => {
    setReadIds((current) => {
      const updated = current.includes(notificationId)
        ? current
        : [...current, notificationId];

      localStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const notifications = useMemo(() => {
    if (!user) {
      return [];
    }

    const result = [];

    if (user.role === "employee") {
      tickets.forEach((ticket) => {
        if (
          ticket.status === "Resolved" ||
          ticket.status === "Closed"
        ) {
          result.push({
            id: `${ticket.ticketId}-resolved`,
            type: "resolved",
            title: "Ticket resolved",
            message: `${ticket.ticketId} has been ${ticket.status.toLowerCase()}.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.updatedAt || ticket.createdAt
          });
        }

        if (ticket.status === "In Progress") {
          result.push({
            id: `${ticket.ticketId}-progress`,
            type: "progress",
            title: "Ticket in progress",
            message: `${ticket.ticketId} is currently being worked on.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.updatedAt || ticket.createdAt
          });
        }

        if (ticket.status === "Pending") {
          result.push({
            id: `${ticket.ticketId}-pending`,
            type: "pending",
            title: "Ticket pending",
            message: `${ticket.ticketId} is waiting for further action.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.updatedAt || ticket.createdAt
          });
        }
      });
    } else {
      tickets.forEach((ticket) => {
        if (ticket.status === "Open") {
          result.push({
            id: `${ticket.ticketId}-open`,
            type: "ticket",
            title: "New ticket",
            message: `${ticket.ticketId} requires support attention.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.createdAt
          });
        }

        if (ticket.priority === "Critical") {
          result.push({
            id: `${ticket.ticketId}-critical`,
            type: "critical",
            title: "Critical incident",
            message: `${ticket.ticketId} has Critical priority.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.createdAt
          });
        }

        if (
          ticket.status === "Resolved" ||
          ticket.status === "Closed"
        ) {
          result.push({
            id: `${ticket.ticketId}-completed`,
            type: "resolved",
            title: "Incident completed",
            message: `${ticket.ticketId} has been ${ticket.status.toLowerCase()}.`,
            ticketId: ticket.ticketId,
            createdAt: ticket.updatedAt || ticket.createdAt
          });
        }
      });
    }

    return result
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 12);
  }, [tickets, user]);

  const unreadNotifications = notifications.filter(
    (notification) =>
      !readIds.includes(notification.id)
  );

  const unreadCount = unreadNotifications.length;

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setOpen(false);

    if (user?.role === "employee") {
      navigate(
        `/employee/tickets/${encodeURIComponent(
          notification.ticketId
        )}`
      );
      return;
    }

    if (user?.role === "admin") {
      navigate(
        `/admin/tickets/${encodeURIComponent(
          notification.ticketId
        )}`
      );
      return;
    }

    navigate(
      `/agent/tickets/${encodeURIComponent(
        notification.ticketId
      )}`
    );
  };

  const markAllAsRead = () => {
    const ids = notifications.map(
      (notification) => notification.id
    );

    const updated = Array.from(
      new Set([...readIds, ...ids])
    );

    setReadIds(updated);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updated)
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "resolved":
        return <CheckCircle2 size={17} />;

      case "progress":
        return <Clock3 size={17} />;

      case "pending":
        return <Clock3 size={17} />;

      case "critical":
        return <AlertTriangle size={17} />;

      default:
        return <Ticket size={17} />;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const currentDate = new Date();
    const notificationDate = new Date(date);

    const diff =
      currentDate.getTime() -
      notificationDate.getTime();

    const minutes = Math.floor(
      diff / (1000 * 60)
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short"
      }
    );
  };

  return (
    <div
      className="notification-wrapper"
      ref={wrapperRef}
    >
      <button
        type="button"
        className="notification-bell-button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>
              <span>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up"}
              </span>
            </div>

            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="mark-read-button"
                >
                  Mark all read
                </button>
              )}

              <button
                type="button"
                className="notification-close"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {loading && tickets.length === 0 ? (
              <div className="notification-empty">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={25} />
                <strong>No notifications</strong>
                <span>
                  You're all caught up.
                </span>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnread = !readIds.includes(
                  notification.id
                );

                return (
                  <button
                    type="button"
                    key={notification.id}
                    className={`notification-item ${
                      isUnread ? "unread" : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >
                    <div
                      className={`notification-icon ${notification.type}`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="notification-content">
                      <div className="notification-title-row">
                        <strong>
                          {notification.title}
                        </strong>

                        <span>
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>
                      </div>

                      <p>
                        {notification.message}
                      </p>
                    </div>

                    {isUnread && (
                      <span className="notification-unread-dot" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;