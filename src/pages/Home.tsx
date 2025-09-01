import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  Database,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuthContext } from "../contexts/AuthContext";
import { adminService } from "../services/adminService";
import type { AppSettings } from "../types";

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeBanners, setActiveBanners] = useState<any[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const appSettings = await adminService.getAppSettings();
        setSettings(appSettings);
        setActiveBanners(appSettings.banners?.filter((b: { isActive: any; }) => b.isActive) || []);
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Use default settings if API fails
        setDefaultSettings();
      }
    };

    loadSettings();
  }, []);

  const setDefaultSettings = () => {
    setSettings({
      siteName: "JCE Citizen",
      siteDescription:
        "Consulta de cédulas dominicanas de forma rápida y segura",
      heroTitle: "Consulta Cédulas Dominicanas",
      heroSubtitle:
        "Accede a información verificada del Registro Civil de forma instantánea",
      tokenPrice: 1.99,
      features: [
        {
          id: "1",
          title: "Consulta Instantánea",
          description:
            "Obtén los datos de cualquier cédula dominicana en segundos",
          icon: "zap",
          isActive: true,
        },
        {
          id: "2",
          title: "Datos Verificados",
          description: "Información oficial del Registro Civil Dominicano",
          icon: "shield",
          isActive: true,
        },
        {
          id: "3",
          title: "Base de Datos Actualizada",
          description: "Acceso a la base de datos más reciente y completa",
          icon: "database",
          isActive: true,
        },
        {
          id: "4",
          title: "Disponible 24/7",
          description: "Servicio disponible las 24 horas, todos los días",
          icon: "clock",
          isActive: true,
        },
      ],
      testimonials: [
        {
          id: "1",
          name: "María González",
          role: "Abogada",
          content:
            "Excelente servicio para verificar datos de clientes. Muy confiable y rápido.",
          rating: 5,
          isActive: true,
        },
        {
          id: "2",
          name: "Juan Pérez",
          role: "Consultor RH",
          content:
            "Indispensable para procesos de reclutamiento. Datos precisos y actualizados.",
          rating: 5,
          isActive: true,
        },
        {
          id: "3",
          name: "Ana Rodríguez",
          role: "Agente Inmobiliaria",
          content:
            "Facilita mucho la verificación de identidad en transacciones importantes.",
          rating: 5,
          isActive: true,
        },
      ],
      banners: [],
      emailTemplates: [],
    });
  };

  const features = settings?.features?.filter((f) => f.isActive) || [];
  const testimonials = settings?.testimonials?.filter((t) => t.isActive) || [];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      zap: <Zap className="w-8 h-8" />,
      shield: <Shield className="w-8 h-8" />,
      database: <Database className="w-8 h-8" />,
      clock: <Clock className="w-8 h-8" />,
      users: <Users className="w-8 h-8" />,
      globe: <Globe className="w-8 h-8" />,
    };
    return icons[iconName] || <CheckCircle className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Active Banners */}
      {activeBanners.map((banner) => (
        <div
          key={banner.id}
          className="py-3 px-4 text-center"
          style={{
            backgroundColor: banner.backgroundColor,
            color: banner.textColor,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
            <p className="font-medium">{banner.title}</p>
            <p className="text-sm opacity-90">{banner.description}</p>
            {banner.buttonText && (
              <a
                href={banner.buttonUrl}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                {banner.buttonText}
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {settings?.heroTitle || "Consulta Cédulas Dominicanas"}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {settings?.heroSubtitle ||
              "Accede a información verificada del Registro Civil de forma instantánea"}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Ir al Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Precisión de datos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Disponibilidad</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                &lt;3s
              </div>
              <div className="text-gray-600">Tiempo de respuesta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir nuestro servicio?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos la solución más confiable y eficiente para consultar
              información de cédulas dominicanas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    {getIcon(feature.icon)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Consultar una cédula es muy fácil con nuestro sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta de forma gratuita y obtén tokens para realizar
                consultas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Ingresa la Cédula</h3>
              <p className="text-gray-600">
                Introduce el número de cédula dominicana que deseas consultar
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Obtén los Resultados
              </h3>
              <p className="text-gray-600">
                Recibe instantáneamente toda la información verificada de la
                persona
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-xl text-gray-600">
                Miles de profesionales confían en nuestro servicio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya utilizan nuestro servicio para
            consultar cédulas dominicanas
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                >
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                >
                  Ver Precios
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
