# DrGravata App - Documentação do Prisma

Este documento explica como o Prisma é usado neste projeto e como atualizar a implementação no futuro.

## Situação Atual

Atualmente, o projeto usa um **stub** do Prisma Client Rust para permitir a compilação e o funcionamento básico do aplicativo. Este stub é um arquivo `src-tauri/src/prisma.rs` criado manualmente que implementa as interfaces necessárias para o aplicativo funcionar.

### Limitações da Implementação Atual

- Sem persistência real de dados (todos os métodos retornam listas vazias ou erros simulados)
- Sem suporte a migrações
- Sem validação de modelos
- Sem consultas complexas

## Como Migrar para o Prisma Real no Futuro

Quando o Prisma Client Rust estiver mais estável ou quando for necessário implementar a persistência real, siga estes passos:

1. **Instale o Prisma CLI globalmente**:
   ```powershell
   npm install -g prisma
   ```

2. **Gere o cliente Prisma**:
   ```powershell
   # Na raiz do projeto
   npx prisma generate
   ```

3. **Verifique se o arquivo `src-tauri/src/prisma.rs` foi gerado**. Se não:
   - Verifique se o `schema.prisma` está correto
   - Verifique se o `provider` está definido como `"prisma-client-rust"`
   - Verifique se o `output` está definido como `"../src-tauri/src/prisma.rs"`

4. **Atualize as importações nos arquivos que usam o Prisma**:
   - `src-tauri/src/db.rs`
   - `src-tauri/src/commands.rs`

5. **Verifique as assinaturas dos métodos**:
   O código do Prisma gerado pode ter assinaturas de métodos ligeiramente diferentes das do stub. Certifique-se de atualizar as chamadas se necessário.

## Solução de Problemas

Se você encontrar problemas ao gerar o cliente Prisma:

1. **Erro no npx prisma generate**:
   - Verifique se o `prisma-client-rust` está instalado corretamente
   - Verifique se o schema é válido com `npx prisma validate`

2. **Erro no cargo build**:
   - Verifique as dependências no `Cargo.toml`
   - Verifique se a versão do `prisma-client-rust` é compatível com seu schema

3. **Alternativas ao Prisma**:
   Se o Prisma Client Rust continuar instável, considere:
   - [Diesel](https://diesel.rs/) - Um ORM e query builder Rust
   - [Sea-ORM](https://www.sea-ql.org/SeaORM/) - Um ORM assíncrono para Rust
   - [SQLx](https://github.com/launchbadge/sqlx) - Toolkit SQL assíncrono para Rust

## Referências

- [Documentação do Prisma Client Rust](https://prisma.brendonovich.dev/)
- [Repositório do Prisma Client Rust](https://github.com/Brendonovich/prisma-client-rust)
- [Documentação do Prisma](https://www.prisma.io/docs) 