use crate::db::get_prisma_client;
use crate::prisma::{ClienteCreateInput, ClienteWhereUniqueInput, ClienteUpdateInput, Cliente};
use crate::error::Error;
use serde::{Serialize, Deserialize};

// --- Structs para Dados de Entrada/Saída --- 

// Struct para criar um novo cliente (sem ID, pois é gerado)
#[derive(Debug, Deserialize)]
pub struct NovoClienteData {
    nome: String,
    #[serde(default)] // Para campos opcionais no JSON
    cpf_cnpj: Option<String>,
    #[serde(default)]
    email: Option<String>,
    #[serde(default)]
    telefone: Option<String>,
    #[serde(default)]
    endereco: Option<String>,
    #[serde(default)]
    observacao: Option<String>,
}

// Struct para atualizar um cliente existente (todos os campos são opcionais)
#[derive(Debug, Deserialize)]
pub struct AtualizarClienteData {
    #[serde(default)]
    nome: Option<String>,
    #[serde(default)]
    cpf_cnpj: Option<String>,
    #[serde(default)]
    email: Option<String>,
    #[serde(default)]
    telefone: Option<String>,
    #[serde(default)]
    endereco: Option<String>,
    #[serde(default)]
    observacao: Option<String>,
}

// Struct para representar um cliente ao ser enviado para o frontend
// Usamos isso para poder adicionar/modificar campos se necessário, sem expor diretamente o modelo Prisma.
// Por enquanto, é idêntico, mas pode mudar.
#[derive(Serialize)]
pub struct ClienteView {
    id: String,
    nome: String,
    cpf_cnpj: Option<String>,
    email: Option<String>,
    telefone: Option<String>,
    endereco: Option<String>,
    observacao: Option<String>,
    created_at: String, // Enviar como string ISO 8601
    updated_at: String, // Enviar como string ISO 8601
}

// --- Comandos Tauri --- 

#[tauri::command]
pub async fn criar_cliente(data: NovoClienteData) -> Result<ClienteView, String> {
    println!("Recebido pedido para criar cliente: {:?}", data);
    let db = get_prisma_client().await.map_err(|e| format!("{:?}", e))?;

    // Criar o objeto de input
    let create_data = ClienteCreateInput {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        observacao: data.observacao,
    };

    // Criar o cliente (nosso stub retorna diretamente um Result<Cliente, String>)
    let novo_cliente = db.cliente().create(create_data).await;
    if let Err(e) = &novo_cliente {
        return Err(format!("{:?}", Error::DatabaseQuery { source: e.clone() }));
    }
    
    let cliente = novo_cliente.unwrap();
    println!("Cliente criado com ID: {}", cliente.id);
    Ok(cliente_data_to_view(cliente))
}

#[tauri::command]
pub async fn listar_clientes() -> Result<Vec<ClienteView>, String> {
    println!("Recebido pedido para listar clientes");
    let db = get_prisma_client().await.map_err(|e| format!("{:?}", e))?;

    // Listar todos os clientes (nosso stub retorna um Vec<Cliente> diretamente)
    let clientes = db.cliente().find_many().await;
    
    println!("Encontrados {} clientes", clientes.len());
    let views = clientes.into_iter().map(cliente_data_to_view).collect();
    Ok(views)
}

#[tauri::command]
pub async fn obter_cliente(id: String) -> Result<ClienteView, String> {
    println!("Recebido pedido para obter cliente com ID: {}", id);
    let db = get_prisma_client().await.map_err(|e| format!("{:?}", e))?;

    // Buscar pelo ID
    let where_input = ClienteWhereUniqueInput {
        id: Some(id.clone()),
        cpf_cnpj: None,
        email: None,
    };

    // Buscar o cliente (nosso stub retorna Option<Cliente> diretamente)
    let cliente_opt = db.cliente().find_unique(where_input).await;

    match cliente_opt {
        Some(data) => {
            println!("Cliente encontrado: {}", data.nome);
            Ok(cliente_data_to_view(data))
        },
        None => {
            println!("Cliente com ID {} não encontrado", id);
            Err(format!("{:?}", Error::NotFound { entity: "Cliente".to_string(), id }))
        },
    }
}

#[tauri::command]
pub async fn atualizar_cliente(id: String, data: AtualizarClienteData) -> Result<ClienteView, String> {
    println!("Recebido pedido para atualizar cliente com ID: {}", id);
    let db = get_prisma_client().await.map_err(|e| format!("{:?}", e))?;

    // Criar o objeto de input para atualização
    let update_data = ClienteUpdateInput {
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        observacao: data.observacao,
    };

    // Criar o objeto de where
    let where_input = ClienteWhereUniqueInput {
        id: Some(id.clone()),
        cpf_cnpj: None,
        email: None,
    };

    // Atualizar o cliente (nosso stub retorna um Result<Cliente, String>)
    let cliente_result = db.cliente().update(where_input, update_data).await;
    if let Err(e) = &cliente_result {
        return Err(format!("{:?}", Error::DatabaseQuery { source: e.clone() }));
    }
    
    let cliente_atualizado = cliente_result.unwrap();
    println!("Cliente atualizado: {}", cliente_atualizado.nome);
    Ok(cliente_data_to_view(cliente_atualizado))
}

#[tauri::command]
pub async fn deletar_cliente(id: String) -> Result<String, String> { 
    println!("Recebido pedido para deletar cliente com ID: {}", id);
    let db = get_prisma_client().await.map_err(|e| format!("{:?}", e))?;

    // Criar o objeto de where
    let where_input = ClienteWhereUniqueInput {
        id: Some(id.clone()),
        cpf_cnpj: None,
        email: None,
    };

    // Deletar o cliente (nosso stub retorna um Result<Cliente, String>)
    let resultado_result = db.cliente().delete(where_input).await;
    if let Err(e) = &resultado_result {
        return Err(format!("{:?}", Error::DatabaseQuery { source: e.clone() }));
    }
    
    let resultado = resultado_result.unwrap();
    println!("Cliente com ID {} deletado", resultado.id);
    Ok(resultado.id)
}

// --- Função Auxiliar --- 

// Converte o tipo de dados retornado pelo Prisma para nossa struct de visualização
fn cliente_data_to_view(data: Cliente) -> ClienteView {
    ClienteView {
        id: data.id,
        nome: data.nome,
        cpf_cnpj: data.cpf_cnpj,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        observacao: data.observacao,
        created_at: data.created_at.to_rfc3339(),
        updated_at: data.updated_at.to_rfc3339(),
    }
} 