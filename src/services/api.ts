const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para obtener el token del localStorage
  private getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Agregar Authorization header si se requiere autenticación
    if (requiresAuth) {
      const token = this.getToken();

      // Debug: Log para verificar token
      console.log("🔐 Auth Required:", requiresAuth);
      console.log("🔑 Token Present:", !!token);
      console.log("📍 Endpoint:", endpoint);

      if (!token) {
        console.error("❌ No token found in localStorage");
        throw new Error("No authentication token found. Please login again.");
      }

      headers.Authorization = `Bearer ${token}`;
      console.log("✅ Authorization header added");
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      console.log("🚀 Making request to:", url);
      const response = await fetch(url, config);

      if (response.status === 401) {
        console.error("❌ 401 Unauthorized - Token may be invalid or expired");
        this.handleUnauthorized();
        throw new Error("Unauthorized - Please login again");
      }

      if (response.status === 403) {
        console.error("❌ 403 Forbidden - Insufficient permissions");
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
        throw new Error(
          errorData.message || "Access forbidden - Insufficient permissions"
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ HTTP Error:", response.status, errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("✅ Request successful");
      return await response.json();
    } catch (error) {
      console.error("💥 API request failed:", error);
      throw error;
    }
  }

  private handleUnauthorized() {
    console.log(
      "🔓 Handling unauthorized - Clearing auth data and redirecting"
    );
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  setAuthToken(token: string) {
    console.log("🔐 Setting auth token");
    localStorage.setItem("authToken", token);
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  clearAuthToken() {
    console.log("🔓 Clearing auth token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  // GET request con soporte para autenticación opcional
  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, requiresAuth);
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    requiresAuth: boolean = true
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      requiresAuth
    );
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiService = new ApiService();
