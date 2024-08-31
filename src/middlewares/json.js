export async function json(req, res) {
    // Inicializa um array vazio para armazenar os chunks de dados recebidos na requisição.
    const buffers = [];

    // Loop assíncrono para iterar sobre os chunks de dados recebidos no corpo da requisição.
    for await (const chunk of req) {
        // Adiciona cada chunk recebido ao array buffers.
        buffers.push(chunk);  // Corrigido o erro de digitação de 'chunke' para 'chunk'
    }

    // Tenta converter os chunks de dados recebidos em um objeto JSON.
    try {
        // Concatena todos os chunks em um único buffer, converte para string e então parseia como JSON.
        req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
        // Se a conversão para JSON falhar (por exemplo, se os dados não estiverem em formato JSON válido),
        // o body da requisição é definido como null.
        req.body = null;
    }

    // Define o cabeçalho 'Content-Type' da resposta para 'application/json',
    // indicando que a resposta será enviada no formato JSON.
    res.setHeader('Content-Type', 'application/json');
}