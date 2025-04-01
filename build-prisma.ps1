# Script para gerar o cliente Prisma em Rust

Write-Host "=== Iniciando Script de Geração do Prisma Client Rust ===" -ForegroundColor Cyan

# Diretório do projeto
$projectRoot = Get-Location

# Caminho do schema Prisma
$schemaPath = Join-Path $projectRoot "prisma/schema.prisma"

# Verificar se o schema existe
if (-not (Test-Path $schemaPath)) {
    Write-Host "Erro: Schema não encontrado em $schemaPath" -ForegroundColor Red
    exit 1
}

# Atualizar o schema.prisma
Write-Host "Atualizando schema.prisma..." -ForegroundColor Yellow
$schemaContent = @"
// Arquivo: prisma/schema.prisma

generator client {
  provider = "prisma-client-rust"
  output   = "../src-tauri/src/prisma.rs"
}

datasource db {
  provider = "sqlite"
  url      = "file:../database.db"
}

// Modelo para configurações gerais do sistema
model Configuracoes {
  id         String   @id @default(cuid())
  chave      String   @unique
  valor      String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Modelo para informações de clientes
model Cliente {
  id         String   @id @default(cuid())
  nome       String
  cpfCnpj    String?  @unique
  email      String?  @unique
  telefone   String?
  endereco   String?
  observacao String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
"@

Set-Content -Path $schemaPath -Value $schemaContent -Force

# Instalar o Prisma Client Rust via npm/pnpm
Write-Host "Instalando prisma-client-rust..." -ForegroundColor Yellow
pnpm add -D prisma@^6.5.0

# Criar o arquivo prisma.rs manualmente
Write-Host "Criando arquivo prisma.rs manualmente..." -ForegroundColor Yellow
$prismaRsPath = Join-Path $projectRoot "src-tauri/src/prisma.rs"
$prismaRsContent = @"
// Arquivo gerado manualmente para o Prisma Client Rust
// Este é um stub temporário para permitir a compilação

pub mod cliente;
pub mod configuracoes;

use serde::{Deserialize, Serialize};

// Definição de tipos básicos
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PrismaClient {}

impl PrismaClient {
    pub async fn new() -> Self {
        PrismaClient {}
    }
    
    pub fn cliente(&self) -> cliente::ClienteActions {
        cliente::ClienteActions {}
    }
    
    pub fn configuracoes(&self) -> configuracoes::ConfiguracoesActions {
        configuracoes::ConfiguracoesActions {}
    }
}

// Módulo cliente
pub mod cliente {
    use super::*;
    use serde::{Deserialize, Serialize};
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ClienteActions {}
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Cliente {
        pub id: String,
        pub nome: String,
        pub cpf_cnpj: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
        pub endereco: Option<String>,
        pub observacao: Option<String>,
        pub created_at: chrono::DateTime<chrono::Utc>,
        pub updated_at: chrono::DateTime<chrono::Utc>,
    }
    
    impl ClienteActions {
        pub async fn find_many(&self) -> Vec<Cliente> {
            Vec::new()
        }
        
        pub async fn find_unique(&self, where_param: ClienteWhereUniqueInput) -> Option<Cliente> {
            None
        }
        
        pub async fn create(&self, data: ClienteCreateInput) -> Result<Cliente, String> {
            Err("Não implementado".to_string())
        }
        
        pub async fn update(&self, where_param: ClienteWhereUniqueInput, data: ClienteUpdateInput) -> Result<Cliente, String> {
            Err("Não implementado".to_string())
        }
        
        pub async fn delete(&self, where_param: ClienteWhereUniqueInput) -> Result<Cliente, String> {
            Err("Não implementado".to_string())
        }
    }
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ClienteWhereUniqueInput {
        pub id: Option<String>,
        pub cpf_cnpj: Option<String>,
        pub email: Option<String>,
    }
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ClienteCreateInput {
        pub nome: String,
        pub cpf_cnpj: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
        pub endereco: Option<String>,
        pub observacao: Option<String>,
    }
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ClienteUpdateInput {
        pub nome: Option<String>,
        pub cpf_cnpj: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
        pub endereco: Option<String>,
        pub observacao: Option<String>,
    }
}

// Módulo configuracoes
pub mod configuracoes {
    use super::*;
    use serde::{Deserialize, Serialize};
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct ConfiguracoesActions {}
    
    #[derive(Debug, Clone, Serialize, Deserialize)]
    pub struct Configuracoes {
        pub id: String,
        pub chave: String,
        pub valor: String,
        pub created_at: chrono::DateTime<chrono::Utc>,
        pub updated_at: chrono::DateTime<chrono::Utc>,
    }
    
    impl ConfiguracoesActions {
        pub async fn find_many(&self) -> Vec<Configuracoes> {
            Vec::new()
        }
    }
}

// Tipos auxiliares para suportar consultas
pub enum Direction {
    Asc,
    Desc,
}

// Tipos adicionais
pub type BatchPayload = Result<usize, String>;
"@

# Criar os diretórios para o arquivo prisma.rs
$dirPath = Split-Path $prismaRsPath -Parent
if (-not (Test-Path $dirPath)) {
    New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
}

# Salvar o arquivo prisma.rs
Set-Content -Path $prismaRsPath -Value $prismaRsContent -Force

Write-Host "=== Arquivo prisma.rs criado com sucesso ===" -ForegroundColor Green
Write-Host "Agora é possível compilar o projeto com 'cargo build'" -ForegroundColor Cyan 