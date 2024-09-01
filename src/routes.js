import { randomUUID } from 'node:crypto'  // Importa a função randomUUID do módulo crypto do Node.js para gerar IDs únicos.
import { Database } from './database.js'  // Importa a classe Database para interagir com o banco de dados.
import { buildRoutePath } from './utils/build-route-path.js';  // Importa a função buildRoutePath para construir expressões regulares para as rotas.

const database = new Database()  // Cria uma nova instância do banco de dados.

export const routes = [
    {
        method: 'POST',  // Define a rota que responde a requisições HTTP POST.
        path: buildRoutePath('/tasks'),  // O caminho da rota é '/tasks', criado com uma expressão regular através da função buildRoutePath.
        handler: (req, res) => {  // Define o manipulador (handler) para lidar com a requisição.
            const { title, description } = req.body  // Desestrutura os dados 'title' e 'description' do corpo da requisição.

            // Validação: Se o título não for fornecido, responde com um erro 400 (Bad Request) e uma mensagem JSON.
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({'message':'title is required'})
                )
            }

            // Validação: Se a descrição não for fornecida, responde com um erro 400 (Bad Request) e uma mensagem JSON.
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({'message':'description is required'})
                )
            }

            // Cria um novo objeto task com um ID único e timestamps para created_at e updated_at.
            const task = {
                id: randomUUID(),
                title,
                description,
                complete_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            // Insere a nova task no banco de dados.
            database.insert('tasks', task)
            
            // Responde com sucesso (status 200) sem corpo de resposta.
            return res.writeHead(200).end()
        }
    },
    {
        method: 'GET',  // Define a rota que responde a requisições HTTP GET.
        path: buildRoutePath('/tasks'),  // O caminho da rota é '/tasks', criado com uma expressão regular através da função buildRoutePath.
        handler: (req, res) => {  // Define o manipulador (handler) para lidar com a requisição.
            const {search }= req.query  // Obtém os parâmetros de consulta (query parameters) da URL.

            // Busca tasks no banco de dados que correspondam ao título ou descrição fornecidos nos parâmetros de consulta.
            const tasks = database.select('tasks', {
                title: search,
                description: search,          
            })

            // Responde com sucesso (status 200) e envia a lista de tasks como JSON.
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',  // Define a rota que responde a requisições HTTP PUT.
        path: buildRoutePath('/tasks/:id'),  // O caminho da rota é '/tasks/:id', onde ':id' é um parâmetro dinâmico.
        handler: (req, res) => {  // Define o manipulador (handler) para lidar com a requisição.
            const { title, description } = req.body  // Desestrutura os dados 'title' e 'description' do corpo da requisição.
            const { id } = req.params  // Obtém o 'id' dos parâmetros da URL.

            // Validação: Se tanto o título quanto a descrição não forem fornecidos, responde com um erro 400 (Bad Request) e uma mensagem JSON.
            if (!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({'message': 'title or description are necessary'})
                )
            }

            // Busca a task no banco de dados pelo 'id'.
            const [task] = database.select('tasks', { id })

            // Validação: Se a task com o 'id' fornecido não for encontrada, responde com um erro 404 (Not Found).
            if (!task) {
                return res.writeHead(404).end()
            }

            // Atualiza a task no banco de dados, mantendo os valores antigos para os campos que não foram fornecidos na requisição.
            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date(),  // Corrigido 'update_at' para 'updated_at' para manter a consistência.
            })

            // Responde com sucesso (status 204) sem corpo de resposta.
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',  // Define a rota que responde a requisições HTTP DELETE.
        path: buildRoutePath('/tasks/:id'),  // O caminho da rota é '/tasks/:id', onde ':id' é um parâmetro dinâmico.
        handler: (req, res) => {  // Define o manipulador (handler) para lidar com a requisição.
            const { id } = req.params  // Obtém o 'id' dos parâmetros da URL.

            // Busca a task no banco de dados pelo 'id'.
            const task = database.select('tasks', { id })

            // Validação: Se a task com o 'id' fornecido não for encontrada, responde com um erro 404 (Not Found).
            if (!task) {
                return res.writeHead(404).end()
            }

            // Deleta a task do banco de dados.
            database.delete('tasks', id)
            
            // Responde com sucesso (status 204) sem corpo de resposta.
            return res.writeHead(204).end()
        }
    },
]

