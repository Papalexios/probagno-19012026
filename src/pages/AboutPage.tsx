import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Award, Users, Factory, Leaf, Shield, Clock } from 'lucide-react';
import heroImage from '@/assets/hero-bathroom.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const stats = [
    { number: '50+', label: t('about.yearsExperience'), icon: Clock },
    { number: '10,000+', label: t('about.satisfiedClients'), icon: Users },
    { number: '500+', label: t('about.productModels'), icon: Factory },
    { number: '100%', label: t('about.greekProduction'), icon: Shield },
  ];

  const values = [
    {
      icon: Award,
      title: t('about.quality'),
      description: t('about.qualityDesc'),
    },
    {
      icon: Factory,
      title: t('about.greekManufacturing'),
      description: t('about.greekManufacturingDesc'),
    },
    {
      icon: Users,
      title: t('about.service'),
      description: t('about.serviceDesc'),
    },
    {
      icon: Leaf,
      title: t('about.environmental'),
      description: t('about.environmentalDesc'),
    },
  ];

  const timeline = [
    { year: '1974', title: t('about.founding'), description: t('about.timeline.1974') },
    { year: '1985', title: t('about.expansion'), description: t('about.timeline.1985') },
    { year: '1995', title: t('about.exports'), description: t('about.timeline.1995') },
    { year: '2010', title: t('about.ledTechnology'), description: t('about.timeline.2010') },
    { year: '2020', title: t('about.digitalEra'), description: t('about.timeline.2020') },
    { year: '2024', title: t('about.today'), description: t('about.timeline.2024') },
  ];

  const materials = [
    'Swiss Krono CDF',
    'Corian',
    language === 'el' ? 'Μασίφ Δρυς' : 'Solid Oak',
    language === 'el' ? 'Λάκα Γυαλιστερή' : 'Glossy Lacquer',
    'Matrix/S4',
    'LED Technology'
  ];

  return (
    <Layout>
      <Helmet>
        <title>{language === 'el' ? 'Η Εταιρεία | PROBAGNO - Έπιπλα Μπάνιου από το 1974' : 'About Us | PROBAGNO - Bathroom Furniture Since 1974'}</title>
        <meta name="description" content={language === 'el' ? 'Η PROBAGNO κατασκευάζει έπιπλα μπάνιου στην Ελλάδα από το 1974. 50 χρόνια εμπειρίας, ποιότητας και καινοτομίας.' : 'PROBAGNO manufactures bathroom furniture in Greece since 1974. 50 years of experience, quality and innovation.'} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="PROBAGNO Factory" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6"
          >
            <span className="text-sm font-medium">Since 1974</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            {t('about.heroSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                {t('about.ourStory')}
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>{t('about.storyP1')}</p>
                <p>{t('about.storyP2')}</p>
                <p>{t('about.storyP3')}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img 
                  src={heroImage} 
                  alt="PROBAGNO Workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl">
                <div className="font-display text-4xl font-bold">1974</div>
                <div className="text-sm">{t('about.yearFounded')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {t('about.ourValues')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.valuesSubtitle')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {t('about.ourJourney')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.journeySubtitle')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border hidden md:block" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-muted/50 p-6 rounded-2xl inline-block">
                      <div className="font-display text-3xl font-bold text-primary mb-2">
                        {item.year}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary shrink-0 hidden md:block" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {t('about.materialsFinishes')}
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              {t('about.materialsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {materials.map((material, index) => (
              <motion.div
                key={material}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <span className="font-medium">{material}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-primary-foreground/5 rounded-2xl"
          >
            <h3 className="font-semibold text-lg mb-4">{t('about.importantInfo')}</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>• {t('about.info1')}</li>
              <li>• {t('about.info2')}</li>
              <li>• {t('about.info3')}</li>
              <li>• {t('about.info4')}</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}