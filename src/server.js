import http from 'node:http'  // Importa o módulo HTTP do Node.js, que permite criar um servidor HTTP.
import { json } from './middlewares/json.js';  // Importa o middleware 'json' que processa o corpo da requisição como JSON.
import { routes } from './routes.js';  // Importa as rotas definidas no arquivo 'routes.js'.
import { extractQueryParams } from './utils/extract-query-params.js';  // Importa a função que extrai parâmetros de query strings de URLs.

const server = http.createServer(async(req, res) => {
    // Cria um servidor HTTP. Toda vez que uma requisição for recebida, esta função será executada.
    const { method, url } = req;  // Desestrutura o método HTTP (GET, POST, etc.) e a URL da requisição.

    await json(req, res);  // Chama o middleware 'json' para processar o corpo da requisição, convertendo-o para JSON.

    // Procura a rota que corresponde ao método e URL da requisição.
    const route = routes.find(route => {
        return route.method === method && route.path.test(url);
    });

    if (route) {
        // Se a rota for encontrada, utiliza a expressão regular associada à rota para capturar os parâmetros da URL.
        const routeParams = req.url.match(route.path);

        // Desestrutura o objeto resultante da correspondência da URL, separando a query string dos outros parâmetros.
        const { query, ...params } = routeParams.groups;

        // Armazena os parâmetros extraídos no objeto 'req.params'.
        req.params = params;

        // Se houver uma query string, ela é processada e armazenada em 'req.query', caso contrário, 'req.query' é um objeto vazio.
        req.query = query ? extractQueryParams(query) : {};

        // Chama o manipulador associado à rota, passando 'req' e 'res' para que a resposta possa ser construída.
        return route.handler(req, res);
    }

    // Se nenhuma rota correspondente for encontrada, retorna uma resposta 404 (Not Found).
    return res.writeHead(404).end('Not Found');
});

server.listen(3334, () => {
    // Inicia o servidor na porta 3334
    console.log('Server is running on http://localhost:3334');
});