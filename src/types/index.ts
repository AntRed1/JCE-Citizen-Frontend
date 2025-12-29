/**
 * ============================================================================
 * JCE CONSULTA API - TYPE DEFINITIONS
 * ============================================================================
 *
 * Definiciones de tipos TypeScript para toda la aplicación.
 * Incluye interfaces para usuarios, pagos, consultas, configuraciones y más.
 *
 * @version 2.0.0
 * @author Anthony Rojas
 */

// ============================================================================
// USER TYPES
// ============================================================================

/**
 * Representa un usuario del sistema
 * @interface User
 */
export interface User {
  /** ID único del usuario (UUID) */
  id: string;
  /** Email del usuario (único) */
  email: string;
  /** Nombre completo del usuario */
  name: string;
  /** Rol del usuario en el sistema */
  role: UserRole;
  /** Cantidad de tokens disponibles para consultas */
  tokens: number;
  /** Fecha de creación de la cuenta (ISO 8601) */
  createdAt: string;
  /** Indica si el usuario está activo */
  isActive: boolean;
}

/**
 * DTO para transferencia de datos de usuario
 * Idéntico a User, usado para separar concerns
 * @interface UserDto
 */
export interface UserDto extends User {}

/**
 * Estadísticas agregadas de usuarios del sistema
 * @interface UserStats
 */
export interface UserStats {
  /** Total de usuarios registrados */
  totalUsers: number;
  /** Usuarios activos (isActive = true) */
  activeUsers: number;
  /** Usuarios inactivos (isActive = false) */
  inactiveUsers: number;
  /** Total de tokens distribuidos a todos los usuarios */
  totalTokensDistributed: number;
}

/**
 * DTO para estadísticas de usuarios
 * @interface UserStatsDto
 */
export interface UserStatsDto extends UserStats {}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

/**
 * Respuesta del servidor al autenticar un usuario
 * @interface AuthResponse
 */
export interface AuthResponse {
  /** JWT token para autenticación */
  token: string;
  /** Datos del usuario autenticado */
  user: User;
  /** Token para refrescar el JWT cuando expire */
  refreshToken: string;
}

/**
 * Credenciales para inicio de sesión
 * @interface LoginCredentials
 */
export interface LoginCredentials {
  /** Email del usuario */
  email: string;
  /** Contraseña del usuario */
  password: string;
}

/**
 * Datos necesarios para registrar un nuevo usuario
 * @interface RegisterData
 */
export interface RegisterData {
  /** Nombre completo del usuario */
  name: string;
  /** Email único del usuario */
  email: string;
  /** Contraseña (mínimo 8 caracteres) */
  password: string;
  /** Confirmación de contraseña (debe coincidir) */
  confirmPassword: string;
}

// ============================================================================
// CEDULA QUERY TYPES
// ============================================================================

/**
 * Representa una consulta de cédula realizada
 * @interface CedulaQuery
 */
export interface CedulaQuery {
  /** ID único de la consulta (UUID) */
  id: string;
  /** Número de cédula consultado (formato: XXX-XXXXXXX-X) */
  cedula: string;
  /** Fecha y hora de la consulta (ISO 8601) */
  queryDate: string;
  /** ID del usuario que realizó la consulta */
  userId: string;
  /** Resultado de la consulta (null si falló) */
  result: CedulaResult | null;
  /** Costo en tokens de la consulta (normalmente 1) */
  cost: number;
  /** Estado de la consulta */
  status: QueryStatus;
}

/**
 * Resultado de una consulta exitosa de cédula
 * Contiene información personal del ciudadano
 * @interface CedulaResult
 */
export interface CedulaResult {
  /** Nombres del ciudadano */
  nombres: string;
  /** Apellidos del ciudadano */
  apellidos: string;
  /** Fecha de nacimiento (formato: DD/MM/YYYY) */
  fechaNacimiento: string;
  /** Lugar de nacimiento */
  lugarNacimiento: string;
  /** Estado civil (Soltero/a, Casado/a, etc.) */
  estadoCivil: string;
  /** Ocupación del ciudadano */
  ocupacion: string;
  /** Nacionalidad (normalmente Dominicana) */
  nacionalidad: string;
  /** Sexo (M/F) */
  sexo: string;
  /** URL de la foto del ciudadano (opcional) */
  foto?: string;
}

