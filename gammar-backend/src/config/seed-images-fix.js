// Script para actualizar solo las imágenes en la DB existente
require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(process.env.DB_PATH || './database/gammar.db'));

// Imágenes reales de repuestos de moto desde CDNs que permiten hotlinking
const imagenesReales = [
    // Motor
    { nombre: 'Filtro de Aceite Honda CB125F', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    { nombre: 'Bujía NGK CR7HSA', img: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop' },
    { nombre: 'Kit de Empaque Motor AKT 125', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop' },
    { nombre: 'Carburador Honda CGL 125', img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
    // Frenos
    { nombre: 'Pastillas de Freno Delantero AKT', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=400&fit=crop' },
    { nombre: 'Cable de Freno Trasero Universal', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop' },
    { nombre: 'Disco de Freno Delantero Yamaha', img: 'https://images.unsplash.com/photo-1558981852-426c349c9e7e?w=400&h=400&fit=crop' },
    // Suspensión
    { nombre: 'Amortiguador Trasero Honda 125', img: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400&h=400&fit=crop' },
    { nombre: 'Kit de Rodamientos de Dirección', img: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=400&h=400&fit=crop' },
    // Transmisión
    { nombre: 'Cadena de Transmisión 428H x 116', img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop' },
    { nombre: 'Kit Piñón Corona y Cadena AKT', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop' },
    // Eléctricos
    { nombre: 'Regulador de Voltaje Honda', img: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400&h=400&fit=crop' },
    { nombre: 'Batería Moto 12V 5Ah', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop' },
    // Aceites
    { nombre: 'Aceite Motor 4T 20W50 1L', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop' },
    { nombre: 'Aceite Sintético Honda 10W30', img: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=400&h=400&fit=crop' },
    // Accesorios
    { nombre: 'Espejo Retrovisor Universal', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    { nombre: 'Maniguetas de Freno y Clutch', img: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=400&fit=crop' },
];

const update = db.prepare('UPDATE productos SET imagen = ? WHERE nombre = ?');

let actualizados = 0;
for (const item of imagenesReales) {
    const r = update.run(item.img, item.nombre);
    if (r.changes > 0) actualizados++;
}

console.log(`✅ ${actualizados} imágenes actualizadas`);
db.close();