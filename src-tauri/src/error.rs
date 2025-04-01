// use thiserror::Error; // Mantém comentado
use prisma_client_rust::QueryError;
use serde::Serialize;

// Restore the Result type alias
pub type Result<T> = std::result::Result<T, Error>;

// Enum principal para os erros da aplicação backend
// Removido derive(Error) pois os campos source: String não são std::error::Error
#[derive(Debug, Serialize)]
pub enum Error {
    // Manter a anotação #[error(...)] para mensagens, mas sem source automático
    DatabaseQuery {
        source: String 
    },

    NotFound {
        entity: String,
        id: String,
    },

    // Adicione outros tipos de erro conforme necessário
    // Ex: Erro de validação, erro de IO, erro de comunicação com sidecar
    Io {
        source: String 
    },

    Unknown(String),
}

// Implement custom From traits to convert non-serializable errors
impl From<QueryError> for Error {
    fn from(e: QueryError) -> Self {
        Error::DatabaseQuery { source: e.to_string() }
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io { source: e.to_string() }
    }
}

// REMOVIDA a implementação `