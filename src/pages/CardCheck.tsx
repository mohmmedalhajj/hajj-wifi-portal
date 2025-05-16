
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CardProvider, useCards, CardType } from "../context/CardContext";
import { CreditCard, Clock, Coins, Calendar } from "lucide-react";
import { format } from "date-fns";

// Wrap this component with CardProvider in App.tsx
const CardCheckContent = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [cardInfo, setCardInfo] = useState<CardType | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const { checkCard, activateCard } = useCards();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-blue-100 bg-wifi-pattern p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <CreditCard className="h-8 w-8 text-wifi-primary" />
          </div>
          <CardTitle className="text-2xl">فحص بطاقة الشبكة</CardTitle>
          <CardDescription>أدخل الرقم التسلسلي للكرت للتحقق من حالته</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
            <div className="flex space-x-2">
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="أدخل الرقم التسلسلي للكرت"
                className="ml-2"
              />
              <Button onClick={handleCheck}>فحص</Button>
            </div>
          </div>

          {cardInfo && (
            <div className="mt-6 border rounded-lg p-4 bg-white/50">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" /> معلومات الكرت
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <Coins className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">القيمة:</span>
                  </div>
                  <span className="font-medium">{cardInfo.value} ريال</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">المدة:</span>
                  </div>
                  <span className="font-medium">{cardInfo.durationHours} ساعة</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">الحالة:</span>
                  </div>
                  <span className={`font-medium ${cardInfo.isActive ? "text-green-600" : "text-amber-600"}`}>
                    {cardInfo.isActive ? "مفعّل" : "غير مفعّل"}
                  </span>
                </div>
                
                {cardInfo.isActive && (
                  <>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">تاريخ التفعيل:</span>
                      </div>
                      <span className="font-medium">
                        {cardInfo.activatedAt ? format(new Date(cardInfo.activatedAt), "yyyy-MM-dd HH:mm") : "غير مفعل"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">تاريخ الانتهاء:</span>
                      </div>
                      <span className="font-medium">
                        {cardInfo.expiresAt ? format(new Date(cardInfo.expiresAt), "yyyy-MM-dd HH:mm") : "غير محدد"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">الوقت المتبقي:</span>
                      </div>
                      <span className="font-medium text-green-600">
                        {calculateRemainingTime()}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {!cardInfo.isActive && (
                <Button 
                  onClick={handleActivate} 
                  className="mt-4 w-full"
                  disabled={isActivating}
                >
                  {isActivating ? "جاري التفعيل..." : "تفعيل الكرت"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-wifi-primary">
            العودة للصفحة الرئيسية
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

const CardCheck = () => (
  <CardProvider>
    <CardCheckContent />
  </CardProvider>
);

export default CardCheck;
