# 🚀 API RESTfull NestJS - Prueba Técnica Horbath

Este repositorio contiene la solución a la prueba técnica para el desarrollo de una API RESTful orientada a la gestión de productos y categorías, implementando autenticación segura y buenas prácticas de arquitectura de software.

## 📋 Tabla de Contenidos

1. Características Principales
2. Tecnologías Utilizadas
3. Requisitos Previos
4. Instalación y Configuración
5. Uso de Docker
6. Ejecución del Proyecto
7. Documentación API (Swagger)
8. Arquitectura y Estructura

---

## ✨ Características Principales

- **CRUD Completo:** Gestión de Categorías y Productos con validaciones de negocio.
- **Relaciones SQL:** Implementación de relaciones 1:N entre Categorías y Productos usando TypeORM.
- **Autenticación JWT:** Registro, Login y protección de rutas mediante Estrategias y Guards (Passport).
- **Consultas Avanzadas:** Paginación, búsqueda insensible a mayúsculas (`ILike`) y filtrado por relaciones.
- **Validación de Datos:** Uso estricto de DTOs con `class-validator` para asegurar la integridad de la información.
- **Documentación Automática:** Integración con Swagger/OpenAPI.

## 🛠 Tecnologías Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Base de Datos:** PostgreSQL 16
- **ORM:** TypeORM
- **Contenedorización:** Docker & Docker Compose
- **Lenguaje:** TypeScript

## ⚙️ Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/) (o Docker Engine en Linux)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd api-horbath
```

### 2. Configuración de Variables de Entorno
Por seguridad, el archivo `.env` original no se incluye en este repositorio.
1. Se ha incluido un archivo `.env.example` como guía.
2. **Nota para evaluadores:** El archivo `.env` con las credenciales reales ha sido enviado adjunto al correo de entrega de la prueba.
3. Si deseas configurarlo manualmente, crea un archivo `.env` en la raíz y define las variables basándote en el ejemplo.

### 3. Instalar Dependencias
```bash
npm install
```

## 🐳 Uso de Docker

Se ha utilizado **Docker** para la base de datos con el objetivo de garantizar la **reproducibilidad del entorno.** Esto asegura que el evaluador no necesite instalar PostgreSQL localmente ni lidiar con conflictos de versiones.

Para levantar la base de datos, ejecuta:

```bash
docker-compose up -d
```
Esto iniciará un contenedor con PostgreSQL 16 configurado en el puerto 5432.

## ▶️ Ejecución del Proyecto
Una vez que Docker esté corriendo y las dependencias instaladas:

```bash
# Modo desarrollo
npm run start:dev
```
La API estará disponible en: http://localhost:3000/api

## 📚 Documentación API (Swagger)
El proyecto incluye documentación interactiva generada con Swagger. Aquí puedes probar todos los endpoints (Login, Creación de productos, Filtros, etc.) directamente desde el navegador.

👉 Acceso: http://localhost:3000/docs

## 🏗 Arquitectura y Estructura
El proyecto sigue una Arquitectura Modular propia de NestJS, diseñada para ser escalable, mantenible y desacoplada.

**Explicación de Directorios (src/)**

- **📁 auth/**: Módulo de seguridad.
  - `dto/`: Validaciones de entrada para login/registro.
  - `strategies/`: Lógica de validación del Token JWT (Passport).
  - `guards/`: Protectores de ruta.
  - `entities/`: Contiene las **entidades del dominio**, es decir, las clases o modelos que representan las tablas, estructuras o conceptos principales del módulo.  
- **📁 categories/**: Dominio de Categorías.
  - Encapsula toda la lógica de negocio y acceso a datos referente a las categorías.
- **📁 products/**: Dominio de Productos.
  - Maneja la lógica de inventario, precios y relación con categorías.


### ¿Por qué esta arquitectura?

1. **Modularidad:** Cada funcionalidad (Auth, Products, Categories) es un módulo aislado. Si se necesita eliminar o escalar una parte, no afecta al resto del sistema.

2. **DTOs (Data Transfer Objects):** Se utilizan DTOs en cada capa para desacoplar la base de datos de la API pública y validar los datos antes de que entren al sistema.

3. **Inyección de Dependencias:** Facilita el testing y la gestión de instancias (ej. el Servicio de Productos inyecta el Servicio de Categorías para validaciones cruzadas).

4. **Repository Pattern:** A través de TypeORM, abstraemos las consultas SQL directas, permitiendo cambiar de motor de base de datos si fuera necesario con mínimo impacto.


Desarrollado por **Martin Herrera** para la prueba técnica de Horbath.
