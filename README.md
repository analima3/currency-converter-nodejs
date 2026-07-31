# Conversor de moedas

Uma API REST desenvolvida em Node.js utilizando o framework Fastify para conversão de moedas de Real Brasileiro (BRL) para Dólar Americano (USD). A aplicação consome taxas de câmbio em tempo real da AWESOME API para calcular e retornar o valor convertido instantaneamente.

## Tecnologias Utilizadas

- Fastify
- TypeScript
- MongoDB
- Mongoose
- Docker
- Zod
- Jest

## Requisitos funcionais

### POST /transactions

Endpoint para criar nova transação, deve seguir o fluxo abaixo:

1. Receber o valor em BRL.
2. Consultar a cotação BRL/USD na Awesome API.
3. Utilizar o campo bid como taxa de conversão.
4. Calcular o valor convertido.
5. Persistir a transação no MongoDB.
6. Retornar os dados da conversão.

```json
Entrada:

{
    "amount": 100
}
```

```json
Saída:

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

### GET /transactions

Endpoint retorna todas as transações sendo possível as possíveis interações:

- Filtro por período da transação
- Consultar transações por página

As transações devem retornar ordenadas das mais rescentes até as mais antigas.

```json
Entrada:

?page=1
&limit=10
&startDate=2026-01-01
&endDate=2026-01-31
```

```json
Saída:

{
    "data": [{
        "id": "...",
        "amount": 100,
        "exchangeRate": 0.1825,
        "convertedAmount": 18.25,
        "currencyFrom": "BRL",
        "currencyTo": "USD",
        "createdAt": "2026-07-30T..."
    }],
    "currentPage": 1,
    "limit": 10,
    "totalElements": 100,
    "totalPages": 10
}
```

### GET /transactions/:id

Endpoint retorna uma transação especifica a partir do id

```json
Saída:

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

## Integração com API AWESOME

Para as taxas de conversões, utilizamos o recurso da API publica. Para o calculo utilizamos o campos `bid (preço de compra)` retornado no endpoint abaixo:

```json
curl --request GET \
--url https://economia.awesomeapi.com.br/json/last/BRL-USD \
--header 'x-api-key: API_KEY'
```

## Banco de dados

### Entidade

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