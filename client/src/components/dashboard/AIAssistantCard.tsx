import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const AIAssistantCard = () => {
  const suggestionQueries = [
    "Elabore uma minuta de recurso para o processo nº 0001234-12",
    "Analise esta decisão e sugira fundamentos para contestação",
    "Pesquise jurisprudência sobre dano moral em relações de consumo"
  ];

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-semibold">Assistente IA Jurídico</h3>
          <span className="px-2 py-1 bg-accent/10 rounded-full text-accent text-xs font-medium">Premium</span>
        </div>
        
        <div className="glass-card p-4 mb-4 rounded-lg bg-gradient-to-r from-primary-light/5 to-accent/5 border border-accent/10">
          <p className="text-sm font-medium text-primary">O que deseja consultar hoje?</p>
        </div>
        
        <div className="space-y-3 mb-6 max-w-full">
          {suggestionQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start px-4 py-3 text-left text-sm rounded-lg border border-gray-200 
                        hover:border-accent hover:bg-gray-50 transition-colors duration-200 h-auto overflow-hidden"
            >
              <div className="flex items-center w-full">
                <MessageSquare className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                <span className="truncate">{query}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link href="/assistant">
            <Button
              className="w-full py-3 bg-gradient-accent text-white rounded-lg hover:bg-accent-light shadow-sm 
                       transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md flex items-center justify-center"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Abrir Assistente IA
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantCard;
