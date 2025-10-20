// DENTRO DE: src/pages/RegisterPurchasePage.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter"; // Para links e pegar state
import Header from "@/components/Header";
import { Minus, Plus, ShoppingCart, Loader, AlertCircle, CheckCircle, Copy } from "lucide-react"; // Ícones
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Para labels do formulário
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Para selecionar PJ/PF
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Para mensagens

// Defina a URL da sua Edge Function aqui
const PURCHASE_FUNCTION_URL = 'https://jctheufwaiixqfrqqnmw.supabase.co/functions/v1/public-purchase-license'; // Ex: 'https://<project-ref>.supabase.co/functions/v1/public-purchase-license'

// Tipagem básica para os dados do formulário
interface FormData {
    nome: string;
    email: string;
    documento: string; // CNPJ ou CPF
    tipo_cliente: 'PF' | 'PJ'; // Pessoa Física ou Pessoa Jurídica
}

// Tipando o componente como Functional Component (React.FC)
export default function RegisterPurchasePage(): React.FC {
  const [location, navigate] = useLocation(); // Hook wouter
  
  // Pega a quantidade do state da navegação, default para 1 se não vier
  const initialQuantity = (location?.state as { quantity: number })?.quantity || 1; // Ajuste de tipagem para wouter state
  const [quantity, setQuantity] = useState<number>(initialQuantity); //

  // Estados do formulário de cadastro
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    documento: "", // CNPJ ou CPF
    tipo_cliente: "PF", // Default para Pessoa Física
  });

  // Estados de controle da UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null); // Armazena a chave gerada

  // ----- Lógica do Calculador -----
  // Tipando as entradas e saídas
  const calculatePrice = (qty: number): number => {
    if (qty <= 0) return 0;
    const basePricePerToken = 130; //
    const totalPrice = qty * basePricePerToken;
    if (qty === 1) return totalPrice; //
    const discountPercentage = (qty + 1) / 100;
    const effectiveDiscount = Math.min(discountPercentage, 0.99);
    return totalPrice * (1 - effectiveDiscount); //
  };

  // Tipando o evento de mudança
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => { //
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1; //
    setQuantity(value);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1); //
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1)); //

  const monthlyPrice = calculatePrice(quantity); //
  // ----- Fim da Lógica do Calculador -----

  // Handler para mudanças nos inputs do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; //
    setFormData(prev => ({ ...prev, [name]: value })); //
  };

  // Handler para mudança no RadioGroup
  const handleTipoChange = (value: 'PF' | 'PJ') => { // Tipagem explícita 'PF' | 'PJ'
    setFormData(prev => ({ ...prev, tipo_cliente: value })); //
  };

  // Função para copiar a chave para a área de transferência
  const copyToClipboard = () => {
    if (successKey) { //
      navigator.clipboard.writeText(successKey)
        .then(() => alert('Chave copiada para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar chave:', err));
    }
  };

  // Função para chamar a Edge Function
  const handleSubmit = async (e: React.FormEvent) => { // Tipagem do evento de formulário
    e.preventDefault(); //
    setIsLoading(true);
    setError(null);
    setSuccessKey(null);

    // Validação básica
    if (!formData.nome || !formData.email || !formData.documento || !formData.tipo_cliente) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false); //
      return;
    }
    const cleanDocumento = formData.documento.replace(/\D/g, ''); //
    if ((formData.tipo_cliente === 'PF' && cleanDocumento.length !== 11) || (formData.tipo_cliente === 'PJ' && cleanDocumento.length !== 14)) {
        setError(`Documento (${formData.tipo_cliente}) inválido.`); //
        setIsLoading(false);
        return;
    }

    const payload = {
      ...formData,
      documento: cleanDocumento,
      quantidade_tokens: quantity
    };
    console.log("Enviando payload para Edge Function:", payload); //

    try {
       if (!PURCHASE_FUNCTION_URL || PURCHASE_FUNCTION_URL === 'YOUR_SUPABASE_FUNCTION_URL_HERE/public-purchase-license') {
          throw new Error('URL da Edge Function não configurada.'); //
        }

      const response = await fetch(PURCHASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), //
      });
      const result = await response.json(); //

      if (!response.ok) {
        throw new Error(result.error || `Erro ${response.status}: ${response.statusText}`); //
      }

      console.log("Resposta da Edge Function:", result);
      setSuccessKey(result.chave_mestra); //
    } catch (err: any) { // Tipando o catch
      console.error("Erro ao processar compra:", err);
      setError(err.message || "Ocorreu um erro inesperado."); //
    } finally {
      setIsLoading(false); //
    }
  };

  return ( //
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Registrar e Comprar Licença
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Complete seus dados e defina a quantidade de empresas que deseja gerenciar. //
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-3xl mx-auto">
          
          {successKey 
          ? ( //
            // --- Tela de Sucesso ---
             <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-8 rounded-lg text-center shadow-md">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3">
                  Licença Gerada com Sucesso! //
                </h2>
                <p className="text-muted-foreground mb-6">
                    Sua chave mestra foi criada e enviada para o seu email ({formData.email}). //
                    Guarde-a em um local seguro. Use esta chave para ativar sua conta no PCA Client. //
                </p>
                <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700 border border-border rounded-lg relative">
                    <code className="block text-sm sm:text-base font-mono text-slate-800 dark:text-slate-200 break-all">
                        {successKey}
                    </code>
     
                    <Button //
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard} 
                        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground" //
                        aria-label="Copiar chave"
                      >
                         <Copy className="h-4 w-4"/>
                    </Button> //
                </div>
                {/* Ajuste o link se a rota de login do PCA Client for diferente */}
                <Button onClick={() => window.location.href = '/login'} className="bg-blue-600 hover:bg-blue-700"> 
                    Ir para Login (PCA Client) //
                </Button>
                 <p className="text-xs text-muted-foreground mt-4">
                     (Você precisará desta chave para o primeiro acesso)
                 </p>
              </div> //

          ) : (
            // --- Formulário de Cadastro e Compra ---
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seção Calculadora */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-border p-6 shadow-sm">
            
                  <h2 className="text-xl font-semibold text-center mb-5">1. Defina a Quantidade de Licenças</h2> //
                 <div className="mb-4">
                    <Label htmlFor="quantity" className="block text-sm font-medium text-center mb-3 text-muted-foreground">
                        Quantas empresas você gerencia ou pretende gerenciar? //
                    </Label>
                    <div className="flex items-center justify-center max-w-xs mx-auto">
                        <Button type="button" variant="outline" size="icon" onClick={decrementQuantity} className="rounded-r-none h-10 w-10"> <Minus className="h-4 w-4" /> </Button>
                        <Input id="quantity" type="number" min="1" value={quantity} onChange={handleQuantityChange} className="w-20 h-10 text-center text-lg font-bold rounded-none focus-visible:ring-offset-0 focus-visible:ring-0 border-l-0 border-r-0"/> //
                        <Button type="button" variant="outline" size="icon" onClick={incrementQuantity} className="rounded-l-none h-10 w-10"> <Plus className="h-4 w-4" /> </Button>
                    </div>
                 </div>
                 <div className="text-center">
         
                    <p className="text-sm text-muted-foreground">Valor mensal estimado:</p> //
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400"> R$ {monthlyPrice.toFixed(2).replace('.', ',')} </p>
                    {quantity > 1 && (<p className="text-xs text-green-600 dark:text-green-400 mt-1"> (Desconto de {(quantity + 1).toFixed(0)}% aplicado) </p>)}
                    <p className="text-xs text-muted-foreground mt-1"> (Base: R$ 130 por empresa/mês)</p> //
                 </div>
              </div>

              {/* Seção Dados do Cliente */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-center mb-5">2. Informe Seus Dados</h2> //
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="nome">Nome Completo / Razão Social *</Label>
                        <Input id="nome" name="nome" 
                        type="text" value={formData.nome} onChange={handleFormChange} required className="mt-1"/> //
                    </div>
                    <div>
                        <Label htmlFor="email">Email de Contato *</Label>
                        <Input id="email" name="email" type="email" 
                        value={formData.email} onChange={handleFormChange} required className="mt-1"/> //
                    </div>
                    <div>
                        <Label htmlFor="documento">CPF / CNPJ *</Label>
                        <Input id="documento" name="documento" type="text" value={formData.documento} 
                        onChange={handleFormChange} placeholder="Apenas números" required className="mt-1"/> //
                    </div>
                     <div className="md:col-span-2">
                         <Label className="mb-2 block">Tipo de Cliente *</Label>
                        
                         <RadioGroup defaultValue="PF" name="tipo_cliente" value={formData.tipo_cliente} onValueChange={handleTipoChange} className="flex space-x-4"> //
                             <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="PF" id="tipoPF" />
                         
                                 <Label htmlFor="tipoPF" className="font-normal">Pessoa Física (Ex: Fonoaudiólogo)</Label> //
                             </div>
                             <div className="flex items-center space-x-2">
                          
                                 <RadioGroupItem value="PJ" id="tipoPJ" /> //
                                 <Label htmlFor="tipoPJ" className="font-normal">Pessoa Jurídica (Ex: Clínica)</Label>
                             </div>
                       
                         </RadioGroup> //
                    </div>
                </div>
              </div>

              {/* Erro Geral */}
              {error && (
               
                 <Alert variant="destructive"> //
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                 </Alert>
              )}

   
              {/* Botão de Submissão */} //
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                 
                  disabled={isLoading} //
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                >
                  {isLoading ? //
                  (
                    <Loader className="animate-spin mr-2 h-5 w-5"/> 
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5"/>
                  )}
              
                  {isLoading ? 'Processando...' : `Gerar Chave (${quantity} Licença${quantity > 1 ? 's' : ''})`} //
                </Button>
                <p className="text-xs text-muted-foreground mt-3">(Sem necessidade de pagamento agora - Simulação)</p>
              </div>
            </form>
          )} 
     
        </div> //
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4">
        <div className="container max-w-5xl mx-auto">
           <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PCA-GES. Todos os direitos reservados.</p> //
          </div>
        </div>
      </footer>
    </div>
  );
} //
