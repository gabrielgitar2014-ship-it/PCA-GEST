// DENTRO DE: src/App.tsx

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
// ✅ Importa a nova página de registro/compra
import RegisterPurchasePage from "./pages/RegisterPurchasePage"; 

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/features"} component={Features} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      {/* ✅ Adiciona a nova rota para a página de registro/compra */}
      <Route path={"/registrar"} component={RegisterPurchasePage} /> 
      
      <Route path={"/404"} component={NotFound} />
      {/* Rota final de fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: Sobre o Tema
// - Escolha primeiro um tema padrão (dark ou light bg), depois ajuste a paleta de cores no index.css
// - Se quiser tornar o tema selecionável, passe `switchable` para ThemeProvider e use o hook `useTheme`

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;