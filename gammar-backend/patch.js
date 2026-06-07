const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.resolve('./database/gammar.db'));

try {
  db.prepare(`UPDATE info_negocios SET nosotros_historia = ?, nosotros_filosofia = ? WHERE id = 1`)
    .run(
      'Nacimos con un propósito claro: ofrecer a los motociclistas del Chocó repuestos de la más alta calidad, garantizando durabilidad, rendimiento y seguridad en cada recorrido. Sabemos lo importante que es tu motocicleta para ti, por eso trabajamos solo con marcas reconocidas y repuestos originales o tipo original (OEM).',
      'Nuestro eslogan refleja nuestra filosofía. No buscamos simplemente vender, sino brindar una asesoría genuina para que adquieras exactamente lo que tu moto necesita. Nuestro equipo está capacitado para guiarte en cada compra.'
    );

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
  console.log('Patch complete!');
} catch(e) {
  console.error(e);
}
db.close();
