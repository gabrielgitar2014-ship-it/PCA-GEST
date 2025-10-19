import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Heart, Target, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Sobre o PCA-GES
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transformando a saúde auditiva ocupacional através da tecnologia e inovação
          </p>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Proteger a saúde auditiva dos trabalhadores brasileiros através de uma solução tecnológica completa, acessível e em conformidade com as regulamentações de saúde ocupacional.
              </p>
            </div>

            <div className="text-center">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
              <p className="text-muted-foreground">
                Ser a plataforma líder em gerenciamento de Programa de Conservação Auditiva no Brasil, reconhecida pela excelência, inovação e impacto positivo na vida dos trabalhadores.
              </p>
            </div>

            <div className="text-center">
              <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Nossos Valores</h3>
              <p className="text-muted-foreground">
                Inovação, segurança, conformidade regulatória, acessibilidade e compromisso com a excelência em saúde ocupacional.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-12 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
            <p className="text-lg text-muted-foreground mb-4">
              O PCA-GES foi desenvolvido por uma equipe de especialistas em saúde ocupacional, fonoaudiólogos e engenheiros de software que identificaram um problema crítico na prática brasileira: a falta de ferramentas digitais eficientes para gerenciar Programas de Conservação Auditiva em conformidade com as normas regulamentadoras.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Após anos de pesquisa e desenvolvimento, em colaboração com empresas, clínicas ocupacionais e profissionais de saúde em todo o Brasil, criamos uma solução que não apenas automatiza tarefas administrativas, mas também melhora significativamente a proteção da saúde auditiva dos trabalhadores.
            </p>
            <p className="text-lg text-muted-foreground">
              Hoje, o PCA-GES é confiado por centenas de empresas e profissionais de saúde ocupacional, ajudando a garantir conformidade com NR-15 e NR-7, e transformando a forma como o Programa de Conservação Auditiva é gerenciado no Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Escolher o PCA-GES?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Desenvolvido por Especialistas</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe inclui fonoaudiólogos, médicos do trabalho e especialistas em saúde ocupacional que entendem os desafios reais da prática. Cada recurso foi desenvolvido com base em feedback direto de profissionais.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Conformidade Garantida</h3>
              <p className="text-muted-foreground mb-6">
                O PCA-GES garante conformidade total com NR-15 (Atividades e Operações Insalubres) e NR-7 (Programa de Controle Médico de Saúde Ocupacional), reduzindo riscos legais e multas.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tecnologia de Ponta</h3>
              <p className="text-muted-foreground mb-6">
                Utilizamos tecnologias modernas e seguras, incluindo inteligência artificial para detecção automática de alterações auditivas, garantindo que seus dados estejam sempre protegidos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Suporte Especializado</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de suporte é composta por profissionais com experiência em saúde ocupacional. Oferecemos treinamento, webinars e documentação completa para garantir seu sucesso.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Inovação Contínua</h3>
              <p className="text-muted-foreground mb-6">
                Continuamos desenvolvendo novos recursos e melhorias com base nas necessidades do mercado e no feedback dos usuários, mantendo o PCA-GES sempre atualizado.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Comunidade Ativa</h3>
              <p className="text-muted-foreground mb-6">
                Faça parte de uma comunidade de profissionais de saúde ocupacional que compartilham experiências, dicas e melhores práticas para otimizar o gerenciamento do PCA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                RP
              </div>
              <h3 className="text-xl font-bold mb-2">Dr. Ricardo Pereira</h3>
              <p className="text-muted-foreground mb-3">Fundador & Especialista em Saúde Ocupacional</p>
              <p className="text-sm text-muted-foreground">
                Médico do trabalho com 20 anos de experiência em Programa de Conservação Auditiva.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                AF
              </div>
              <h3 className="text-xl font-bold mb-2">Ana Fernandes</h3>
              <p className="text-muted-foreground mb-3">Fonoaudióloga & Diretora de Produto</p>
              <p className="text-sm text-muted-foreground">
                Fonoaudióloga especializada em audiologia ocupacional com 15 anos de prática clínica.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                CB
              </div>
              <h3 className="text-xl font-bold mb-2">Carlos Barbosa</h3>
              <p className="text-muted-foreground mb-3">Engenheiro de Software & CTO</p>
              <p className="text-sm text-muted-foreground">
                Especialista em desenvolvimento de software para saúde com foco em segurança e conformidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nosso Impacto</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-muted-foreground">Empresas Clientes</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <p className="text-muted-foreground">Trabalhadores Protegidos</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-muted-foreground">Conformidade Regulatória</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-muted-foreground">Suporte Disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Proteger a Saúde Auditiva da Sua Empresa?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Junte-se a centenas de empresas que já estão transformando sua saúde ocupacional com o PCA-GES.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">PCA-GES</h4>
              <p className="text-sm text-muted-foreground">
                Gerenciador de Programa de Conservação Auditiva para saúde ocupacional.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features"><a className="text-muted-foreground hover:text-foreground">Recursos</a></Link></li>
                <li><Link href="/pricing"><a className="text-muted-foreground hover:text-foreground">Preços</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about"><a className="text-muted-foreground hover:text-foreground">Sobre</a></Link></li>
                <li><Link href="/contact"><a className="text-muted-foreground hover:text-foreground">Contato</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PCA-GES. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

