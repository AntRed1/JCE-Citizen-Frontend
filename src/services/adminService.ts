import { apiService } from "./api";
import type {
  AppSettings,
  ApiResponse,
  PaginatedResponse,
  Feature,
  Testimonial,
  Banner,
  DashboardStats,
  HealthStatus,
  CleanupResults,
  SystemStats,
  LogData,
  JceClientInfo,
  UserDto,
  PaymentOrderDto,
  UserStatsDto,
} from "../types";

class AdminService {
  // ================= ADMIN CONTROLLER ENDPOINTS =================

  /**
   * Obtener estadísticas del dashboard administrativo
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get dashboard stats");
  }

  /**
   * Verificar salud del sistema
   */
  async healthCheck(): Promise<HealthStatus> {
    const response = await apiService.get<ApiResponse<HealthStatus>>(
      "/admin/health-check"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Health check failed");
  }

  /**
   * Ejecutar limpieza del sistema
   */
  async performSystemCleanup(): Promise<CleanupResults> {
    const response = await apiService.post<ApiResponse<CleanupResults>>(
      "/admin/cleanup"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "System cleanup failed");
  }

  /**
   * Enviar email de prueba
   */
  async sendTestEmail(
    testEmail: string,
    subject: string = "Email de Prueba - JCE Consulta API",
    message: string = "Este es un email de prueba del sistema JCE Consulta API."
  ): Promise<string> {
    const params = new URLSearchParams({
      testEmail,
      subject,
      message,
    });

    const response = await apiService.post<ApiResponse<string>>(
      `/admin/test-email?${params}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to send test email");
  }

  /**
   * Actualizar precio del token
   */
  async updateTokenPrice(newPrice: number): Promise<number> {
    const response = await apiService.put<ApiResponse<number>>(
      `/admin/token-price?newPrice=${newPrice}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update token price");
  }

  /**
   * Obtener información del cliente JCE
   */
  async getJceClientInfo(): Promise<JceClientInfo> {
    const response = await apiService.get<ApiResponse<JceClientInfo>>(
      "/admin/jce-client-info"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get JCE client info");
  }

  /**
   * Probar conexión con JCE
   */
  async testJceConnection(): Promise<boolean> {
    const response = await apiService.post<ApiResponse<boolean>>(
      "/admin/test-jce"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "JCE connection test failed");
  }

  /**
   * Obtener estadísticas completas del sistema
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiService.get<ApiResponse<SystemStats>>(
      "/admin/system-stats"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get system stats");
  }

  /**
   * Limpiar caché del sistema
   */
  async clearSystemCache(): Promise<string> {
    const response = await apiService.post<ApiResponse<string>>(
      "/admin/clear-cache"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to clear system cache");
  }

  /**
   * Obtener logs del sistema
   */
  async getSystemLogs(
    lines: number = 100,
    level: string = "INFO"
  ): Promise<LogData> {
    const params = new URLSearchParams({
      lines: lines.toString(),
      level,
    });

    const response = await apiService.get<ApiResponse<LogData>>(
      `/admin/logs?${params}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get system logs");
  }

  // ================= APP SETTINGS CONTROLLER ENDPOINTS =================

  /**
   * Obtener configuraciones públicas (usando endpoint público)
   */
  async getPublicSettings(): Promise<AppSettings> {
    // Intentar primero el endpoint público sin autenticación
    try {
      const response = await apiService.get<ApiResponse<AppSettings>>(
        "/settings/public",
        false // sin autenticación
      );

      if (response.success) {
        return response.data;
      }
    } catch (error) {
      // Si falla, usar endpoint admin
      console.warn("Public endpoint failed, trying admin endpoint");
    }

    // Fallback al endpoint admin
    const response = await apiService.get<ApiResponse<AppSettings>>(
      "/admin/settings"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get public settings");
  }

  /**
   * Obtener precio actual del token
   */
  async getTokenPrice(): Promise<number> {
    try {
      const response = await apiService.get<ApiResponse<number>>(
        "/settings/token-price",
        false // sin autenticación
      );

      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.warn("Public token price endpoint failed, using dashboard stats");
    }

    // Fallback: obtener desde dashboard stats
    const dashboardStats = await this.getDashboardStats();
    return dashboardStats.tokenPrice;
  }

  /**
   * Obtener características activas
   */
  async getActiveFeatures(): Promise<Feature[]> {
    const response = await apiService.get<ApiResponse<Feature[]>>(
      "/settings/features"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get active features");
  }

  /**
   * Obtener testimonios activos
   */
  async getActiveTestimonials(): Promise<Testimonial[]> {
    const response = await apiService.get<ApiResponse<Testimonial[]>>(
      "/settings/testimonials"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get active testimonials");
  }

  /**
   * Obtener banners activos
   */
  async getActiveBanners(): Promise<Banner[]> {
    const response = await apiService.get<ApiResponse<Banner[]>>(
      "/settings/banners"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get active banners");
  }

  /**
   * Actualizar configuraciones de la aplicación (Admin)
   */
  async updateAppSettings(settings: AppSettings): Promise<AppSettings> {
    const response = await apiService.put<ApiResponse<AppSettings>>(
      "/settings",
      settings
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update app settings");
  }

  // ================= FEATURES MANAGEMENT =================

  /**
   * Obtener todas las características con paginación (Admin)
   */
  async getAllFeatures(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Feature>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await apiService.get<
      ApiResponse<PaginatedResponse<Feature>>
    >(`/settings/features/all?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get all features");
  }

  /**
   * Crear nueva característica (Admin)
   */
  async createFeature(feature: Omit<Feature, "id">): Promise<Feature> {
    const response = await apiService.post<ApiResponse<Feature>>(
      "/settings/features",
      feature
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create feature");
  }

  /**
   * Actualizar característica (Admin)
   */
  async updateFeature(
    featureId: string,
    feature: Partial<Feature>
  ): Promise<Feature> {
    const response = await apiService.put<ApiResponse<Feature>>(
      `/settings/features/${featureId}`,
      feature
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update feature");
  }

  /**
   * Eliminar característica (Admin)
   */
  async deleteFeature(featureId: string): Promise<string> {
    const response = await apiService.delete<ApiResponse<string>>(
      `/settings/features/${featureId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to delete feature");
  }

  // ================= TESTIMONIALS MANAGEMENT =================

  /**
   * Obtener todos los testimonios con paginación (Admin)
   */
  async getAllTestimonials(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Testimonial>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await apiService.get<
      ApiResponse<PaginatedResponse<Testimonial>>
    >(`/settings/testimonials/all?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get all testimonials");
  }

  /**
   * Crear nuevo testimonio (Admin)
   */
  async createTestimonial(
    testimonial: Omit<Testimonial, "id">
  ): Promise<Testimonial> {
    const response = await apiService.post<ApiResponse<Testimonial>>(
      "/settings/testimonials",
      testimonial
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create testimonial");
  }

  /**
   * Actualizar testimonio (Admin)
   */
  async updateTestimonial(
    testimonialId: string,
    testimonial: Partial<Testimonial>
  ): Promise<Testimonial> {
    const response = await apiService.put<ApiResponse<Testimonial>>(
      `/settings/testimonials/${testimonialId}`,
      testimonial
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to update testimonial");
  }

  /**
   * Eliminar testimonio (Admin)
   */
  async deleteTestimonial(testimonialId: string): Promise<string> {
    const response = await apiService.delete<ApiResponse<string>>(
      `/settings/testimonials/${testimonialId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to delete testimonial");
  }

  // ================= USER MANAGEMENT =================

  /**
   * Obtener todos los usuarios con paginación
   */
  async getAllUsers(
    page: number = 0,
    size: number = 10,
    sortBy: string = "name",
    sortDir: string = "asc"
  ): Promise<PaginatedResponse<UserDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    const response = await apiService.get<
      ApiResponse<PaginatedResponse<UserDto>>
    >(`/users?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get all users");
  }

  /**
   * Buscar usuarios
   */
  async searchUsers(
    term: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<UserDto>> {
    const params = new URLSearchParams({
      term,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await apiService.get<
      ApiResponse<PaginatedResponse<UserDto>>
    >(`/users/search?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to search users");
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId: string): Promise<UserDto> {
    const response = await apiService.get<ApiResponse<UserDto>>(
      `/users/${userId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get user");
  }

  /**
   * Cambiar estado de usuario (activar/desactivar)
   */
  async toggleUserStatus(userId: string): Promise<UserDto> {
    const response = await apiService.put<ApiResponse<UserDto>>(
      `/users/${userId}/toggle-status`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to toggle user status");
  }

  /**
   * Establecer tokens a usuario
   */
  async setUserTokens(userId: string, tokens: number): Promise<UserDto> {
    const response = await apiService.put<ApiResponse<UserDto>>(
      `/users/${userId}/tokens?tokens=${tokens}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to set user tokens");
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(userId: string): Promise<string> {
    const response = await apiService.delete<ApiResponse<string>>(
      `/users/${userId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to delete user");
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStatistics(): Promise<UserStatsDto> {
    const response = await apiService.get<ApiResponse<UserStatsDto>>(
      "/users/stats"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get user statistics");
  }

  /**
   * Obtener usuarios con tokens expirados
   */
  async getUsersWithExpiredTokens(): Promise<UserDto[]> {
    const response = await apiService.get<ApiResponse<UserDto[]>>(
      "/users/expired-tokens"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(
      response.message || "Failed to get users with expired tokens"
    );
  }

  // ================= PAYMENT MANAGEMENT =================

  /**
   * Obtener pagos pendientes
   */
  async getPendingPayments(): Promise<PaymentOrderDto[]> {
    const response = await apiService.get<ApiResponse<PaymentOrderDto[]>>(
      "/payments/pending"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get pending payments");
  }

  /**
   * Confirmar pago manualmente
   */
  async confirmPayment(paymentId: string): Promise<PaymentOrderDto> {
    const response = await apiService.post<ApiResponse<PaymentOrderDto>>(
      `/payments/${paymentId}/confirm`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to confirm payment");
  }

  /**
   * Marcar pago como fallido
   */
  async failPayment(
    paymentId: string,
    reason: string
  ): Promise<PaymentOrderDto> {
    const response = await apiService.post<ApiResponse<PaymentOrderDto>>(
      `/payments/${paymentId}/fail?reason=${encodeURIComponent(reason)}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to fail payment");
  }

  /**
   * Obtener pagos expirados
   */
  async getExpiredPayments(hoursOld: number = 24): Promise<PaymentOrderDto[]> {
    const response = await apiService.get<ApiResponse<PaymentOrderDto[]>>(
      `/payments/expired?hoursOld=${hoursOld}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get expired payments");
  }

  /**
   * Limpiar pagos expirados
   */
  async cleanupExpiredPayments(hoursOld: number = 24): Promise<number> {
    const response = await apiService.post<ApiResponse<number>>(
      `/payments/cleanup-expired?hoursOld=${hoursOld}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to cleanup expired payments");
  }

  // ================= VALIDATION METHODS =================

  /**
   * Validar datos de característica
   */
  validateFeature(feature: Partial<Feature>): {
    isValid: boolean;
    message?: string;
  } {
    if (!feature.title?.trim()) {
      return { isValid: false, message: "El título es requerido" };
    }

    if (!feature.description?.trim()) {
      return { isValid: false, message: "La descripción es requerida" };
    }

    if (!feature.icon?.trim()) {
      return { isValid: false, message: "El icono es requerido" };
    }

    return { isValid: true };
  }

  /**
   * Validar datos de testimonio
   */
  validateTestimonial(testimonial: Partial<Testimonial>): {
    isValid: boolean;
    message?: string;
  } {
    if (!testimonial.name?.trim()) {
      return { isValid: false, message: "El nombre es requerido" };
    }

    if (!testimonial.content?.trim()) {
      return { isValid: false, message: "El contenido es requerido" };
    }

    if (!testimonial.role?.trim()) {
      return { isValid: false, message: "El rol es requerido" };
    }

    if (testimonial.rating !== undefined) {
      if (testimonial.rating < 1 || testimonial.rating > 5) {
        return {
          isValid: false,
          message: "La calificación debe ser entre 1 y 5",
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validar configuraciones de la aplicación
   */
  validateAppSettings(settings: Partial<AppSettings>): {
    isValid: boolean;
    message?: string;
  } {
    if (!settings.siteName?.trim()) {
      return { isValid: false, message: "El nombre del sitio es requerido" };
    }

    if (!settings.siteDescription?.trim()) {
      return {
        isValid: false,
        message: "La descripción del sitio es requerida",
      };
    }

    if (!settings.heroTitle?.trim()) {
      return { isValid: false, message: "El título principal es requerido" };
    }

    if (settings.tokenPrice !== undefined) {
      if (settings.tokenPrice <= 0) {
        return {
          isValid: false,
          message: "El precio del token debe ser mayor a 0",
        };
      }

      if (settings.tokenPrice > 100) {
        return {
          isValid: false,
          message: "El precio del token no puede ser mayor a $100",
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validar parámetros de email de prueba
   */
  validateTestEmail(
    testEmail: string,
    subject: string,
    message: string
  ): { isValid: boolean; message?: string } {
    if (!testEmail?.trim()) {
      return { isValid: false, message: "Email de prueba es requerido" };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return { isValid: false, message: "Formato de email inválido" };
    }

    if (!subject?.trim()) {
      return { isValid: false, message: "El asunto es requerido" };
    }

    if (subject.length > 200) {
      return {
        isValid: false,
        message: "El asunto no puede ser mayor a 200 caracteres",
      };
    }

    if (!message?.trim()) {
      return { isValid: false, message: "El mensaje es requerido" };
    }

    if (message.length > 1000) {
      return {
        isValid: false,
        message: "El mensaje no puede ser mayor a 1000 caracteres",
      };
    }

    return { isValid: true };
  }

  // ================= UTILITY METHODS =================

  /**
   * Verificar si el usuario es administrador
   */
  async isUserAdmin(): Promise<boolean> {
    try {
      // Intentar acceder a un endpoint admin simple
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Formatear estadísticas para mostrar
   */
  formatSystemStats(stats: SystemStats): {
    formattedMemory: string;
    memoryUsagePercent: number;
    uptime: string;
  } {
    const usedMemory = stats.runtime.usedMemoryMB;
    const maxMemory = stats.runtime.maxMemoryMB;
    const memoryUsagePercent = Math.round((usedMemory / maxMemory) * 100);

    return {
      formattedMemory: `${usedMemory}MB / ${maxMemory}MB`,
      memoryUsagePercent,
      uptime: "N/A", // El backend no proporciona uptime
    };
  }

  /**
   * Formatear bytes a formato legible
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Formatear fecha relativa
   */
  formatRelativeTime(date: string): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `hace ${diffInSeconds} segundos`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `hace ${diffInHours} horas`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays} días`;
  }
}

export const adminService = new AdminService();
