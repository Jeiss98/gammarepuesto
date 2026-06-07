require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(process.env.DB_PATH || './database/gammar.db'));

// Limpiar datos previos
db.exec(`
  DELETE FROM productos;
  DELETE FROM categorias;
  DELETE FROM servicios;
  DELETE FROM info_negocios;
  DELETE FROM users;
  DELETE FROM faqs;
`);

// Usuario admin
db.prepare(`
  INSERT INTO users (name, email, password, role)
  VALUES ('Administrador', 'admin@gamarepuestos.com', '$2b$10$N7b08WJ.9TZPvJXqdwGFfeA3QU9onZ0lpdMravsWLjluJdmhf0Yym', 'admin')
`).run();

// Info del negocio
db.prepare(`
  INSERT INTO info_negocios (nombre, whatsapp, telefono, email, direccion,
    horario_inicio_dia, horario_fin_dia, hora_apertura, hora_cierre,
    descripcion_hero, mensaje_wa_default, link_facebook, link_instagram, link_tiktok,
    nosotros_historia, nosotros_filosofia)
  VALUES (
    'Gama Repuestos Quibdó',
    '3113147815',
    '3106109325',
    'mimare0892@hotmail.com',
    'Quibdó, Chocó',
    'Lunes', 'Sábado', '8:00', '18:00',
    'No competimos, servimos. Repuestos originales y OEM para tu moto.',
    'Hola, me interesa un repuesto de su catálogo 🏍️',
    '', '', '',
    'Nacimos con un propósito claro: ofrecer a los motociclistas del Chocó repuestos de la más alta calidad, garantizando durabilidad, rendimiento y seguridad en cada recorrido. Sabemos lo importante que es tu motocicleta para ti, por eso trabajamos solo con marcas reconocidas y repuestos originales o tipo original (OEM).',
    'Nuestro eslogan refleja nuestra filosofía. No buscamos simplemente vender, sino brindar una asesoría genuina para que adquieras exactamente lo que tu moto necesita. Nuestro equipo está capacitado para guiarte en cada compra.'
  )
`).run();

// FAQs
const faqs = [
    { pregunta: '¿Tienen envíos a domicilio en Quibdó?', respuesta: 'Sí, realizamos envíos a todo Quibdó y municipios cercanos. Al momento de la compra puedes coordinar la entrega.' },
    { pregunta: '¿Los repuestos tienen garantía?', respuesta: '¡Por supuesto! Todos nuestros productos originales y tipo original (OEM) cuentan con garantía por defectos de fábrica. Te asesoramos para que lleves lo mejor.' },
    { pregunta: '¿Cómo puedo pagar mi pedido?', respuesta: 'Aceptamos transferencias bancarias (Nequi, Bancolombia, etc.) y pago en efectivo al momento de retirar en tienda.' },
    { pregunta: '¿Manejan repuestos para motos de alto cilindraje?', respuesta: 'Principalmente nos enfocamos en baja y mediana cilindrada (Honda, Yamaha, AKT, Auteco), pero podemos traer bajo pedido repuestos específicos para alto cilindraje.' },
    { pregunta: '¿Son tienda física o virtual?', respuesta: 'Ambas. Puedes ver nuestro catálogo online y comprar por WhatsApp, o visitarnos en nuestra sede física en Quibdó para atención presencial.' }
];

const insertFaq = db.prepare(`INSERT INTO faqs (pregunta, respuesta, orden, activo) VALUES (?, ?, ?, 1)`);
let faqOrden = 1;
for (const f of faqs) {
    insertFaq.run(f.pregunta, f.respuesta, faqOrden++);
}

// Categorías
const cats = [
    { nombre: 'Motor', slug: 'motor', icono: '⚙️' },
    { nombre: 'Frenos', slug: 'frenos', icono: '🛞' },
    { nombre: 'Suspensión', slug: 'suspension', icono: '🔩' },
    { nombre: 'Transmisión', slug: 'transmision', icono: '⛓️' },
    { nombre: 'Eléctricos', slug: 'electricos', icono: '⚡' },
    { nombre: 'Aceites', slug: 'aceites', icono: '🛢️' },
    { nombre: 'Accesorios', slug: 'accesorios', icono: '🧰' },
    { nombre: 'Otros', slug: 'otros', icono: '📦' },
];

