import { apiService } from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  ApiResponse,
} from "../types";

class AuthService {
  // ================= AUTHENTICATION METHODS =================

  /**
   * Login regular y admin - usa el mismo endpoint
   * El backend diferencia por el rol del usuario en la respuesta
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );

    if (response.success) {
      const { token, user, refreshToken } = response.data;

      // Guardar tokens y usuario
      if (token) {
        apiService.setAuthToken(token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    }

    throw new Error(response.message || "Login failed");
  }

  /**
   * Admin login - usa el mismo endpoint que login regular
   * La diferenciación se hace por el rol del usuario
   */
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.login(credentials);

    // Verificar que el usuario tenga rol de admin
    if (response.user?.role !== "ADMIN") {
      // Hacer logout si no es admin
      await this.logout();
      throw new Error("Access denied: Admin privileges required");
    }

    return response;
  }

  /**
   * Registro de usuario
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData
    );

    if (response.success) {
      const { token, user, refreshToken } = response.data;

      // Guardar tokens y usuario
      if (token) {
        apiService.setAuthToken(token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    }

    throw new Error(response.message || "Registration failed");
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        // El backend espera el refreshToken como query parameter
        await apiService.post(
          `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Limpiar datos locales siempre
      this.clearAuthData();
    }
  }

  /**
   * Refrescar token de acceso
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // El backend espera el refreshToken como query parameter
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      `/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`
    );

    if (response.success) {
      const { token, user, refreshToken: newRefreshToken } = response.data;

      // Actualizar tokens
      if (token) {
        apiService.setAuthToken(token);
      }

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    }

    throw new Error(response.message || "Token refresh failed");
  }

  /**
   * Validar token actual
   */
  async validateToken(): Promise<AuthResponse> {
    const response = await apiService.get<ApiResponse<AuthResponse>>(
      "/auth/validate"
    );

    if (response.success) {
      // Actualizar usuario en localStorage
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    }

    throw new Error(response.message || "Token validation failed");
  }

  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser(): Promise<AuthResponse> {
    const response = await apiService.get<ApiResponse<AuthResponse>>(
      "/auth/me"
    );

    if (response.success) {
      // Actualizar usuario en localStorage
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    }

    throw new Error(response.message || "Failed to get current user");
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<string> {
    // El backend espera los parámetros como query parameters
    const params = new URLSearchParams({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    const response = await apiService.post<ApiResponse<string>>(
      `/auth/change-password?${params}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Password change failed");
  }

  // ================= LOCAL STORAGE METHODS =================

  /**
   * Obtener usuario desde localStorage
   */
  getCurrentUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token =
      localStorage.getItem("authToken") || apiService.getAuthToken();
    const user = this.getCurrentUserFromStorage();
    return !!token && !!user;
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUserFromStorage();
    return user?.role === "ADMIN";
  }

  /**
   * Obtener token de localStorage
   */
  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Obtener refresh token de localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Limpiar todos los datos de autenticación
   */
  clearAuthData(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    apiService.clearAuthToken();
  }

  // ================= VALIDATION METHODS =================

  /**
   * Validar credenciales de login
   */
  validateLoginCredentials(credentials: LoginCredentials): {
    isValid: boolean;
    message?: string;
  } {
    if (!credentials.email) {
      return { isValid: false, message: "Email is required" };
    }

    if (!credentials.password) {
      return { isValid: false, message: "Password is required" };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      return { isValid: false, message: "Invalid email format" };
    }

    return { isValid: true };
  }

  /**
   * Validar datos de registro
   */
  validateRegisterData(userData: RegisterData): {
    isValid: boolean;
    message?: string;
  } {
    if (!userData.email) {
      return { isValid: false, message: "Email is required" };
    }

    if (!userData.password) {
      return { isValid: false, message: "Password is required" };
    }

    if (!userData.name) {
      return { isValid: false, message: "Name is required" };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { isValid: false, message: "Invalid email format" };
    }

    // Validar longitud de contraseña
    if (userData.password.length < 6) {
      return {
        isValid: false,
        message: "Password must be at least 6 characters",
      };
    }

    return { isValid: true };
  }

  /**
   * Validar cambio de contraseña
   */
  validatePasswordChange(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): { isValid: boolean; message?: string } {
    if (!currentPassword) {
      return { isValid: false, message: "Current password is required" };
    }

    if (!newPassword) {
      return { isValid: false, message: "New password is required" };
    }

    if (!confirmPassword) {
      return { isValid: false, message: "Password confirmation is required" };
    }

    if (newPassword !== confirmPassword) {
      return { isValid: false, message: "New passwords do not match" };
    }

    if (newPassword.length < 6) {
      return {
        isValid: false,
        message: "New password must be at least 6 characters",
      };
    }

    if (currentPassword === newPassword) {
      return {
        isValid: false,
        message: "New password must be different from current password",
      };
    }

    return { isValid: true };
  }

  // ================= UTILITY METHODS =================

  /**
   * Intentar refrescar token automáticamente
   */
  async tryRefreshToken(): Promise<boolean> {
    try {
      await this.refreshToken();
      return true;
    } catch (error) {
      console.error("Auto token refresh failed:", error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Verificar si el token está próximo a expirar
   * (Esta función requeriría decodificar el JWT para obtener la fecha de expiración)
   */
  isTokenExpiringSoon(): boolean {
    // Implementar lógica para verificar expiración del JWT
    // Por ahora retorna false, pero podrías implementar la lógica completa
    return false;
  }
}

export const authService = new AuthService();
