import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, Code, Zap, Globe, FolderOpen, FileText, Package, Eye, Edit3 } from 'lucide-react';
import ProjectPreview from './ProjectPreview';
import ModificationRequest from './ModificationRequest';

interface ProjectFile {
  name: string;
  path: string;
  content: string;
  type: 'file' | 'folder';
}

interface GeneratedProject {
  name: string;
  description: string;
  files: ProjectFile[];
}

const ReactGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
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
      const project = generateMockReactProject(prompt, language);
      setGeneratedProject(project);
      setSelectedFile(project.files[0]); // Select first file by default
      setIsGenerating(false);
      toast({
        title: language === 'ar' ? "تم التوليد بنجاح!" : "Generated Successfully!",
        description: language === 'ar' ? "تم إنشاء مشروع React كامل" : "Complete React project has been created"
      });
    }, 3000);
  };

  const copyFileContent = (file: ProjectFile) => {
    navigator.clipboard.writeText(file.content);
    toast({
      title: language === 'ar' ? "تم النسخ!" : "Copied!",
      description: language === 'ar' ? `تم نسخ ${file.name}` : `${file.name} copied to clipboard`
    });
  };

  const downloadProject = () => {
    if (!generatedProject) return;
    
    // Create downloadable files content
    let zipContent = `# ${generatedProject.name}\n\n${generatedProject.description}\n\n## Files Generated:\n\n`;
    generatedProject.files.forEach(file => {
      zipContent += `### ${file.path}\n\`\`\`${file.name.endsWith('.json') ? 'json' : file.name.endsWith('.jsx') ? 'jsx' : 'text'}\n${file.content}\n\`\`\`\n\n`;
    });

    const blob = new Blob([zipContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedProject.name.toLowerCase().replace(/\s+/g, '-')}-project.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleModificationApplied = (updatedProject: GeneratedProject) => {
    setGeneratedProject(updatedProject);
    setSelectedFile(updatedProject.files[0]); // Update selected file
    
    toast({
      title: language === 'ar' ? "تم التعديل!" : "Modified!",
      description: language === 'ar' ? "تم تحديث المشروع بالتعديلات الجديدة" : "Project updated with new modifications"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Package className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {language === 'ar' ? 'مولد مشاريع React' : 'React Project Generator'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أنشئ مشاريع React كاملة بجميع الملفات والمجلدات في دقائق'
              : 'Create complete React projects with all files and folders in minutes'
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
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {language === 'ar' ? 'إنشاء المشروع' : 'Generate Project'}
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                {language === 'ar' ? 'ملفات المشروع' : 'Project Files'}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedProject}>
                <Eye className="w-4 h-4" />
                {language === 'ar' ? 'المراجعة' : 'Preview'}
              </TabsTrigger>
              <TabsTrigger value="modify" className="flex items-center gap-2" disabled={!generatedProject}>
                <Edit3 className="w-4 h-4" />
                {language === 'ar' ? 'التعديل' : 'Modify'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <Card className="bg-gradient-card shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'اكتب وصفاً مفصلاً للمشروع الذي تريد إنشاؤه - سيتم توليد مشروع كامل بجميع الملفات'
                      : 'Write a detailed description of the project you want to create - a complete project with all files will be generated'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={language === 'ar' 
                      ? 'مثال: أريد موقع لشركة تصميم جرافيك به صفحة رئيسية وصفحة أعمال وصفحة اتصال مع تصميم حديث...'
                      : 'Example: I want a website for a graphic design company with home page, portfolio and contact page with modern design...'
                    }
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px] resize-none"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Package className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'مشروع كامل' : 'Complete Project'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'ملفات متعددة' : 'Multiple Files'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'تصميم متجاوب' : 'Responsive Design'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'دعم العربية' : 'Arabic Support'}
                    </Badge>
                    <Badge variant="secondary">
                      {language === 'ar' ? 'جاهز للتشغيل' : 'Ready to Run'}
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
                        {language === 'ar' ? 'جاري إنشاء المشروع...' : 'Generating Project...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {language === 'ar' ? 'أنشئ المشروع الكامل' : 'Generate Complete Project'}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="output" className="space-y-6">
              {generatedProject ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Structure Sidebar */}
                  <Card className="bg-gradient-card shadow-elegant border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        {language === 'ar' ? 'بنية المشروع' : 'Project Structure'}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={downloadProject}>
                          <Download className="w-4 h-4" />
                          {language === 'ar' ? 'تحميل' : 'Download'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          <div className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {generatedProject.name}
                          </div>
                          {generatedProject.files.map((file, index) => (
                            <Button
                              key={index}
                              variant={selectedFile?.name === file.name ? "default" : "ghost"}
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedFile(file)}
                            >
                              <FileText className="w-4 h-4 ml-2" />
                              {file.path}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* File Content */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gradient-card shadow-elegant border-0">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            {selectedFile?.name || 'Select a file'}
                          </CardTitle>
                          {selectedFile && (
                            <Button 
                              variant="outline" 
                              onClick={() => copyFileContent(selectedFile)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <CardDescription>
                          {selectedFile?.path || (language === 'ar' ? 'اختر ملفاً لعرضه' : 'Select a file to view')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {selectedFile ? (
                          <ScrollArea className="h-96">
                            <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
                              <code>{selectedFile.content}</code>
                            </pre>
                          </ScrollArea>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                            <FileText className="w-16 h-16 mb-4" />
                            <p>{language === 'ar' ? 'اختر ملفاً من القائمة' : 'Select a file from the list'}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="bg-gradient-card shadow-elegant border-0">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <FolderOpen className="w-24 h-24 text-muted-foreground mb-6" />
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'ar' ? 'لا يوجد مشروع مولد بعد' : 'No Project Generated Yet'}
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {language === 'ar' 
                        ? 'ابدأ بكتابة وصف مشروعك في تبويب إنشاء المشروع. سيتم توليد مشروع React كامل بجميع الملفات والمجلدات المطلوبة.'
                        : 'Start by writing your project description in the Generate Project tab. A complete React project with all required files and folders will be generated.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6">
              {generatedProject ? (
                <ProjectPreview project={generatedProject} language={language} />
              ) : (
                <Card className="bg-gradient-card shadow-elegant border-0">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Eye className="w-24 h-24 text-muted-foreground mb-6" />
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'ar' ? 'لا يوجد مشروع للمراجعة' : 'No Project to Preview'}
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {language === 'ar' 
                        ? 'قم بإنشاء مشروع أولاً لرؤية المعاينة المباشرة'
                        : 'Generate a project first to see the live preview'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="modify" className="space-y-6">
              {generatedProject ? (
                <ModificationRequest 
                  project={generatedProject} 
                  language={language}
                  onModificationApplied={handleModificationApplied}
                />
              ) : (
                <Card className="bg-gradient-card shadow-elegant border-0">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <Edit3 className="w-24 h-24 text-muted-foreground mb-6" />
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'ar' ? 'لا يوجد مشروع للتعديل' : 'No Project to Modify'}
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      {language === 'ar' 
                        ? 'قم بإنشاء مشروع أولاً لتتمكن من طلب التعديلات عليه'
                        : 'Generate a project first to request modifications'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Info */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-elegant border-0 text-center">
            <CardContent className="p-6">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'مشروع كامل' : 'Complete Project'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'جميع الملفات والمجلدات المطلوبة للمشروع'
                  : 'All required files and folders for the project'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant border-0 text-center">
            <CardContent className="p-6">
              <Code className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'كود نظيف' : 'Clean Code'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'كود منظم وقابل للقراءة مع أفضل الممارسات'
                  : 'Organized and readable code with best practices'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-elegant border-0 text-center">
            <CardContent className="p-6">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {language === 'ar' ? 'جاهز للتشغيل' : 'Ready to Run'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' 
                  ? 'npm install && npm run dev وانطلق'
                  : 'npm install && npm run dev and you\'re ready'
                }
              </p>
            </CardContent>
          </Card>
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

const generateMockReactProject = (prompt: string, language: 'ar' | 'en'): GeneratedProject => {
  const isArabic = language === 'ar' || /[\u0600-\u06FF]/.test(prompt);
  
  return {
    name: isArabic ? 'مشروعي الجديد' : 'My New Project',
    description: isArabic 
      ? 'مشروع React مولد تلقائياً بناءً على الوصف المقدم'
      : 'Auto-generated React project based on the provided description',
    files: [
      {
        name: 'package.json',
        path: 'package.json',
        type: 'file',
        content: `{
  "name": "generated-react-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5"
  }
}`
      },
      {
        name: 'index.html',
        path: 'index.html',
        type: 'file',
        content: `<!doctype html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isArabic ? 'مشروعي الجديد' : 'My New Project'}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        direction: ${isArabic ? 'rtl' : 'ltr'};
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
      },
      {
        name: 'main.jsx',
        path: 'src/main.jsx',
        type: 'file',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      },
      {
        name: 'App.jsx',
        path: 'src/App.jsx',
        type: 'file',
        content: `import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <Services />
      case 'contact':
        return <Contact />
      default:
        return (
          <>
            <Hero />
            <Services />
            <Contact />
          </>
        )
    }
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App`
      },
      {
        name: 'App.css',
        path: 'src/App.css',
        type: 'file',
        content: `.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 60px 0;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .section {
    padding: 40px 0;
  }
  
  .btn {
    padding: 10px 25px;
    font-size: 14px;
  }
}`
      },
      {
        name: 'index.css',
        path: 'src/index.css',
        type: 'file',
        content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0 0 20px 0;
  color: #333;
}

p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: #666;
}

a {
  color: #667eea;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}`
      },
      {
        name: 'Header.jsx',
        path: 'src/components/Header.jsx',
        type: 'file',
        content: `import React from 'react'

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ 
          margin: 0, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '24px'
        }}>
          ${isArabic ? 'شركتي' : 'MyCompany'}
        </h1>
        <nav>
          <ul style={{ 
            display: 'flex', 
            listStyle: 'none', 
            gap: '30px',
            margin: 0,
            padding: 0
          }}>
            <li>
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
                style={{ 
                  color: currentPage === 'home' ? '#667eea' : '#666',
                  fontWeight: currentPage === 'home' ? 'bold' : 'normal'
                }}
              >
                ${isArabic ? 'الرئيسية' : 'Home'}
              </a>
            </li>
            <li>
              <a 
                href="#services" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('services'); }}
                style={{ 
                  color: currentPage === 'services' ? '#667eea' : '#666',
                  fontWeight: currentPage === 'services' ? 'bold' : 'normal'
                }}
              >
                ${isArabic ? 'الخدمات' : 'Services'}
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); }}
                style={{ 
                  color: currentPage === 'contact' ? '#667eea' : '#666',
                  fontWeight: currentPage === 'contact' ? 'bold' : 'normal'
                }}
              >
                ${isArabic ? 'اتصل بنا' : 'Contact'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header`
      },
      {
        name: 'Hero.jsx',
        path: 'src/components/Hero.jsx',
        type: 'file',
        content: `import React from 'react'

const Hero = () => {
  return (
    <section className="section" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '100px 0'
    }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          ${isArabic ? 'مرحباً بك في شركتنا' : 'Welcome to Our Company'}
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '40px',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          ${isArabic 
            ? 'نقدم أفضل الحلول والخدمات المبتكرة لعملائنا'
            : 'We provide the best solutions and innovative services for our clients'
          }
        </p>
        <button className="btn" style={{
          fontSize: '18px',
          padding: '15px 40px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          ${isArabic ? 'ابدأ الآن' : 'Get Started'}
        </button>
      </div>
    </section>
  )
}

export default Hero`
      },
      {
        name: 'Services.jsx',
        path: 'src/components/Services.jsx',
        type: 'file',
        content: `import React from 'react'

const Services = () => {
  const services = [
    {
      title: ${isArabic ? '"تصميم الويب"' : '"Web Design"'},
      description: ${isArabic 
        ? '"نصمم مواقع ويب عصرية ومتجاوبة"'
        : '"We design modern and responsive websites"'
      },
      icon: '🎨'
    },
    {
      title: ${isArabic ? '"تطوير التطبيقات"' : '"App Development"'},
      description: ${isArabic 
        ? '"نطور تطبيقات جوال وويب متقدمة"'
        : '"We develop advanced mobile and web applications"'
      },
      icon: '📱'
    },
    {
      title: ${isArabic ? '"التسويق الرقمي"' : '"Digital Marketing"'},
      description: ${isArabic 
        ? '"نساعدك في الوصول لجمهورك المستهدف"'
        : '"We help you reach your target audience"'
      },
      icon: '📈'
    }
  ]

  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem',
          marginBottom: '60px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ${isArabic ? 'خدماتنا' : 'Our Services'}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {services.map((service, index) => (
            <div key={index} className="card" style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '20px'
              }}>
                {service.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.5rem',
                marginBottom: '15px',
                color: '#333'
              }}>
                {service.title}
              </h3>
              <p style={{ 
                color: '#666',
                lineHeight: '1.6'
              }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services`
      },
      {
        name: 'Contact.jsx',
        path: 'src/components/Contact.jsx',
        type: 'file',
        content: `import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(${isArabic ? '"تم إرسال رسالتك بنجاح!"' : '"Your message has been sent successfully!"'})
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="section" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div className="container">
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem',
          marginBottom: '60px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ${isArabic ? 'اتصل بنا' : 'Contact Us'}
        </h2>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} className="card">
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                ${isArabic ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                ${isArabic ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                ${isArabic ? 'الرسالة' : 'Message'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  minHeight: '120px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
            <button type="submit" className="btn" style={{ width: '100%' }}>
              ${isArabic ? 'إرسال الرسالة' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact`
      },
      {
        name: 'Footer.jsx',
        path: 'src/components/Footer.jsx',
        type: 'file',
        content: `import React from 'react'

const Footer = () => {
  return (
    <footer style={{
      background: '#333',
      color: 'white',
      textAlign: 'center',
      padding: '40px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <p style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
          ${isArabic ? 'شركتي - جميع الحقوق محفوظة' : 'MyCompany - All Rights Reserved'}
        </p>
        <p style={{ margin: 0, opacity: 0.7 }}>
          © 2024 ${isArabic ? 'مولد تلقائياً بواسطة React Generator' : 'Auto-generated by React Generator'}
        </p>
      </div>
    </footer>
  )
}

export default Footer`
      },
      {
        name: 'vite.config.js',
        path: 'vite.config.js',
        type: 'file',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`
      },
      {
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        content: `# ${isArabic ? 'مشروعي الجديد' : 'My New Project'}

${isArabic 
  ? 'مشروع React مولد تلقائياً بناءً على الوصف المقدم.'
  : 'An auto-generated React project based on the provided description.'
}

## ${isArabic ? 'التشغيل' : 'Getting Started'}

### ${isArabic ? 'المتطلبات' : 'Prerequisites'}
- Node.js (v16 أو أحدث)
- npm أو yarn

### ${isArabic ? 'التثبيت' : 'Installation'}

\`\`\`bash
# ${isArabic ? 'تثبيت التبعيات' : 'Install dependencies'}
npm install

# ${isArabic ? 'تشغيل خادم التطوير' : 'Start development server'}
npm run dev

# ${isArabic ? 'بناء للإنتاج' : 'Build for production'}
npm run build

# ${isArabic ? 'معاينة البناء' : 'Preview build'}
npm run preview
\`\`\`

## ${isArabic ? 'بنية المشروع' : 'Project Structure'}

\`\`\`
src/
├── components/          # ${isArabic ? 'المكونات' : 'Components'}
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── App.jsx             # ${isArabic ? 'المكون الرئيسي' : 'Main component'}
├── App.css            # ${isArabic ? 'أنماط التطبيق' : 'App styles'}
├── index.css          # ${isArabic ? 'الأنماط العامة' : 'Global styles'}
└── main.jsx           # ${isArabic ? 'نقطة الدخول' : 'Entry point'}
\`\`\`

## ${isArabic ? 'الميزات' : 'Features'}

- ✨ ${isArabic ? 'تصميم حديث ومتجاوب' : 'Modern and responsive design'}
- 🎨 ${isArabic ? 'ألوان متدرجة جميلة' : 'Beautiful gradient colors'}
- 📱 ${isArabic ? 'متوافق مع الجوال' : 'Mobile-friendly'}
- ⚡ ${isArabic ? 'سريع وخفيف' : 'Fast and lightweight'}
- 🌐 ${isArabic ? 'دعم اللغة العربية' : 'Arabic language support'}

## ${isArabic ? 'التخصيص' : 'Customization'}

${isArabic 
  ? 'يمكنك تخصيص هذا المشروع عبر تعديل الملفات في مجلد `src/`. جميع المكونات منظمة ومقسمة لسهولة التعديل.'
  : 'You can customize this project by modifying files in the `src/` folder. All components are organized and separated for easy modification.'
}

## ${isArabic ? 'المساعدة' : 'Support'}

${isArabic 
  ? 'إذا واجهت أي مشاكل، يرجى مراجعة وثائق React و Vite الرسمية.'
  : 'If you encounter any issues, please refer to the official React and Vite documentation.'
}

---

${isArabic 
  ? '**ملاحظة:** هذا المشروع مولد تلقائياً. يمكنك تعديله حسب احتياجاتك.'
  : '**Note:** This project is auto-generated. Feel free to modify it according to your needs.'
}`
      }
    ]
  };
};

export default ReactGenerator;