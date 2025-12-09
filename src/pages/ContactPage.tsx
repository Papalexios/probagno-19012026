import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.phone'),
      lines: ['210 6622215', '210 6622218'],
    },
    {
      icon: Mail,
      title: t('contact.email'),
      lines: ['info@probagno.gr'],
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      lines: language === 'el' 
        ? ['2ο χλμ Λεωφόρος Κορωπίου-Βάρης', 'Τ.Θ. 25 - ΤΚ 19400 - Κορωπί']
        : ['2nd km Koropi-Vari Avenue', 'P.O. Box 25 - PC 19400 - Koropi'],
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      lines: [t('contact.hoursWeekday'), t('contact.hoursSaturday')],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) throw error;

      toast({
        title: t('contact.sent'),
        description: t('contact.sentDescription'),
      });
      
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: language === 'el' ? 'Σφάλμα' : 'Error',
        description: language === 'el' ? 'Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά.' : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{language === 'el' ? 'Επικοινωνία | PROBAGNO - Έπιπλα Μπάνιου Κορωπί' : 'Contact | PROBAGNO - Bathroom Furniture Koropi'}</title>
        <meta name="description" content={language === 'el' ? 'PROBAGNO - STEFANOS PANOUSSOS & CO E.E. Τηλ: 210 6622215, 210 6622218. 2ο χλμ Λεωφόρος Κορωπίου-Βάρης, Κορωπί 194 00.' : 'PROBAGNO - STEFANOS PANOUSSOS & CO E.E. Tel: 210 6622215, 210 6622218. 2nd km Koropi-Vari Avenue, Koropi 194 00.'} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              PROBAGNO - STEFANOS PANOUSSOS & CO E.E.<br />
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <info.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-muted-foreground text-sm">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl font-bold mb-6">
                {t('contact.sendMessage')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{language === 'el' ? 'Τηλέφωνο' : 'Phone'}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('contact.phonePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact.subject')} *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto gap-2"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                </Button>
              </form>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-semibold mb-4">{t('contact.followUs')}</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.facebook.com/Probagno" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </a>
                  <a 
                    href="https://www.instagram.com/probagno" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">
                  {t('contact.visitUs')}
                </h2>
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3148.4138738866567!2d23.87308841531878!3d37.89983697973859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1976b1c7d7c17%3A0x7d72c6c3f3d3e0e0!2sPROBAGNO%20-%20STEFANOS%20PANOUSSOS%20%26%20CO%20E.E.!5e0!3m2!1sen!2sgr!4v1701234567890!5m2!1sen!2sgr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PROBAGNO Location - 2ο χλμ Λεωφόρος Κορωπίου-Βάρης, Κορωπί"
                  />
                </div>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <p className="font-semibold">PROBAGNO - STEFANOS PANOUSSOS & CO E.E.</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'el' ? '2ο Χλμ Λεωφόρος Κορωπίου-Βάρης, Koropi 194 00' : '2nd km Koropi-Vari Avenue, Koropi 194 00'}
                  </p>
                  <a 
                    href="https://www.google.com/maps/dir//PROBAGNO+-+STEFANOS+PANOUSSOS+%26+CO+E.E.,+2o+Xlm+Leof.+Koropiou-Varis,+Koropi+194+00/@37.8998369,23.8730884,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline mt-2 inline-block"
                  >
                    {t('contact.directions')} →
                  </a>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-primary text-primary-foreground p-8 rounded-2xl">
                <h3 className="font-display text-2xl font-bold mb-4">
                  {t('contact.needHelp')}
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  {t('contact.callUs')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:2106622215" 
                    className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    210 6622215
                  </a>
                  <a 
                    href="tel:2106622218" 
                    className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    210 6622218
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </Layout>
  );
}