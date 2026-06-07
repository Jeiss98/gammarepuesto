const { getDb } = require('../config/database');

function get() {
    return getDb().prepare('SELECT * FROM info_negocios LIMIT 1').get();
}

function update(id, data) {
    const fields = Object.keys(data).map(k => `${k} = @${k}`).join(', ');
    getDb().prepare(`UPDATE info_negocios SET ${fields}, updated_at = datetime('now') WHERE id = @id`)
        .run({ ...data, id });
    return get();
}

module.exports = { get, update };