const insertCat = db.prepare(`INSERT INTO categorias (nombre, slug, icono, activo) VALUES (?, ?, ?, 1)`);
const catIds = {};
for (const c of cats) {
    const r = insertCat.run(c.nombre, c.slug, c.icono);
    catIds[c.slug] = r.lastInsertRowid;
}

// Servicios
const servicios = [
    { nombre: 'Mantenimiento preventivo', descripcion: 'Revisión completa y cambio de aceite para tu moto', icono: '🔧' },
    { nombre: 'Sistema eléctrico', descripcion: 'Diagnóstico y reparación del sistema eléctrico', icono: '⚡' },
    { nombre: 'Frenos y llantas', descripcion: 'Cambio y ajuste profesional de frenos y llantas', icono: '🛞' },
    { nombre: 'Reparación de motor', descripcion: 'Revisión, diagnóstico y reparación de motor', icono: '⚙️' },
    { nombre: 'Suspensión', descripcion: 'Ajuste y cambio de amortiguadores y horquillas', icono: '🔩' },
    { nombre: 'Lavado y detailing', descripcion: 'Lavado completo y detallado de tu moto', icono: '🚿' },
];

const insertSrv = db.prepare(`INSERT INTO servicios (nombre, descripcion, icono, activo) VALUES (?, ?, ?, 1)`);
for (const s of servicios) insertSrv.run(s.nombre, s.descripcion, s.icono);

