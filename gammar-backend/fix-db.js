require('dotenv').config();
const { getDb } = require('./src/config/database');

const db = getDb();

// Re-asignar los productos a las nuevas categorias
// Nuevos IDs: Motor (1), Frenos (2), Suspensión (3), Transmisión (4), Eléctricos (5), Accesorios (6), Aceites (7), Otros (8)
const catMotor = db.prepare("SELECT id FROM categorias WHERE slug='motor'").get()?.id;
const catFrenos = db.prepare("SELECT id FROM categorias WHERE slug='frenos'").get()?.id;

if (catMotor && catFrenos) {
    db.prepare("UPDATE productos SET categoria_id = ? WHERE slug IN ('filtro-aceite-honda-cb125', 'bujia-ngk-cr7hsa')").run(catMotor);
    db.prepare("UPDATE productos SET categoria_id = ? WHERE slug IN ('pastillas-freno-delantero-akt', 'cable-freno-trasero-universal')").run(catFrenos);
}

const prodCount = db.prepare('SELECT COUNT(*) as c FROM productos').get().c;
console.log('Productos en DB:', prodCount);
