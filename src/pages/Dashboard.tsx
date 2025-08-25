import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Plus, LogOut, User, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddTaskModal } from "@/components/AddTaskModal";
import { TaskList } from "@/components/TaskList";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Synergize</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Olá, {user?.email?.split('@')[0] || 'Usuário'}
              </span>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Minhas Tarefas
            </h1>
            <p className="text-muted-foreground">
              Organize suas atividades e aumente sua produtividade.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-medium transition-all duration-300 hover:scale-105"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Nova Tarefa
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="hover:shadow-soft transition-all duration-300"
            >
              Ver Workspaces
            </Button>
          </div>

          {/* Tasks Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Tasks Today */}
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Hoje</span>
                </CardTitle>
                <CardDescription>
                  Tarefas para hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma tarefa para hoje</p>
                  <p className="text-sm mt-2">Que tal adicionar uma?</p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Próximas</span>
                </CardTitle>
                <CardDescription>
                  Tarefas futuras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma tarefa agendada</p>
                  <p className="text-sm mt-2">Planeje seu futuro!</p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Concluídas</span>
                </CardTitle>
                <CardDescription>
                  Tarefas finalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma tarefa concluída</p>
                  <p className="text-sm mt-2">Complete algumas tarefas!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Tarefas Hoje</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">0</p>
                  <p className="text-sm text-muted-foreground">Em Progresso</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-muted-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Suas Tarefas
            </h2>
            <TaskList refreshTrigger={refreshTasks} />
          </div>

          {/* Mobile Menu Panel */}
          <div className="md:hidden mt-8 p-4 bg-card rounded-lg shadow-soft">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Logado como: {user?.email}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onTaskAdded={() => setRefreshTasks(prev => prev + 1)}
      />
    </div>
  );
};

export default Dashboard;