# Gerador do Prisma Client Rust

Este é um pequeno projeto que gera o código do Prisma Client Rust para o DrGravata App.

## Como funciona

Este projeto usa a biblioteca `prisma-client-rust-cli` para gerar o código do cliente Prisma a partir do arquivo `schema.prisma` no diretório principal.

A geração é feita programaticamente, evitando a necessidade de instalar o CLI do Prisma globalmente.

## Como usar

A maneira mais fácil de usar este gerador é através do script PowerShell fornecido na raiz do projeto principal:

```powershell
# Na raiz do projeto principal (drgravata-app)
.\gerar-prisma.ps1
```

Este script irá:
1. Compilar este projeto
2. Executá-lo para gerar o código do Prisma Client
3. O código gerado será salvo em `../src-tauri/src/prisma.rs`

## Detalhes técnicos

- O projeto é construído em Rust e usa o crate `prisma-client-rust-cli`
- A versão usada é compatível com a definida no `Cargo.toml` do projeto principal
- O código gerado inclui todos os modelos definidos no `schema.prisma`

## Solução de problemas

Se você encontrar problemas com a geração:

1. Verifique se o caminho para o `schema.prisma` está correto
2. Certifique-se de que o schema é válido executando `npx prisma validate`
3. Verifique se as versões do `prisma-client-rust` são compatíveis

## Contribuindo

Sinta-se à vontade para melhorar este gerador conforme necessário. 