const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Importar el plugin de paginación

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },           // Título del producto
    description: { type: String, required: true },     // Descripción del producto
    code: { type: String, required: true, unique: true }, // Código único del producto
    price: { type: Number, required: true },           // Precio
    status: { type: Boolean, default: true },          // Estado (activo o no)
    stock: { type: Number, required: true },           // Stock disponible
    category: { type: String, required: true },        // Categoría del producto
    thumbnails: { type: [String], default: [] },       // Rutas de imágenes
}, { timestamps: true });                              // Habilitar timestamps para createdAt y updatedAt

// Agregar el plugin de paginación
productSchema.plugin(mongoosePaginate);

// Crear el modelo de producto
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
module.exports = Product;

