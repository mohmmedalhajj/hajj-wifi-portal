
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardProvider, useCards, CardType } from "../context/CardContext";
import { 
  Home, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  Plus,
  Search,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCcw, // Added for reactivation
  Check,
  X
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Card Management Content Component
const CardManagementContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cards, addCard, logoutCard, reactivateCard } = useCards();
  const { toast } = useToast();
  
  const [cardValue, setCardValue] = useState<"200" | "500" | "1000">("200");
  const [cardCount, setCardCount] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);
  const [autoGenerateInterval, setAutoGenerateInterval] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Auto-generate cards functionality
  useEffect(() => {
    if (autoGenerateEnabled && autoGenerateInterval === null) {
      // Generate a card every 10 seconds when enabled
      const intervalId = window.setInterval(() => {
        const randomValue = ["200", "500", "1000"][Math.floor(Math.random() * 3)] as "200" | "500" | "1000";
        // Convert string to number using parseInt, then cast to allowed type
        addCard(parseInt(randomValue) as 200 | 500 | 1000, 1);
        
        toast({
          title: "تم إنشاء كرت جديد تلقائيًا",
          description: `تم إنشاء كرت جديد بقيمة ${randomValue} ريال`,
        });
      }, 10000);
      
      setAutoGenerateInterval(intervalId);
    } else if (!autoGenerateEnabled && autoGenerateInterval !== null) {
      // Clear the interval when disabled
      clearInterval(autoGenerateInterval);
      setAutoGenerateInterval(null);
    }
    
    // Clean up the interval when the component unmounts
    return () => {
      if (autoGenerateInterval !== null) {
        clearInterval(autoGenerateInterval);
      }
    };
  }, [autoGenerateEnabled, autoGenerateInterval, addCard, toast]);

  const handleCreateCards = () => {
    const count = parseInt(cardCount);
    const value = parseInt(cardValue) as 200 | 500 | 1000;
    
    if (isNaN(count) || count <= 0 || count > 100) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد صحيح بين 1 و 100",
        variant: "destructive",
      });
      return;
    }
    
    addCard(value, count);
    
    toast({
      title: "تم إنشاء الكروت بنجاح",
      description: `تم إنشاء ${count} كرت جديد بقيمة ${value} ريال`,
    });
    
    // Reset form
    setCardCount("1");
  };

  const handleSearchCards = () => {
    if (!searchQuery.trim()) {
      setFilteredCards([]);
      return;
    }
    
    const results = cards.filter(card => 
      card.serialNumber.includes(searchQuery) || 
      card.value.toString().includes(searchQuery)
    );
    
    setFilteredCards(results);
    
    toast({
      title: "نتائج البحث",
      description: `تم العثور على ${results.length} كرت`,
    });
  };

  // Handle card logout
  const handleCardLogout = (serialNumber: string) => {
    const result = logoutCard(serialNumber);
    if (result) {
      toast({
        title: "تم تسجيل الخروج",
        description: `تم تسجيل خروج الكرت ${serialNumber} بنجاح. يمكن إعادة استخدامه لاحقاً`,
      });
    }
  };

  // Handle card reactivation
  const handleCardReactivate = (serialNumber: string) => {
    const result = reactivateCard(serialNumber);
    if (result) {
      toast({
        title: "تم إعادة تفعيل الكرت",
        description: `تم إعادة تفعيل الكرت ${serialNumber} بنجاح`,
      });
    } else {
      toast({
        title: "فشل إعادة التفعيل",
        description: "لا يمكن إعادة تفعيل هذا الكرت",
        variant: "destructive"
      });
    }
  };

  // Get status text and styling for a card
  const getCardStatusInfo = (card: CardType) => {
    if (card.isActive) {
      return {
        text: "مفعّل",
        className: "bg-emerald-100 text-emerald-800"
      };
    } else if (card.remainingTime && card.remainingTime > 0) {
      return {
        text: "متوقف مؤقتًا",
        className: "bg-amber-100 text-amber-800"
      };
    } else {
      return {
        text: "غير مفعّل",
        className: "bg-slate-100 text-slate-800"
      };
    }
  };

  // Format remaining time for display
  const formatRemainingTime = (milliseconds: number) => {
    if (!milliseconds) return "—";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} ساعة ${minutes} دقيقة`;
  };

  const sortedCards = [...cards].sort((a, b) => {
    // Sort by activation status (active first)
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    
    // Then sort by cards with remaining time
    if ((a.remainingTime && a.remainingTime > 0) !== (b.remainingTime && b.remainingTime > 0)) {
      return (a.remainingTime && a.remainingTime > 0) ? -1 : 1;
    }
    
    // Then sort by creation date (newest first)
    const aId = parseInt(a.id.split('-')[0]);
    const bId = parseInt(b.id.split('-')[0]);
    return bId - aId;
  });

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = sortedCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(sortedCards.length / cardsPerPage);

  // Create the App sidebar component
  const AppSidebar = () => {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2 p-4">
            <div className="bg-white p-1 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 bg-white rounded-full opacity-70 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-lg font-bold text-foreground">الحاج نت</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="لوحة التحكم">
                <Link to="/admin" className="sidebar-link">
                  <LayoutDashboard size={18} className="mr-2" /> 
                  <span>لوحة التحكم</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive tooltip="إدارة الكروت">
                <Link to="/admin/card-management" className="sidebar-link active">
                  <CreditCard size={18} className="mr-2" /> 
                  <span>إدارة الكروت</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="الصفحة الرئيسية">
                <Link to="/" className="sidebar-link">
                  <Home size={18} className="mr-2" /> 
                  <span>الصفحة الرئيسية</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut size={18} className="mr-2" /> خروج
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Admin Header */}
          <header className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white p-4 shadow-lg z-10">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-white hover:bg-white/20 hover:text-white" />
                <h1 className="text-xl font-bold">لوحة تحكم الحاج نت</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm">مرحباً, {user?.username}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6 flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">إدارة الكروت</h2>
              <p className="text-muted-foreground">إنشاء وإدارة بطاقات شبكة الحاج نت</p>
            </div>

            <Tabs defaultValue="manage" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="create">إنشاء كروت جديدة</TabsTrigger>
                <TabsTrigger value="manage">إدارة الكروت الحالية</TabsTrigger>
                <TabsTrigger value="search">بحث عن كرت</TabsTrigger>
                <TabsTrigger value="auto">الإنشاء التلقائي</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <Card className="border-emerald-200 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <CardTitle>إنشاء كروت جديدة</CardTitle>
                    <CardDescription>قم بإنشاء كروت جديدة لشبكة الحاج نت</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardValue">قيمة الكرت</Label>
                        <Select value={cardValue} onValueChange={(value) => setCardValue(value as "200" | "500" | "1000")}>
                          <SelectTrigger id="cardValue">
                            <SelectValue placeholder="اختر قيمة الكرت" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="200">200 ريال (يوم واحد)</SelectItem>
                            <SelectItem value="500">500 ريال (3 أيام)</SelectItem>
                            <SelectItem value="1000">1000 ريال (أسبوع)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardCount">عدد الكروت</Label>
                        <Input
                          id="cardCount"
                          type="number"
                          min="1"
                          max="100"
                          value={cardCount}
                          onChange={(e) => setCardCount(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleCreateCards} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      إنشاء الكروت
                    </Button>
                    
                    <div className="border p-4 rounded-lg mt-6 bg-emerald-50 shadow-sm">
                      <h3 className="font-medium text-emerald-800 mb-2">معلومات الكروت</h3>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        <li>• كرت 200 ريال: صالح لمدة يوم واحد (24 ساعة)</li>
                        <li>• كرت 500 ريال: صالح لمدة ثلاثة أيام (72 ساعة)</li>
                        <li>• كرت 1000 ريال: صالح لمدة أسبوع كامل (168 ساعة)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="manage">
                <Card className="border-emerald-200 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <CardTitle>إدارة الكروت الحالية</CardTitle>
                    <CardDescription>جميع الكروت المتوفرة في النظام</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cards.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">الرقم التسلسلي</TableHead>
                              <TableHead className="text-right">القيمة</TableHead>
                              <TableHead className="text-right">المدة</TableHead>
                              <TableHead className="text-right">الحالة</TableHead>
                              <TableHead className="text-right">الوقت المتبقي</TableHead>
                              <TableHead className="text-right">تاريخ التفعيل</TableHead>
                              <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                              <TableHead className="text-right">إجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentCards.map((card) => {
                              const statusInfo = getCardStatusInfo(card);
                              return (
                                <TableRow key={card.id} className="hover:bg-emerald-50/50">
                                  <TableCell>{card.serialNumber}</TableCell>
                                  <TableCell>{card.value} ريال</TableCell>
                                  <TableCell>{card.durationHours} ساعة</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${statusInfo.className}`}>
                                      {statusInfo.text}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {card.remainingTime ? formatRemainingTime(card.remainingTime) : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {card.activatedAt 
                                      ? format(new Date(card.activatedAt), 'yyyy-MM-dd HH:mm') 
                                      : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {card.expiresAt 
                                      ? format(new Date(card.expiresAt), 'yyyy-MM-dd HH:mm') 
                                      : '—'}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      {card.isActive && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleCardLogout(card.serialNumber)}
                                          className="text-amber-600 border-amber-600 hover:bg-amber-50"
                                          title="تسجيل الخروج"
                                        >
                                          <LogOut className="h-4 w-4" />
                                        </Button>
                                      )}
                                      {!card.isActive && card.remainingTime && card.remainingTime > 0 && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleCardReactivate(card.serialNumber)}
                                          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                          title="إعادة التفعيل"
                                        >
                                          <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center mt-4 space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="text-emerald-600"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground px-2">
                              صفحة {currentPage} من {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="text-emerald-600"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        <div className="text-center mt-4 text-muted-foreground">
                          إجمالي عدد الكروت: {cards.length}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">لا توجد كروت مضافة حتى الآن</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => document.querySelector('[value="create"]')?.dispatchEvent(new MouseEvent('click'))}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          إنشاء كروت جديدة
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="search">
                <Card className="border-emerald-200 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <CardTitle>بحث عن كرت</CardTitle>
                    <CardDescription>ابحث عن كرت باستخدام الرقم التسلسلي أو القيمة</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="ابحث عن كرت..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button onClick={handleSearchCards} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Search className="mr-2 h-4 w-4" />
                        بحث
                      </Button>
                    </div>
                    
                    {filteredCards.length > 0 ? (
                      <div className="overflow-x-auto mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">الرقم التسلسلي</TableHead>
                              <TableHead className="text-right">القيمة</TableHead>
                              <TableHead className="text-right">المدة</TableHead>
                              <TableHead className="text-right">الحالة</TableHead>
                              <TableHead className="text-right">الوقت المتبقي</TableHead>
                              <TableHead className="text-right">إجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCards.map((card) => {
                              const statusInfo = getCardStatusInfo(card);
                              return (
                                <TableRow key={card.id} className="hover:bg-emerald-50/50">
                                  <TableCell>{card.serialNumber}</TableCell>
                                  <TableCell>{card.value} ريال</TableCell>
                                  <TableCell>{card.durationHours} ساعة</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${statusInfo.className}`}>
                                      {statusInfo.text}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    {card.remainingTime ? formatRemainingTime(card.remainingTime) : '—'}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      {card.isActive && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleCardLogout(card.serialNumber)}
                                          className="text-amber-600 border-amber-600 hover:bg-amber-50"
                                          title="تسجيل الخروج"
                                        >
                                          <LogOut className="h-4 w-4" />
                                        </Button>
                                      )}
                                      {!card.isActive && card.remainingTime && card.remainingTime > 0 && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => handleCardReactivate(card.serialNumber)}
                                          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                          title="إعادة التفعيل"
                                        >
                                          <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : searchQuery ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">لم يتم العثور على نتائج</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="auto">
                <Card className="border-emerald-200 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <CardTitle>الإنشاء التلقائي للكروت</CardTitle>
                    <CardDescription>إنشاء كروت بشكل تلقائي كل 10 ثوان</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center space-x-4 p-4 border rounded-lg bg-emerald-50">
                        <div className="flex-1">
                          <h4 className="font-medium">الإنشاء التلقائي للكروت</h4>
                          <p className="text-sm text-muted-foreground">
                            عند تفعيل هذه الميزة، سيتم إنشاء كروت جديدة تلقائيًا كل 10 ثوانٍ بقيم عشوائية
                          </p>
                        </div>
                        <Button 
                          variant={autoGenerateEnabled ? "destructive" : "default"}
                          onClick={() => setAutoGenerateEnabled(!autoGenerateEnabled)}
                          className={autoGenerateEnabled ? "" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
                        >
                          {autoGenerateEnabled ? "إيقاف" : "تفعيل"}
                        </Button>
                      </div>
                      
                      {autoGenerateEnabled && (
                        <div className="p-4 border rounded-lg bg-emerald-50 animate-pulse">
                          <p className="text-emerald-700 text-sm text-center">
                            تم تفعيل الإنشاء التلقائي للكروت
                            <br />
                            سيتم إنشاء كرت جديد كل 10 ثوانٍ
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const CardManagement = () => (
  <CardProvider>
    <CardManagementContent />
  </CardProvider>
);

export default CardManagement;
