// Import the 'pg' module
const { Client } = require('pg');

class Database {
    constructor() {
        this.conexao = new Client({
            host: 'localhost',        // PostgreSQL host
            port: 5432,               // Default port for PostgreSQL
            user: 'postgres',    // Your PostgreSQL username
            password: 'postgres', // Your PostgreSQL password
            database: 'SIG15', // The database name you want to access
        });
    }
    async connect() {
        console.log('Connecting to database... 1');
        await this.conexao.connect();

    }
    async disconnect() {
        await this.conexao.end();
    }
    // Método de teste para obter dados sobre uma subseccao (número de subseccoes vizinhas)
    async getNumVizinhos(id) {
        const query = `
select nome from professores_estg where id = 1;
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

