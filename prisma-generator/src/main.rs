use std::env;
use std::path::Path;

async fn run() -> Result<(), Box<dyn std::error::Error>> {
    // Obtém o diretório atual
    let current_dir = env::current_dir()?;
    
    // Move para o diretório do projeto principal (um diretório acima)
    let project_dir = current_dir.parent().expect("Falha ao obter o diretório do projeto");
    
    // Define o caminho do schema Prisma
    let schema_path = project_dir.join("prisma").join("schema.prisma");
    
    println!("Diretório do projeto: {:?}", project_dir);
    println!("Caminho do schema: {:?}", schema_path);
    
    // Verifica se o schema existe
    if !schema_path.exists() {
        return Err(format!("Schema não encontrado em {:?}", schema_path).into());
    }
    
    // Define a variável de ambiente para o caminho do schema
    env::set_var("SCHEMA_PATH", schema_path.to_str().unwrap());
    
    // Executa o gerador Prisma
    println!("Executando prisma-client-rust-cli generate...");
    prisma_client_rust_cli::generate()?;
    
    println!("Cliente Prisma gerado com sucesso!");
    Ok(())
}

// Função principal
fn main() {
    let runtime = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("Falha ao criar o runtime Tokio");
    
    if let Err(e) = runtime.block_on(run()) {
        eprintln!("Erro ao gerar o cliente Prisma: {}", e);
        std::process::exit(1);
    }
} 