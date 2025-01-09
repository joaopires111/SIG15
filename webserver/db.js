const { Client } = require('pg');

class Database {
    constructor() {
        this.conexao = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'postgres',
            database: 'SIG15'
        });
    }
    async connect() {
        await this.conexao.connect();

    }
    async disconnect() {
        await this.conexao.end();
    }
    // Método de teste para obter dados sobre uma subseccao (número de subseccoes vizinhas)
    async getNumVizinhos(id) {
        const query = `
select * from presidentes_cmvc where id = 1;
`;
        try {
            const result = await this.conexao.query(query, [id]);
            if (result.rows.length === 0 || !result.rows[0].contagem) {
                return null;
            }
            return result.rows[0].contagem;
        } catch (error) {
            console.error('Erro ao executar getNumVizinhos na base de dados', error);
            throw error;
        }
    }
}
module.exports = Database;

