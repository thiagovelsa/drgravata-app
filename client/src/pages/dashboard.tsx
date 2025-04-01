import { useQuery } from "@tanstack/react-query";
import DeadlinesCard from "@/components/dashboard/DeadlinesCard";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentCasesCard from "@/components/dashboard/RecentCasesCard";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";
import CaseDetailCard from "@/components/dashboard/CaseDetailCard";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: deadlines, isLoading: isLoadingDeadlines } = useQuery({
    queryKey: ["/api/deadlines/upcoming/7"],
  });

  const { data: cases, isLoading: isLoadingCases } = useQuery({
    queryKey: ["/api/cases"],
  });

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ["/api/clients"],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Deadlines Card */}
      {isLoadingDeadlines ? (
        <div className="bg-white rounded-lg shadow-card col-span-1 lg:col-span-2 p-6">
          <Skeleton className="h-8 w-52 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <DeadlinesCard deadlines={deadlines || []} />
      )}
      
      {/* Stats Card */}
      {isLoadingClients || isLoadingCases || isLoadingDeadlines ? (
        <div className="bg-white rounded-lg shadow-card p-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <StatsCard 
          stats={{
            clientsCount: clients?.length || 0,
            casesCount: cases?.length || 0,
            activeCount: cases?.filter(c => c.status === "active").length || 0,
            deadlinesCount: deadlines?.length || 0,
            overdueCount: deadlines?.filter(d => d.status === "overdue").length || 0,
            documentsCount: 389, // This would come from another API call
          }}
        />
      )}
      
      {/* Recent Cases Card */}
      {isLoadingCases ? (
        <div className="bg-white rounded-lg shadow-card col-span-1 lg:col-span-2 p-6">
          <Skeleton className="h-8 w-72 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
        <RecentCasesCard cases={cases || []} clients={clients || []} />
      )}
      
      {/* AI Assistant Card */}
      <AIAssistantCard />

      {/* Case Detail Card */}
      {isLoadingCases ? (
        <div className="bg-white rounded-lg shadow-card col-span-1 lg:col-span-3 p-6">
          <Skeleton className="h-8 w-52 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      ) : (
        cases && cases.length > 0 && <CaseDetailCard caseId={cases[0].id} />
      )}
    </div>
  );
};

export default Dashboard;
