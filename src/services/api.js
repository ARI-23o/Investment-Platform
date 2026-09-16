// Central Data Service (Shared Across All Browsers & Devices via Backend API)

export async function fetchAllEnquiries() {
  try {
    const res = await fetch("/api/enquiries");
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("gsp_enquiries_cache", JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Backend API unavailable, reading from local cache:", err);
  }
  // Fallback to local cache
  const cached = localStorage.getItem("gsp_enquiries_cache") || localStorage.getItem("gsp_enquiries") || "[]";
  return JSON.parse(cached);
}

export async function saveEnquiryToBackend(enquiry) {
  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    if (res.ok) {
      const result = await res.json();
      return result.enquiry || enquiry;
    }
  } catch (err) {
    console.warn("Could not post to backend, storing locally:", err);
  }
  // Fallback
  const cached = JSON.parse(localStorage.getItem("gsp_enquiries_cache") || "[]");
  cached.unshift(enquiry);
  localStorage.setItem("gsp_enquiries_cache", JSON.stringify(cached));
  return enquiry;
}

export async function updateEnquiryStatusInBackend(id, newStatus) {
  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_status", id, status: newStatus }),
    });
    if (res.ok) {
      const result = await res.json();
      return result;
    }
  } catch (err) {
    console.warn("Could not update status on backend, updating local cache:", err);
  }
  // Fallback to local cache
  try {
    const cached = JSON.parse(localStorage.getItem("gsp_enquiries_cache") || "[]");
    const updated = cached.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    localStorage.setItem("gsp_enquiries_cache", JSON.stringify(updated));
  } catch (e) {}
  return { success: true, id, status: newStatus };
}

export async function deleteEnquiryFromBackend(id) {
  try {
    await fetch(`/api/enquiries?id=${id || "all"}`, { method: "DELETE" });
  } catch (err) {
    console.warn("Could not delete from backend:", err);
  }
}

export async function clearAllEnquiriesFromBackend() {
  try {
    await fetch("/api/enquiries?id=all", { method: "DELETE" });
    localStorage.removeItem("gsp_enquiries_cache");
    localStorage.removeItem("gsp_enquiries");
  } catch (err) {
    console.warn("Could not clear from backend:", err);
  }
}

export async function registerUserBackend(user) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const result = await res.json();
      return result.user || user;
    }
  } catch (err) {
    console.warn("Backend user registration error:", err);
  }
  return user;
}

export const registerUserInBackend = registerUserBackend;

export async function fetchSettingsFromBackend() {
  try {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const settings = await res.json();
      if (settings.googleSheetWebhook) {
        localStorage.setItem("gsp_google_sheet_webhook", settings.googleSheetWebhook);
      }
      if (settings.adminPin) {
        localStorage.setItem("gsp_admin_pin", settings.adminPin);
      }
      localStorage.setItem("gsp_settings", JSON.stringify(settings));
      return settings;
    }
  } catch (err) {
    console.warn("Backend settings fetch error:", err);
  }
  try {
    return JSON.parse(localStorage.getItem("gsp_settings") || "{}");
  } catch {
    return {};
  }
}

export async function saveSettingsToBackend(newSettings) {
  const token = sessionStorage.getItem("gsp_admin_token") || "";
  try {
    if (newSettings.googleSheetWebhook) {
      localStorage.setItem("gsp_google_sheet_webhook", newSettings.googleSheetWebhook);
    }
    const existing = JSON.parse(localStorage.getItem("gsp_settings") || "{}");
    const merged = { ...existing, ...newSettings };
    localStorage.setItem("gsp_settings", JSON.stringify(merged));

    // 1. Sync to sheets-gateway.php
    if (newSettings.googleSheetWebhook !== undefined && token) {
      try {
        await fetch("/api/sheets-gateway.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save_settings",
            googleSheetWebhook: newSettings.googleSheetWebhook,
            token: token
          }),
        });
      } catch (gwErr) {}
    }

    // 2. Sync to general settings endpoint
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
    if (res.ok) {
      const result = await res.json();
      return result.settings || merged;
    }
  } catch (err) {
    console.warn("Backend settings save error:", err);
  }
  return newSettings;
}

// 30-MINUTE INACTIVITY TIMEOUT CONSTANT (30 minutes = 1,800,000 ms)
export const ADMIN_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function updateAdminActivity() {
  if (sessionStorage.getItem("gsp_admin_token")) {
    sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
  }
}

export function isAdminSessionExpiredDueToInactivity() {
  const token = sessionStorage.getItem("gsp_admin_token");
  if (!token) return true;
  const lastActiveStr = sessionStorage.getItem("gsp_admin_last_activity");
  if (!lastActiveStr) return false;
  const lastActive = parseInt(lastActiveStr, 10);
  return Date.now() - lastActive > ADMIN_INACTIVITY_TIMEOUT_MS;
}

// SECURE SERVER-SIDE BCRYPT AUTHENTICATION (PHP BACKEND)
export async function loginAdminServer(password) {
  try {
    const res = await fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      sessionStorage.setItem("gsp_admin_token", data.token);
      sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
      return { success: true, token: data.token };
    }
    return { success: false, error: data.error || "Authentication failed." };
  } catch (err) {
    console.warn("Server auth endpoint unavailable, verifying via fallback:", err);
    // Fallback for local Vite dev testing if PHP server is not running locally
    const fallbackPin = localStorage.getItem("gsp_dev_admin_pin") || "admin123";
    if (password === fallbackPin) {
      const fakeToken = "dev-token-" + Date.now();
      sessionStorage.setItem("gsp_admin_token", fakeToken);
      sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
      return { success: true, token: fakeToken };
    }
    return { success: false, error: "Invalid password. Please check and try again." };
  }
}

export async function verifyAdminSessionServer(token) {
  if (!token) return false;
  
  // Check client-side 30-minute inactivity limit
  if (isAdminSessionExpiredDueToInactivity()) {
    await logoutAdminServer();
    return false;
  }

  try {
    const res = await fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify_session", token }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.valid) {
      sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
      return true;
    }
    return false;
  } catch (err) {
    if (token.startsWith("dev-token-")) {
      sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
      return true;
    }
    return false;
  }
}

export async function changeAdminPasswordServer(currentPassword, newPassword) {
  const token = sessionStorage.getItem("gsp_admin_token") || "";
  try {
    const res = await fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", currentPassword, newPassword, token }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        sessionStorage.setItem("gsp_admin_token", data.token);
        sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
      }
      return { success: true, message: data.message };
    }
    return { success: false, error: data.error || "Failed to update password." };
  } catch (err) {
    console.warn("Server change password endpoint unavailable:", err);
    localStorage.setItem("gsp_dev_admin_pin", newPassword);
    sessionStorage.setItem("gsp_admin_last_activity", Date.now().toString());
    return { success: true, message: "Password updated successfully in local environment." };
  }
}

export async function logoutAdminServer() {
  const token = sessionStorage.getItem("gsp_admin_token") || "";
  sessionStorage.removeItem("gsp_admin_token");
  sessionStorage.removeItem("gsp_admin_last_activity");
  try {
    await fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout", token }),
    });
  } catch (err) {
    // Ignore error on logout
  }
}

