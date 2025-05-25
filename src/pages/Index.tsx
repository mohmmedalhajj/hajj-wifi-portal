
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LogIn, User, Users, CreditCard } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white bg-wifi-pattern">
      <header className="bg-gradient-to-r from-red-600 to-black text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-full">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 bg-white rounded-full opacity-70 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold">الحاج نت</h1>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">مرحبا, {user?.username}</span>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                    لوحة التحكم
                  </Button>
                </Link>
              )}
              <Link to="/card-check">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  فحص الكرت
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/user-login">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  دخول المستخدمين
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  دخول المسؤولين
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">مرحباً بك في شبكة الحاج نت</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            أسرع وأفضل خدمة إنترنت في المنطقة. اشترك الآن واستمتع بتصفح سريع وغير محدود.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow border-2 border-red-100">
            <CardHeader className="text-center">
              <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600">دخول المستخدمين</CardTitle>
              <CardDescription>تسجيل الدخول للمشتركين في الشبكة</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى حسابك وإدارة اشتراكك</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/user-login">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <LogIn className="mr-2 h-4 w-4" /> تسجيل الدخول
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow border-2 border-black/20">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gray-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <CreditCard className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-black">فحص بطاقة الشبكة</CardTitle>
              <CardDescription>تحقق من رصيد ومدة بطاقة الشبكة الخاصة بك</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">أدخل رقم البطاقة للتحقق من المدة المتبقية والرصيد</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/card-check">
                <Button className="w-full bg-black hover:bg-gray-800">
                  فحص البطاقة
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-xl transition-shadow border-2 border-red-100">
            <CardHeader className="text-center">
              <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600">دخول المسؤولين</CardTitle>
              <CardDescription>لوحة تحكم مخصصة لمسؤولي الشبكة</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">تسجيل دخول للمسؤولين لإدارة الشبكة وإنشاء البطاقات</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/admin-login">
                <Button className="w-full bg-red-600 hover:bg-red-700" variant="outline">
                  <LogIn className="mr-2 h-4 w-4" /> دخول المسؤولين
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-black">باقات الإنترنت</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-red-600 hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-white">
              <CardHeader>
                <CardTitle className="text-red-600">كرت 200 ريال</CardTitle>
                <CardDescription>استخدام لمدة يوم كامل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-4">200 ريال</div>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ تصفح سريع</li>
                  <li>✓ صالح لمدة 24 ساعة</li>
                  <li>✓ دعم فني</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-black hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-50 to-white">
              <CardHeader>
                <CardTitle className="text-black">كرت 500 ريال</CardTitle>
                <CardDescription>استخدام لمدة ثلاثة أيام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-black mb-4">500 ريال</div>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ تصفح سريع</li>
                  <li>✓ صالح لمدة 3 أيام</li>
                  <li>✓ دعم فني ممتاز</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-red-800 hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-white">
              <CardHeader>
                <CardTitle className="text-red-800">كرت 1000 ريال</CardTitle>
                <CardDescription>استخدام لمدة أسبوع كامل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-800 mb-4">1000 ريال</div>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ تصفح فائق السرعة</li>
                  <li>✓ صالح لمدة 7 أيام</li>
                  <li>✓ أولوية في الدعم الفني</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 شبكة الحاج نت - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
