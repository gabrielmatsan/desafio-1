export async function json(req, res) {
    const buffers = []


    for await (const chunk of req) {
        buffers.push(chunke)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    req.setHeader('Content-Type', 'application/json')
}