# Conversor de Moedas

API REST desenvolvida em **Node.js** para conversão de **Real Brasileiro (BRL)** para **Dólar Americano (USD)** utilizando a cotação em tempo real da **Awesome API**.

A cada conversão, a aplicação consulta a cotação atual, realiza o cálculo, persiste a transação no banco de dados e disponibiliza endpoints para consulta do histórico.

## Arquitetura

O projeto foi desenvolvido utilizando **Arquitetura em Camadas (Layered Architecture)** em conjunto com princípios da **Clean Architecture**.

A responsabilidade da aplicação é separada em camadas bem definidas, tornando o código mais organizado, testável e de fácil manutenção.

De forma simplificada:

- **Controllers**: recebem as requisições HTTP e retornam as respostas.
- **Services (Casos de Uso)**: concentram as regras de negócio da aplicação.
- **Repositories**: realizam o acesso aos dados.
- **Providers**: encapsulam integrações externas, como a Awesome API.
- **Schemas**: validam dados de entrada e saída.
- **Models**: representam as entidades persistidas no banco.

Essa separação reduz o acoplamento entre as camadas e facilita futuras substituições de tecnologias (banco de dados, APIs externas, etc.) sem impactar a regra de negócio.

# Tecnologias Utilizadas

| Tecnologia | Motivo da utilização |
|------------|----------------------|
| **Fastify** | Framework HTTP de alta performance, com suporte a plugins, tipagem e validação de schemas. |
| **TypeScript** | Adiciona tipagem estática, reduz erros em tempo de desenvolvimento e melhora a manutenção do código. |
| **MongoDB** | Banco NoSQL utilizado para armazenar o histórico das conversões realizadas. |
| **Mongoose** | ODM responsável por mapear documentos do MongoDB para objetos da aplicação e facilitar consultas e validações. |
| **Docker** | Padroniza o ambiente de desenvolvimento e execução da aplicação. |
| **Zod** | Validação de dados de entrada e saída com inferência automática de tipos para o TypeScript. |
| **Jest** | Framework utilizado para testes automatizados da aplicação. |


## Executando a aplicação

### 1. Clone o repositório

```bash
git clone https://github.com/analima3/currency-converter-nodejs.git
cd currency-converter-nodejs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto utilizando o `.env.example` como referência.

### 4. Inicie o MongoDB com Docker

A aplicação utiliza o MongoDB para persistência dos dados. Para iniciar o banco de dados, execute:

```bash
docker compose up -d
```

Verifique se o container está em execução:

```bash
docker ps
```

### 5. Inicie a aplicação

```bash
npm run dev
```

A API estará disponível em:

```
http://localhost:3001
```

A documentação interativa (Swagger) pode ser acessada em:

```
http://localhost:3001/docs
```

### Encerrando o ambiente

Para parar o MongoDB:

```bash
docker compose down
```


# Requisitos Funcionais

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

## GET /transactions

Retorna o histórico de conversões.

### Funcionalidades

- Paginação
- Filtro por período (`startDate` e `endDate`)
- Ordenação das transações da mais recente para a mais antiga

### Exemplo de consulta

```text
?page=1
&limit=10
&startDate=2026-01-01
&endDate=2026-01-31
```

### Exemplo de resposta

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

## GET /transactions/:id

Retorna uma conversão específica pelo seu identificador.

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

# Integração com a Awesome API

A cotação utilizada na conversão é obtida em tempo real através da Awesome API.

Para o cálculo é utilizado o campo **`bid`**, que representa o preço de compra da moeda.

```bash
curl --request GET \
  --url https://economia.awesomeapi.com.br/json/last/BRL-USD \
  --header 'x-api-key: API_KEY'
```

# Modelo de Dados

A entidade persistida no banco possui a seguinte estrutura:

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

# Decisões Técnicas

Durante o desenvolvimento foram tomadas algumas decisões com foco em simplicidade, organização do código e facilidade de manutenção.

### Arquitetura em Camadas + Clean Architecture

A aplicação foi organizada em camadas para separar responsabilidades entre as partes do sistema.

A regra de negócio fica isolada das tecnologias utilizadas (HTTP, banco de dados e APIs externas), tornando a aplicação menos acoplada e facilitando alterações futuras.

Por exemplo, caso seja necessário trocar o MongoDB por PostgreSQL ou substituir a Awesome API por outro provedor de câmbio, a maior parte da regra de negócio permanece inalterada.

### Fastify

O Fastify foi escolhido por oferecer uma boa performance, baixo overhead e uma arquitetura baseada em plugins.

Além disso, possui ótima integração com TypeScript e permite definir schemas de validação e serialização das respostas, reduzindo a necessidade de código manual.

### MongoDB

Como a aplicação armazena apenas o histórico das conversões, sem relacionamentos complexos entre entidades, um banco orientado a documentos atende bem ao cenário.

O MongoDB permite armazenar os registros de forma simples e oferece consultas eficientes para paginação, filtros por período e ordenação por data.

### Mongoose

O Mongoose foi utilizado para abstrair o acesso ao MongoDB, centralizando a definição dos modelos e facilitando operações de persistência.

Também fornece recursos como validações, tipagem e uma API mais consistente para consultas.

### Zod

O Zod foi utilizado para validar os dados recebidos pela API antes que cheguem às regras de negócio.

Com isso, a aplicação garante que apenas dados válidos sejam processados e ainda aproveita a inferência de tipos do TypeScript, evitando duplicação entre validação e tipagem.

### Awesome API

A Awesome API foi escolhida por disponibilizar gratuitamente cotações de moedas em tempo real, sendo suficiente para o escopo da aplicação.

Para realizar a conversão é utilizado o campo `bid`, que representa o preço de compra da moeda, servindo como taxa de conversão adotada pelo sistema.

### Testes Automatizados

Os testes são implementados com Jest para validar o comportamento das regras de negócio e reduzir o risco de regressões.

Como a lógica principal está desacoplada das dependências externas, é possível testar os casos de uso utilizando mocks dos repositórios e dos provedores de câmbio, tornando os testes mais rápidos e previsíveis.

### Docker

O Docker foi utilizado para padronizar o ambiente de execução da aplicação e eliminar diferenças entre ambientes de desenvolvimento.

Dessa forma, qualquer pessoa consegue executar o projeto utilizando a mesma configuração, reduzindo problemas relacionados à instalação de dependências ou versões de ferramentas.