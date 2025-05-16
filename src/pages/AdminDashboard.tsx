
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardProvider, useCards, CardType } from "../context/CardContext";
import { 
  Home, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  PlusCircle, 
  Package, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { format } from "date-fns";

// Dashboard Content Component
const DashboardContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cards } = useCards();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    card200: 0,
    card500: 0,
    card1000: 0,
  });

  useEffect(() => {
    // Calculate statistics
    const totalCards = cards.length;
    const activeCards = cards.filter(card => card.isActive).length;
    const inactiveCards = totalCards - activeCards;
    const card200Count = cards.filter(card => card.value === 200).length;
    const card500Count = cards.filter(card => card.value === 500).length;
    const card1000Count = cards.filter(card => card.value === 1000).length;

    setStats({
      total: totalCards,
      active: activeCards,
      inactive: inactiveCards,
      card200: card200Count,
      card500: card500Count,
      card1000: card1000Count,
    });
  }, [cards]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get last 5 cards for recent activity
  const recentCards = cards.slice(-5).reverse();

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
            <Link to="/admin" className="flex items-center p-3 rounded-lg bg-wifi-light text-wifi-primary font-medium">
              <LayoutDashboard size={18} className="mr-2" /> لوحة التحكم
            </Link>
            <Link to="/admin/card-management" className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700">
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
            <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
            <p className="text-gray-600">نظرة عامة على بطاقات الشبكة والإحصائيات</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-wifi-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">إجمالي الكروت</p>
                    <h3 className="text-2xl font-bold">{stats.total}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">الكروت المفعّلة</p>
                    <h3 className="text-2xl font-bold">{stats.active}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <XCircle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">الكروت غير المفعّلة</p>
                    <h3 className="text-2xl font-bold">{stats.inactive}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-full">
                  <Link to="/admin/card-management">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" /> إنشاء كروت جديدة
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card Inventory */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>مخزون الكروت</CardTitle>
                <CardDescription>توزيع الكروت حسب القيمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-price-200 rounded-full mr-2"></div>
                      <span>كروت 200 ريال</span>
                    </div>
                    <span className="font-medium">{stats.card200}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-price-500 rounded-full mr-2"></div>
                      <span>كروت 500 ريال</span>
                    </div>
                    <span className="font-medium">{stats.card500}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-price-1000 rounded-full mr-2"></div>
                      <span>كروت 1000 ريال</span>
                    </div>
                    <span className="font-medium">{stats.card1000}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>النشاط الأخير</CardTitle>
                <CardDescription>آخر 5 كروت تم إنشاؤها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCards.length > 0 ? (
                    recentCards.map((card: CardType) => (
                      <div key={card.id} className="border-b pb-2 last:border-0">
                        <div className="flex justify-between">
                          <span className={`font-medium ${
                            card.value === 200 ? 'text-price-200' : 
                            card.value === 500 ? 'text-price-500' : 
                            'text-price-1000'
                          }`}>
                            كرت {card.value} ريال
                          </span>
                          <span className={`text-sm ${card.isActive ? 'text-green-600' : 'text-amber-600'}`}>
                            {card.isActive ? 'مفعّل' : 'غير مفعّل'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          الرقم التسلسلي: {card.serialNumber.substring(0, 8)}...
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">لا توجد كروت مضافة حتى الآن</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <CardProvider>
    <DashboardContent />
  </CardProvider>
);

export default AdminDashboard;
