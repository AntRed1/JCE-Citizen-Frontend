import React, { useState, useEffect } from "react";
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Mail,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  TrendingUp,
  Server,
  MemoryStick,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react";
import { adminService } from "../services/adminService";
import type {
  DashboardStats,
  HealthStatus,
  SystemStats,
  Feature,
  Testimonial,
  AppSettings,
  JceClientInfo,
  CleanupResults,
} from "../types";

export const AdminPanel: React.FC = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de datos
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [jceInfo, setJceInfo] = useState<JceClientInfo | null>(null);

  // Estados de formularios
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [testEmail, setTestEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState(
    "Email de Prueba - JCE Consulta API"
  );
  const [emailMessage, setEmailMessage] = useState(
    "Este es un email de prueba del sistema."
  );

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [stats, health, settings] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.healthCheck(),
        adminService.getPublicSettings(),
      ]);

      setDashboardStats(stats);
      setHealthStatus(health);
      setTokenPrice(settings.tokenPrice || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const stats = await adminService.getSystemStats();
      setSystemStats(stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error loading system stats"
      );
    }
  };

  const loadJceInfo = async () => {
    try {
      const info = await adminService.getJceClientInfo();
      setJceInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading JCE info");
    }
  };

  const handleSystemCleanup = async () => {
    setLoading(true);
    try {
      const results: CleanupResults = await adminService.performSystemCleanup();
      alert(
        `Limpieza completada:\n- Tokens expirados: ${results.expiredTokensCleanup}\n- Pagos expirados: ${results.expiredPaymentsCleanup}`
      );
      loadDashboardData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error en limpieza del sistema"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      setError("Email de prueba requerido");
      return;
    }

    setLoading(true);
    try {
      await adminService.sendTestEmail(testEmail, emailSubject, emailMessage);
      alert("Email de prueba enviado exitosamente");
      setTestEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error enviando email de prueba"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTokenPrice = async () => {
    if (tokenPrice <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      await adminService.updateTokenPrice(tokenPrice);
      alert("Precio del token actualizado exitosamente");
      loadDashboardData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error actualizando precio del token"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestJceConnection = async () => {
    setLoading(true);
    try {
      const isHealthy = await adminService.testJceConnection();
      alert(isHealthy ? "Conexión JCE exitosa" : "Conexión JCE fallida");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error probando conexión JCE"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      await adminService.clearSystemCache();
      alert("Caché del sistema limpiado exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error limpiando caché");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "users", name: "Usuarios", icon: Users },
    { id: "system", name: "Sistema", icon: Server },
    { id: "settings", name: "Configuración", icon: Settings },
    { id: "features", name: "Características", icon: Shield },
    { id: "testimonials", name: "Testimonios", icon: Activity },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard Administrativo
        </h2>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Estado del sistema */}
      {healthStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border-l-4 ${
              healthStatus.overall.healthy
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center">
              {healthStatus.overall.healthy ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Estado General
                </p>
                <p
                  className={`text-lg font-bold ${
                    healthStatus.overall.healthy
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {healthStatus.overall.status}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-l-4 ${
              healthStatus.jceService.healthy
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center">
              {healthStatus.jceService.healthy ? (
                <Wifi className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500 mr-2" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Servicio JCE
                </p>
                <p
                  className={`text-lg font-bold ${
                    healthStatus.jceService.healthy
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {healthStatus.jceService.status}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg border-l-4 ${
              healthStatus.database.healthy
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center">
              <Database
                className={`w-5 h-5 mr-2 ${
                  healthStatus.database.healthy
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Base de Datos
                </p>
                <p
                  className={`text-lg font-bold ${
                    healthStatus.database.healthy
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {healthStatus.database.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Usuarios Totales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.userStats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Usuarios Activos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.userStats.activeUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pagos Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.pendingPayments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Precio Token
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardStats.tokenPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información del sistema */}
      {dashboardStats?.systemInfo && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Cpu className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Java Version</p>
                <p className="font-medium">
                  {dashboardStats.systemInfo.javaVersion}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Server className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">OS</p>
                <p className="font-medium">
                  {dashboardStats.systemInfo.osName}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Cpu className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Procesadores</p>
                <p className="font-medium">
                  {dashboardStats.systemInfo.availableProcessors}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MemoryStick className="w-5 h-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Memoria Libre</p>
                <p className="font-medium">
                  {dashboardStats.systemInfo.freeMemory} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Acciones del Sistema
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleSystemCleanup}
            disabled={loading}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50"
          >
            <Trash2 className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium">Limpiar Sistema</span>
          </button>

          <button
            onClick={handleTestJceConnection}
            disabled={loading}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 disabled:opacity-50"
          >
            <Wifi className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium">Test JCE</span>
          </button>

          <button
            onClick={handleClearCache}
            disabled={loading}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 disabled:opacity-50"
          >
            <RefreshCw className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium">Limpiar Caché</span>
          </button>

          <button
            onClick={loadSystemStats}
            disabled={loading}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50"
          >
            <TrendingUp className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium">Ver Estadísticas</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sistema</h2>

      {/* Controles de sistema */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Configuración del Token
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio del Token (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleUpdateTokenPrice}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Actualizar Precio
          </button>
        </div>
      </div>

      {/* Email de prueba */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Email de Prueba
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de destino
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSendTestEmail}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            <span>Enviar Email de Prueba</span>
          </button>
        </div>
      </div>

      {/* Estadísticas del sistema */}
      {systemStats && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estadísticas del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Runtime</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memoria Total:</span>
                  <span className="text-sm font-medium">
                    {systemStats.runtime.totalMemoryMB} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memoria Libre:</span>
                  <span className="text-sm font-medium">
                    {systemStats.runtime.freeMemoryMB} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memoria Máxima:</span>
                  <span className="text-sm font-medium">
                    {systemStats.runtime.maxMemoryMB} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Procesadores:</span>
                  <span className="text-sm font-medium">
                    {systemStats.runtime.availableProcessors}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Entorno</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Java Version:</span>
                  <span className="text-sm font-medium">
                    {systemStats.environment.javaVersion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">OS:</span>
                  <span className="text-sm font-medium">
                    {systemStats.environment.osName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Arquitectura:</span>
                  <span className="text-sm font-medium">
                    {systemStats.environment.osArch}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Usuarios</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-medium">
                    {systemStats.users.totalUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activos:</span>
                  <span className="text-sm font-medium">
                    {systemStats.users.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inactivos:</span>
                  <span className="text-sm font-medium">
                    {systemStats.users.inactiveUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información JCE */}
      {jceInfo && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Cliente JCE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado:</span>
              <span
                className={`text-sm font-medium ${
                  jceInfo.isHealthy ? "text-green-600" : "text-red-600"
                }`}
              >
                {jceInfo.isHealthy ? "Saludable" : "No disponible"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Tiempo de respuesta:
              </span>
              <span className="text-sm font-medium">
                {jceInfo.responseTime} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Último check:</span>
              <span className="text-sm font-medium">
                {new Date(jceInfo.lastCheck).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Endpoint:</span>
              <span className="text-sm font-medium">{jceInfo.endpoint}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title: string, description: string) => (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8">{description}</p>
      <div className="bg-white p-8 rounded-lg shadow border mx-auto max-w-md">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Funcionalidad en desarrollo...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel Administrativo
          </h1>
          <p className="text-gray-600">
            Gestión y monitoreo del sistema JCE Consulta API
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Navegación por tabs */}
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "system" && renderSystemTab()}
            {activeTab === "users" &&
              renderPlaceholder(
                "Gestión de Usuarios",
                "Administración de usuarios del sistema"
              )}
            {activeTab === "settings" &&
              renderPlaceholder(
                "Configuración",
                "Configuraciones generales de la aplicación"
              )}
            {activeTab === "features" &&
              renderPlaceholder(
                "Características",
                "Gestión de características del sistema"
              )}
            {activeTab === "testimonials" &&
              renderPlaceholder(
                "Testimonios",
                "Administración de testimonios de usuarios"
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
