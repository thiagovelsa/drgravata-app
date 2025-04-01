import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  stats: {
    clientsCount: number;
    casesCount: number;
    activeCount: number;
    deadlinesCount: number;
    overdueCount: number;
    documentsCount: number;
  }
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="font-heading text-lg font-semibold mb-6">Visão Geral</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            label="Clientes Ativos"
            value={stats.clientsCount}
            additionalText={`+4 este mês`}
            additionalTextColor="text-success"
            bgColor="bg-primary bg-opacity-5"
            borderColor="border-primary border-opacity-10"
          />
          
          <StatItem
            label="Processos"
            value={stats.casesCount}
            additionalText={`${stats.activeCount} ativos`}
            additionalTextColor="text-gray-500"
            bgColor="bg-accent bg-opacity-5"
            borderColor="border-accent border-opacity-10"
          />
          
          <StatItem
            label="Prazos Pendentes"
            value={stats.deadlinesCount}
            additionalText={`${stats.overdueCount} ${stats.overdueCount === 1 ? 'atrasado' : 'atrasados'}`}
            additionalTextColor="text-danger"
            bgColor="bg-warning bg-opacity-5"
            borderColor="border-warning border-opacity-10"
          />
          
          <StatItem
            label="Peças Jurídicas"
            value={stats.documentsCount}
            additionalText="42 este mês"
            additionalTextColor="text-success"
            bgColor="bg-success bg-opacity-5"
            borderColor="border-success border-opacity-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  additionalText: string;
  additionalTextColor: string;
  bgColor: string;
  borderColor: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  additionalText,
  additionalTextColor,
  bgColor,
  borderColor
}) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      bgColor,
      borderColor
    )}>
      <div className="text-xs font-medium text-primary text-opacity-70 mb-1">{label}</div>
      <div className="flex items-baseline">
        <span className="text-2xl font-heading font-semibold">{value}</span>
        <span className={cn("ml-2 text-xs font-medium", additionalTextColor)}>{additionalText}</span>
      </div>
    </div>
  );
};

export default StatsCard;
