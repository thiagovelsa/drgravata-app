import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, CheckCircle, Clock, List, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, addDays, isAfter, isBefore, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const DeadlinesList = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { data: deadlines, isLoading, isError } = useQuery({
    queryKey: ["/api/deadlines"],
  });
  
  const { data: cases, isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/cases"],
  });
  
  // Get case number by ID
  const getCaseNumber = (caseId: number | null) => {
    if (!caseId) return "Sem processo vinculado";
    const legalCase = cases?.find(c => c.id === caseId);
    return legalCase ? legalCase.caseNumber : "Processo não encontrado";
  };
  
  // Group deadlines by date categories
  const groupedDeadlines = deadlines?.reduce((acc: Record<string, any[]>, deadline) => {
    const dueDate = new Date(deadline.dueDate);
    const now = new Date();
    
    let category;
    if (deadline.status === "completed") {
      category = "completed";
    } else if (deadline.status === "overdue" || isBefore(dueDate, now)) {
      category = "overdue";
    } else if (isToday(dueDate)) {
      category = "today";
    } else if (isTomorrow(dueDate)) {
      category = "tomorrow";
    } else if (isBefore(dueDate, addDays(now, 7))) {
      category = "thisWeek";
    } else {
      category = "upcoming";
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(deadline);
    return acc;
  }, {});
  
  const getDeadlineStatusColor = (deadline: any) => {
    const dueDate = new Date(deadline.dueDate);
    const now = new Date();
    
    if (deadline.status === "completed") return "border-success bg-success/10";
    if (deadline.status === "overdue" || isBefore(dueDate, now)) return "border-danger bg-danger/10";
    
    const daysUntil = differenceInDays(dueDate, now);
    if (daysUntil <= 2) return "border-warning bg-warning/10";
    return "border-accent bg-accent/10";
  };
  
  const getDeadlineIcon = (deadline: any) => {
    const dueDate = new Date(deadline.dueDate);
    const now = new Date();
    
    if (deadline.status === "completed") return <CheckCircle className="h-6 w-6 text-success" />;
    if (deadline.status === "overdue" || isBefore(dueDate, now)) return <AlertTriangle className="h-6 w-6 text-danger" />;
    
    const daysUntil = differenceInDays(dueDate, now);
    if (daysUntil <= 2) return <Clock className="h-6 w-6 text-warning" />;
    return <CalendarIcon className="h-6 w-6 text-accent" />;
  };
  
  const getDaysBadge = (deadline: any) => {
    const dueDate = new Date(deadline.dueDate);
    const now = new Date();
    
    if (deadline.status === "completed") return <Badge variant="outline">Concluído</Badge>;
    if (deadline.status === "overdue" || isBefore(dueDate, now)) return <Badge variant="destructive">Atrasado</Badge>;
    
    const daysUntil = differenceInDays(dueDate, now);
    if (daysUntil === 0) return <Badge variant="warning">Hoje</Badge>;
    if (daysUntil === 1) return <Badge variant="warning">Amanhã</Badge>;
    return <Badge variant="outline">{daysUntil} dias</Badge>;
  };
  
  // Filter deadlines for the selected date in calendar view
  const calendarDeadlines = deadlines?.filter(deadline => {
    if (!selectedDate) return false;
    const deadlineDate = new Date(deadline.dueDate);
    return (
      deadlineDate.getDate() === selectedDate.getDate() &&
      deadlineDate.getMonth() === selectedDate.getMonth() &&
      deadlineDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-heading text-lg font-semibold">Prazos</CardTitle>
            <CardDescription>Gerencie os prazos processuais e compromissos</CardDescription>
          </div>
          <div className="flex gap-2">
            <Tabs defaultValue="list" value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
              <TabsList>
                <TabsTrigger value="list" onClick={() => setView("list")}>
                  <List className="h-4 w-4 mr-2" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="calendar" onClick={() => setView("calendar")}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendário
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="bg-accent hover:bg-accent-light">
              Novo Prazo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || isLoadingCases ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Erro ao carregar prazos. Tente novamente mais tarde.
            </div>
          ) : (
            <>
              {view === "list" ? (
                // List View
                <div className="space-y-6">
                  {/* Overdue Deadlines */}
                  {groupedDeadlines?.overdue && groupedDeadlines.overdue.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-destructive flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Prazos Atrasados
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.overdue.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4 border-danger"
                          )}>
                            <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg bg-danger/10 flex items-center justify-center">
                              {getDeadlineIcon(deadline)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                <Badge variant="destructive">Atrasado</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Today's Deadlines */}
                  {groupedDeadlines?.today && groupedDeadlines.today.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-warning flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Hoje
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.today.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4 border-warning"
                          )}>
                            <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg bg-warning/10 flex items-center justify-center">
                              {getDeadlineIcon(deadline)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                <Badge variant="warning">Hoje</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tomorrow's Deadlines */}
                  {groupedDeadlines?.tomorrow && groupedDeadlines.tomorrow.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-primary flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Amanhã
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.tomorrow.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4 border-warning"
                          )}>
                            <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg bg-warning/10 flex items-center justify-center">
                              {getDeadlineIcon(deadline)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                <Badge variant="outline">Amanhã</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* This Week's Deadlines */}
                  {groupedDeadlines?.thisWeek && groupedDeadlines.thisWeek.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-primary flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Esta Semana
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.thisWeek.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4",
                            getDeadlineStatusColor(deadline)
                          )}>
                            <div className={cn(
                              "mr-4 h-12 w-12 flex-shrink-0 rounded-lg flex items-center justify-center",
                              deadline.status === "overdue" ? "bg-danger/10" : "bg-accent/10"
                            )}>
                              {getDeadlineIcon(deadline)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                {getDaysBadge(deadline)}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(deadline.dueDate), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming Deadlines */}
                  {groupedDeadlines?.upcoming && groupedDeadlines.upcoming.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-primary flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Próximos Prazos
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.upcoming.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4 border-success"
                          )}>
                            <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg bg-success/10 flex items-center justify-center">
                              {getDeadlineIcon(deadline)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                {getDaysBadge(deadline)}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(deadline.dueDate), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Completed Deadlines */}
                  {groupedDeadlines?.completed && groupedDeadlines.completed.length > 0 && (
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-3 text-primary flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluídos
                      </h3>
                      <div className="space-y-3">
                        {groupedDeadlines.completed.map((deadline: any) => (
                          <div key={deadline.id} className={cn(
                            "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                            "border-l-4 border-success"
                          )}>
                            <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg bg-success/10 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-success" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-primary truncate">{deadline.title} - Proc. nº {getCaseNumber(deadline.caseId)}</p>
                                <Badge variant="outline">Concluído</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 truncate">{deadline.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(deadline.dueDate), "dd/MM/yyyy")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Calendar View
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        hasDeadline: deadlines?.map(d => new Date(d.dueDate)) || [],
                      }}
                      modifiersClassNames={{
                        hasDeadline: "bg-accent/20 font-bold text-accent",
                      }}
                    />
                  </div>
                  <div className="md:w-1/2">
                    <div className="border rounded-md p-4">
                      <h3 className="font-heading text-base font-semibold mb-4">
                        {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </h3>
                      
                      {calendarDeadlines && calendarDeadlines.length > 0 ? (
                        <div className="space-y-3">
                          {calendarDeadlines.map((deadline) => (
                            <div key={deadline.id} className={cn(
                              "flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200",
                              "border-l-4",
                              getDeadlineStatusColor(deadline)
                            )}>
                              <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-accent/10">
                                {getDeadlineIcon(deadline)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className="font-medium text-primary truncate">{deadline.title}</p>
                                  {getDaysBadge(deadline)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate">
                                  {deadline.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Processo: {getCaseNumber(deadline.caseId)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          Nenhum prazo para esta data.
                        </div>
                      )}
                    </div>
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

export default DeadlinesList;
