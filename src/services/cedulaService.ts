import { apiService } from "./api";
import type { CedulaQuery, ApiResponse, PaginatedResponse } from "../types";

// Interfaces adicionales que necesitarás según tu backend
interface CedulaQueryRequest {
  cedula: string;
}

interface CedulaQueryStats {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  pendingQueries?: number;
  // Añade otros campos según tu CedulaQueryStatsDto
}

class CedulaService {
  // ================= QUERY METHODS =================

  /**
   * Realizar consulta síncrona de cédula
   */
  async queryCedula(cedula: string): Promise<CedulaQuery> {
    const response = await apiService.post<ApiResponse<CedulaQuery>>(
      "/cedula-queries/query",
      { cedula } as CedulaQueryRequest
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Cedula query failed");
  }

  /**
   * Realizar consulta asíncrona de cédula
   */
  async queryCedulaAsync(cedula: string): Promise<string> {
    const response = await apiService.post<ApiResponse<string>>(
      "/cedula-queries/query-async",
      { cedula } as CedulaQueryRequest
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Async cedula query failed");
  }

  /**
   * Verificar si el usuario puede realizar consultas
   */
  async canUserQuery(): Promise<boolean> {
    const response = await apiService.get<ApiResponse<boolean>>(
      "/cedula-queries/can-query"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to check query availability");
  }

  // ================= HISTORY & STATS METHODS =================

  /**
   * Obtener historial paginado de consultas
   */
  async getQueryHistory(
    page: number = 0,
    size: number = 10,
    sortBy: string = "queryDate",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<PaginatedResponse<CedulaQuery>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    const response = await apiService.get<
      ApiResponse<PaginatedResponse<CedulaQuery>>
    >(`/cedula-queries/history?${params}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get query history");
  }

  /**
   * Obtener consulta por ID
   */
  async getQueryById(queryId: string): Promise<CedulaQuery> {
    const response = await apiService.get<ApiResponse<CedulaQuery>>(
      `/cedula-queries/${queryId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get query details");
  }

  /**
   * Obtener estadísticas de consultas del usuario
   */
  async getQueryStats(): Promise<CedulaQueryStats> {
    const response = await apiService.get<ApiResponse<CedulaQueryStats>>(
      "/cedula-queries/stats"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get query stats");
  }

  /**
   * Obtener consultas recientes
   */
  async getRecentQueries(limit: number = 5): Promise<CedulaQuery[]> {
    // Validar límite según backend (min: 1, max: 20)
    const validLimit = Math.min(Math.max(limit, 1), 20);

    const response = await apiService.get<ApiResponse<CedulaQuery[]>>(
      `/cedula-queries/recent?limit=${validLimit}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get recent queries");
  }

  // ================= SEARCH METHODS =================

  /**
   * Buscar consultas por número de cédula
   */
  async searchQueriesByCedula(cedula: string): Promise<CedulaQuery[]> {
    // Validar que la cédula solo contenga números (según backend: \\d{1,11})
    const cleanCedula = cedula.replace(/\D/g, "");

    if (!cleanCedula || cleanCedula.length === 0) {
      throw new Error("La cédula es requerida");
    }

    if (cleanCedula.length > 11) {
      throw new Error("La cédula no puede tener más de 11 dígitos");
    }

    const response = await apiService.get<ApiResponse<CedulaQuery[]>>(
      `/cedula-queries/search?cedula=${encodeURIComponent(cleanCedula)}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Search failed");
  }

  // ================= VALIDATION METHODS =================

  /**
   * Validar formato de cédula dominicana
   * Acepta tanto formato con guiones (XXX-XXXXXXX-X) como sin guiones (11 dígitos)
   */
  validateCedula(cedula: string): { isValid: boolean; message?: string } {
    if (!cedula) {
      return { isValid: false, message: "Cédula es requerida" };
    }

    // Remover guiones para validación
    const digits = cedula.replace(/-/g, "");

    // Validar que solo contenga números
    if (!/^\d+$/.test(digits)) {
      return {
        isValid: false,
        message: "La cédula solo debe contener números",
      };
    }

    // Validar longitud (backend acepta de 1 a 11 dígitos para búsqueda, pero para consulta debe ser 11)
    if (digits.length !== 11) {
      return {
        isValid: false,
        message: "La cédula debe tener exactamente 11 dígitos",
      };
    }

    return { isValid: true };
  }

  /**
   * Validar cédula para búsqueda (más flexible, 1-11 dígitos)
   */
  validateCedulaForSearch(cedula: string): {
    isValid: boolean;
    message?: string;
  } {
    if (!cedula) {
      return { isValid: false, message: "La cédula es requerida" };
    }

    const digits = cedula.replace(/\D/g, "");

    if (digits.length === 0) {
      return {
        isValid: false,
        message: "La cédula debe contener al menos un dígito",
      };
    }

    if (digits.length > 11) {
      return {
        isValid: false,
        message: "La cédula no puede tener más de 11 dígitos",
      };
    }

    return { isValid: true };
  }

  /**
   * Formatear cédula con guiones (XXX-XXXXXXX-X)
   */
  formatCedula(input: string): string {
    // Remover cualquier carácter que no sea dígito
    const digits = input.replace(/\D/g, "");

    // Aplicar formato dominicano
    if (digits.length >= 3) {
      let formatted = digits.substring(0, 3);

      if (digits.length > 3) {
        formatted += "-" + digits.substring(3, 10);

        if (digits.length > 10) {
          formatted += "-" + digits.substring(10, 11);
        }
      }

      return formatted;
    }

    return digits;
  }

  /**
   * Limpiar cédula (remover guiones)
   */
  cleanCedula(cedula: string): string {
    return cedula.replace(/\D/g, "");
  }

  /**
   * Validar parámetros de paginación
   */
  validatePaginationParams(
    page: number,
    size: number
  ): {
    page: number;
    size: number;
    isValid: boolean;
    message?: string;
  } {
    const validatedPage = Math.max(0, Math.floor(page));
    const validatedSize = Math.min(Math.max(1, Math.floor(size)), 100);

    return {
      page: validatedPage,
      size: validatedSize,
      isValid: true,
    };
  }
}

export const cedulaService = new CedulaService();
