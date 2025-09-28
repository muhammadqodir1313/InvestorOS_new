import { useState } from "react";
import { TrendingUp, AlertTriangle, CheckCircle, Calendar, ArrowRight, X, DollarSign, Users, BarChart3, Clock, FileText, ExternalLink, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MorningBrief() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [newTask, setNewTask] = useState({
    task: '',
    priority: 'medium',
    dueDate: 'Today'
  });
  const [tasks, setTasks] = useState([
    { id: 1, task: "Review TechFlow AI financials", completed: false, priority: "high", dueDate: "Today" },
    { id: 2, task: "Schedule call with DataSync CEO", completed: false, priority: "medium", dueDate: "Tomorrow" },
    { id: 3, task: "Prepare LP presentation slides", completed: true, priority: "high", dueDate: "Yesterday" },
    { id: 4, task: "Review due diligence documents for CloudScale", completed: false, priority: "high", dueDate: "Today" },
    { id: 5, task: "Update portfolio company metrics dashboard", completed: false, priority: "low", dueDate: "This week" },
    { id: 6, task: "Prepare board meeting agenda", completed: false, priority: "medium", dueDate: "Friday" },
    { id: 7, task: "Follow up with legal team on contract review", completed: true, priority: "medium", dueDate: "Last week" },
    { id: 8, task: "Analyze market trends for Q4 report", completed: false, priority: "low", dueDate: "Next week" },
    { id: 9, task: "Schedule investor update calls", completed: false, priority: "high", dueDate: "Today" },
    { id: 10, task: "Review and approve expense reports", completed: true, priority: "low", dueDate: "Yesterday" }
  ]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const priorities = [
    {
      id: 1,
      title: "TechFlow AI Series A Decision",
      type: "Deal Review",
      score: 8.5,
      status: "urgent",
      dueBy: "2:00 PM Today",
      description: "Final IC meeting for $15M Series A. Strong metrics, 3x YoY growth.",
      details: {
        company: "TechFlow AI",
        dealSize: "$15M",
        valuation: "$120M pre-money",
        stage: "Series A",
        sector: "Artificial Intelligence",
        location: "San Francisco, CA",
        founded: "2021",
        employees: "45",
        revenue: "$2.1M ARR",
        growth: "3x YoY",
        keyMetrics: {
          mrr: "$175K",
          churn: "2.1%",
          ltv: "$45K",
          cac: "$8K"
        },
        team: {
          ceo: "Sarah Chen",
          cto: "Michael Rodriguez",
          cfo: "Jennifer Liu"
        },
        investors: ["Accel Partners", "Sequoia Capital", "Andreessen Horowitz"],
        timeline: "6 months from first meeting",
        risks: ["Market competition", "Regulatory changes in AI"],
        opportunities: ["Enterprise expansion", "International markets"],
        documents: ["Financial Model", "Pitch Deck", "Due Diligence Report", "Market Analysis"],
        nextSteps: ["Final IC presentation", "Legal documentation", "Closing procedures"]
      }
    },
    {
      id: 2,
      title: "Portfolio Review: DataSync",
      type: "Portfolio",
      score: 6.2,
      status: "attention",
      dueBy: "End of Week",
      description: "Monthly check-in. Revenue growth slowing, discussing runway.",
      details: {
        company: "DataSync",
        dealSize: "$8M",
        valuation: "$40M post-money",
        stage: "Series A",
        sector: "Data Infrastructure",
        location: "Austin, TX",
        founded: "2020",
        employees: "28",
        revenue: "$1.2M ARR",
        growth: "1.2x YoY",
        keyMetrics: {
          mrr: "$100K",
          churn: "4.5%",
          ltv: "$22K",
          cac: "$12K"
        },
        team: {
          ceo: "David Park",
          cto: "Lisa Wang",
          cfo: "Robert Kim"
        },
        runway: "8 months",
        burnRate: "$150K/month",
        concerns: ["Slowing growth", "High churn rate", "Competitive pressure"],
        actionItems: ["Customer retention strategy", "Product roadmap review", "Fundraising preparation"],
        documents: ["Monthly Report", "Financial Statements", "Customer Analysis"],
        nextSteps: ["CEO 1:1", "Board meeting prep", "Strategic planning session"]
      }
    },
    {
      id: 3,
      title: "LP Report Q4 2024",
      type: "Fund Operations",
      score: 7.8,
      status: "normal",
      dueBy: "Next Monday",
      description: "Quarterly report preparation. Strong portfolio performance to highlight.",
      details: {
        reportType: "Quarterly LP Report",
        period: "Q4 2024",
        fund: "Venture Capital Fund II",
        fundSize: "$150M",
        deployed: "$95M (63%)",
        portfolio: "24 companies",
        keyHighlights: {
          newInvestments: 3,
          followOns: 5,
          exits: 1,
          irr: "18.2%",
          tvpi: "1.4x"
        },
        topPerformers: ["TechFlow AI", "CloudScale", "DataViz"],
        challenges: ["Market volatility", "Longer sales cycles"],
        upcoming: ["2 potential exits", "3 new investments", "Fund III planning"],
        documents: ["Financial Statements", "Portfolio Analysis", "Market Commentary"],
        nextSteps: ["Final review", "LP distribution", "Board presentation"]
      }
    }
  ];

  const runwayAlerts = [
    { company: "StartupX", months: 8, trend: "stable" },
    { company: "InnovCorp", months: 4, trend: "declining" },
    { company: "TechFlow", months: 18, trend: "improving" }
  ];


  const getScoreColor = (score) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-destructive";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "attention":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Needs Attention</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedItem(null);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const addNewTask = () => {
    if (newTask.task.trim()) {
      const taskId = Math.max(...tasks.map(t => t.id), 0) + 1;
      const task = {
        id: taskId,
        task: newTask.task.trim(),
        completed: false,
        priority: newTask.priority,
        dueDate: newTask.dueDate
      };
      setTasks([...tasks, task]);
      setNewTask({ task: '', priority: 'medium', dueDate: 'Today' });
      setIsAddTaskOpen(false);
    }
  };

  const handleNewTaskChange = (field, value) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">Medium</Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Normal</Badge>;
    }
  };

  const getTopTasks = () => {
    return tasks.slice(0, 3);
  };

  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Alex</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">3 meetings today</span>
        </div>
      </div>

      {/* Priority Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {priorities.map((item) => (
          <Card key={item.id} className="glass-card border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                {getStatusBadge(item.status)}
              </div>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/80">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                    {item.score}/10
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{item.dueBy}</span>
              </div>

              <Button 
                size="sm" 
                className="w-full mt-3"
                variant={item.status === 'urgent' ? 'default' : 'outline'}
                onClick={() => handleItemClick(item)}
              >
                {item.status === 'urgent' ? 'Review Now' : 'View Details'}
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Runway Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Portfolio Runway Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {runwayAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                  <div>
                    <p className="font-medium text-sm">{alert.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.months} months remaining
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      alert.months <= 6 ? 'bg-destructive' : 
                      alert.months <= 12 ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {alert.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Tasks */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Top 3 Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopTasks().map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-4 w-4 rounded border-border cursor-pointer"
                  />
                  <span className={`text-sm flex-1 ${
                    task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}>
                    {task.task}
                  </span>
                  {getPriorityBadge(task.priority)}
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => setIsTasksOpen(true)}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {selectedItem?.title}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{selectedItem?.type}</Badge>
              {getStatusBadge(selectedItem?.status)}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {selectedItem?.dueBy}
              </div>
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Score</p>
                        <p className={`text-lg font-bold ${getScoreColor(selectedItem.score)}`}>
                          {selectedItem.score}/10
                        </p>
                      </div>
                    </div>
                    {selectedItem.details?.dealSize && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Deal Size</p>
                          <p className="text-lg font-bold">{selectedItem.details.dealSize}</p>
                        </div>
                      </div>
                    )}
                    {selectedItem.details?.company && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Company</p>
                          <p className="text-lg font-bold">{selectedItem.details.company}</p>
                        </div>
                      </div>
                    )}
                    {selectedItem.details?.sector && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Sector</p>
                          <p className="text-lg font-bold">{selectedItem.details.sector}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Company Details */}
              {selectedItem.details?.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                          <p className="text-sm">{selectedItem.details.location}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Founded</h4>
                          <p className="text-sm">{selectedItem.details.founded}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Employees</h4>
                          <p className="text-sm">{selectedItem.details.employees}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Revenue</h4>
                          <p className="text-sm">{selectedItem.details.revenue}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">Growth</h4>
                          <p className="text-sm">{selectedItem.details.growth}</p>
                        </div>
                        {selectedItem.details.valuation && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Valuation</h4>
                            <p className="text-sm">{selectedItem.details.valuation}</p>
                          </div>
                        )}
                        {selectedItem.details.stage && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Stage</h4>
                            <p className="text-sm">{selectedItem.details.stage}</p>
                          </div>
                        )}
                        {selectedItem.details.timeline && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground">Timeline</h4>
                            <p className="text-sm">{selectedItem.details.timeline}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Key Metrics */}
              {selectedItem.details?.keyMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedItem.details.keyMetrics).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-accent/20 rounded-lg">
                          <p className="text-2xl font-bold">{value}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Team */}
              {selectedItem.details?.team && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leadership Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(selectedItem.details.team).map(([role, name]) => (
                        <div key={role} className="p-3 bg-accent/20 rounded-lg">
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground uppercase">{role}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investors */}
              {selectedItem.details?.investors && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.details.investors.map((investor, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {investor}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risks & Opportunities */}
              {(selectedItem.details?.risks || selectedItem.details?.opportunities) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedItem.details?.risks && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-destructive">Risks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedItem.details.risks.map((risk, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-2 w-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {selectedItem.details?.opportunities && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-success">Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedItem.details.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-2 w-2 bg-success rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Documents */}
              {selectedItem.details?.documents && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedItem.details.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-accent/20 rounded-lg">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doc}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              {selectedItem.details?.nextSteps && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedItem.details.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                          <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  {selectedItem.status === 'urgent' ? 'Review Now' : 'View Details'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={closeDetails}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* All Tasks Dialog */}
      <Dialog open={isTasksOpen} onOpenChange={setIsTasksOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">All Tasks</DialogTitle>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                {tasks.filter(task => task.completed).length} of {tasks.length} completed
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {tasks.filter(task => !task.completed && task.dueDate === "Today").length} due today
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <Button
                variant={taskFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setTaskFilter('all')}
              >
                All ({tasks.length})
              </Button>
              <Button
                variant={taskFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setTaskFilter('pending')}
              >
                Pending ({tasks.filter(task => !task.completed).length})
              </Button>
              <Button
                variant={taskFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setTaskFilter('completed')}
              >
                Completed ({tasks.filter(task => task.completed).length})
              </Button>
            </div>

            {/* Add New Task Button */}
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Task
              </Button>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {getFilteredTasks().map((task) => (
                <Card key={task.id} className={`transition-all duration-200 ${
                  task.completed ? 'opacity-60' : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="h-5 w-5 rounded border-border cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-medium ${
                            task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                          }`}>
                            {task.task}
                          </span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {task.dueDate}
                          </div>
                          {task.completed && (
                            <div className="flex items-center gap-1 text-success">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">
                      {tasks.filter(task => task.completed).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">
                      {tasks.filter(task => !task.completed && task.priority === "high").length}
                    </p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">
                      {tasks.filter(task => !task.completed && task.dueDate === "Today").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Due Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  // Mark all high priority tasks as completed
                  setTasks(tasks.map(task => 
                    task.priority === "high" && !task.completed
                      ? { ...task, completed: true }
                      : task
                  ));
                }}
              >
                Complete High Priority
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Mark all tasks as completed
                  setTasks(tasks.map(task => ({ ...task, completed: true })));
                }}
              >
                Mark All Done
              </Button>
              <Button variant="outline" onClick={() => setIsTasksOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Add New Task</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Input
                id="task"
                placeholder="Enter task description..."
                value={newTask.task}
                onChange={(e) => handleNewTaskChange('task', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => handleNewTaskChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Select
                  value={newTask.dueDate}
                  onValueChange={(value) => handleNewTaskChange('dueDate', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="This week">This week</SelectItem>
                    <SelectItem value="Next week">Next week</SelectItem>
                    <SelectItem value="This month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={addNewTask}
                disabled={!newTask.task.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddTaskOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}