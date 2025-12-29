import React, { useState, useEffect } from "react";
import {
  Search,
  History,
  CreditCard,
  User,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { cedulaService } from "../services/cedulaService";
import { paymentService, TokenPackage } from "../services/paymentService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { formatDate } from "../utils/formatters";
import type { CedulaQuery } from "../types";

// Function to render photo with fallback and crop to hide watermark
const renderPhoto = (foto: string | undefined) => {
  if (!foto) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Foto no disponible</p>
      </div>
    );
  }

  let fotoUrl = foto;
  if (!/^https?:\/\//i.test(foto) || foto.includes("localhost")) {
    fotoUrl = `https://dataportal.jce.gob.do${
      foto.startsWith("/") ? "" : "/"
    }${foto}`;
  }

  return (
    <div className="text-center">
      <div
        className="mx-auto mb-2 overflow-hidden rounded-lg shadow-md"
        style={{
          maxWidth: "200px",
          maxHeight: "230px",
        }}
      >
        <img
          src={fotoUrl}
          alt="Foto de cédula"
          className="w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "top center",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div class="w-12 h-12 text-gray-400 mx-auto mb-2">📷</div>
                  <p class="text-gray-500 text-sm">Error cargando la foto</p>
                </div>
              `;
            }
          }}
        />
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user, refreshUserData } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"query" | "history">("query");
  const [cedula, setCedula] = useState("");
  const [queryResult, setQueryResult] = useState<CedulaQuery | null>(null);
  const [queryHistory, setQueryHistory] = useState<CedulaQuery[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Estados para paquetes de tokens
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Cargar paquetes de tokens al montar el componente o abrir el modal
  useEffect(() => {
    if (showPaymentModal && tokenPackages.length === 0) {
      loadTokenPackages();
    }
  }, [showPaymentModal]);

  const loadTokenPackages = async () => {
    setLoadingPackages(true);
    try {
      const packages = await paymentService.getTokenPackages();
      setTokenPackages(packages);
    } catch (error) {
      console.error("Error loading token packages:", error);
      setErrors({
        ...errors,
        packages: "Error cargando paquetes de tokens",
      });
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadQueryHistory();
    }
  }, [activeTab]);

  const loadQueryHistory = async () => {
    setIsLoading(true);
    try {
      const history = await cedulaService.getQueryHistory(0, 20);
      setQueryHistory(history.content);
    } catch (error: any) {
      console.error("Failed to load query history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = cedulaService.formatCedula(e.target.value);
    setCedula(formatted);

    if (errors.cedula) {
      setErrors((prev) => ({ ...prev, cedula: "" }));
    }
  };

  const handleQuery = async () => {
    setErrors({});

    const validation = cedulaService.validateCedula(cedula);
    if (!validation.isValid) {
      setErrors({ cedula: validation.message! });
      return;
    }

    if (!user || user.tokens < 1) {
      setShowPaymentModal(true);
      return;
    }

    setIsQuerying(true);
    try {
      const result = await cedulaService.queryCedula(cedula);
      setQueryResult(result);
      setShowResultModal(true);

      await refreshUserData();

      if (activeTab === "history") {
        loadQueryHistory();
      }

      setCedula("");
    } catch (error: any) {
      setErrors({ general: error.message || "Error al realizar la consulta" });
    } finally {
      setIsQuerying(false);
    }
  };

  const handleBuyTokens = async (tokens: number) => {
    try {
      setErrors({});
      const paymentOrder = await paymentService.createPaymentOrder(tokens);
      window.open(paymentOrder.buyMeCoffeeUrl, "_blank");
      setShowPaymentModal(false);

      // Mostrar mensaje de confirmación
      alert(`Orden de pago creada exitosamente. 
      
Por favor completa el pago en Buy Me a Coffee para activar tus ${tokens} tokens.`);
    } catch (error: any) {
      console.error("Error creating payment order:", error);
      setErrors({
        payment: error.message || "Error al crear orden de pago",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "FAILED":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Bienvenido, {user?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600 font-semibold">
                  {user?.tokens || 0} tokens
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowPaymentModal(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Comprar Tokens</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("query")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "query"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Nueva Consulta</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>Historial</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "query" ? (
          <Card className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Consultar Cédula
              </h2>
              <p className="text-gray-600">
                Ingresa el número de cédula dominicana para obtener la
                información
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={cedula}
                    onChange={handleCedulaChange}
                    placeholder="000-0000000-0"
                    error={errors.cedula}
                    maxLength={13}
                    className="text-lg text-center"
                  />
                </div>
                <Button
                  onClick={handleQuery}
                  isLoading={isQuerying}
                  disabled={!cedula.trim()}
                  size="lg"
                  className="px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Consultar
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Formato: XXX-XXXXXXX-X (11 dígitos)</p>
                <p className="mt-2">
                  Cada consulta cuesta{" "}
                  <span className="font-semibold text-blue-600">1 token</span>
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Historial de Consultas
                </h2>
                <Button
                  onClick={loadQueryHistory}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualizar</span>
                </Button>
              </div>

              {isLoading ? (
                <LoadingSpinner className="py-8" />
              ) : queryHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No tienes consultas realizadas aún
                  </p>
                  <Button
                    onClick={() => setActiveTab("query")}
                    variant="outline"
                    className="mt-4"
                  >
                    Realizar primera consulta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {queryHistory.map((query) => (
                    <div
                      key={query.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setQueryResult(query);
                        setShowResultModal(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(query.status)}
                          <div>
                            <p className="font-semibold text-gray-900">
                              Cédula: {query.cedula}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(query.queryDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            Estado: {query.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            Costo: {query.cost} token
                            {query.cost !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Comprar Tokens"
          size="lg"
        >
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Necesitas tokens para realizar consultas. Selecciona un paquete:
              </p>
              <p className="text-sm text-gray-500">
                Los tokens se activarán automáticamente después del pago
              </p>
            </div>

            {loadingPackages ? (
              <div className="py-12">
                <LoadingSpinner />
                <p className="text-center text-gray-500 mt-4">
                  Cargando paquetes de tokens...
                </p>
              </div>
            ) : errors.packages ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{errors.packages}</p>
                <Button
                  onClick={loadTokenPackages}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokenPackages.map((pkg) => (
                  <div
                    key={pkg.tokens}
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      pkg.popular
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleBuyTokens(pkg.tokens)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 text-xs font-bold rounded-full shadow-lg">
                          MÁS POPULAR
                        </span>
                      </div>
                    )}

                    {pkg.discount && pkg.discount > 0 && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">
                          <span className="text-xs">-{pkg.discount}%</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="mb-3">
                        <CreditCard className="w-10 h-10 text-blue-500 mx-auto" />
                      </div>

                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {pkg.tokens}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Token{pkg.tokens !== 1 ? "s" : ""}
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold text-blue-600">
                          {paymentService.formatPrice(pkg.totalPrice)}
                        </div>
                        {pkg.discount && pkg.discount > 0 && (
                          <div className="text-sm text-gray-500 line-through mt-1">
                            {paymentService.formatPrice(
                              tokenPackages[0].price * pkg.tokens
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        {paymentService.formatPrice(pkg.price)} por token
                      </div>

                      <Button
                        variant={pkg.popular ? "primary" : "outline"}
                        className="w-full"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Comprar Ahora
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.payment && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.payment}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                ¿Por qué comprar más tokens?
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Obtén descuentos de hasta 25%</li>
                <li>✅ Los tokens nunca expiran</li>
                <li>✅ Activación automática después del pago</li>
                <li>✅ Cada consulta cuesta solo 1 token</li>
              </ul>
            </div>
          </div>
        </Modal>

        {/* Result Modal */}
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Resultado de Consulta"
          size="lg"
        >
          {queryResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cédula: {queryResult.cedula}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Consultado el {formatDate(queryResult.queryDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(queryResult.status)}
                  <span className="text-sm font-medium text-gray-700">
                    {queryResult.status}
                  </span>
                </div>
              </div>

              {queryResult.result ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">
                    Información Encontrada
                  </h4>

                  {queryResult.result.foto && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Fotografía:
                      </p>
                      {renderPhoto(queryResult.result.foto)}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Nombres:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.nombres}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Apellidos:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.apellidos}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Fecha de Nacimiento:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.fechaNacimiento || "No disponible"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Lugar de Nacimiento:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.lugarNacimiento}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Estado Civil:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.estadoCivil}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Ocupación:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.ocupacion}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Nacionalidad:
                      </p>
                      <p className="text-gray-900">
                        {queryResult.result.nacionalidad}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sexo:</p>
                      <p className="text-gray-900">{queryResult.result.sexo}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">
                    No se encontró información
                  </h4>
                  <p className="text-red-600">
                    La cédula consultada no se encuentra en los registros
                    oficiales o puede tener un formato incorrecto.
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
