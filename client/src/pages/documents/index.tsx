import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  FileText, 
  Copy, 
  Edit, 
  Trash2,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DocumentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["/api/documents"],
  });
  
  const { data: cases, isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/cases"],
  });
  
  const isLoading = isLoadingDocuments || isLoadingCases;
  
  // Get case number by ID
  const getCaseNumber = (caseId: number | null) => {
    if (!caseId) return "Sem processo vinculado";
    const legalCase = cases?.find(c => c.id === caseId);
    return legalCase ? legalCase.caseNumber : "Processo não encontrado";
  };
  
  // Filter documents based on search term
  const filteredDocuments = documents?.filter(document => 
    document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (document.caseId && getCaseNumber(document.caseId).includes(searchTerm))
  );
  
  // Apply tab filter
  const tabFilteredDocuments = activeTab === "all" 
    ? filteredDocuments
    : filteredDocuments?.filter(document => document.documentType.toLowerCase() === activeTab);
  
  // Get unique document types for tabs
  const documentTypes = documents
    ? Array.from(new Set(documents.map(doc => doc.documentType.toLowerCase())))
    : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg font-semibold">Peças Jurídicas</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline">
              Biblioteca de Modelos
            </Button>
            <Button className="bg-accent hover:bg-accent-light">
              Nova Peça
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por título, tipo ou processo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {documentTypes.map(type => (
                <TabsTrigger key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : tabFilteredDocuments && tabFilteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tabFilteredDocuments.map(document => (
                    <div 
                      key={document.id} 
                      className="card bg-white rounded-lg shadow-card hover:shadow-elevated transition-all duration-300 hover:translate-y-[-2px]"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center mr-3",
                              "bg-accent/10 text-accent"
                            )}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-primary">{document.title}</h3>
                              <p className="text-xs text-gray-500">{document.documentType}</p>
                            </div>
                          </div>
                          <Badge status={document.status} />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {document.content.substring(0, 120)}...
                        </p>
                        
                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          {document.caseId && (
                            <p className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              Processo: {getCaseNumber(document.caseId)}
                            </p>
                          )}
                          <p className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Criado em: {format(new Date(document.createdAt), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Copy className="h-3 w-3 mr-1" />
                            Duplicar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma peça jurídica encontrada</h3>
                  <p>Crie uma nova peça ou tente outros critérios de busca.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Badge component for document status
const Badge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "finalized":
        return "bg-success/10 text-success";
      case "filed":
        return "bg-accent/10 text-accent";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "finalized":
        return "Finalizado";
      case "filed":
        return "Protocolado";
      default:
        return status;
    }
  };
  
  return (
    <span className={cn(
      "text-xs font-medium px-2 py-1 rounded-full",
      getStatusColor(status)
    )}>
      {getStatusLabel(status)}
    </span>
  );
};

export default DocumentsList;
