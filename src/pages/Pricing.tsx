// DENTRO DE: src/pages/Pricing.tsx (Revertido para Explicação)

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import { CheckCircle2, TrendingUp, Calculator } from "lucide-react"; // Ícones relevantes

export default function Pricing() {

  // Função para calcular o desconto (pode ser usada para exemplos)
  const calculateDiscountPercent = (qty: number): number => {
    if (qty <= 1) return 0;
    return qty + 1; // Desconto = (Quantidade + 1)%
  };

  // Função para calcular preço final (pode ser usada para exemplos)
   const calculateFinalPrice = (qty: number): number => {
    if (qty <= 0) return 0;
    const basePricePerToken = 130;
    const totalPrice = qty * basePricePerToken;
    if (qty === 1) return totalPrice;
    
    const discountPercentage = (qty + 1) / 100;
    const effectiveDiscount = Math.min(discountPercentage, 0.99); 
    return totalPrice * (1 - effectiveDiscount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Preço Transparente e Flexível
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Pague apenas pelo que usar. Acesso completo a todas as funcionalidades do PCA-GES, sem planos complicados.
          </p>
        </div>
      </section>

      {/* Pricing Model Explanation */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-16">
             <Calculator className="w-16 h-16 text-blue-600 mx-auto mb-4"/>
            <h2 className="text-3xl font-bold mb-4">Nosso Modelo de Preço</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Acreditamos em simplicidade. Você paga um valor base mensal por cada empresa que gerencia, com descontos automáticos quanto mais empresas você adiciona.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-border shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-center mb-6">Como Funciona</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center border-r pr-8 border-border dark:border-slate-700">
                <p className="text-muted-foreground mb-1">Valor Base</p>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">R$ 130</p>
                <p className="text-muted-foreground mt-1">por empresa / mês</p>
              </div>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0 mt-1"/>
                    <div>
                        <h4 className="font-semibold">Desconto Progressivo Automático</h4>
                        <p className="text-sm text-muted-foreground">
                            Quanto mais empresas você gerencia, maior o seu desconto! <br/>
                            A partir da 2ª empresa, o desconto é de <strong>(Nº de Empresas + 1)%</strong> sobre o valor total.
                        </p>
                    </div>
                 </div>
                 <div className="text-sm text-muted-foreground pl-9">
                    <p>Exemplo 1: <strong>3 Empresas</strong> = (3 x R$130) - 4% = R$ 374,40/mês</p>
                    <p>Exemplo 2: <strong>10 Empresas</strong> = (10 x R$130) - 11% = R$ 1157,00/mês</p>
                 </div>
              </div>
            </div>
          </div>
          
           <div className="text-center mb-12">
              <h3 className="text-xl font-semibold mb-4">Todas as funcionalidades sempre incluídas:</h3>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Monitoramento</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Audiometrias</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Detecção Automática</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Relatórios NR</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Gestão de EPIs</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500"/> Treinamento</span>
                {/* Adicione mais se houver */}
              </div>
            </div>

          {/* CTA para a página de compra */}
          <div className="text-center">
            <Link href="/registrar"> {/* Link para a nova página */}
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Calcular Preço e Registrar Agora
              </Button>
            </Link>
             <p className="text-sm text-muted-foreground mt-4">
                Precisa de um volume maior ou tem dúvidas? <Link href="/contact"><a className="text-blue-600 hover:underline">Fale conosco</a></Link>.
            </p>
          </div>

        </div>
      </section>

      {/* Outras seções (FAQ, etc.) podem ser mantidas ou removidas */}

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          {/* ... Conteúdo do Footer ... */}
           <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PCA-GES. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}