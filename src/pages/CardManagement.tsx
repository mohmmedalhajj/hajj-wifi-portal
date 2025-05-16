
import { useState } from "react";
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
  PlusCircle
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Card Management Content Component
const CardManagementContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cards, addCard } = useCards();
  const { toast } = useToast();
  
  const [cardValue, setCardValue] = useState<"200" | "500" | "1000">("200");
  const [cardCount, setCardCount] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  const sortedCards = [...cards].sort((a, b) => {
    // Sort by activation status (active first)
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    
    // Then sort by creation date (newest first)
    const aId = parseInt(a.id.split('-')[0]);
    const bId = parseInt(b.id.split('-')[0]);
    return bId - aId;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-wifi-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-full">
              <div className="w-8 h-8 bg-wifi-primary rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 bg-white rounded-full opacity-70 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold">لوحة تحكم الحاج نت</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">مرحباً, {user?.username}</span>
            <Button variant="outline" onClick={handleLogout} className="bg-white/10 border-white/20 hover:bg-white/20">
              <LogOut size={18} className="mr-2" /> خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Sidebar and Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-64px)] shadow-md p-4 fixed left-0">
          <nav className="space-y-2">
            <Link to="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <LayoutDashboard size={18} className="mr-2" /> لوحة التحكم
            </Link>
            <Link to="/admin/card-management" className="flex items-center p-3 rounded-lg bg-wifi-light text-wifi-primary font-medium">
              <CreditCard size={18} className="mr-2" /> إدارة الكروت
            </Link>
            <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700">
              <Home size={18} className="mr-2" /> الصفحة الرئيسية
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-6 flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">إدارة الكروت</h2>
            <p className="text-gray-600">إنشاء وإدارة بطاقات شبكة الحاج نت</p>
          </div>

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="create">إنشاء كروت جديدة</TabsTrigger>
              <TabsTrigger value="manage">إدارة الكروت الحالية</TabsTrigger>
              <TabsTrigger value="search">بحث عن كرت</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>إنشاء كروت جديدة</CardTitle>
                  <CardDescription>قم بإنشاء كروت جديدة لشبكة الحاج نت</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <Button onClick={handleCreateCards} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    إنشاء الكروت
                  </Button>
                  
                  <div className="border p-4 rounded-lg mt-6 bg-blue-50">
                    <h3 className="font-medium text-wifi-primary mb-2">معلومات الكروت</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• كرت 200 ريال: صالح لمدة يوم واحد (24 ساعة)</li>
                      <li>• كرت 500 ريال: صالح لمدة ثلاثة أيام (72 ساعة)</li>
                      <li>• كرت 1000 ريال: صالح لمدة أسبوع كامل (168 ساعة)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الكروت الحالية</CardTitle>
                  <CardDescription>جميع الكروت المتوفرة في النظام</CardDescription>
                </CardHeader>
                <CardContent>
                  {cards.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right py-3 px-2 font-medium">الرقم التسلسلي</th>
                            <th className="text-right py-3 px-2 font-medium">القيمة</th>
                            <th className="text-right py-3 px-2 font-medium">المدة</th>
                            <th className="text-right py-3 px-2 font-medium">الحالة</th>
                            <th className="text-right py-3 px-2 font-medium">تاريخ التفعيل</th>
                            <th className="text-right py-3 px-2 font-medium">تاريخ الانتهاء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCards.slice(0, 10).map((card) => (
                            <tr key={card.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2">{card.serialNumber}</td>
                              <td className="py-3 px-2">{card.value} ريال</td>
                              <td className="py-3 px-2">{card.durationHours} ساعة</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded text-xs ${card.isActive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {card.isActive ? 'مفعّل' : 'غير مفعّل'}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                {card.activatedAt 
                                  ? format(new Date(card.activatedAt), 'yyyy-MM-dd HH:mm') 
                                  : '—'}
                              </td>
                              <td className="py-3 px-2">
                                {card.expiresAt 
                                  ? format(new Date(card.expiresAt), 'yyyy-MM-dd HH:mm') 
                                  : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {cards.length > 10 && (
                        <div className="text-center mt-4 text-gray-500">
                          تم عرض 10 كروت من أصل {cards.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">لا توجد كروت مضافة حتى الآن</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>بحث عن كرت</CardTitle>
                  <CardDescription>ابحث عن كرت باستخدام الرقم التسلسلي أو القيمة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="ابحث عن كرت..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button onClick={handleSearchCards}>
                      <Search className="mr-2 h-4 w-4" />
                      بحث
                    </Button>
                  </div>
                  
                  {filteredCards.length > 0 ? (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right py-3 px-2 font-medium">الرقم التسلسلي</th>
                            <th className="text-right py-3 px-2 font-medium">القيمة</th>
                            <th className="text-right py-3 px-2 font-medium">المدة</th>
                            <th className="text-right py-3 px-2 font-medium">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCards.map((card) => (
                            <tr key={card.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-2">{card.serialNumber}</td>
                              <td className="py-3 px-2">{card.value} ريال</td>
                              <td className="py-3 px-2">{card.durationHours} ساعة</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-1 rounded text-xs ${card.isActive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {card.isActive ? 'مفعّل' : 'غير مفعّل'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">لم يتم العثور على نتائج</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

const CardManagement = () => (
  <CardProvider>
    <CardManagementContent />
  </CardProvider>
);

export default CardManagement;
