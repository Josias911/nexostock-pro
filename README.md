# NexoStock Pro

## Descripcion del proyecto

NexoStock Pro es un sistema web para catalogo, ventas, inventario, pedidos,
clientes y reportes.

El proyecto esta pensado como una aplicacion para administrar productos,
controlar existencias, recibir pedidos y revisar informacion basica de clientes
y ventas.

Actualmente el sistema ya esta conectado con Supabase para guardar productos,
gestionar inventario y proteger el acceso al panel administrativo.

## Tecnologias usadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- PostgreSQL
- Row Level Security RLS
- Vercel
- Git y GitHub

## Base de datos

Los productos ahora se guardan en una tabla `products` en Supabase.

Esta tabla almacena la informacion principal del catalogo, como nombre, slug,
precio, categoria, stock, estado, codigo visual, etiquetas de producto nuevo o
destacado y descripcion.

El catalogo publico, el detalle del producto, el modulo de productos del admin
y el inventario leen informacion desde esta tabla.

## Autenticacion

El acceso al panel administrativo ahora usa Supabase Auth.

El login ya no depende de credenciales temporales guardadas en `localStorage`.
Ahora el usuario debe iniciar sesion con correo y contrasena registrados en
Supabase Auth. Si la sesion es valida, puede entrar al panel admin. Si no hay
sesion activa, el sistema redirige al login.

## Seguridad

Se configuraron politicas RLS en Supabase para proteger la tabla de productos.

Las reglas estan pensadas para que:

- El catalogo publico pueda leer productos.
- Solo usuarios autenticados puedan crear, editar y eliminar productos.

Esto ayuda a separar las acciones publicas del catalogo y las acciones privadas
del panel administrativo.

## Modulos actuales

- Landing page
- Catalogo publico
- Detalle de producto
- Carrito
- Checkout con WhatsApp
- Login con Supabase Auth
- Dashboard admin
- Productos
- Inventario
- Pedidos
- Clientes
- Reportes

## Funciones actuales actualizadas

- Catalogo conectado a Supabase
- Detalle de producto conectado a Supabase
- Admin de productos conectado a Supabase
- Crear productos en Supabase
- Editar productos en Supabase
- Eliminar productos en Supabase
- Inventario conectado a Supabase
- Login con Supabase Auth
- Agregar productos al carrito
- Finalizar pedido por WhatsApp
- Controlar stock con entradas, salidas y ajustes
- Cambiar estado de pedidos
- Ver detalle de pedidos
- Ver detalle e historial de clientes

## Enlace del proyecto publicado

https://nexostock-pro.vercel.app

El proyecto fue desplegado en Vercel.

## Pendiente por implementar

Todavia falta agregar varias partes importantes para que el proyecto funcione
como un sistema mas completo:

- Subida real de imagenes
- Pedidos guardados en base de datos
- Clientes guardados en base de datos
- Reportes calculados con datos reales
- Mejorar roles de usuario

## Nota

NexoStock Pro ya usa Supabase para productos, inventario y autenticacion del
admin. Algunas secciones todavia usan datos de ejemplo o almacenamiento local
mientras se completa la integracion con base de datos.
