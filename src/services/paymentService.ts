import { apiService } from "./api";
import type { PaymentOrder, ApiResponse } from "../types";

class PaymentService {
  async createPaymentOrder(tokens: number): Promise<PaymentOrder> {
    const response = await apiService.post<ApiResponse<PaymentOrder>>(
      "/payments/create-order",
      {
        tokens,
      }
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to create payment order");
  }

  async verifyPayment(
    orderId: string
  ): Promise<{ verified: boolean; tokens: number }> {
    const response = await apiService.post<
      ApiResponse<{ verified: boolean; tokens: number }>
    >(`/payments/verify/${orderId}`);

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Payment verification failed");
  }

  async getPaymentHistory(page: number = 0, size: number = 10): Promise<any> {
    const response = await apiService.get<ApiResponse<any>>(
      `/payments/history?page=${page}&size=${size}`
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get payment history");
  }

  async getUserTokens(): Promise<{ tokens: number }> {
    const response = await apiService.get<ApiResponse<{ tokens: number }>>(
      "/payments/tokens"
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "Failed to get user tokens");
  }

  getTokenPackages(): Array<{
    tokens: number;
    price: number;
    popular?: boolean;
  }> {
    return [
      { tokens: 1, price: 1.99 },
      { tokens: 5, price: 8.99, popular: true },
      { tokens: 10, price: 15.99 },
      { tokens: 25, price: 35.99 },
      { tokens: 50, price: 65.99 },
      { tokens: 100, price: 120.99 },
    ];
  }
}

export const paymentService = new PaymentService();
