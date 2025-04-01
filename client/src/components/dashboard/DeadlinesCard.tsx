import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Deadline } from "@shared/schema";
import { format, isBefore, isToday, isTomorrow } from "date-fns";
import { ChevronRight, Clock, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface DeadlinesCardProps {
  deadlines: Deadline[];
}

const DeadlinesCard: React.FC<DeadlinesCardProps> = ({ deadlines }) => {
  const { data: cases } = useQuery({
    queryKey: ["/api/cases"],
  });

  // Sort deadlines by due date
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Get case number by ID
  const getCaseNumber = (caseId: number | null) => {
    if (!caseId) return "Sem processo";
    const legalCase = cases?.find(c => c.id === caseId);
    return legalCase ? legalCase.caseNumber : "Processo não encontrado";
  };

  // Get deadline status info
  const getDeadlineInfo = (deadline: Deadline) => {
    const dueDate = new Date(deadline.dueDate);
    const now = new Date();
    
    if (deadline.status === "completed") {
      return {
        label: "Concluído",
        color: "border-success",
        bgColor: "bg-success",
        iconBg: "bg-success bg-opacity-10",
        textColor: "text-success"
      };
    }
    
    if (deadline.status === "overdue" || isBefore(dueDate, now)) {
      return {
        label: "Atrasado",
        color: "border-danger",
        bgColor: "bg-danger",
        iconBg: "bg-danger bg-opacity-10",
        textColor: "text-danger"
      };
    }
    
    if (isToday(dueDate)) {
      return {
        label: "Hoje",
        color: "border-warning",
        bgColor: "bg-warning",
        iconBg: "bg-warning bg-opacity-10",
        textColor: "text-warning"
      };
    }
    
    if (isTomorrow(dueDate)) {
      return {
        label: "Amanhã",
        color: "border-warning",
        bgColor: "bg-warning",
        iconBg: "bg-warning bg-opacity-10",
        textColor: "text-warning"
      };
    }
    
    return {
      label: `${Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} dias`,
      color: "border-success",
      bgColor: "bg-success",
      iconBg: "bg-success bg-opacity-10",
      textColor: "text-success"
    };
  };

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">Prazos dos Próximos 7 Dias</h3>
          <span className="text-xs font-medium text-gray-500">{deadlines.length} prazos pendentes</span>
        </div>
        
        <div className="space-y-4">
          {sortedDeadlines.slice(0, 3).map((deadline) => {
            const info = getDeadlineInfo(deadline);
            
            return (
              <div 
                key={deadline.id}
                className={cn(
                  "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                  "border-l-4", 
                  info.color
                )}
              >
                <div className={cn(
                  "mr-4 h-12 w-12 flex-shrink-0 rounded-lg flex items-center justify-center",
                  info.iconBg
                )}>
                  <Clock className={cn("h-6 w-6", info.textColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-primary truncate">
                      {deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}
                    </p>
                    <span className={cn("font-medium text-sm", info.textColor)}>
                      {info.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {deadline.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <Link href="/deadlines">
            <a className="text-sm font-medium text-accent hover:text-accent-light transition-colors duration-200">
              Ver todos os prazos
              <ChevronRight className="h-4 w-4 inline ml-1" />
            </a>
          </Link>
          
          <Button 
            className="bg-accent hover:bg-accent-light shadow-sm flex items-center transition-all duration-200 hover:translate-y-[-1px]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Prazo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeadlinesCard;
