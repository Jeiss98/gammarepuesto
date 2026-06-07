# Gama Repuestos Quibdó

¡Bienvenido al repositorio oficial de **Gama Repuestos**!  
Esta es una aplicación web Full-Stack diseñada para administrar el inventario, servicios y configuraciones de una tienda de repuestos de motocicletas, ofreciendo un canal de venta directa y rápida a través de WhatsApp.

## 🚀 Arquitectura del Proyecto

Este repositorio es un **Monorepo** que contiene tanto el código del Frontend como el del Backend:

- **Frontend (`/gammar-frontend`)**: Desarrollado en **Angular 17+ (Standalone/Zoneless)**. Diseño adaptativo enfocado en experiencia móvil, rápido y sin módulos pesados (`NgModules`).
- **Backend (`/gammar-backend`)**: Construido con **Node.js y Express**. API REST ligera.
- **Base de Datos**: **SQLite** (vía `better-sqlite3`). Extremadamente veloz para catálogos locales, sin requerir la instalación de un motor de base de datos pesado.

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- Git

## 🛠️ Instalación y Configuración Local

Dado que es un monorepo, necesitarás instalar las dependencias y ejecutar ambos servicios en dos ventanas de terminal (o pestañas) por separado.

### 1. Iniciar el Backend (Base de Datos y API)

Abre una terminal, navega a la carpeta del backend y ejecuta:

```bash
cd gammar-backend
npm install
npm run dev
```
*El backend quedará corriendo en `http://localhost:3000`.*

### 2. Iniciar el Frontend (Interfaz Visual)

Abre otra terminal, navega a la carpeta del frontend y ejecuta:

```bash
cd gammar-frontend
npm install
npm start
```
*La aplicación web estará disponible en `http://localhost:4200`.*

## 🌟 Características Principales

- **Gestión de Catálogo**: Panel administrativo para crear, editar y eliminar productos y servicios.
- **Venta por WhatsApp**: Los clientes seleccionan repuestos y envían un mensaje pre-armado directamente al número del negocio.
- **Totalmente Administrable**: Textos de la página de "Nosotros", Preguntas Frecuentes (FAQ), URLs de redes sociales, ubicación y horarios modificables desde el panel de administrador.
- **Autenticación**: Panel administrativo protegido con JWT (JSON Web Tokens).

## 📄 Licencia
Este proyecto es privado y de uso exclusivo para Gama Repuestos Quibdó. Todos los derechos reservados.
