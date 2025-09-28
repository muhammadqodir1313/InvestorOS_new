import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, ThumbsUp, ThumbsDown, Clock, Building, TrendingUp, MessageSquare, Check, X, Pause, Plus, GripVertical } from "lucide-react";
import { usePersistData } from "@/hooks/use-persist-data";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const stages = ["New", "Screening", "Diligence", "IC Ready", "Decided"];

const sectors = ["AI/ML", "CleanTech", "HealthTech", "DevTools", "FinTech", "EdTech", "E-commerce", "SaaS", "Other"];

// Droppable Stage komponenti
function DroppableStage({ stage, deals, onDealAction, getScoreColor, getSectorColor, setSelectedDeal }) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`min-w-[280px] sm:min-w-[320px] flex-shrink-0 stage-drop-zone ${
        isOver ? 'drag-over' : ''
      }`}
    >
      {/* Stage Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`font-semibold text-foreground stage-header ${
          isOver ? 'text-primary' : ''
        }`}>{stage}</h3>
        <Badge variant="secondary" className={`text-xs stage-badge ${
          isOver ? 'bg-primary/20 text-primary' : ''
        }`}>
          {deals?.length || 0}
        </Badge>
      </div>

      {/* Deals in Stage with Sortable Context */}
      <SortableContext 
        items={deals?.map(deal => deal.id) || []} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[200px]">
          {deals?.map((deal) => (
            <SortableDeal
              key={deal.id}
              deal={deal}
              onDealAction={onDealAction}
              getScoreColor={getScoreColor}
              getSectorColor={getSectorColor}
              setSelectedDeal={setSelectedDeal}
            />
          ))}

          {/* Add Deal Button */}
          {deals?.length === 0 && (
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">No deals in {stage}</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Sortable Deal komponenti
function SortableDeal({ deal, onDealAction, getScoreColor, getSectorColor, setSelectedDeal }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`glass-card cursor-pointer hover:border-primary/30 transition-all duration-200 pipeline-deal ${
        isDragging ? 'dragging shadow-2xl scale-105' : ''
      }`}
      onClick={() => setSelectedDeal(deal)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">{deal.company}</CardTitle>
            <p className="text-xs text-muted-foreground">{deal.name} • {deal.amount}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-foreground/80 line-clamp-2">
          {deal.description}
        </p>

        <div className="flex items-center gap-2">
          <Badge className={getSectorColor(deal.sector)} variant="outline">
            {deal.sector}
          </Badge>
        </div>

        {/* Score Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className={`text-xs font-medium ${getScoreColor(deal.score)}`}>
              {deal.score}/10
            </span>
          </div>
          <Progress value={deal.score * 10} className="h-1" />
        </div>

        {/* Comments Preview */}
        {deal.comments.length > 0 && (
          <div className="pt-2 border-t border-border/30">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{deal.comments.length} comment{deal.comments.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{deal.lastUpdate}</span>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-success hover:bg-success/10"
              onClick={(e) => {
                e.stopPropagation();
                onDealAction(deal.id, 'accept');
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-warning hover:bg-warning/10"
              onClick={(e) => {
                e.stopPropagation();
                onDealAction(deal.id, 'hold');
              }}
            >
              <Pause className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDealAction(deal.id, 'reject');
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const deals = [
  {
    id: "1",
    name: "Series A",
    company: "TechFlow AI",
    stage: "IC Ready",
    score: 8.5,
    amount: "$15M",
    sector: "AI/ML",
    lastUpdate: "2h ago",
    description: "AI-powered workflow automation platform with strong product-market fit",
    comments: [
      { id: "1", text: "Strong technical team", author: "Sarah", timestamp: "1h ago" },
      { id: "2", text: "Market size validation needed", author: "Mike", timestamp: "3h ago" }
    ]
  },
  {
    id: "2", 
    name: "Seed",
    company: "EcoStart",
    stage: "Diligence",
    score: 7.2,
    amount: "$3M",
    sector: "CleanTech",
    lastUpdate: "1d ago",
    description: "Sustainable packaging solutions for e-commerce companies",
    comments: [
      { id: "3", text: "ESG compliance looks good", author: "Alex", timestamp: "2d ago" }
    ]
  },
  {
    id: "3",
    name: "Series B",
    company: "HealthLink",
    stage: "Screening",
    score: 6.8,
    amount: "$25M",
    sector: "HealthTech",
    lastUpdate: "3d ago", 
    description: "Telemedicine platform connecting patients with specialized care",
    comments: []
  },
  {
    id: "4",
    name: "Pre-Seed",
    company: "DevTools Pro",
    stage: "New",
    score: 5.5,
    amount: "$1.5M",
    sector: "DevTools",
    lastUpdate: "1w ago",
    description: "Developer productivity tools for remote teams",
    comments: []
  }
];

export default function Pipeline() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeId, setActiveId] = useState(null);
  
  // localStorage da saqlash uchun deals data
  const { data: dealsData, setData: setDealsData } = usePersistData("pipeline-deals", deals);
  
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    company: "",
    name: "",
    amount: "",
    sector: "",
    description: "",
    score: 5,
    stage: "New"
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getScoreColor = (score) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";  
    return "text-destructive";
  };

  const getSectorColor = (sector) => {
    const colors = {
      "AI/ML": "bg-primary/10 text-primary border-primary/20",
      "CleanTech": "bg-success/10 text-success border-success/20",
      "HealthTech": "bg-warning/10 text-warning border-warning/20",
      "DevTools": "bg-accent/10 text-accent-foreground border-accent/20"
    };
    return colors[sector] || "bg-muted text-muted-foreground";
  };

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = dealsData.filter(deal => deal.stage === stage);
    return acc;
  }, {});

  const handleDealAction = (dealId, action) => {
    const newStage = action === 'accept' ? 'IC Ready' : action === 'reject' ? 'Decided' : 'Diligence';
    setDealsData(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    ));
  };

  const addComment = (dealId) => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: "You",
      timestamp: "now"
    };
    setDealsData(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, comments: [...deal.comments, comment] } : deal
    ));
    setNewComment("");
  };

  const handleAddDeal = () => {
    if (!newDeal.company || !newDeal.name || !newDeal.amount || !newDeal.sector) {
      return;
    }

    const deal = {
      id: Date.now().toString(),
      ...newDeal,
      lastUpdate: "now",
      comments: []
    };

    setDealsData(prev => [...prev, deal]);
    setNewDeal({
      company: "",
      name: "",
      amount: "",
      sector: "",
      description: "",
      score: 5,
      stage: "New"
    });
    setAddDealOpen(false);
  };

  const handleNewDealChange = (field, value) => {
    setNewDeal(prev => ({ ...prev, [field]: value }));
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Agar stage'ga drop qilinsa
    if (stages.includes(overId)) {
      setDealsData((items) => {
        return items.map((item) => {
          if (item.id === activeId) {
            return { ...item, stage: overId };
          }
          return item;
        });
      });
    } else {
      // Agar boshqa deal'ga drop qilinsa
      const activeIndex = dealsData.findIndex((item) => item.id === activeId);
      const overIndex = dealsData.findIndex((item) => item.id === overId);
      
      if (activeIndex !== overIndex) {
        setDealsData((items) => {
          return arrayMove(items, activeIndex, overIndex);
        });
      }
    }
  };

  const handleDragOver = (event) => {
    // Drag over logic if needed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deal Pipeline</h1>
          <p className="text-muted-foreground">
            {dealsData.length} active opportunities • $44.5M total deal value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet open={sortPanelOpen} onOpenChange={setSortPanelOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Sort Panel
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-96 glass-card">
              <SheetHeader>
                <SheetTitle>Quick Sort</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                {dealsData.filter(deal => deal.stage === 'Screening' || deal.stage === 'Diligence').map(deal => (
                  <Card key={deal.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">{deal.company}</h4>
                          <p className="text-sm text-muted-foreground">{deal.name} • {deal.amount}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Progress value={deal.score * 10} className="flex-1 h-2" />
                          <span className={`text-sm font-medium ${getScoreColor(deal.score)}`}>
                            {deal.score}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDealAction(deal.id, 'accept')}
                            className="flex-1 bg-success hover:bg-success/90 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDealAction(deal.id, 'hold')}
                            className="flex-1 border-warning text-warning hover:bg-warning/10"
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Hold
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDealAction(deal.id, 'reject')}
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={() => setAddDealOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Kanban Board with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 pipeline-scrollbar">
          {stages.map((stage) => (
            <DroppableStage
              key={stage}
              stage={stage}
              deals={dealsByStage[stage]}
              onDealAction={handleDealAction}
              getScoreColor={getScoreColor}
              getSectorColor={getSectorColor}
              setSelectedDeal={setSelectedDeal}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <div className="transform rotate-2 scale-105 shadow-2xl">
              <SortableDeal
                deal={dealsData.find(deal => deal.id === activeId)}
                onDealAction={handleDealAction}
                getScoreColor={getScoreColor}
                getSectorColor={getSectorColor}
                setSelectedDeal={setSelectedDeal}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Deal Details Panel (if selected) */}
      {selectedDeal && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 glass-sidebar border-l border-border/50 p-4 sm:p-6 overflow-y-auto z-50">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{selectedDeal.company}</h2>
                <p className="text-sm text-muted-foreground">{selectedDeal.name} • {selectedDeal.amount}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDeal(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedDeal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Score</h3>
                  <div className="space-y-2">
                    <Progress value={selectedDeal.score * 10} className="h-2" />
                    <p className={`text-lg font-bold ${getScoreColor(selectedDeal.score)}`}>
                      {selectedDeal.score}/10
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Stage</h3>
                  <Badge variant="outline">{selectedDeal.stage}</Badge>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Quick Comments</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedDeal.comments.map(comment => (
                    <div key={comment.id} className="glass-card p-3 text-sm">
                      <p className="text-foreground/90">{comment.text}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{comment.author}</span>
                        <span>•</span>
                        <span>{comment.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a quick comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 resize-none h-20 text-sm"
                  />
                  <Button 
                    size="sm"
                    onClick={() => addComment(selectedDeal.id)}
                    disabled={!newComment.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDealAction(selectedDeal.id, 'accept')}
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDealAction(selectedDeal.id, 'hold')}
                    className="border-warning text-warning hover:bg-warning/10"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Hold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDealAction(selectedDeal.id, 'reject')}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
                <Button className="w-full">Schedule Meeting</Button>
                <Button variant="outline" className="w-full">Add to IC</Button>
                <Button variant="outline" className="w-full">
                  <Building className="h-4 w-4 mr-2" />
                  Company Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Panel (if open) */}
      {addDealOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 glass-sidebar border-l border-border/50 p-4 sm:p-6 overflow-y-auto z-50">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">Add New Deal</h2>
                <p className="text-sm text-muted-foreground">Create a new deal in your pipeline</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAddDealOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={newDeal.company}
                  onChange={(e) => handleNewDealChange("company", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Deal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Series A, Seed, Pre-Seed"
                  value={newDeal.name}
                  onChange={(e) => handleNewDealChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Deal Amount</Label>
                <Input
                  id="amount"
                  placeholder="e.g., $15M, $3M"
                  value={newDeal.amount}
                  onChange={(e) => handleNewDealChange("amount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={newDeal.sector} onValueChange={(value) => handleNewDealChange("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the deal"
                  value={newDeal.description}
                  onChange={(e) => handleNewDealChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Score (1-10)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={newDeal.score}
                      onChange={(e) => handleNewDealChange("score", parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8">{newDeal.score}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button 
                  onClick={handleAddDeal}
                  className="w-full"
                  disabled={!newDeal.company || !newDeal.name || !newDeal.amount || !newDeal.sector}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAddDealOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}