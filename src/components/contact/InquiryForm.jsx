import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', projectType: '',
    budget: '', timeline: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('يرجى ملء الحقول المطلوبة.');
      return;
    }
    setError('');
    // يمكن ربط هذا لاحقاً بـ API endpoint أو Resend/Nodemailer
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
        <h3 className="font-body text-2xl md:text-3xl font-light text-foreground mb-4">شكرًا على تواصلك.</h3>
        <p className="font-body text-base text-muted-foreground">سأراجع رسالتك وأردّ خلال 48 ساعة.</p>
      </motion.div>
    );
  }

  const inputCls = 'bg-transparent border-0 border-b border-border w-full font-body text-base h-12 focus:outline-none focus:border-b-2 focus:border-cobalt transition-colors placeholder:text-muted-foreground/50';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">الاسم *</label>
          <input value={formData.name} onChange={e => handleChange('name', e.target.value)}
            placeholder="اسمك الكامل" className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">البريد الإلكتروني *</label>
          <input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)}
            placeholder="you@company.com" className={inputCls} dir="ltr" />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">الشركة</label>
          <input value={formData.company} onChange={e => handleChange('company', e.target.value)}
            placeholder="اسم الشركة" className={inputCls} />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">نوع المشروع</label>
          <select value={formData.projectType} onChange={e => handleChange('projectType', e.target.value)}
            className={`${inputCls} bg-background`}>
            <option value="">اختر نوعًا</option>
            <option value="web">تطبيق ويب</option>
            <option value="ai">وكيل ذكاء اصطناعي</option>
            <option value="api">API / Backend</option>
            <option value="design">تصميم</option>
            <option value="other">أخرى</option>
          </select>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">الميزانية</label>
          <select value={formData.budget} onChange={e => handleChange('budget', e.target.value)}
            className={`${inputCls} bg-background`}>
            <option value="">اختر نطاقًا</option>
            <option value="1-5k">$1K – $5K</option>
            <option value="5-15k">$5K – $15K</option>
            <option value="15-50k">$15K – $50K</option>
            <option value="50k+">$50K+</option>
          </select>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">الجدول الزمني</label>
          <select value={formData.timeline} onChange={e => handleChange('timeline', e.target.value)}
            className={`${inputCls} bg-background`}>
            <option value="">اختر مدة</option>
            <option value="1-2months">1 – 2 أشهر</option>
            <option value="3-6months">3 – 6 أشهر</option>
            <option value="6months+">6+ أشهر</option>
            <option value="flexible">مرن</option>
          </select>
        </div>
      </div>
      <div>
        <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">تفاصيل المشروع *</label>
        <textarea value={formData.message} onChange={e => handleChange('message', e.target.value)}
          placeholder="أخبرني عن مشروعك وأهدافك..." rows={6}
          className="bg-transparent border-0 border-b border-border w-full font-body text-base focus:outline-none focus:border-b-2 focus:border-cobalt transition-colors placeholder:text-muted-foreground/50 resize-none" />
      </div>
      <button type="submit"
        className="inline-flex items-center justify-center px-10 py-4 bg-charcoal text-gallery font-mono text-xs tracking-widest uppercase hover:bg-cobalt transition-colors duration-300">
        إرسال الاستفسار
      </button>
    </form>
  );
}
