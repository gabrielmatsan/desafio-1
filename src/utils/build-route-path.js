export function buildRoutePath(path) {
    // Define uma expressão regular que captura parâmetros dinâmicos na URL.
    // O formato esperado é ":param", onde "param" pode ser qualquer sequência de letras maiúsculas ou minúsculas.
    const routeParametersRegex = /:([a-zA-Z]+)/g;

    // Substitui os parâmetros dinâmicos na URL por grupos de captura nomeados na expressão regular.
    // O grupo de captura nomeado é criado com o formato "(?<nome>[expressão])", onde "nome" é o nome do parâmetro
    // e "expressão" define como os valores para aquele parâmetro devem se parecer.
    // Neste caso, ele captura qualquer combinação de letras minúsculas, números, hifens e underscores.
    const pathWithParameters = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

    // Cria uma nova expressão regular que combina a URL ajustada com parâmetros e adiciona uma captura opcional de query strings.
    // O `(?<query>\\(.*))?$` captura tudo após o "?" na URL como parte de uma query string, se houver.
    // A âncora "^" garante que a correspondência comece no início da string, e "$" no final, garantindo uma correspondência exata.
    const pathRegex = new RegExp(`^${pathWithParameters}(?<query>\\?.*)?$`);

    // Retorna a expressão regular final que pode ser usada para comparar e extrair valores de URLs que seguem o padrão definido.
    return pathRegex;
}