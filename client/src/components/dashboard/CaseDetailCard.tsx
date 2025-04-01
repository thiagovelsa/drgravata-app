import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Clock, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface CaseDetailCardProps {
  caseId: number;
}

const CaseDetailCard: React.FC<CaseDetailCardProps> = ({ caseId }) => {
  const { data: legalCase, isLoading: isCaseLoading } = useQuery({
    queryKey: [`/api/cases/${caseId}`],
  });

  const { data: client, isLoading: isClientLoading } = useQuery({
    queryKey: [legalCase ? `/api/clients/${legalCase.clientId}` : null],
    enabled: !!legalCase,
  });

  const { data: updates, isLoading: isUpdatesLoading } = useQuery({
    queryKey: [`/api/cases/${caseId}/updates`],
  });

  const { data: deadlines, isLoading: isDeadlinesLoading } = useQuery({
    queryKey: [`/api/cases/${caseId}/deadlines`],
  });

  const isLoading = isCaseLoading || isClientLoading || isUpdatesLoading || isDeadlinesLoading;

  // Sort updates by date (newest first)
  const sortedUpdates = updates ? [...updates].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }) : [];

  // Get the upcoming deadlines (sorted by due date)
  const upcomingDeadlines = deadlines ? [...deadlines]
    .filter(d => d.status !== "completed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2) : [];

  return (
    <Card className="col-span-1 lg:col-span-3 shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">Detalhe de Processo</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-[300px] w-full mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[520px] w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {/* Process Information */}
              <div className="p-4 rounded-lg border border-gray-200 mb-4">
                <h4 className="font-heading text-sm font-semibold mb-3 text-primary">Informações do Processo</h4>
                
                <div className="space-y-3">
                  <InfoItem label="Número CNJ" value={legalCase.caseNumber} />
                  <InfoItem label="Cliente" value={client?.name || "Carregando..."} />
                  <InfoItem label="Tipo de Ação" value={legalCase.caseType} />
                  <InfoItem label="Comarca / Vara" value={`${legalCase.court} / ${legalCase.jurisdiction}`} />
                  <InfoItem label="Valor da Causa" value={`R$ ${parseFloat(legalCase.caseValue || "0").toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <StatusItem status={legalCase.status} />
                </div>
              </div>
              
              {/* Upcoming Deadlines */}
              <div className="p-4 rounded-lg border border-gray-200">
                <h4 className="font-heading text-sm font-semibold mb-3 text-primary">Próximos Prazos</h4>
                
                <div className="space-y-3">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map(deadline => (
                      <div key={deadline.id} className="flex items-center p-2 rounded hover:bg-gray-50">
                        <div className={cn(
                          "w-10 h-10 rounded flex items-center justify-center mr-3",
                          deadline.priority === "high" 
                            ? "bg-warning bg-opacity-10 text-warning" 
                            : "bg-success bg-opacity-10 text-success"
                        )}>
                          {deadline.isWorkingDays ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <Calendar className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{deadline.title}</p>
                          <p className="text-xs text-gray-500">{format(new Date(deadline.dueDate), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhum prazo pendente</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {/* Case Timeline */}
              <div className="p-4 rounded-lg border border-gray-200">
                <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Andamentos do Processo</h4>
                
                <div className="relative pl-6">
                  {sortedUpdates.map((update, index) => (
                    <div key={update.id} className={cn(
                      "timeline-item relative mb-6 pl-6",
                      index === sortedUpdates.length - 1 && "last"
                    )}>
                      <div className="timeline-dot"></div>
                      <div>
                        <p className="text-sm font-medium mb-1">{update.title}</p>
                        <p className="text-xs text-gray-600 mb-2">{update.updateType}</p>
                        {update.description && (
                          <div className="p-3 rounded-lg bg-background text-sm mb-2">
                            <p>{update.description}</p>
                          </div>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{format(new Date(update.date), "dd/MM/yyyy 'às' HH:mm")}</span>
                          <span className="mx-2">•</span>
                          <span>Registrado por {update.recordedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sortedUpdates.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Nenhum andamento registrado</p>
                  )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <Button variant="link" className="text-accent hover:text-accent-light transition-colors duration-200 p-0">
                    Ver histórico completo
                  </Button>
                  
                  <Button className="bg-accent hover:bg-accent-light shadow-sm flex items-center transition-all duration-200 hover:translate-y-[-1px]">
                    <FileText className="h-4 w-4 mr-1" />
                    Novo Andamento
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
};

interface StatusItemProps {
  status: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ status }) => {
  const getStatusLabel = (status: string) => {
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "closed":
        return "bg-gray-400";
      case "archived":
        return "bg-accent";
      case "on_hold":
        return "bg-warning";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">Status</p>
      <div className="flex items-center">
        <span className={cn(
          "h-2 w-2 flex-shrink-0 rounded-full mr-2",
          getStatusColor(status)
        )}></span>
        <span className="text-sm font-medium">{getStatusLabel(status)}</span>
      </div>
    </div>
  );
};

export default CaseDetailCard;
