export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  tokens: number;
  createdAt: string;
  isActive: boolean;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  tokens: number;
  createdAt: string;
  isActive: boolean;
}

export interface CedulaQuery {
  id: string;
  cedula: string;
  queryDate: string;
  userId: string;
  result: CedulaResult | null;
  cost: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface CedulaResult {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  estadoCivil: string;
  ocupacion: string;
  nacionalidad: string;
  sexo: string;
  foto?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  tokens: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  buyMeCoffeeUrl: string;
  createdAt: string;
}

export interface PaymentOrderDto {
  id: string;
  userId: string;
  tokens: number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  buyMeCoffeeUrl: string;
  createdAt: string;
}

export interface AppSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  tokenPrice: number;
  features?: Feature[];
  testimonials?: Testimonial[];
  banners?: Banner[];
  emailTemplates?: EmailTemplate[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  priority: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  type: "WELCOME" | "LOGIN" | "ADMIN_LOGIN" | "PAYMENT_CONFIRMED";
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DashboardStats {
  userStats: UserStats;
  jceStatus: JceClientInfo;
  pendingPayments: number;
  tokenPrice: number;
  systemInfo: SystemInfo;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTokensDistributed: number;
}

export interface UserStatsDto {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTokensDistributed: number;
}

export interface PaymentStatsDto {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  averagePaymentAmount: number;
}

export interface JceClientInfo {
  isHealthy: boolean;
  responseTime: number;
  lastCheck: string;
  endpoint: string;
}

export interface SystemInfo {
  javaVersion: string;
  osName: string;
  availableProcessors: number;
  maxMemory: number;
  freeMemory: number;
}

export interface HealthStatus {
  jceService: {
    status: "UP" | "DOWN";
    healthy: boolean;
  };
  database: {
    status: "UP" | "DOWN";
    healthy: boolean;
  };
  overall: {
    status: "UP" | "DOWN";
    healthy: boolean;
  };
  timestamp: string;
}

export interface CleanupResults {
  expiredTokensCleanup: number;
  expiredPaymentsCleanup: number;
}

export interface SystemStats {
  users: UserStats;
  runtime: RuntimeStats;
  environment: EnvironmentStats;
  generatedAt: string;
}

export interface RuntimeStats {
  totalMemoryMB: number;
  freeMemoryMB: number;
  maxMemoryMB: number;
  usedMemoryMB: number;
  availableProcessors: number;
}

export interface EnvironmentStats {
  javaVersion: string;
  javaVendor: string;
  osName: string;
  osVersion: string;
  osArch: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  logger: string;
  message: string;
}

export interface LogData {
  entries: LogEntry[];
  totalLines: number;
  level: string;
  retrievedAt: string;
}

// Interfaces adicionales para cédula queries
export interface CedulaQueryDto {
  id: string;
  cedula: string;
  queryDate: string;
  userId: string;
  result: CedulaResult | null;
  cost: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface CedulaQueryStatsDto {
  totalQueries: number;
  completedQueries: number;
  pendingQueries: number;
  failedQueries: number;
  averageCost: number;
  totalCost: number;
}

// Interfaces para paginación mejorada
export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface SearchRequest extends PageRequest {
  searchTerm: string;
}

// Enum-like types para mejorar type safety
export type UserRole = "USER" | "ADMIN";
export type QueryStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type HealthStatusType = "UP" | "DOWN";
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

// Interfaces para formularios
export interface FeatureFormData {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
}

export interface AppSettingsFormData {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  tokenPrice: number;
}

export interface EmailTestFormData {
  testEmail: string;
  subject: string;
  message: string;
}

// Interfaces para respuestas de operaciones
export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: string[];
}

// Interfaces para estadísticas avanzadas
export interface AdminDashboardData {
  stats: DashboardStats;
  health: HealthStatus;
  recentActivity: ActivityLog[];
  alerts: SystemAlert[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

export interface SystemAlert {
  id: string;
  type: "WARNING" | "ERROR" | "INFO";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Interfaces para configuraciones avanzadas
export interface SystemConfiguration {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  defaultTokensForNewUsers: number;
  maxTokensPerUser: number;
  jceServiceTimeout: number;
  cacheConfiguration: CacheConfig;
}

export interface CacheConfig {
  enabled: boolean;
  ttlMinutes: number;
  maxSize: number;
}

// Tipos para filtros y búsquedas
export interface UserFilter {
  role?: UserRole;
  isActive?: boolean;
  hasTokens?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface PaymentFilter {
  status?: PaymentStatus;
  minAmount?: number;
  maxAmount?: number;
  createdAfter?: string;
  createdBefore?: string;
}

export interface QueryFilter {
  status?: QueryStatus;
  cedula?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Interfaces para reportes
export interface SystemReport {
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
  userMetrics: UserMetrics;
  paymentMetrics: PaymentMetrics;
  queryMetrics: QueryMetrics;
  systemMetrics: SystemMetrics;
}

export interface UserMetrics {
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
  userGrowthRate: number;
}

export interface PaymentMetrics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  successRate: number;
}

export interface QueryMetrics {
  totalQueries: number;
  successfulQueries: number;
  averageResponseTime: number;
  successRate: number;
}

export interface SystemMetrics {
  uptime: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: number;
}
