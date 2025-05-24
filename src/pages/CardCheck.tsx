import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CardProvider, useCards, CardType } from "../context/CardContext";
import { CreditCard, Clock, Coins, Calendar, LogOut, Search, CheckCircle, AlertCircle, Timer } from "lucide-react";
import { format } from "date-fns";

// Wrap this component with CardProvider in App.tsx
const CardCheckContent = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [cardInfo, setCardInfo] = useState<CardType | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { checkCard, activateCard, logoutCard } = useCards();
  const { toast } = useToast();

  const handleCheck = () => {
    if (!serialNumber.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال الرقم التسلسلي للكرت",
        variant: "destructive",
      });
      return;
    }

    const card = checkCard(serialNumber);
    setCardInfo(card);

    if (!card) {
      toast({
        title: "كرت غير صالح",
        description: "لم يتم العثور على الكرت، يرجى التحقق من الرقم التسلسلي",
        variant: "destructive",
      });
    }
  };

  const handleActivate = () => {
    if (!cardInfo) return;

    setIsActivating(true);
    const activatedCard = activateCard(cardInfo.serialNumber);

    if (activatedCard) {
      setCardInfo(activatedCard);
      toast({
        title: "تم تفعيل الكرت بنجاح",
        description: `تم تفعيل كرت بقيمة ${activatedCard.value} ريال`,
      });
    } else {
      toast({
        title: "فشل التفعيل",
        description: "لم يتم تفعيل الكرت، ربما تم تفعيله مسبقاً",
        variant: "destructive",
      });
    }
    setIsActivating(false);
  };

  const handleLogout = () => {
    if (!cardInfo) return;

    setIsLoggingOut(true);
    const loggedOutCard = logoutCard(cardInfo.serialNumber);

    if (loggedOutCard) {
      setCardInfo(loggedOutCard);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: `تم حفظ الوقت المتبقي للكرت: ${formatRemainingTimeMs(loggedOutCard.remainingTime || 0)}`,
      });
    } else {
      toast({
        title: "فشل تسجيل الخروج",
        description: "لم يتم تسجيل الخروج من الكرت",
        variant: "destructive",
      });
    }
    setIsLoggingOut(false);
  };

  const calculateRemainingTime = () => {
    if (!cardInfo?.isActive || !cardInfo?.expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(cardInfo.expiresAt);
    
    if (expiry <= now) return "منتهي الصلاحية";
    
    const diffMs = expiry.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs} ساعة و ${diffMins} دقيقة`;
  };

  const formatRemainingTimeMs = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ساعة و ${minutes} دقيقة`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 bg-wifi-pattern p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            فحص بطاقة الشبكة
          </h1>
          <p className="text-gray-600 text-lg">تحقق من حالة ورصيد بطاقة الإنترنت الخاصة بك</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Search Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center">
                <Search className="mr-2 h-5 w-5" />
                البحث عن البطاقة
              </CardTitle>
              <CardDescription className="text-blue-100">
                أدخل الرقم التسلسلي للبطاقة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="serialNumber" className="text-gray-700 font-medium">
                  الرقم التسلسلي
                </Label>
                <div className="relative">
                  <Input
                    id="serialNumber"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="أدخل الرقم التسلسلي للكرت"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button 
                onClick={handleCheck}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="mr-2 h-5 w-5" />
                فحص البطاقة
              </Button>
            </CardContent>
          </Card>

          {/* Card Info Display */}
          {cardInfo && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className={`${cardInfo.isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'} text-white rounded-t-lg`}>
                <CardTitle className="text-xl flex items-center">
                  {cardInfo.isActive ? (
                    <CheckCircle className="mr-2 h-5 w-5" />
                  ) : (
                    <AlertCircle className="mr-2 h-5 w-5" />
                  )}
                  معلومات البطاقة
                </CardTitle>
                <CardDescription className={cardInfo.isActive ? "text-green-100" : "text-orange-100"}>
                  حالة البطاقة: {cardInfo.isActive ? "نشطة" : "غير نشطة"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {/* Card Value */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="bg-blue-500 p-2 rounded-full mr-3">
                        <Coins className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">قيمة البطاقة</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{cardInfo.value} ريال</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <div className="bg-purple-500 p-2 rounded-full mr-3">
                        <Timer className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">مدة الصلاحية</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">{cardInfo.durationHours} ساعة</span>
                  </div>

                  {cardInfo.isActive && (
                    <>
                      {/* Activation Date */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <div className="bg-green-500 p-2 rounded-full mr-3">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">تاريخ التفعيل</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {cardInfo.activatedAt ? format(new Date(cardInfo.activatedAt), "yyyy-MM-dd HH:mm") : "غير مفعل"}
                        </span>
                      </div>

                      {/* Expiry Date */}
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                          <div className="bg-red-500 p-2 rounded-full mr-3">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">تاريخ الانتهاء</span>
                        </div>
                        <span className="text-sm font-medium text-red-600">
                          {cardInfo.expiresAt ? format(new Date(cardInfo.expiresAt), "yyyy-MM-dd HH:mm") : "غير محدد"}
                        </span>
                      </div>

                      {/* Remaining Time */}
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-emerald-500 p-2 rounded-full mr-3">
                              <Clock className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-gray-700 font-medium">الوقت المتبقي</span>
                          </div>
                          <span className="text-xl font-bold text-emerald-600">
                            {calculateRemainingTime()}
                          </span>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <Button 
                        onClick={handleLogout}
                        className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                        disabled={isLoggingOut}
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                      </Button>
                    </>
                  )}

                  {!cardInfo.isActive && (
                    <>
                      {cardInfo.remainingTime && cardInfo.remainingTime > 0 ? (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="flex items-center mb-3">
                            <Clock className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-800 font-medium">رصيد متبقي</span>
                          </div>
                          <p className="text-blue-700 mb-4 text-center">
                            هذا الكرت لديه رصيد متبقي: <span className="font-bold">{formatRemainingTimeMs(cardInfo.remainingTime)}</span>
                          </p>
                          <Button 
                            onClick={handleActivate} 
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                            disabled={isActivating}
                          >
                            {isActivating ? "جاري إعادة التفعيل..." : "إعادة تفعيل الكرت"}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleActivate} 
                          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                          disabled={isActivating}
                        >
                          {isActivating ? "جاري التفعيل..." : "تفعيل الكرت"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all text-gray-600 hover:text-purple-600 font-medium"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

const CardCheck = () => (
  <CardProvider>
    <CardCheckContent />
  </CardProvider>
);

export default CardCheck;
