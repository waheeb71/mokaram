import React, { useState } from 'react';
import { X, Send, CheckCircle, Phone, MessageSquare } from 'lucide-react';
import { SiteSettings } from '../types.ts';
import { SERVICES_DATA } from '../data/content.ts';

interface QuoteModalProps {
  isOpen: boolean;
  initialService?: string;
  lang: 'ar' | 'en';
  settings: SiteSettings;
  onClose: () => void;
  onQuoteSubmitted?: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  initialService = '',
  lang,
  settings,
  onClose,
  onQuoteSubmitted,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(initialService || (isAr ? 'الأعمال الكهربائية' : 'Electrical'));
  const [city, setCity] = useState(isAr ? 'الرياض' : 'Riyadh');
  const [district, setDistrict] = useState('');
  const [details, setDetails] = useState('');
  const [preferredTime, setPreferredTime] = useState(isAr ? 'في أقرب وقت ممكن' : 'As soon as possible');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال الاسم ورقم الجوال.' : 'Please enter your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          service_type: serviceType,
          city,
          district,
          details,
          preferred_time: preferredTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        if (onQuoteSubmitted) onQuoteSubmitted();
      } else {
        setErrorMsg(data.error || (isAr ? 'حدث خطأ أثناء الإرسال.' : 'Error sending request.'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    isAr
      ? `مرحباً مؤسسة ريم النفوذ، أنا ${customerName || 'عميل'}، طلبت عرض سعر لخدمة (${serviceType}) في (${city}${district ? ' - ' + district : ''}). تفاصيل مشروعي: ${details || 'أرغب بالمعاينة والتسعير'}.`
      : `Hello Reem Al-Nufood, I requested a quote for ${serviceType} in ${city}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl shadow-2xl overflow-hidden my-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8E2D5] bg-white shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#15181F]">
              {isAr ? 'طلب عرض سعر واستشارة فورية' : 'Request Quotation & On-Site Survey'}
            </h3>
            <span className="text-xs text-[#717786]">
              {isAr ? 'مؤسسة ريم النفوذ · الرياض والخرج' : 'Reem Al-Nufood · Riyadh & Al-Kharj'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#717786] hover:text-[#15181F] hover:bg-[#F2EDE2] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 overflow-y-auto">
          {success ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#9B7846]/15 border border-[#9B7846] text-[#9B7846] mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#15181F] mb-2">
                  {isAr ? 'تم استلام طلبكم بنجاح!' : 'Your Request Has Been Received!'}
                </h4>
                <p className="text-xs sm:text-sm text-[#5A6273] leading-relaxed max-w-md mx-auto">
                  {isAr
                    ? 'شكراً لثقتكم بمؤسسة ريم النفوذ. تم حفظ تفاصيل طلبكم في قاعدة بياناتنا وسيتم التواصل معكم من قِبل المهندس المختص في أقرب وقت.'
                    : 'Thank you for choosing Reem Al-Nufood. Our engineering representative will contact you shortly.'}
                </p>
              </div>

              {/* Direct Instant Action Links */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-xl transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isAr ? 'متابعة الطلب عبر الواتساب فوراً' : 'Follow Up on WhatsApp Now'}</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-medium text-[#1E2229] bg-[#EAE3D5] hover:bg-[#DDD5C5] rounded-xl transition-colors"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {errorMsg && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                    {isAr ? 'الاسم الكريم *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: أبو فهد' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] placeholder-[#9CA3AF] focus:outline-none transition-colors shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                    {isAr ? 'رقم الجوال *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] placeholder-[#9CA3AF] focus:outline-none transition-colors text-right shadow-xs"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                  {isAr ? 'نوع الخدمة أو النشاط المطلوب *' : 'Service Type *'}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] focus:outline-none transition-colors shadow-xs"
                >
                  {SERVICES_DATA.map((s) => (
                    <option key={s.id} value={isAr ? s.title_ar : s.title_en}>
                      {isAr ? s.title_ar : s.title_en}
                    </option>
                  ))}
                  <option value={isAr ? 'مشروع متكامل متعدد البنود' : 'Turnkey Multi-Service Project'}>
                    {isAr ? 'مشروع متكامل متعدد البنود' : 'Turnkey Multi-Service Project'}
                  </option>
                </select>
              </div>

              {/* City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                    {isAr ? 'المدينة *' : 'City *'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] focus:outline-none transition-colors shadow-xs"
                  >
                    <option value="الرياض">{isAr ? 'الرياض' : 'Riyadh'}</option>
                    <option value="الخرج">{isAr ? 'الخرج' : 'Al-Kharj'}</option>
                    <option value="الدرعية">{isAr ? 'الدرعية' : 'Diriyah'}</option>
                    <option value="الدلم">{isAr ? 'الدلم' : 'Ad-Dilam'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                    {isAr ? 'الحي أو الموقع التقريبي' : 'District / Neighborhood'}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={isAr ? 'مثال: حي الملقا / حي السلام' : 'e.g. Al-Malqa'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] placeholder-[#9CA3AF] focus:outline-none transition-colors shadow-xs"
                  />
                </div>
              </div>

              {/* Details & Specifications */}
              <div>
                <label className="block text-xs font-semibold text-[#15181F] mb-1.5">
                  {isAr ? 'تفاصيل المشروع والمواصفات المطلوبة' : 'Project Details & Specifications'}
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    isAr
                      ? 'يرجى كتابة تفاصيل العمل، المساحات التقريبية، وأي متطلبات خاصة...'
                      : 'Provide details, approximate dimensions, or specifications...'
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DDD5C5] focus:border-[#9B7846] rounded-xl text-xs sm:text-sm text-[#15181F] placeholder-[#9CA3AF] focus:outline-none transition-colors resize-none shadow-xs"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white bg-[#9B7846] hover:bg-[#866637] rounded-xl shadow-lg shadow-[#9B7846]/20 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>{isAr ? 'جارٍ تسجيل الطلب...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال طلب عرض السعر' : 'Submit Quotation Request'}</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
