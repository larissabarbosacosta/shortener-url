# URL Shortener API com Docker

Projeto prático desenvolvido durante meus estudos de DevOps com foco em Docker.

A aplicação é uma API simples de encurtamento de URLs desenvolvida em Node.js e containerizada com Docker.

O objetivo do projeto foi praticar Dockerfile, volumes, networks, healthcheck e troubleshooting em um ambiente real de container.

---

# Tecnologias utilizadas

- Node.js
- Express
- Docker
- Docker Volumes
- Docker Networks

---

# Funcionalidades

## Criar URL encurtada

Endpoint:

```bash
POST /shorten
```

Exemplo:

```bash
curl -X POST localhost:3000/shorten \
-H "Content-Type: application/json" \
-d '{"target":"https://google.com"}'
```

Resposta:

```json
{
  "shortUrl": "abc123",
  "target": "https://google.com"
}
```

---

## Estatísticas

Endpoint:

```bash
GET /stats
```

Exemplo:

```bash
curl localhost:3000/stats
```

Resposta:

```json
{
  "abc123": {
    "target": "https://google.com",
    "clicks": 0
  }
}
```

---

## Redirecionamento

Endpoint:

```bash
GET /:id
```

Exemplo:

```bash
curl -I localhost:3000/abc123
```

Resposta:

```bash
HTTP/1.1 302 Found
Location: https://google.com
```

---

## Healthcheck

Endpoint:

```bash
GET /health
```

Exemplo:

```bash
curl localhost:3000/health
```

Resposta:

```json
{
  "status": "ok"
}
```

---

# Dockerfile aplicado

O projeto utiliza boas práticas com Dockerfile:

- `ARG`
- `FROM`
- `WORKDIR`
- `COPY package*.json`
- `RUN npm ci`
- `ENV`
- `EXPOSE`
- `USER node`
- `ENTRYPOINT`
- `CMD`
- `HEALTHCHECK`

---

# Build da imagem

```bash
docker build -t shortener:1.0 .
```

---

# Criando network

```bash
docker network create shortener-net
```

---

# Criando volume

```bash
docker volume create shortener-data
```

---

# Executando container

```bash
docker run -d \
-p 3000:3000 \
--name shortener-url \
--network shortener-net \
-v shortener-data:/app/data \
shortener:1.0
```

---

# Persistência com Docker Volume

A aplicação salva os links em:

```bash
/app/data/urls.json
```

Os dados permanecem disponíveis mesmo após remover e recriar o container utilizando o mesmo volume Docker.

Fluxo testado:

```bash
docker rm -f shortener-url
```

Subir novamente:

```bash
docker run ...
```

Verificar:

```bash
curl localhost:3000/stats
```

Resultado:

Dados persistidos com sucesso.

---

# Troubleshooting realizado durante o projeto

Durante os testes foram encontrados e corrigidos alguns problemas:

## Porta não publicada

Corrigido com:

```bash
-p 3000:3000
```

---

## Sintaxe incorreta de volume

Corrigido com:

```bash
-v shortener-data:/app/data
```

---

## Arquivo JSON vazio em volume recém criado

Ajustado no código para tratar arquivo vazio corretamente.

---

# Aprendizados

Com este projeto pratiquei:

- Dockerfile
- cache de layers
- build de imagens
- containers
- publicação de portas
- Docker Volumes
- persistência de dados
- Docker Networks
- HEALTHCHECK
- troubleshooting com:
  - `docker ps`
  - `docker logs`
  - `docker exec`
  - `docker inspect`

---

# Próximos passos

- Docker Compose
- multi-container
- banco de dados
- CI/CD com GitHub Actions
- Kubernetes
