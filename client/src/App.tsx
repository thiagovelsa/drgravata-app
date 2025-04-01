import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard";
import ClientsList from "./pages/clients";
import CasesList from "./pages/cases";
import DeadlinesList from "./pages/deadlines";
import DocumentsList from "./pages/documents";
import AIAssistant from "./pages/assistant";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/clients" component={ClientsList} />
      <Route path="/cases" component={CasesList} />
      <Route path="/deadlines" component={DeadlinesList} />
      <Route path="/documents" component={DocumentsList} />
      <Route path="/assistant" component={AIAssistant} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
