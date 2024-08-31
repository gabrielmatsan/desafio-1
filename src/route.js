import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { constants } from 'node:vm'

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            
            if (!title) {
                return res.writeHead(400).end(
                    JSON.stringify({'message':'title is required'})
                )
            }
            if (!description) {
                return res.writeHead(400).end(
                    JSON.stringify({'message':'description is required'})
                )
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                complete_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            }

            database.insert('tasks', task)
            
            return res.writeHead(200).end()
        }


    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const search = req.query

            const tasks = database.select('tasks', {
                title: search,
                description: search
            })

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { title, description } = req.body
            const { id } = req.params
            
            if (!title && !description) {
                return res.writeHead(400).end(
                    JSON.stringify({'message': 'title or description are necessary'})
                )
            }
            const [task] = database.select('tasks', { id })
            
            if (!task) {
                return res.writeHead(404).end()
            }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                update_at: new Date(),
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
        }
    }
]