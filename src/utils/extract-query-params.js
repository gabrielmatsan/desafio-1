export function extractQueryParams(query) {
    // Remove o primeiro caractere da string de query (que é um '?') usando substr(1).
    // Em seguida, divide a string pelos caracteres '&' para obter um array de pares chave-valor.
    return query.substr(1).split('&').reduce((queryParams, param) => {
        // Para cada par chave-valor, divide-o pelo caractere '=' para separar a chave do valor.
        const [key, value] = param.split('=');

        // Adiciona o par chave-valor ao objeto queryParams.
        // Nota: aqui há um erro, deveria ser 'queryParams[key] = value' ao invés de 'query.params[key] = value'.
        queryParams[key] = value;

        // Retorna o objeto acumulado que contém todos os parâmetros da query string.
        return queryParams;
    }, {});
}