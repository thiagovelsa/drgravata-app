import { useState } from "react";
import { useLocation } from "wouter";
import SidebarNavigation from "@/components/ui/sidebar-navigation";
import UserAvatar from "@/components/ui/user-avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getPageTitle = () => {
    const path = location.split("/")[1];
    if (path === "") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="h-screen flex overflow-hidden antialiased text-sm">
      {/* Sidebar - added fixed positioning with higher z-index */}
      <div className="fixed h-screen flex z-50">
        <SidebarNavigation 
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
      
      {/* Main content area - added margin-left to make space for sidebar */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white shadow-subtle">
          <div className="flex items-center">
            <h2 className="font-heading text-xl font-semibold text-primary">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <UserAvatar name="Maria Gravata" />
          </div>
        </header>
        
        {/* Content area */}
        <main className={cn(
          "flex-1 overflow-y-auto p-6 bg-background",
          "transition-all duration-300 ease-in-out"
        )}>
          {children}
        </main>
      </div>
      
      {/* Floating Action Button */}
      <Button 
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent 
                  shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all 
                  duration-300 hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Button>
    </div>
  );
};

export default MainLayout;
