# LAMA - Buyer App

## Deploy de producción

https://proyecto-c-buyer2-lama.vercel.app/

## Usuarios de prueba

| Rol | Email | Contraseña | Descripción |
| --- | --- | --- | --- |
| Comprador | buyer+clerk_test@iaw.com | iawuser# |
| Super admin | super_admin+clerk_test@iaw.com | iawuser# |

## Instrucciones de uso

1. Iniciar sesión con alguno de los usuarios de prueba.

Si se inicia con rol comprador:

1. Desde el inicio, navegar el catálogo de productos, filtrar por categorías o usar el buscador para encontrar prendas de interés, consultar productos a través del asistente de IA (tiene límites de consulta) o guardar favoritos.
2. Agregar productos al carrito o comprar directamente desde el detalle del producto.
3. Completar y/o modificar los datos necesarios y continuar el flujo de checkout.
4. Revisar las compras realizadas y el estado desde la sección "Mis compras".
5. Modificar datos de perfil y/o preferencias para luego ver en el inicio productos recomendados según las categorías favoritas.

Si se inicia con rol super admin:

1. Revisar los usuarios registrados, las compras realizadas y modificar o completar datos.
2. Los usuarios registrados pueden ser desactivados (soft delete) pero no creados desde el panel de super admin.

## Descripción del proyecto

Es una aplicación de compra de moda circular orientada al rol comprador. Permite explorar prendas, ver detalles de productos, guardar favoritos, armar un carrito y realizar compras mediante un flujo conectado a Mercado Pago.

El proyecto busca ofrecer una experiencia simple y visualmente cuidada para consumir moda de segunda mano, promoviendo la reutilización de prendas y una forma de compra más consciente.

La aplicación también incluye secciones informativas como "Quienes somos", "Preguntas frecuentes" y "Como comprar", pensadas para acompañar al usuario durante la experiencia.

## Notas para la corrección

- Se implemento navegacion por catalogo, carrito, favoritos, perfil y compras.
- La interfaz es responsive e incluye modo claro/oscuro.
- El checkout redirige a Mercado Pago.
- Se incorporo un asistente/chat con IA para acompañar la experiencia de búsqueda. (Tiene límites en cuanto a consultas)
- No se contemplan reembolsos dentro del flujo actual.
