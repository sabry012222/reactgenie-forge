import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, Code, Zap, Globe } from 'lucide-react';

const ReactGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال وصف للمشروع" : "Please enter a project description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call - in real app this would call Laravel backend
    setTimeout(() => {
      const mockCode = generateMockReactCode(prompt, language);
      setGeneratedCode(mockCode);
      setIsGenerating(false);
      toast({
        title: language === 'ar' ? "تم التوليد بنجاح!" : "Generated Successfully!",
        description: language === 'ar' ? "تم إنشاء مشروع React جديد" : "New React project has been created"
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: language === 'ar' ? "تم النسخ!" : "Copied!",
      description: language === 'ar' ? "تم نسخ الكود إلى الحافظة" : "Code copied to clipboard"
    });
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.jsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {language === 'ar' ? 'مولد React الذكي' : 'Smart React Generator'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'حول أفكارك إلى مشاريع React متكاملة في ثوانٍ معدودة'
              : 'Turn your ideas into complete React projects in seconds'
            }
          </p>
          
          {/* Language Toggle */}
          <div className="flex justify-center mt-6">
            <div className="flex bg-card rounded-lg p-1 shadow-elegant">
              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                onClick={() => setLanguage('ar')}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                العربية
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                onClick={() => setLanguage('en')}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                English
              </Button>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {language === 'ar' ? 'التوليد' : 'Generate'}
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                {language === 'ar' ? 'الكود المولد' : 'Generated Code'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <Card className="bg-gradient-card shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {language === 'ar' ? 'اكتب فكرتك' : 'Describe Your Idea'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'اكتب وصفاً مفصلاً للموقع أو التطبيق الذي تريد إنشاؤه'
                      : 'Write a detailed description of the website or app you want to create'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={language === 'ar' 
                      ? 'مثال: اعمل موقع شخصي بسيط فيه صورة شخصية وبايو ومعلومات الاتصال...'
                      : 'Example: Create a simple personal website with profile picture, bio, and contact information...'
                    }
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px] resize-none"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {language === 'ar' ? 'واجهات حديثة' : 'Modern UI'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'متجاوب' : 'Responsive'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'دعم العربية' : 'Arabic Support'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'ملف واحد' : 'Single File'}
                    </Badge>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {language === 'ar' ? 'ولد المشروع' : 'Generate Project'}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="space-y-6">
              {generatedCode ? (
                <Card className="bg-gradient-card shadow-elegant border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        App.jsx
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" onClick={downloadCode}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'المشروع جاهز للتحميل والتشغيل'
                        : 'Project ready for download and execution'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-card shadow-elegant border-0">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Code className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      {language === 'ar' 
                        ? 'لا يوجد كود مولد بعد. ابدأ بكتابة فكرتك في تبويب التوليد.'
                        : 'No generated code yet. Start by writing your idea in the Generate tab.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Important Note */}
        <Card className="max-w-4xl mx-auto mt-8 bg-accent/50 border-accent">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 text-accent-foreground">
              {language === 'ar' ? 'ملاحظة مهمة حول Backend' : 'Important Backend Note'}
            </h3>
            <p className="text-accent-foreground/80">
              {language === 'ar' 
                ? 'هذا المثال يحاكي واجهة المولد. للحصول على وظائف Backend حقيقية (Laravel + OpenRouter API)، تحتاج لربط المشروع بـ Supabase لتنفيذ Edge Functions.'
                : 'This is a demo interface. For real backend functionality (Laravel + OpenRouter API), you need to connect the project to Supabase to implement Edge Functions.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const generateMockReactCode = (prompt: string, language: 'ar' | 'en') => {
  const isArabic = language === 'ar' || /[\u0600-\u06FF]/.test(prompt);
  
  return `/*
* ${isArabic ? 'مشروع React مولد تلقائياً' : 'Auto-generated React Project'}
* ${isArabic ? 'للتشغيل:' : 'To run:'}
* 
* package.json:
* {
*   "name": "generated-react-app",
*   "scripts": {
*     "dev": "vite",
*     "build": "vite build"
*   },
*   "dependencies": {
*     "react": "^18.0.0",
*     "react-dom": "^18.0.0"
*   },
*   "devDependencies": {
*     "vite": "^4.0.0",
*     "@vitejs/plugin-react": "^4.0.0"
*   }
* }
* 
* ${isArabic ? 'أوامر التشغيل:' : 'Run commands:'}
* npm install
* npm run dev
*/

import React from 'react';

const App = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      direction: '${isArabic ? 'rtl' : 'ltr'}'
    },
    card: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      padding: '3rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    description: {
      fontSize: '1.2rem',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '2rem'
    },
    button: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '25px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          ${isArabic ? 'مرحباً بك في موقعي' : 'Welcome to My Website'}
        </h1>
        <p style={styles.description}>
          ${isArabic 
            ? 'هذا مثال على مشروع React مولد تلقائياً بناءً على الوصف المقدم. يمكنك تخصيص هذا الكود حسب احتياجاتك.'
            : 'This is an example of an auto-generated React project based on the provided description. You can customize this code according to your needs.'
          }
        </p>
        <button 
          style={styles.button}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          ${isArabic ? 'ابدأ الآن' : 'Get Started'}
        </button>
      </div>
    </div>
  );
};

export default App;`;
};

export default ReactGenerator;