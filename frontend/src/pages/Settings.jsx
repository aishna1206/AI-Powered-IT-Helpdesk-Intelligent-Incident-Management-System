import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  KeyRound,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/api";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(
        response.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    if (user?.role === "employee") {
      navigate("/employee/dashboard");
      return;
    }

    if (user?.role === "agent") {
      navigate("/agent/dashboard");
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="settings-page">

      <div className="settings-header">
        <button
          type="button"
          className="settings-back-button"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <h2>Settings</h2>
          <p>
            Manage your account information and password.
          </p>
        </div>
      </div>

      {/* Profile */}
      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <UserRound size={18} />
          </div>

          <div>
            <h3>Profile</h3>
            <p>
              Your current helpdesk account details.
            </p>
          </div>
        </div>

        <div className="settings-profile-grid">

          <div className="settings-field">
            <span>Name</span>
            <strong>
              {user?.name || "—"}
            </strong>
          </div>

          <div className="settings-field">
            <span>Email</span>
            <strong>
              {user?.email || "—"}
            </strong>
          </div>

          <div className="settings-field">
            <span>Role</span>
            <strong>
              {user?.role || "—"}
            </strong>
          </div>

        </div>
      </section>

      {/* Password */}
      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <KeyRound size={18} />
          </div>

          <div>
            <h3>Change Password</h3>
            <p>
              Choose a new password for your account.
            </p>
          </div>
        </div>

        {success && (
          <div className="settings-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        <form
          className="settings-password-form"
          onSubmit={handleChangePassword}
        >
          <div className="settings-form-group">
            <label htmlFor="currentPassword">
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="settings-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Change Password"}
          </button>
        </form>
      </section>

      {/* Logout */}
      <section className="settings-card settings-logout-card">
        <div>
          <h3>Sign out</h3>
          <p>
            Sign out of this helpdesk account on this
            device.
          </p>
        </div>

        <button
          type="button"
          className="settings-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </section>

    </div>
  );
}

export default Settings;