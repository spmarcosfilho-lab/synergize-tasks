import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Synergize</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost">Recursos</Button>
            <Button variant="ghost">Preços</Button>
            <Button variant="outline">Login</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Organize seu trabalho<br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                e sua vida, finalmente.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              A ferramenta definitiva para gerenciamento de tarefas pessoais e de equipe.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button size="lg" className="bg-gradient-primary hover:shadow-medium transition-all duration-300 hover:scale-105">
              Cadastre-se Grátis
            </Button>
            <Button variant="outline" size="lg" className="hover:shadow-soft transition-all duration-300">
              Fazer Login
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 text-sm text-muted-foreground">
            ✨ Sem cartão de crédito • 📱 Funciona em todos os dispositivos • 🔒 Dados seguros
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center space-y-4 p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Tarefas Inteligentes</h3>
            <p className="text-muted-foreground">
              Crie, organize e acompanhe suas tarefas com facilidade. Nunca mais esqueça o que é importante.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Colaboração em Equipe</h3>
            <p className="text-muted-foreground">
              Crie workspaces, convide membros e trabalhe junto em projetos compartilhados.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Produtividade Máxima</h3>
            <p className="text-muted-foreground">
              Interface intuitiva e recursos poderosos para maximizar sua eficiência diária.
            </p>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden mt-16 text-center space-y-4">
          <Button size="lg" className="w-full bg-gradient-primary hover:shadow-medium transition-all duration-300">
            Cadastre-se Grátis
          </Button>
          <Button variant="outline" size="lg" className="w-full hover:shadow-soft transition-all duration-300">
            Fazer Login
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Synergize. Transformando a forma como você trabalha.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;