// Productos con imágenes reales de repuestos
const productos = [
    // MOTOR
    {
        cat: 'motor', nombre: 'Filtro de Aceite Honda CB125F',
        precio: 25000, marca: 'Honda', es_oferta: 0, stock: 20,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_871755-MCO71854571048_092023-O.webp',
        descripcion: 'Filtro de aceite original Honda para modelos CB125F. Garantiza una filtración óptima del aceite del motor.'
    },
    {
        cat: 'motor', nombre: 'Bujía NGK CR7HSA',
        precio: 12000, marca: 'NGK', es_oferta: 1, stock: 50,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_996685-MCO74669551918_022024-O.webp',
        descripcion: 'Bujía NGK CR7HSA para motos de 4 tiempos. Compatibilidad amplia con Honda, Yamaha, AKT y más.'
    },
    {
        cat: 'motor', nombre: 'Kit de Empaque Motor AKT 125',
        precio: 38000, marca: 'AKT', es_oferta: 0, stock: 15,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_617749-MCO71592513248_092023-O.webp',
        descripcion: 'Kit de empaques completo para motor AKT 125. Incluye empaque de tapa, cilindro y culata.'
    },
    {
        cat: 'motor', nombre: 'Carburador Honda CGL 125',
        precio: 85000, marca: 'Honda', es_oferta: 0, stock: 8,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_896658-MCO71854420256_092023-O.webp',
        descripcion: 'Carburador compatible con Honda CGL 125. Mejora el rendimiento y el consumo de combustible.'
    },
    // FRENOS
    {
        cat: 'frenos', nombre: 'Pastillas de Freno Delantero AKT',
        precio: 35000, marca: 'AKT', es_oferta: 0, stock: 25,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_977698-MCO71804573513_092023-O.webp',
        descripcion: 'Pastillas de freno delantero para AKT 125 y 150. Alta resistencia al calor.'
    },
    {
        cat: 'frenos', nombre: 'Cable de Freno Trasero Universal',
        precio: 18000, marca: 'Genérico', es_oferta: 0, stock: 30,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_629116-MCO71573048798_092023-O.webp',
        descripcion: 'Cable de freno trasero universal, compatible con la mayoría de motos 125cc.'
    },
    {
        cat: 'frenos', nombre: 'Disco de Freno Delantero Yamaha',
        precio: 95000, marca: 'Yamaha', es_oferta: 1, stock: 10,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_991045-MCO71765978715_092023-O.webp',
        descripcion: 'Disco de freno delantero original Yamaha. Compatible con modelos FZ y YBR.'
    },
    // SUSPENSIÓN
    {
        cat: 'suspension', nombre: 'Amortiguador Trasero Honda 125',
        precio: 120000, marca: 'Honda', es_oferta: 0, stock: 12,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_770346-MCO71855063960_092023-O.webp',
        descripcion: 'Amortiguador trasero original Honda para modelos CB y CGL 125cc.'
    },
    {
        cat: 'suspension', nombre: 'Kit de Rodamientos de Dirección',
        precio: 28000, marca: 'Genérico', es_oferta: 0, stock: 20,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_714515-MCO72064528046_102023-O.webp',
        descripcion: 'Kit de rodamientos de dirección universal. Incluye cojinetes superior e inferior.'
    },
    // TRANSMISIÓN
    {
        cat: 'transmision', nombre: 'Cadena de Transmisión 428H x 116',
        precio: 42000, marca: 'DID', es_oferta: 0, stock: 18,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_879124-MCO71578025360_092023-O.webp',
        descripcion: 'Cadena de transmisión reforzada 428H x 116 eslabones. Para motos 125-150cc.'
    },
    {
        cat: 'transmision', nombre: 'Kit Piñón Corona y Cadena AKT',
        precio: 75000, marca: 'AKT', es_oferta: 1, stock: 14,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_783488-MCO71586175204_092023-O.webp',
        descripcion: 'Kit completo de transmisión AKT 125. Incluye piñón, corona y cadena.'
    },
    // ELÉCTRICOS
    {
        cat: 'electricos', nombre: 'Regulador de Voltaje Honda',
        precio: 32000, marca: 'Honda', es_oferta: 0, stock: 22,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_813799-MCO71581345528_092023-O.webp',
        descripcion: 'Regulador rectificador de voltaje para Honda 125cc. Protege la batería y el sistema eléctrico.'
    },
    {
        cat: 'electricos', nombre: 'Batería Moto 12V 5Ah',
        precio: 65000, marca: 'Genérico', es_oferta: 0, stock: 16,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_698984-MCO71858285624_092023-O.webp',
        descripcion: 'Batería sellada sin mantenimiento 12V 5Ah. Compatible con motos 125-150cc.'
    },
    // ACEITES
    {
        cat: 'aceites', nombre: 'Aceite Motor 4T 20W50 1L',
        precio: 22000, marca: 'Genérico', es_oferta: 0, stock: 60,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_745614-MCO71583448120_092023-O.webp',
        descripcion: 'Aceite mineral para motor 4 tiempos 20W50. Ideal para motos de trabajo y mototaxi.'
    },
    {
        cat: 'aceites', nombre: 'Aceite Sintético Honda 10W30',
        precio: 35000, marca: 'Honda', es_oferta: 0, stock: 40,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_857591-MCO71583620944_092023-O.webp',
        descripcion: 'Aceite sintético Honda 4 tiempos 10W30. Mayor protección y durabilidad del motor.'
    },
    // ACCESORIOS
    {
        cat: 'accesorios', nombre: 'Espejo Retrovisor Universal',
        precio: 15000, marca: 'Genérico', es_oferta: 0, stock: 35,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_681774-MCO71586060628_092023-O.webp',
        descripcion: 'Espejo retrovisor universal para motos. Rosca derecha e izquierda incluidas.'
    },
    {
        cat: 'accesorios', nombre: 'Maniguetas de Freno y Clutch',
        precio: 28000, marca: 'Genérico', es_oferta: 1, stock: 25,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_997516-MCO71859011928_092023-O.webp',
        descripcion: 'Par de maniguetas de freno y clutch ajustables. Compatibles con la mayoría de motos.'
    },
];

const insertProd = db.prepare(`
  INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, marca, imagen, es_oferta, activo, stock)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
`);

for (const p of productos) {
    const slug = p.nombre.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-')
        + '-' + Date.now();
    insertProd.run(catIds[p.cat], p.nombre, slug, p.descripcion, p.precio, p.marca, p.imagen, p.es_oferta, p.stock);
}

console.log('✅ Seed completado');
console.log('   👤 admin@gamarepuestos.com / admin123');
console.log(`   🏷️  ${cats.length} categorías`);
console.log(`   🔧 ${servicios.length} servicios`);
console.log(`   📦 ${productos.length} productos con imágenes reales`);

db.close();