# Conversor de Moedas

API REST desenvolvida em **Node.js** para conversão de **Real Brasileiro (BRL)** para **Dólar Americano (USD)** utilizando a cotação em tempo real da **Awesome API**.

A cada conversão, a aplicação consulta a cotação atual, realiza o cálculo, persiste a transação no banco de dados e disponibiliza endpoints para consulta do histórico.

---

# Arquitetura

O projeto foi desenvolvido utilizando **Arquitetura em Camadas (Layered Architecture)** em conjunto com princípios da **Clean Architecture**.

Cada camada possui uma responsabilidade específica, reduzindo o acoplamento entre os componentes da aplicação e facilitando testes, manutenção e futuras substituições de tecnologias.

As responsabilidades estão distribuídas da seguinte forma:

- **Controllers:** recebem as requisições HTTP, validam entradas e retornam respostas.
- **Services (Casos de Uso):** concentram toda a regra de negócio da aplicação.
- **Repositories:** abstraem o acesso aos dados.
- **Providers:** encapsulam integrações externas, como provedores de cotação.
- **Schemas:** validam os dados de entrada e saída utilizando Zod.
- **Models:** representam as entidades persistidas no banco.

Essa organização permite, por exemplo, substituir o banco de dados ou o provedor de câmbio sem alterar a regra de negócio.

---

# Tecnologias Utilizadas

| Tecnologia | Motivo da utilização |
|------------|----------------------|
| **Fastify** | Framework HTTP de alta performance com arquitetura baseada em plugins, tipagem e integração com schemas. |
| **TypeScript** | Tipagem estática que aumenta a segurança e facilita a manutenção do código. |
| **MongoDB** | Banco NoSQL utilizado para armazenar o histórico das conversões. |
| **Mongoose** | ODM responsável pelo mapeamento entre documentos do MongoDB e objetos da aplicação. |
| **Zod** | Validação de dados com inferência automática de tipos para o TypeScript. |
| **Vitest** | Framework utilizado para testes automatizados, oferecendo execução rápida e excelente integração com TypeScript. |
| **Docker** | Padroniza o ambiente de desenvolvimento e execução da aplicação. |

---

# Estrutura do Projeto

```text
src
├── configs
├── modules
│   └── transaction
│       ├── controllers
│       ├── models
│       ├── repositories
│       ├── routes
│       ├── schemas
│       └── services
├── providers
│   └── awesome
├── shared
└── server.ts
```

---

# Como executar

## Pré-requisitos

- Node.js 22 ou superior
- Docker e Docker Compose

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o `.env.example` como referência.

---

## Executando com Docker

Inicie toda a aplicação (API + MongoDB):

```bash
docker compose up --build
```

Após a inicialização:

- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

Para finalizar:

```bash
docker compose down
```

---

## Desenvolvimento local

Inicie apenas o MongoDB:

```bash
docker compose up -d mongodb
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

A API estará disponível em:

- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

---

# Executando os testes

Executar todos os testes:

```bash
npm test
```

Executar em modo watch:

```bash
npm run test:watch
```

Gerar relatório de cobertura:

```bash
npm run test:coverage
```

---

# Endpoints

## POST /transactions

Cria uma nova conversão de moeda.

### Fluxo

1. Recebe o valor em BRL.
2. Consulta a cotação BRL/USD na Awesome API.
3. Utiliza o campo `bid` como taxa de conversão.
4. Calcula o valor convertido.
5. Persiste a transação no MongoDB.
6. Retorna os dados da conversão.

### Exemplo de requisição

```json
{
  "amount": 100
}
```

### Exemplo de resposta

```json
{
  "id": "...",
  "amount": 100,
  "exchangeRate": 0.1825,
  "convertedAmount": 18.25,
  "currencyFrom": "BRL",
  "currencyTo": "USD",
  "createdAt": "2026-07-30T..."
}
```

---

## GET /transactions

Retorna o histórico de conversões.

### Funcionalidades

- Paginação
- Filtro por período
- Ordenação da mais recente para a mais antiga

### Exemplo

```text
?page=1
&limit=10
&startDate=2026-01-01
&endDate=2026-01-31
```

### Resposta

```json
{
  "data": [
    {
      "id": "...",
      "amount": 100,
      "exchangeRate": 0.1825,
      "convertedAmount": 18.25,
      "currencyFrom": "BRL",
      "currencyTo": "USD",
      "createdAt": "2026-07-30T..."
    }
  ],
  "page": 1,
  "limit": 10,
  "totalElements": 100,
  "totalPages": 10
}
```

---

## GET /transactions/:id

Retorna uma conversão pelo identificador.

```json
{
  "id": "...",
  "amount": 100,
  "exchangeRate": 0.1825,
  "convertedAmount": 18.25,
  "currencyFrom": "BRL",
  "currencyTo": "USD",
  "createdAt": "2026-07-30T..."
}
```

---

# Integração com a Awesome API

A cotação é obtida em tempo real através da Awesome API.

Para realizar a conversão é utilizado o campo **`bid`**, que representa o preço de compra da moeda.

```bash
curl --request GET \
  --url https://economia.awesomeapi.com.br/json/last/BRL-USD \
  --header 'x-api-key: API_KEY'
```

---

# Modelo de Dados

```text
Transaction {
    id
    amount
    exchangeRate
    convertedAmount
    currencyFrom
    currencyTo
    createdAt
}
```

---

# Decisões Técnicas

## Arquitetura em Camadas + Clean Architecture

A aplicação foi estruturada para separar responsabilidades e manter a regra de negócio independente das tecnologias utilizadas.

Essa abordagem facilita testes, manutenção e futuras substituições de infraestrutura, como banco de dados ou provedores externos.

## Fastify

Escolhido pela alta performance, baixo overhead e arquitetura baseada em plugins, além da excelente integração com TypeScript.

## MongoDB

Atende bem ao cenário da aplicação, que armazena apenas o histórico de conversões e realiza consultas simples com paginação, filtros e ordenação.

## Mongoose

Facilita o acesso ao MongoDB através de modelos, validações e uma API consistente para consultas e persistência.

## Zod

Centraliza a validação dos dados de entrada e saída, evitando duplicação entre validação e tipagem.

## Awesome API

Fornece gratuitamente cotações em tempo real. A aplicação utiliza o campo `bid` como taxa de conversão.

## Testes Automatizados

Os testes são implementados com **Vitest** para validar o comportamento das regras de negócio e reduzir o risco de regressões.

Os casos de uso são testados isoladamente por meio de mocks dos repositórios e dos provedores externos, garantindo testes rápidos, previsíveis e independentes de infraestrutura.

## Docker

Padroniza o ambiente de desenvolvimento e execução da aplicação, facilitando a configuração e reduzindo diferenças entre ambientes.