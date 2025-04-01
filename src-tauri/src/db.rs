// Importa o cliente Prisma gerado (geralmente em src/prisma.rs)
use crate::prisma::PrismaClient;

use tokio::sync::OnceCell;
use crate::error::{Result, Error}; // Usa nosso Result e Error customizados
use std::sync::Arc;

// Static global para armazenar o cliente Prisma inicializado.
// OnceCell garante inicialização única e segura para threads.
// Arc permite compartilhar a posse do cliente entre threads.
static CLIENT: OnceCell<Arc<PrismaClient>> = OnceCell::const_new();

// Função assíncrona para inicializar o cliente Prisma.
// Esta função será chamada uma vez para configurar o CLIENT.
async fn initialize_prisma_client() -> Result<Arc<PrismaClient>> {
    // Stub: Cria uma instância do PrismaClient diretamente
    // Em uma implementação real, isso usaria um builder
    let client = PrismaClient::new().await;

    // Na implementação real, poderia realizar migrações aqui
    // client._db_push().await.map_err(|e| Error::DatabaseQuery { source: e.to_string() })?;

    Ok(Arc::new(client))
}

// Função pública para obter uma referência compartilhada (Arc) ao cliente Prisma.
// Ela garante que a inicialização ocorra apenas na primeira chamada.
pub async fn get_prisma_client() -> Result<&'static Arc<PrismaClient>> {
    CLIENT
        .get_or_try_init(initialize_prisma_client)
        .await
        .map_err(|e| match e {
            // Corrigido: Pattern match na struct variant
            err @ Error::DatabaseQuery { .. } => err, // Usamos .. para ignorar campos
            _ => Error::Unknown("Falha ao inicializar ou obter cliente Prisma".to_string()),
        })
}

// Exemplo de como usar o cliente (será movido para commands.rs depois)
/*
async fn example_usage() -> Result<()> {
    let db = get_prisma_client().await?;
    // Use db para fazer consultas, ex:
    // db.cliente().find_many(vec![]).exec().await?;
    Ok(())
}
*/ 