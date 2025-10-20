import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Entre em Contato Conosco
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Estamos aqui para responder suas dúvidas e ajudar você a implementar o PCA-GES
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Envie uma Mensagem</h2>

              {submitted ? (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-6 rounded-lg">
                  <p className="text-green-800 dark:text-green-200 font-bold mb-2">
                    Mensagem enviada com sucesso!
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    Obrigado por entrar em contato. Nossa equipe responderá em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="(11) 9999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Empresa</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assunto</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="demo">Solicitar Demonstração</option>
                      <option value="pricing">Dúvida sobre Preços</option>
                      <option value="implementation">Implementação</option>
                      <option value="technical">Suporte Técnico</option>
                      <option value="partnership">Parceria</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mensagem</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Sua mensagem aqui..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Enviar Mensagem
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Informações de Contato</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Email</h3>
                    <p className="text-muted-foreground">contato@pcages.com.br</p>
                    <p className="text-muted-foreground">suporte@pcages.com.br</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Telefone</h3>
                    <p className="text-muted-foreground">(11) 3000-0000</p>
                    <p className="text-sm text-muted-foreground mt-1">Segunda a sexta, 8h às 18h</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Localização</h3>
                    <p className="text-muted-foreground">São Paulo, SP</p>
                    <p className="text-muted-foreground">Brasil</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">Segunda a sexta: 8h às 18h</p>
                    <p className="text-muted-foreground">Sábado: 9h às 13h</p>
                    <p className="text-muted-foreground">Domingo: Fechado</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold mb-3">Teste Gratuito por 30 Dias</h3>
                <p className="text-muted-foreground mb-4">
                  Não tem certeza? Experimente o PCA-GES por 30 dias gratuitamente. Acesso completo a todas as funcionalidades. Sem cartão de crédito necessário.
                </p>
                <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                  Começar Teste Grátis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">Qual é o tempo de resposta?</h3>
              <p className="text-muted-foreground">
                Respondemos a todos os emails e mensagens dentro de 24 horas úteis. Para questões urgentes, ligue para nosso telefone de suporte.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">Como é o processo de implementação?</h3>
              <p className="text-muted-foreground">
                Oferecemos suporte completo na implementação, incluindo treinamento da equipe, configuração do sistema e migração de dados existentes. Nosso processo leva em média 2-4 semanas.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">Vocês oferecem treinamento?</h3>
              <p className="text-muted-foreground">
                Sim! Oferecemos webinars de treinamento, documentação completa, vídeos tutoriais e suporte personalizado para garantir que sua equipe aproveite ao máximo o PCA-GES.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">Como funciona o período de teste?</h3>
              <p className="text-muted-foreground">
                O período de teste gratuito de 30 dias oferece acesso completo a todos os recursos do plano Profissional. Sem necessidade de cartão de crédito. Você pode cancelar a qualquer momento.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">Posso integrar com meu sistema atual?</h3>
              <p className="text-muted-foreground">
                Sim! Oferecemos integrações com diversos sistemas de agenda, prontuário eletrônico e equipamentos de audiometria. Entre em contato para discutir suas necessidades específicas.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-3">O PCA-GES é realmente conforme com NR-15 e NR-7?</h3>
              <p className="text-muted-foreground">
                Sim! O PCA-GES foi desenvolvido em conformidade total com as Normas Regulamentadoras NR-15 e NR-7. Nossos relatórios são aceitos por órgãos reguladores e auditorias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Implementar o PCA-GES?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Comece com 30 dias de teste gratuito. Sem cartão de crédito necessário.
          </p>
          <Button size="lg" variant="secondary">
            Começar Teste Gratuito Agora
          </Button>
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

