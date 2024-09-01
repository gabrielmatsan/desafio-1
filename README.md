# Ignite Node.js

Este projeto é uma simulação de um banco de dados conectado a uma API. O foco principal foi treinar o desenvolvimento de uma API simples sem o uso de frameworks, utilizando apenas as ferramentas nativas do Node.js e o pacote externo `csv-parse` para importação de dados em CSV.

## Descrição do Projeto

Neste projeto, você encontrará uma API capaz de gerenciar tasks, armazenadas em formato JSON, simulando um banco de dados. A API oferece funcionalidades básicas de CRUD (Criar, Ler, Atualizar, Deletar) para as tasks, além de uma funcionalidade adicional que permite a importação de tasks a partir de um arquivo CSV.

## Tecnologias Utilizadas

- **Node.js**: A API foi desenvolvida sem a utilização de frameworks, utilizando apenas os módulos nativos do Node.js.
- **csv-parse**: Único pacote externo utilizado no projeto, responsável por fazer o parsing dos dados de um arquivo CSV para inserção no banco de dados JSON.

## Instalação

Para instalar as dependências necessárias, siga os passos abaixo:

```bash
npm install csv-parse
```
Execute o servidor da API
```bash
npm run dev
```

Importar tasks do CSV
```bash
node src/server.js
```
