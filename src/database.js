import fs from 'node:fs/promises'  // Importa o módulo de sistema de arquivos (fs) do Node.js, permitindo operações assíncronas com arquivos.

// Define o caminho para o arquivo de banco de dados JSON usando uma URL relativa.
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    // Declaração de uma propriedade privada #database que será usada para armazenar os dados do banco de dados em memória.
    #database = {}

    // Construtor da classe Database, executado quando uma instância da classe é criada.
    constructor() {
        // Tenta ler o arquivo do banco de dados JSON no caminho especificado.
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                // Se a leitura for bem-sucedida, os dados do arquivo são parseados de JSON para um objeto JavaScript e armazenados na propriedade #database.
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                // Se a leitura falhar (por exemplo, se o arquivo não existir), a função #persist é chamada para criar o arquivo.
                this.#persist()
            })
    }

    // Método privado #persist que escreve o conteúdo da propriedade #database no arquivo JSON para persistir os dados em disco.
    #persist() {
        // Converte o objeto #database para uma string JSON e grava no arquivo.
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    // Método select que recupera dados de uma tabela específica no banco de dados.
    // Pode receber um objeto de busca (search) para filtrar os dados retornados.
    select(table, search) {
        let data = this.#database[table] ?? []
    
        if (search) {
          data = data.filter(row => {
            return Object.entries(search).some(([key, value]) => {
                if (!value) return true
              return row[key].includes(value)
            })
          })
        }
    
        return data
      }

    // Método insert que insere um novo dado na tabela especificada.
    insert(table, data) {
        // Se a tabela já existe e é um array, o novo dado é adicionado ao final do array.
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            // Se a tabela não existir, ela é criada e o dado é adicionado.
            this.#database[table] = [data]
        }
        // Persiste as alterações gravando o estado atual do banco de dados no arquivo JSON.
        this.#persist();

        // Retorna o dado recém-adicionado.
        return data;
    }

    // Método delete que remove um dado da tabela com base no ID fornecido.
    delete(table, id) {
        // Encontra o índice da linha que possui o ID correspondente.
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        
        // Se a linha com o ID for encontrada, ela é removida do array.
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            // Persiste as alterações gravando o estado atual do banco de dados no arquivo JSON.
            this.#persist();
        }
    }

    // Método update que atualiza um dado existente na tabela com base no ID fornecido.
    update(table, id, data) {
        // Encontra o índice da linha que possui o ID correspondente.
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        // Se a linha com o ID for encontrada, ela é atualizada com os novos dados fornecidos.
        if (rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data }
            // Persiste as alterações gravando o estado atual do banco de dados no arquivo JSON.
            this.#persist()
        }
    }
}