/**
 * DTO para consultas de cédula
 * @interface CedulaQueryDto
 */
export interface CedulaQueryDto extends CedulaQuery {}

/**
 * Estadísticas de consultas de cédula
 * @interface CedulaQueryStatsDto
 */
export interface CedulaQueryStatsDto {
  /** Total de consultas realizadas */
  totalQueries: number;
  /** Consultas completadas exitosamente */
  completedQueries: number;
  /** Consultas en estado pendiente */
  pendingQueries: number;
  /** Consultas fallidas */
  failedQueries: number;
  /** Costo promedio por consulta */
  averageCost: number;
  /** Costo total de todas las consultas */
  totalCost: number;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

/**
 * Orden de pago para compra de tokens
 * @interface PaymentOrder
 */
export interface PaymentOrder {
  /** ID único de la orden (UUID) */
  id: string;
  /** ID del usuario que creó la orden */
  userId: string;
  /** Cantidad de tokens a comprar */
  tokens: number;
  /** Monto total a pagar (USD) */
  amount: number;
  /** Estado actual del pago */
  status: PaymentStatus;
  /** URL de Buy Me a Coffee para realizar el pago */
  buyMeCoffeeUrl: string;
  /** Fecha de creación de la orden (ISO 8601) */
  createdAt: string;
  /** Fecha de completado del pago (ISO 8601, null si pendiente) */
  completedAt?: string | null;
  /** Mensaje de error si el pago falló */
  errorMessage?: string | null;
}

/**
 * DTO para órdenes de pago
 * @interface PaymentOrderDto
 */
export interface PaymentOrderDto extends PaymentOrder {}

/**
 * Estadísticas de pagos de un usuario
 * @interface PaymentStatsDto
 */
export interface PaymentStatsDto {
  /** Total de pagos realizados */
  totalPayments: number;
  /** Pagos completados exitosamente */
  completedPayments: number;
  /** Pagos en estado pendiente */
  pendingPayments: number;
  /** Pagos fallidos */
  failedPayments: number;
  /** Total gastado por el usuario (USD) */
  totalAmountSpent: number;
  /** Total de tokens comprados */
  totalTokensPurchased: number;
}

/**
 * Paquete de tokens disponible para compra
 * Solo usado en el frontend
 * @interface TokenPackage
 */
export interface TokenPackage {
  /** Cantidad de tokens en el paquete */
  tokens: number;
  /** Precio por token (puede incluir descuento) */
  price: number;
  /** Precio total del paquete */
  totalPrice: number;
  /** Indica si es el paquete más popular */
  popular?: boolean;
  /** Porcentaje de descuento (0-100) */
  discount?: number;
}

// ============================================================================
// APP SETTINGS TYPES
// ============================================================================

/**
 * Configuraciones generales de la aplicación
 * @interface AppSettings
 */
export interface AppSettings {
  /** ID de las configuraciones (UUID, opcional en creación) */
  id?: string;
  /** Nombre del sitio web */
  siteName: string;
  /** Descripción del sitio para SEO */
  siteDescription: string;
  /** Título principal del hero section */
  heroTitle: string;
  /** Subtítulo del hero section */
  heroSubtitle: string;
  /** Precio unitario del token (USD) */
  tokenPrice: number;
  /** Características activas del sistema */
  features?: Feature[];
  /** Testimonios de usuarios */
  testimonials?: Testimonial[];
  /** Banners promocionales */
  banners?: Banner[];
  /** Plantillas de email */
  emailTemplates?: EmailTemplate[];
  /** Indica si las configuraciones están activas */
  isActive?: boolean;
  /** Fecha de creación (ISO 8601) */
  createdAt?: string;
  /** Fecha de última actualización (ISO 8601) */
  updatedAt?: string;
}

/**
 * Característica o funcionalidad del sistema
 * @interface Feature
 */
export interface Feature {
  /** ID único de la característica (UUID) */
  id: string;
  /** Título de la característica */
  title: string;
  /** Descripción detallada */
  description: string;
  /** Nombre del icono (Lucide icon name) */
  icon: string;
  /** Indica si está activa y visible */
  isActive: boolean;
}

/**
 * Testimonio de un usuario
 * @interface Testimonial
 */
export interface Testimonial {
  /** ID único del testimonio (UUID) */
  id: string;
  /** Nombre del usuario que da el testimonio */
  name: string;
  /** Rol o título del usuario */
  role: string;
  /** Contenido del testimonio */
  content: string;
  /** Calificación (1-5 estrellas) */
  rating: number;
  /** Indica si está activo y visible */
  isActive: boolean;
}

/**
 * Banner promocional
 * @interface Banner
 */
export interface Banner {
  /** ID único del banner (UUID) */
  id: string;
  /** Título del banner */
  title: string;
  /** Descripción o mensaje del banner */
  description: string;
  /** Texto del botón de acción */
  buttonText: string;
  /** URL a la que redirige el botón */
  buttonUrl: string;
  /** Color de fondo (hex, rgb, etc.) */
  backgroundColor: string;
  /** Color del texto (hex, rgb, etc.) */
  textColor: string;
  /** Indica si está activo y visible */
  isActive: boolean;
  /** Prioridad de visualización (menor = mayor prioridad) */
  priority: number;
}

/**
 * Plantilla de email del sistema
 * @interface EmailTemplate
 */
export interface EmailTemplate {
  /** ID único de la plantilla (UUID) */
  id: string;
  /** Nombre descriptivo de la plantilla */
  name: string;
  /** Asunto del email */
  subject: string;
  /** Contenido HTML del email */
  htmlContent: string;
  /** Tipo de email (define cuándo se usa) */
  type: EmailTemplateType;
  /** Indica si está activa */
  isActive: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Respuesta estándar de la API
 * @template T Tipo de datos en la respuesta
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Datos de la respuesta (tipo genérico) */
  data: T;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Mensaje de error (solo si success = false) */
  error?: string;
  /** Timestamp de la respuesta (ISO 8601) */
  timestamp?: string;
}

/**
 * Respuesta paginada de la API
 * @template T Tipo de elementos en la página
 * @interface PaginatedResponse
 */
export interface PaginatedResponse<T> {
  /** Array de elementos de la página actual */
  content: T[];
  /** Total de elementos en todas las páginas */
  totalElements: number;
  /** Total de páginas disponibles */
  totalPages: number;
  /** Tamaño de la página (elementos por página) */
  size: number;
  /** Número de la página actual (0-indexed) */
  number: number;
  /** Indica si es la primera página */
  first?: boolean;
  /** Indica si es la última página */
  last?: boolean;
  /** Indica si la página está vacía */
  empty?: boolean;
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

/**
 * Estadísticas completas del dashboard administrativo
 * @interface DashboardStats
 */
export interface DashboardStats {
  /** Estadísticas de usuarios */
  userStats: UserStats;
  /** Estado del servicio JCE */
  jceStatus: JceClientInfo;
  /** Cantidad de pagos pendientes */
  pendingPayments: number;
  /** Precio actual del token */
  tokenPrice: number;
  /** Información del sistema */
  systemInfo: SystemInfo;
}

/**
 * Información del cliente JCE
 * @interface JceClientInfo
 */
export interface JceClientInfo {
  /** Indica si el servicio está funcionando */
  isHealthy: boolean;
  /** Tiempo de respuesta en milisegundos */
  responseTime: number;
  /** Fecha del último health check (ISO 8601) */
  lastCheck: string;
  /** URL del endpoint JCE */
  endpoint: string;
}

/**
 * Información del sistema
 * @interface SystemInfo
 */
export interface SystemInfo {
  /** Versión de Java */
  javaVersion: string;
  /** Sistema operativo */
  osName: string;
  /** Cantidad de procesadores disponibles */
  availableProcessors: number;
  /** Memoria máxima en MB */
  maxMemory: number;
  /** Memoria libre en MB */
  freeMemory: number;
}

/**
 * Estado de salud del sistema
 * @interface HealthStatus
 */
export interface HealthStatus {
  /** Estado del servicio JCE */
  jceService: {
    status: HealthStatusType;
    healthy: boolean;
  };
  /** Estado de la base de datos */
  database: {
    status: HealthStatusType;
    healthy: boolean;
  };
  /** Estado general del sistema */
  overall: {
    status: HealthStatusType;
    healthy: boolean;
  };
  /** Timestamp del health check (ISO 8601) */
  timestamp: string;
}

/**
 * Resultados de limpieza del sistema
 * @interface CleanupResults
 */
export interface CleanupResults {
  /** Tokens expirados limpiados */
  expiredTokensCleanup: number;
  /** Pagos expirados limpiados */
  expiredPaymentsCleanup: number;
}

/**
 * Estadísticas completas del sistema
 * @interface SystemStats
 */
export interface SystemStats {
  /** Estadísticas de usuarios */
  users: UserStats;
  /** Estadísticas de runtime (JVM) */
  runtime: RuntimeStats;
  /** Estadísticas del entorno */
  environment: EnvironmentStats;
  /** Fecha de generación de las estadísticas */
  generatedAt: string;
}

/**
 * Estadísticas de runtime (JVM)
 * @interface RuntimeStats
 */
export interface RuntimeStats {
  /** Memoria total en MB */
  totalMemoryMB: number;
  /** Memoria libre en MB */
  freeMemoryMB: number;
  /** Memoria máxima en MB */
  maxMemoryMB: number;
  /** Memoria usada en MB */
  usedMemoryMB: number;
  /** Procesadores disponibles */
  availableProcessors: number;
}

/**
 * Estadísticas del entorno de ejecución
 * @interface EnvironmentStats
 */
export interface EnvironmentStats {
  /** Versión de Java */
  javaVersion: string;
  /** Vendor de Java */
  javaVendor: string;
  /** Sistema operativo */
  osName: string;
  /** Versión del SO */
  osVersion: string;
  /** Arquitectura del SO */
  osArch: string;
}

// ============================================================================
// LOGGING TYPES
// ============================================================================

/**
 * Entrada de log del sistema
 * @interface LogEntry
 */
export interface LogEntry {
  /** Timestamp del log (ISO 8601) */
  timestamp: string;
  /** Nivel del log */
  level: LogLevel;
  /** Logger que generó el log */
  logger: string;
  /** Mensaje del log */
  message: string;
}

/**
 * Datos de logs del sistema
 * @interface LogData
 */
export interface LogData {
  /** Array de entradas de log */
  entries: LogEntry[];
  /** Total de líneas de log */
  totalLines: number;
  /** Nivel de log filtrado */
  level: string;
  /** Fecha de recuperación de logs */
  retrievedAt: string;
}

// ============================================================================
// PAGINATION & SEARCH TYPES
// ============================================================================

/**
 * Parámetros para paginación
 * @interface PageRequest
 */
export interface PageRequest {
  /** Número de página (0-indexed) */
  page: number;
  /** Tamaño de página (elementos por página) */
  size: number;
  /** Campo por el cual ordenar */
  sortBy?: string;
  /** Dirección del ordenamiento */
  sortDir?: "asc" | "desc";
}

/**
 * Parámetros para búsqueda con paginación
 * @interface SearchRequest
 */
export interface SearchRequest extends PageRequest {
  /** Término de búsqueda */
  searchTerm: string;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * Datos de formulario para crear/editar característica
 * @interface FeatureFormData
 */
export interface FeatureFormData {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

/**
 * Datos de formulario para crear/editar testimonio
 * @interface TestimonialFormData
 */
export interface TestimonialFormData {
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
}

/**
 * Datos de formulario para configuraciones de la app
 * @interface AppSettingsFormData
 */
export interface AppSettingsFormData {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  tokenPrice: number;
}

/**
 * Datos de formulario para email de prueba
 * @interface EmailTestFormData
 */
export interface EmailTestFormData {
  testEmail: string;
  subject: string;
  message: string;
}

// ============================================================================
// OPERATION RESULT TYPES
// ============================================================================

/**
 * Resultado de una operación genérica
 * @interface OperationResult
 */
export interface OperationResult {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo del resultado */
  message: string;
  /** Datos adicionales (opcional) */
  data?: any;
  /** Mensaje de error (solo si success = false) */
  error?: string;
}

/**
 * Resultado de validación
 * @interface ValidationResult
 */
export interface ValidationResult {
  /** Indica si la validación pasó */
  isValid: boolean;
  /** Mensaje de error principal */
  message?: string;
  /** Array de errores específicos */
  errors?: string[];
}

// ============================================================================
// ADVANCED ADMIN TYPES
// ============================================================================

/**
 * Datos completos del dashboard administrativo
 * @interface AdminDashboardData
 */
export interface AdminDashboardData {
  /** Estadísticas del sistema */
  stats: DashboardStats;
  /** Estado de salud */
  health: HealthStatus;
  /** Actividad reciente */
  recentActivity: ActivityLog[];
  /** Alertas del sistema */
  alerts: SystemAlert[];
}

/**
 * Entrada de log de actividad
 * @interface ActivityLog
 */
export interface ActivityLog {
  /** ID único del log */
  id: string;
  /** Timestamp de la actividad */
  timestamp: string;
  /** Descripción de la acción */
  action: string;
  /** Usuario que realizó la acción */
  user: string;
  /** Detalles adicionales */
  details: string;
  /** Tipo de actividad */
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

/**
 * Alerta del sistema
 * @interface SystemAlert
 */
export interface SystemAlert {
  /** ID único de la alerta */
  id: string;
  /** Tipo de alerta */
  type: "WARNING" | "ERROR" | "INFO";
  /** Título de la alerta */
  title: string;
  /** Mensaje descriptivo */
  message: string;
  /** Timestamp de la alerta */
  timestamp: string;
  /** Indica si fue leída */
  isRead: boolean;
}

/**
 * Configuración avanzada del sistema
 * @interface SystemConfiguration
 */
export interface SystemConfiguration {
  /** Modo de mantenimiento activado */
  maintenanceMode: boolean;
  /** Permitir registro de nuevos usuarios */
  registrationEnabled: boolean;
  /** Requerir verificación de email */
  emailVerificationRequired: boolean;
  /** Tokens por defecto para nuevos usuarios */
  defaultTokensForNewUsers: number;
  /** Máximo de tokens por usuario */
  maxTokensPerUser: number;
  /** Timeout del servicio JCE (ms) */
  jceServiceTimeout: number;
  /** Configuración de caché */
  cacheConfiguration: CacheConfig;
}

/**
 * Configuración de caché
 * @interface CacheConfig
 */
export interface CacheConfig {
  /** Caché habilitado */
  enabled: boolean;
  /** Tiempo de vida en minutos */
  ttlMinutes: number;
  /** Tamaño máximo del caché */
  maxSize: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

/**
 * Filtros para búsqueda de usuarios
 * @interface UserFilter
 */
export interface UserFilter {
  /** Filtrar por rol */
  role?: UserRole;
  /** Filtrar por estado activo */
  isActive?: boolean;
  /** Filtrar usuarios con tokens */
  hasTokens?: boolean;
  /** Creados después de esta fecha */
  createdAfter?: string;
  /** Creados antes de esta fecha */
  createdBefore?: string;
}

/**
 * Filtros para búsqueda de pagos
 * @interface PaymentFilter
 */
export interface PaymentFilter {
  /** Filtrar por estado */
  status?: PaymentStatus;
  /** Monto mínimo */
  minAmount?: number;
  /** Monto máximo */
  maxAmount?: number;
  /** Creados después de esta fecha */
  createdAfter?: string;
  /** Creados antes de esta fecha */
  createdBefore?: string;
}

/**
 * Filtros para búsqueda de consultas
 * @interface QueryFilter
 */
export interface QueryFilter {
  /** Filtrar por estado */
  status?: QueryStatus;
  /** Filtrar por cédula específica */
  cedula?: string;
  /** Consultas desde esta fecha */
  dateFrom?: string;
  /** Consultas hasta esta fecha */
  dateTo?: string;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

/**
 * Reporte completo del sistema
 * @interface SystemReport
 */
export interface SystemReport {
  /** Fecha de generación del reporte */
  generatedAt: string;
  /** Período del reporte */
  period: {
    from: string;
    to: string;
  };
  /** Métricas de usuarios */
  userMetrics: UserMetrics;
  /** Métricas de pagos */
  paymentMetrics: PaymentMetrics;
  /** Métricas de consultas */
  queryMetrics: QueryMetrics;
  /** Métricas del sistema */
  systemMetrics: SystemMetrics;
}

/**
 * Métricas de usuarios para reportes
 * @interface UserMetrics
 */
export interface UserMetrics {
  /** Usuarios nuevos en el período */
  newUsers: number;
  /** Usuarios activos en el período */
  activeUsers: number;
  /** Total de usuarios */
  totalUsers: number;
  /** Tasa de crecimiento (%) */
  userGrowthRate: number;
}

/**
 * Métricas de pagos para reportes
 * @interface PaymentMetrics
 */
export interface PaymentMetrics {
  /** Ingresos totales (USD) */
  totalRevenue: number;
  /** Total de transacciones */
  totalTransactions: number;
  /** Valor promedio por transacción */
  averageTransactionValue: number;
  /** Tasa de éxito (%) */
  successRate: number;
}

/**
 * Métricas de consultas para reportes
 * @interface QueryMetrics
 */
export interface QueryMetrics {
  /** Total de consultas */
  totalQueries: number;
  /** Consultas exitosas */
  successfulQueries: number;
  /** Tiempo de respuesta promedio (ms) */
  averageResponseTime: number;
  /** Tasa de éxito (%) */
  successRate: number;
}

/**
 * Métricas del sistema para reportes
 * @interface SystemMetrics
 */
export interface SystemMetrics {
  /** Tiempo de actividad (segundos) */
  uptime: number;
  /** Tiempo de respuesta promedio (ms) */
  averageResponseTime: number;
  /** Tasa de error (%) */
  errorRate: number;
  /** Uso de memoria (%) */
  memoryUsage: number;
}

// ============================================================================
// ENUM-LIKE TYPES (Type-safe strings)
// ============================================================================

/**
 * Roles de usuario en el sistema
 * @type UserRole
 */
export type UserRole = "USER" | "ADMIN";

/**
 * Estados de consulta de cédula
 * @type QueryStatus
 */
export type QueryStatus = "PENDING" | "COMPLETED" | "FAILED";

/**
 * Estados de pago
 * @type PaymentStatus
 */
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

/**
 * Estados de health check
 * @type HealthStatusType
 */
export type HealthStatusType = "UP" | "DOWN";

/**
 * Niveles de log
 * @type LogLevel
 */
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

/**
 * Tipos de plantilla de email
 * @type EmailTemplateType
 */
export type EmailTemplateType =
  | "WELCOME"
  | "LOGIN"
  | "ADMIN_LOGIN"
  | "PAYMENT_CONFIRMED"
  | "PASSWORD_RESET"
  | "EMAIL_VERIFICATION";

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Hace todas las propiedades de T opcionales recursivamente
 * @type DeepPartial
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Hace todas las propiedades de T requeridas recursivamente
 * @type DeepRequired
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Omite propiedades especificadas de T recursivamente
 * @type OmitDeep
 */
export type OmitDeep<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P] extends object
    ? OmitDeep<T[P], K>
    : T[P];
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Verifica si un valor es un User válido
 * @param value - Valor a verificar
 * @returns true si es un User válido
 */
export const isUser = (value: any): value is User => {
  return (
    value &&
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.name === "string" &&
    typeof value.tokens === "number" &&
    typeof value.isActive === "boolean"
  );
};

/**
 * Verifica si un valor es un PaymentOrder válido
 * @param value - Valor a verificar
 * @returns true si es un PaymentOrder válido
 */
export const isPaymentOrder = (value: any): value is PaymentOrder => {
  return (
    value &&
    typeof value.id === "string" &&
    typeof value.userId === "string" &&
    typeof value.tokens === "number" &&
    typeof value.amount === "number" &&
    typeof value.status === "string"
  );
};

/**
 * Verifica si un valor es un ApiResponse válido
 * @param value - Valor a verificar
 * @returns true si es un ApiResponse válido
 */
export const isApiResponse = <T>(value: any): value is ApiResponse<T> => {
  return (
    value &&
    typeof value.success === "boolean" &&
    typeof value.message === "string" &&
    "data" in value
  );
};
