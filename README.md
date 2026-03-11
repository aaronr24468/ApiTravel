🚗 Plataforma de Viajes Compartidos – Backend API

API REST para una plataforma de viajes compartidos que permite la gestión de usuarios, vehículos, viajes e imágenes, con autenticación segura y control de acceso basado en roles y ownership.

Este backend fue desarrollado con enfoque en seguridad, escalabilidad y buenas prácticas de arquitectura.

🛠️ Tecnologías utilizadas

- Node.js

- Express

- MySQL

- JWT (JSON Web Tokens)

- Cookies httpOnly

- Cloudinary (almacenamiento de imágenes)

- Multer (manejo de FormData)

- dotenv

- stripe

🔐 Autenticación y seguridad

- Autenticación basada en JWT.

- Tokens almacenados en cookies httpOnly para evitar accesos desde JavaScript.

- Middleware para:

  - Verificar autenticación.

  - Validar roles de usuario (conductor / pasajero).

- Validación de ownership para proteger recursos (ej. subir imágenes solo a vehículos propios).

- Prevención de accesos indebidos tipo IDOR.

- idempotencia para evitar cobros o rembolsos dobles

👥 Roles de usuario

- Driver (Conductor)

  - Registro de vehículos.

  - Subida de imágenes de vehículos.

  - Creación de viajes.
 
  - crear cuenta Stripe Connect

- Passenger (Pasajero)

  - Visualización de viajes disponibles.
 
  - ver viajes reservados y el status de los mismos

🚘 Gestión de vehículos

- Registro de múltiples vehículos por usuario.

- Cada vehículo se asocia a:

  - Marca

  - Modelo

  - Año

  - Color

  - Placas (únicas)

  - Número de asientos

  - Estado de seguro

- Subida de imágenes de vehículos usando FormData + Cloudinary.

- Validación de ownership antes de permitir operaciones sobre un vehículo.

🖼️ Manejo de imágenes

- Subida de imágenes mediante Multer.

- Almacenamiento en Cloudinary.

- Generación de public_id únicos para evitar sobrescritura.

- Asociación de imágenes con vehículos en la base de datos.

📌 Estado del proyecto

🚧 En desarrollo

Se continúan agregando mejoras de validación, optimización de queries y nuevas funcionalidades.
