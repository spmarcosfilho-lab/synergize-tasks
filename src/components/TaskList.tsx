import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Edit, Plus, ChevronRight, ChevronDown, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  parent_task_id: string | null;
}

interface TaskListProps {
  refreshTrigger: number;
}

export function TaskList({ refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showAddSubtask, setShowAddSubtask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("is_completed", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setTasks(data || []);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar as tarefas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const toggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ is_completed: !isCompleted })
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, is_completed: !isCompleted }
          : task
      ));

      toast({
        title: "Sucesso!",
        description: `Tarefa ${!isCompleted ? "concluída" : "marcada como pendente"}.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      setTasks(tasks.filter(task => task.id !== taskId));

      toast({
        title: "Sucesso!",
        description: "Tarefa excluída com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir a tarefa.",
        variant: "destructive",
      });
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const selectAllTasks = () => {
    const allTaskIds = tasks.map(task => task.id);
    setSelectedTasks(new Set(allTaskIds));
  };

  const clearSelection = () => {
    setSelectedTasks(new Set());
  };

  const completeSelectedTasks = async () => {
    if (selectedTasks.size === 0) return;

    try {
      const taskIds = Array.from(selectedTasks);
      const { error } = await supabase
        .from("tasks")
        .update({ is_completed: true })
        .in("id", taskIds);

      if (error) {
        throw error;
      }

      setTasks(tasks.map(task => 
        selectedTasks.has(task.id) 
          ? { ...task, is_completed: true }
          : task
      ));

      setSelectedTasks(new Set());

      toast({
        title: "Sucesso!",
        description: `${taskIds.length} tarefa${taskIds.length !== 1 ? 's' : ''} concluída${taskIds.length !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error("Erro ao concluir tarefas:", error);
      toast({
        title: "Erro",
        description: "Erro ao concluir as tarefas selecionadas.",
        variant: "destructive",
      });
    }
  };

  const deleteSelectedTasks = async () => {
    if (selectedTasks.size === 0) return;

    try {
      const taskIds = Array.from(selectedTasks);
      const { error } = await supabase
        .from("tasks")
        .delete()
        .in("id", taskIds);

      if (error) {
        throw error;
      }

      setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
      setSelectedTasks(new Set());

      toast({
        title: "Sucesso!",
        description: `${taskIds.length} tarefa${taskIds.length !== 1 ? 's' : ''} excluída${taskIds.length !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error("Erro ao excluir tarefas:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir as tarefas selecionadas.",
        variant: "destructive",
      });
    }
  };

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getSubtasks = (parentId: string) => {
    return tasks.filter(task => task.parent_task_id === parentId);
  };

  const getMainTasks = () => {
    return tasks.filter(task => !task.parent_task_id);
  };

  const renderTask = (task: Task, isSubtask = false) => {
    const subtasks = getSubtasks(task.id);
    const hasSubtasks = subtasks.length > 0;
    const isExpanded = expandedTasks.has(task.id);

    return (
      <div key={task.id} className={isSubtask ? "ml-6" : ""}>
        <Card 
          className={`transition-all duration-300 hover:shadow-medium ${
            task.is_completed ? "opacity-75" : ""
          } ${isSubtask ? "border-l-4 border-l-primary/30" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {hasSubtasks && !isSubtask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(task.id)}
                  className="p-0 h-6 w-6 hover:bg-muted"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Checkbox
                checked={selectedTasks.has(task.id)}
                onCheckedChange={() => toggleTaskSelection(task.id)}
                className="mt-1"
                title="Selecionar tarefa"
              />
              
              <div className="flex-1 min-w-0">
                <h3 
                  className={`font-medium ${
                    task.is_completed 
                      ? "line-through text-muted-foreground" 
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
                
                {task.due_date && (
                  <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(new Date(task.due_date), "PPP", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {hasSubtasks && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                    <span>{subtasks.length} subtarefa{subtasks.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {!isSubtask && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddSubtask(task.id)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                    title="Adicionar subtarefa"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTask(task)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Editar tarefa"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Excluir tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComplete(task.id, task.is_completed)}
                  className={`${
                    task.is_completed 
                      ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                      : "text-green-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                  title={task.is_completed ? "Marcar como pendente" : "Finalizar tarefa"}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasSubtasks && isExpanded && (
          <div className="mt-2 space-y-2">
            {subtasks.map(subtask => renderTask(subtask, true))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          <p className="text-sm text-muted-foreground mt-2">
            Que tal adicionar sua primeira tarefa?
          </p>
        </CardContent>
      </Card>
    );
  }

  const mainTasks = getMainTasks();

  return (
    <>
      {/* Bulk Actions */}
      {tasks.length > 0 && (
        <div className="mb-4 p-4 bg-card rounded-lg border shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTasks.size === tasks.length && tasks.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAllTasks();
                    } else {
                      clearSelection();
                    }
                  }}
                  title="Selecionar todas as tarefas"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedTasks.size > 0 
                    ? `${selectedTasks.size} tarefa${selectedTasks.size !== 1 ? 's' : ''} selecionada${selectedTasks.size !== 1 ? 's' : ''}`
                    : "Selecionar todas"
                  }
                </span>
              </div>
            </div>

            {selectedTasks.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={completeSelectedTasks}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Concluir Selecionadas
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteSelectedTasks}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Selecionadas
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {mainTasks.map(task => renderTask(task))}
      </div>

      {/* Add Subtask Modal */}
      <AddTaskModal 
        open={!!showAddSubtask}
        onOpenChange={(open) => !open && setShowAddSubtask(null)}
        onTaskAdded={() => {
          setShowAddSubtask(null);
          fetchTasks();
        }}
        parentTaskId={showAddSubtask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal 
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onTaskUpdated={() => {
          setEditingTask(null);
          fetchTasks();
        }}
        task={editingTask}
      />
    </>
  );
}