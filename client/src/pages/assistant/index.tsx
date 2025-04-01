import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Upload, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  RefreshCw 
} from "lucide-react";
import { cn } from "@/lib/utils";

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o assistente jurídico DrGravata. Como posso ajudar você hoje?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
    
    // Simulate assistant response (would be replaced with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: simulateResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };
  
  const simulateResponse = (query: string): string => {
    // This is just for demonstration - in a real app, we'd call an actual API
    if (query.toLowerCase().includes("recurso")) {
      return "Para elaborar um recurso eficaz, precisamos analisar a decisão contestada e identificar os fundamentos jurídicos para a reforma. Você poderia fornecer detalhes específicos sobre o caso e a decisão que deseja recorrer?";
    } else if (query.toLowerCase().includes("prazo")) {
      return "Para calcular corretamente um prazo processual, precisamos considerar: 1) A natureza do prazo (comum ou individual); 2) Se a contagem é em dias úteis ou corridos; 3) O termo inicial conforme legislação aplicável. Em que específico posso ajudar com seu cálculo de prazo?";
    } else if (query.toLowerCase().includes("jurisprudência") || query.toLowerCase().includes("pesquisa")) {
      return "Para realizar uma pesquisa jurisprudencial eficiente sobre esse tema, posso consultar bases de decisões dos tribunais superiores (STF, STJ) e tribunais regionais. Você poderia especificar alguns parâmetros como período de tempo, tribunal específico ou termos-chave para refinar a busca?";
    } else {
      return "Entendi sua consulta. Para que eu possa lhe auxiliar de maneira mais precisa, poderia fornecer mais detalhes sobre a situação jurídica em questão? Informações como a área do direito, tribunal competente e etapa processual podem ser úteis para uma análise mais completa.";
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const suggestionQueries = [
    "Elabore uma minuta de recurso para o processo nº 0001234-12",
    "Análise jurídica desta decisão judicial",
    "Pesquise jurisprudência sobre dano moral em relações de consumo",
    "Calcule o prazo para apresentação de contestação"
  ];
  
  return (
    <div className="space-y-6">
      <Card className="h-[calc(100vh-10rem)]">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <CardTitle className="font-heading text-lg font-semibold">Assistente IA Jurídico</CardTitle>
          <span className="px-2 py-1 bg-accent bg-opacity-10 rounded-full text-accent text-xs font-medium">Premium</span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100%-60px)]">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isThinking && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 bg-primary text-white">
                  <AvatarFallback>DG</AvatarFallback>
                </Avatar>
                <div className="p-3 text-sm bg-gray-100 rounded-lg rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2 items-center text-gray-500">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggestions */}
          {messages.length < 3 && (
            <div className={cn(
              "p-4 mx-6 mb-4 bg-gradient-to-r from-primary-light/5 to-accent/5 rounded-lg",
              "border border-accent/10 transition-all duration-300",
              showSuggestions ? "max-h-[200px]" : "max-h-[40px] overflow-hidden"
            )}>
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-sm font-semibold text-primary">Sugestões de consulta</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {showSuggestions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  {suggestionQueries.map((query, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-3 text-left text-sm rounded-lg border border-gray-200 
                                hover:border-accent hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {
                        setInput(query);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-accent mr-2" />
                        <span className="line-clamp-1">{query}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Input area */}
          <div className="p-4 border-t mt-auto">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-lg flex-shrink-0"
                title="Anexar documento"
              >
                <Upload className="h-5 w-5" />
              </Button>
              
              <div className="relative flex-1">
                <Input
                  placeholder="Digite sua consulta jurídica..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-12 h-10"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white bg-accent hover:bg-accent-light"
                  onClick={handleSend}
                  disabled={isThinking || !input.trim()}
                >
                  {isThinking ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser && "justify-end"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-white">
          <AvatarFallback>DG</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "p-3 text-sm rounded-lg max-w-[80%]",
        isUser 
          ? "bg-accent text-white rounded-tr-none" 
          : "bg-gray-100 text-gray-800 rounded-tl-none"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-white/70" : "text-gray-500"
        )}>
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-accent text-white">
          <AvatarFallback>MG</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AIAssistant;
