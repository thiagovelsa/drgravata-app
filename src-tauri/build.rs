// build.rs
use std::env;

fn main() {
    // Definir variáveis ambientais necessárias antes de executar o build do Tauri
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rerun-if-changed=tauri.conf.json");
    
    // Obter o diretório do manifesto do projeto
    let _manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    
    println!("cargo:warning=Usando implementação stub do Prisma Client Rust");
    println!("cargo:warning=Veja README-PRISMA.md para instruções sobre migração futura");
    
    // Executar o build do Tauri
    tauri_build::build();
}
