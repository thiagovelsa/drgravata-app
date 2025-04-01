import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Eye, 
  Pencil, 
  Calendar, 
  FileText,
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const CasesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data: cases, isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/cases"],
  });
  
  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });
  
  const isLoading = isLoadingCases || isLoadingClients;
  
  // Get client name by ID
  const getClientName = (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.name : "Cliente não encontrado";
  };
  
  // Filter cases based on search term
  const filteredCases = cases?.filter(legalCase => 
    legalCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (clients && getClientName(legalCase.clientId).toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Paginate cases
  const paginatedCases = filteredCases?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = filteredCases ? Math.ceil(filteredCases.length / itemsPerPage) : 0;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      case "archived":
        return "bg-blue-500";
      case "on_hold":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };
  
  const formatCaseStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Em andamento";
      case "closed":
        return "Encerrado";
      case "archived":
        return "Arquivado";
      case "on_hold":
        return "Suspenso";
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg font-semibold">Processos</CardTitle>
          <Button className="bg-accent hover:bg-accent-light">
            Novo Processo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar por número do processo ou cliente..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número CNJ</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vara/Comarca</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Inicial</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCases && paginatedCases.length > 0 ? (
                      paginatedCases.map((legalCase) => (
                        <TableRow key={legalCase.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <TableCell className="font-medium text-accent">{legalCase.caseNumber}</TableCell>
                          <TableCell>{clients && getClientName(legalCase.clientId)}</TableCell>
                          <TableCell>{legalCase.jurisdiction}</TableCell>
                          <TableCell>{legalCase.caseType}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full ${getStatusColor(legalCase.status)} mr-2`}></span>
                              <span>{formatCaseStatus(legalCase.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(legalCase.filingDate), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Nenhum processo encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredCases?.length || 0)} de {filteredCases?.length} processos
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CasesList;
