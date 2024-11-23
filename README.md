# Backend - Primera PreEntrega

Este proyecto es parte de la primera entrega del curso de backend. El objetivo es desarrollar un servidor en **Node.js** y **Express** para gestionar productos y carritos, utilizando persistencia con archivos JSON.

---

## **Instalación**

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clona este repositorio**:
   ```bash
   git clone https://github.com/MarioRigoni/Backend-Primera-PreEntrega-Rigoni-Mario.git
Rutas Implementadas

Productos (/api/products)
GET /: Lista todos los productos.
GET /:pid: Obtiene un producto específico por su ID.
POST /: Crea un producto con los siguientes campos obligatorios:
title (String)
description (String)
code (String)
price (Number)
status (Boolean, por defecto true)
stock (Number)
category (String)
thumbnails (Array de Strings, opcional)
PUT /:pid: Actualiza un producto existente por su ID.
DELETE /:pid: Elimina un producto por su ID.
Carritos (/api/carts)
POST /: Crea un nuevo carrito con un ID único.
GET /:cid: Lista los productos de un carrito específico por su ID.
POST /:cid/product/:pid:
Agrega un producto al carrito.
Incrementa la cantidad (quantity) si el producto ya existe.

Persistencia de Datos
Productos: Se almacenan en el archivo data/products.json.
Carritos: Se almacenan en el archivo data/carts.json.
Pruebas
Puedes probar las rutas utilizando Postman o cualquier cliente HTTP.

Ejemplo de JSON para crear un producto:

{
  "title": "Teclado RGB",
  "description": "Teclado mecánico retroiluminado",
  "code": "TKRGB123",
  "price": 150,
  "stock": 20,
  "category": "Accesorios",
  "thumbnails": ["url1", "url2"]
}



