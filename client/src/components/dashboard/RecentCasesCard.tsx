import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Case, Client } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface RecentCasesCardProps {
  cases: Case[];
  clients: Client[];
}

const RecentCasesCard: React.FC<RecentCasesCardProps> = ({ cases, clients }) => {
  const { data: caseUpdates } = useQuery({
    queryKey: ["/api/cases/1/updates"],
  });

  // Sort cases by filing date (newest first)
  const sortedCases = [...cases].sort((a, b) => {
    return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
  });

  // Get client name by ID
  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente não encontrado";
  };

  // Get update type status (color)
  const getUpdateTypeStatus = (type: string) => {
    switch (type.toLowerCase()) {
      case "publicação":
        return "bg-success";
      case "intimação":
        return "bg-warning";
      case "petição":
        return "bg-success";
      case "citação":
        return "bg-accent";
      case "despacho":
        return "bg-accent";
      case "distribuição":
        return "bg-accent";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">Últimas Atualizações de Processos</h3>
          <div>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary transition-colors">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Movimentação</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCases.slice(0, 4).map((legalCase) => {
                // Find any updates for this case
                const update = caseUpdates?.find(u => u.caseId === legalCase.id);
                
                return (
                  <TableRow key={legalCase.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell className="whitespace-nowrap text-sm font-medium">
                      <Link href={`/cases/${legalCase.id}`}>
                        <a className="text-accent hover:underline">{legalCase.caseNumber}</a>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-700">
                      {getClientName(legalCase.clientId)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      <div className="flex items-center">
                        <span className={cn(
                          "h-2 w-2 flex-shrink-0 rounded-full mr-2",
                          update ? getUpdateTypeStatus(update.updateType) : "bg-gray-400"
                        )}></span>
                        <span>
                          {update 
                            ? `${update.updateType} - ${update.title.split(' - ')[1] || ''}`
                            : "Distribuição Inicial"
                          }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      <time dateTime={legalCase.filingDate.toString()}>
                        {format(new Date(legalCase.filingDate), 'dd/MM/yyyy')}
                      </time>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href="/cases">
            <a className="text-sm font-medium text-accent hover:text-accent-light transition-colors duration-200">
              Ver todos os processos
              <ChevronRight className="h-4 w-4 inline ml-1" />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCasesCard;
