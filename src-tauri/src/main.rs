// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Declaração dos módulos criados
pub mod prisma;
mod error;
mod db;
mod commands;

// Função greet que já existia
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Função principal
#[tokio::main]
async fn main() { // Alterado: Não retorna mais Result
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet, 
            commands::criar_cliente,
            commands::listar_clientes,
            commands::obter_cliente,
            commands::atualizar_cliente,
            commands::deletar_cliente
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
