import {
  users, User, InsertUser,
  clients, Client, InsertClient,
  cases, Case, InsertCase,
  caseUpdates, CaseUpdate, InsertCaseUpdate,
  deadlines, Deadline, InsertDeadline,
  documents, Document, InsertDocument
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Case operations
  getCases(): Promise<Case[]>;
  getCase(id: number): Promise<Case | undefined>;
  getCasesByClient(clientId: number): Promise<Case[]>;
  createCase(legalCase: InsertCase): Promise<Case>;
  updateCase(id: number, legalCase: Partial<InsertCase>): Promise<Case | undefined>;
  deleteCase(id: number): Promise<boolean>;
  
  // Case update operations
  getCaseUpdates(caseId: number): Promise<CaseUpdate[]>;
  createCaseUpdate(update: InsertCaseUpdate): Promise<CaseUpdate>;
  
  // Deadline operations
  getDeadlines(): Promise<Deadline[]>;
  getUpcomingDeadlines(days: number): Promise<Deadline[]>;
  getDeadlinesByCaseId(caseId: number): Promise<Deadline[]>;
  createDeadline(deadline: InsertDeadline): Promise<Deadline>;
  updateDeadline(id: number, deadline: Partial<InsertDeadline>): Promise<Deadline | undefined>;
  deleteDeadline(id: number): Promise<boolean>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByCaseId(caseId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private cases: Map<number, Case>;
  private caseUpdates: Map<number, CaseUpdate>;
  private deadlines: Map<number, Deadline>;
  private documents: Map<number, Document>;
  
  // Current IDs for auto-increment
  private currentUserId: number;
  private currentClientId: number;
  private currentCaseId: number;
  private currentCaseUpdateId: number;
  private currentDeadlineId: number;
  private currentDocumentId: number;
  
  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.cases = new Map();
    this.caseUpdates = new Map();
    this.deadlines = new Map();
    this.documents = new Map();
    
    this.currentUserId = 1;
    this.currentClientId = 1;
    this.currentCaseId = 1;
    this.currentCaseUpdateId = 1;
    this.currentDeadlineId = 1;
    this.currentDocumentId = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async createClient(client: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }
  
  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const existingClient = this.clients.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient = { ...existingClient, ...client };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  // Case methods
  async getCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }
  
  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }
  
  async getCasesByClient(clientId: number): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(
      (legalCase) => legalCase.clientId === clientId,
    );
  }
  
  async createCase(legalCase: InsertCase): Promise<Case> {
    const id = this.currentCaseId++;
    const newCase: Case = { ...legalCase, id };
    this.cases.set(id, newCase);
    return newCase;
  }
  
  async updateCase(id: number, legalCase: Partial<InsertCase>): Promise<Case | undefined> {
    const existingCase = this.cases.get(id);
    if (!existingCase) return undefined;
    
    const updatedCase = { ...existingCase, ...legalCase };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }
  
  async deleteCase(id: number): Promise<boolean> {
    return this.cases.delete(id);
  }
  
  // Case update methods
  async getCaseUpdates(caseId: number): Promise<CaseUpdate[]> {
    return Array.from(this.caseUpdates.values())
      .filter((update) => update.caseId === caseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createCaseUpdate(update: InsertCaseUpdate): Promise<CaseUpdate> {
    const id = this.currentCaseUpdateId++;
    const newUpdate: CaseUpdate = { ...update, id };
    this.caseUpdates.set(id, newUpdate);
    return newUpdate;
  }
  
  // Deadline methods
  async getDeadlines(): Promise<Deadline[]> {
    return Array.from(this.deadlines.values());
  }
  
  async getUpcomingDeadlines(days: number): Promise<Deadline[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return Array.from(this.deadlines.values())
      .filter((deadline) => {
        const dueDate = new Date(deadline.dueDate);
        return dueDate >= now && dueDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  
  async getDeadlinesByCaseId(caseId: number): Promise<Deadline[]> {
    return Array.from(this.deadlines.values())
      .filter((deadline) => deadline.caseId === caseId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  
  async createDeadline(deadline: InsertDeadline): Promise<Deadline> {
    const id = this.currentDeadlineId++;
    const newDeadline: Deadline = { ...deadline, id };
    this.deadlines.set(id, newDeadline);
    return newDeadline;
  }
  
  async updateDeadline(id: number, deadline: Partial<InsertDeadline>): Promise<Deadline | undefined> {
    const existingDeadline = this.deadlines.get(id);
    if (!existingDeadline) return undefined;
    
    const updatedDeadline = { ...existingDeadline, ...deadline };
    this.deadlines.set(id, updatedDeadline);
    return updatedDeadline;
  }
  
  async deleteDeadline(id: number): Promise<boolean> {
    return this.deadlines.delete(id);
  }
  
  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentsByCaseId(caseId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter((document) => document.caseId === caseId);
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const newDocument: Document = { 
      ...document, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;
    
    const now = new Date();
    const updatedDocument = { 
      ...existingDocument, 
      ...document, 
      updatedAt: now 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Initialize with sample data
  private initializeData() {
    // Add a demo user
    this.createUser({
      username: "demo",
      password: "password", // In a real app, this would be hashed
      fullName: "Maria Gravata",
      email: "maria@drgravata.com",
    });
    
    // Add some clients
    const client1 = this.createClient({
      name: "Empresa ABC Ltda.",
      documentNumber: "12.345.678/0001-99",
      clientType: "PJ",
      phone: "(11) 5555-1234",
      email: "contato@empresaabc.com",
      address: "Av. Paulista, 1000, São Paulo - SP",
      active: true,
      notes: "Cliente desde 2021",
    });
    
    const client2 = this.createClient({
      name: "João Silva",
      documentNumber: "123.456.789-00",
      clientType: "PF",
      phone: "(11) 98765-4321",
      email: "joao.silva@email.com",
      address: "Rua das Flores, 123, São Paulo - SP",
      active: true,
      notes: "Indicação do Dr. Carlos",
    });
    
    const client3 = this.createClient({
      name: "Indústrias XYZ S/A",
      documentNumber: "23.456.789/0001-88",
      clientType: "PJ",
      phone: "(11) 5555-9876",
      email: "contato@industriasxyz.com",
      address: "Av. Brasil, 500, São Paulo - SP",
      active: true,
      notes: "",
    });
    
    // Add some cases
    Promise.all([client1, client2, client3]).then(([c1, c2, c3]) => {
      // Case 1
      this.createCase({
        caseNumber: "0001234-12.2023.8.26.0100",
        clientId: c1.id,
        court: "Foro Central Cível",
        jurisdiction: "10ª Vara Cível",
        caseType: "Ação de Cobrança",
        status: "active",
        filingDate: new Date("2023-07-05"),
        caseValue: "150000",
        description: "Ação de cobrança contra devedor",
        notes: "",
      }).then(case1 => {
        // Add case updates
        this.createCaseUpdate({
          caseId: case1.id,
          updateType: "Distribuição",
          title: "Distribuição",
          description: "Distribuído por sorteio para a 10ª Vara Cível",
          date: new Date("2023-07-05T11:30:00"),
          recordedBy: "Sistema",
          isImportant: false,
        });
        
        this.createCaseUpdate({
          caseId: case1.id,
          updateType: "Despacho",
          title: "Despacho - Cite-se",
          description: "Cite-se a parte requerida para, querendo, apresentar contestação no prazo legal.",
          date: new Date("2023-07-10T09:55:00"),
          recordedBy: "Maria Gravata",
          isImportant: true,
        });
        
        this.createCaseUpdate({
          caseId: case1.id,
          updateType: "Citação",
          title: "Citação Realizada",
          description: "Requerido citado em 15/07/2023",
          date: new Date("2023-07-15T16:40:00"),
          recordedBy: "Sistema",
          isImportant: false,
        });
        
        this.createCaseUpdate({
          caseId: case1.id,
          updateType: "Petição",
          title: "Petição Juntada - Contestação",
          description: "Juntada de contestação pela parte requerida",
          date: new Date("2023-07-28T10:15:00"),
          recordedBy: "Maria Gravata",
          isImportant: false,
        });
        
        this.createCaseUpdate({
          caseId: case1.id,
          updateType: "Publicação",
          title: "Publicação - Despacho Inicial",
          description: "Vistos. Para apreciação do pedido liminar, manifeste-se a parte autora sobre a contestação apresentada, no prazo de 15 dias.",
          date: new Date("2023-08-02T14:25:00"),
          recordedBy: "Maria Gravata",
          isImportant: true,
        });
        
        // Add deadlines
        this.createDeadline({
          caseId: case1.id,
          title: "Recurso de Apelação",
          description: "Protocolar recurso de apelação contra sentença",
          dueDate: new Date("2023-08-10"),
          status: "pending",
          priority: "high",
          isWorkingDays: true,
          assignedTo: "Maria Gravata",
        });
        
        this.createDeadline({
          caseId: case1.id,
          title: "Audiência de Instrução",
          description: "Audiência de instrução e julgamento",
          dueDate: new Date("2023-08-25"),
          status: "pending",
          priority: "medium",
          isWorkingDays: false,
          assignedTo: "Maria Gravata",
        });
        
        // Add documents
        this.createDocument({
          caseId: case1.id,
          title: "Petição Inicial",
          documentType: "Petição",
          content: "Conteúdo da petição inicial...",
          createdBy: "Maria Gravata",
          status: "finalized",
        });
        
        this.createDocument({
          caseId: case1.id,
          title: "Procuração",
          documentType: "Documento",
          content: "Conteúdo da procuração...",
          createdBy: "Maria Gravata",
          status: "finalized",
        });
      });
      
      // Case 2
      this.createCase({
        caseNumber: "0002345-67.2023.8.26.0100",
        clientId: c2.id,
        court: "Foro Regional I - Santana",
        jurisdiction: "2ª Vara Cível",
        caseType: "Ação de Indenização",
        status: "active",
        filingDate: new Date("2023-06-15"),
        caseValue: "50000",
        description: "Ação de indenização por danos morais",
        notes: "",
      }).then(case2 => {
        // Add case updates
        this.createCaseUpdate({
          caseId: case2.id,
          updateType: "Intimação",
          title: "Intimação - Audiência Designada",
          description: "Designada audiência de conciliação para o dia 10/08/2023, às 14h",
          date: new Date("2023-08-01T10:00:00"),
          recordedBy: "Maria Gravata",
          isImportant: true,
        });
        
        // Add deadlines
        this.createDeadline({
          caseId: case2.id,
          title: "Audiência de Conciliação",
          description: "Audiência de conciliação no Fórum Central",
          dueDate: new Date("2023-08-10T14:00:00"),
          status: "pending",
          priority: "medium",
          isWorkingDays: false,
          assignedTo: "Maria Gravata",
        });
      });
      
      // Case 3
      this.createCase({
        caseNumber: "0003456-78.2023.8.26.0100",
        clientId: c3.id,
        court: "Foro Central Cível",
        jurisdiction: "5ª Vara Cível",
        caseType: "Ação Declaratória",
        status: "active",
        filingDate: new Date("2023-07-20"),
        caseValue: "200000",
        description: "Ação declaratória de inexistência de débito",
        notes: "",
      }).then(case3 => {
        // Add case updates
        this.createCaseUpdate({
          caseId: case3.id,
          updateType: "Publicação",
          title: "Publicação - Sentença Desfavorável",
          description: "Julgo improcedente o pedido formulado na inicial...",
          date: new Date("2023-07-30T16:00:00"),
          recordedBy: "Maria Gravata",
          isImportant: true,
        });
        
        // Add deadlines
        this.createDeadline({
          caseId: case3.id,
          title: "Recurso",
          description: "Prazo para recurso de apelação",
          dueDate: new Date("2023-08-20"),
          status: "pending",
          priority: "high",
          isWorkingDays: true,
          assignedTo: "Maria Gravata",
        });
      });
      
      // Case 4
      this.createCase({
        caseNumber: "0004567-89.2023.8.26.0100",
        clientId: c2.id,
        court: "Foro Regional II - Santo Amaro",
        jurisdiction: "3ª Vara Cível",
        caseType: "Execução de Título Extrajudicial",
        status: "active",
        filingDate: new Date("2023-07-01"),
        caseValue: "75000",
        description: "Execução de título extrajudicial",
        notes: "",
      }).then(case4 => {
        // Add case updates
        this.createCaseUpdate({
          caseId: case4.id,
          updateType: "Petição",
          title: "Petição Juntada - Manifestação",
          description: "Juntada de manifestação sobre penhora",
          date: new Date("2023-07-29T09:30:00"),
          recordedBy: "Maria Gravata",
          isImportant: false,
        });
      });
      
      // Case 5
      this.createCase({
        caseNumber: "0005678-90.2023.8.26.0100",
        clientId: c1.id,
        court: "Foro Central Cível",
        jurisdiction: "8ª Vara Cível",
        caseType: "Monitória",
        status: "active",
        filingDate: new Date("2023-07-25"),
        caseValue: "45000",
        description: "Ação monitória baseada em cheques sem força executiva",
        notes: "",
      }).then(case5 => {
        // Add deadlines
        this.createDeadline({
          caseId: case5.id,
          title: "Contestação",
          description: "Apresentar contestação na ação de cobrança",
          dueDate: new Date("2023-08-01"),
          status: "overdue",
          priority: "high",
          isWorkingDays: true,
          assignedTo: "Maria Gravata",
        });
      });
    });
  }
}

export const storage = new MemStorage();
