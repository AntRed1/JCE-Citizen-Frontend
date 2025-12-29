import { apiService } from "./api";
import type { PaymentOrder, ApiResponse, PaginatedResponse } from "../types";

// Exportar interfaz de TokenPackage para uso en componentes
export interface TokenPackage {
  tokens: number;
  price: number;
  totalPrice: number;
  popular?: boolean;
  discount?: number;
}

export interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalAmountSpent: number;
  totalTokensPurchased: number;
}

class PaymentService {
  /**
   * Crear orden de pago con cantidad de tokens
   * IMPORTANTE: El backend espera 'tokens' como query parameter, no en el body
   */
  async createPaymentOrder(tokens: number): Promise<PaymentOrder> {
    const response = await apiService.post<ApiResponse<PaymentOrder>>(
      `/payments/create-order?tokens=${tokens}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create payment order");
  }

  /**
   * Obtener historial de pagos paginado
   */
  async getPaymentHistory(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<PaymentOrder>> {
    const response = await apiService.get<
      ApiResponse<PaginatedResponse<PaymentOrder>>
    >(`/payments/history?page=${page}&size=${size}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get payment history");
  }

  /**
   * Obtener orden de pago por ID
   */
  async getPaymentOrder(paymentId: string): Promise<PaymentOrder> {
    const response = await apiService.get<ApiResponse<PaymentOrder>>(
      `/payments/${paymentId}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get payment order");
  }

  /**
   * Obtener estadísticas de pagos del usuario
   */
  async getPaymentStats(): Promise<PaymentStats> {
    const response = await apiService.get<ApiResponse<PaymentStats>>(
      "/payments/stats"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get payment stats");
  }

  /**
   * Obtener paquetes de tokens con precios dinámicos desde el backend
   * Calcula los precios basándose en el precio unitario del token
   */
  async getTokenPackages(): Promise<TokenPackage[]> {
    try {
      // Obtener precio del token desde el backend
      const response = await apiService.get<ApiResponse<number>>(
        "/settings/token-price",
        false // endpoint público
      );

      if (!response.success) {
        throw new Error("Failed to get token price");
      }

      const tokenPrice = response.data;

      // Definir paquetes con descuentos progresivos
      const packages: TokenPackage[] = [
        {
          tokens: 1,
          price: tokenPrice,
          totalPrice: tokenPrice * 1,
          discount: 0,
        },
        {
          tokens: 5,
          price: tokenPrice * 0.95, // 5% descuento
          totalPrice: tokenPrice * 0.95 * 5,
          popular: true,
          discount: 5,
        },
        {
          tokens: 10,
          price: tokenPrice * 0.9, // 10% descuento
          totalPrice: tokenPrice * 0.9 * 10,
          discount: 10,
        },
        {
          tokens: 25,
          price: tokenPrice * 0.85, // 15% descuento
          totalPrice: tokenPrice * 0.85 * 25,
          discount: 15,
        },
        {
          tokens: 50,
          price: tokenPrice * 0.8, // 20% descuento
          totalPrice: tokenPrice * 0.8 * 50,
          discount: 20,
        },
        {
          tokens: 100,
          price: tokenPrice * 0.75, // 25% descuento
          totalPrice: tokenPrice * 0.75 * 100,
          discount: 25,
        },
      ];

      return packages;
    } catch (error) {
      console.error("Error loading token packages:", error);
      // Fallback en caso de error
      return this.getDefaultTokenPackages();
    }
  }

  /**
   * Paquetes por defecto en caso de que falle la carga dinámica
   */
  private getDefaultTokenPackages(): TokenPackage[] {
    const defaultPrice = 5.0;
    return [
      { tokens: 1, price: defaultPrice, totalPrice: defaultPrice },
      {
        tokens: 5,
        price: defaultPrice,
        totalPrice: defaultPrice * 5,
        popular: true,
      },
      { tokens: 10, price: defaultPrice, totalPrice: defaultPrice * 10 },
      { tokens: 25, price: defaultPrice, totalPrice: defaultPrice * 25 },
      { tokens: 50, price: defaultPrice, totalPrice: defaultPrice * 50 },
      { tokens: 100, price: defaultPrice, totalPrice: defaultPrice * 100 },
    ];
  }

  /**
   * Calcular precio total para cantidad de tokens
   */
  async calculatePrice(tokens: number): Promise<number> {
    try {
      const response = await apiService.get<ApiResponse<number>>(
        "/settings/token-price",
        false
      );

      if (response.success) {
        return response.data * tokens;
      }

      return 5.0 * tokens; // Fallback
    } catch (error) {
      console.error("Error calculating price:", error);
      return 5.0 * tokens; // Fallback
    }
  }

  /**
   * Formatear precio para display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Validar cantidad de tokens
   */
  validateTokenQuantity(tokens: number): {
    valid: boolean;
    message?: string;
  } {
    if (!Number.isInteger(tokens)) {
      return {
        valid: false,
        message: "La cantidad de tokens debe ser un número entero",
      };
    }

    if (tokens < 1) {
      return {
        valid: false,
        message: "La cantidad mínima de tokens es 1",
      };
    }

    if (tokens > 100) {
      return {
        valid: false,
        message: "La cantidad máxima de tokens es 100",
      };
    }

    return { valid: true };
  }
}

export const paymentService = new PaymentService();
