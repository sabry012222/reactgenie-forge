import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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

interface ProjectPreviewProps {
  project: GeneratedProject;
  language: 'ar' | 'en';
}

const ProjectPreview = ({ project, language }: ProjectPreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Extract and render the HTML preview from generated files
  const generatePreviewHTML = () => {
    const appFile = project.files.find(f => f.name === 'App.jsx');
    const indexFile = project.files.find(f => f.name === 'index.html');
    const cssFile = project.files.find(f => f.name === 'App.css');
    const indexCssFile = project.files.find(f => f.name === 'index.css');
    
    if (!appFile || !indexFile) return '';

    // Create a simplified preview HTML
    return `
      <!DOCTYPE html>
      <html lang="${language === 'ar' ? 'ar' : 'en'}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${indexCssFile?.content || ''}
          ${cssFile?.content || ''}
          
          /* Preview specific styles */
          .App { margin: 0; }
          body { margin: 0; padding: 0; }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .container { padding: 0 10px; }
          }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="App">
            <!-- Header -->
            <header style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 15px 0; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);">
              <div class="container" style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <h1 style="margin: 0; background: linear-gradient(135deg, #667eea, #764ba2); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px;">
                  ${language === 'ar' ? 'شركتي' : 'MyCompany'}
                </h1>
                <nav>
                  <ul style="display: flex; list-style: none; gap: 30px; margin: 0; padding: 0;">
                    <li><a href="#" style="color: #667eea; font-weight: bold; text-decoration: none;">${language === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
                    <li><a href="#" style="color: #666; text-decoration: none;">${language === 'ar' ? 'الخدمات' : 'Services'}</a></li>
                    <li><a href="#" style="color: #666; text-decoration: none;">${language === 'ar' ? 'اتصل بنا' : 'Contact'}</a></li>
                  </ul>
                </nav>
              </div>
            </header>
            
            <!-- Hero Section -->
            <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 100px 0;">
              <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
                  ${language === 'ar' ? 'مرحباً بك في شركتنا' : 'Welcome to Our Company'}
                </h1>
                <p style="font-size: 1.3rem; margin-bottom: 40px; opacity: 0.9; max-width: 600px; margin: 0 auto 40px auto;">
                  ${language === 'ar' 
                    ? 'نقدم أفضل الحلول والخدمات المبتكرة لعملائنا'
                    : 'We provide the best solutions and innovative services for our clients'
                  }
                </p>
                <button style="display: inline-block; padding: 15px 40px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.3); color: white; text-decoration: none; border-radius: 25px; cursor: pointer; font-size: 18px;">
                  ${language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                </button>
              </div>
            </section>
            
            <!-- Services Section -->
            <section style="padding: 60px 0; background: white;">
              <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 60px; background: linear-gradient(135deg, #667eea, #764ba2); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${language === 'ar' ? 'خدماتنا' : 'Our Services'}
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                  <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🎨</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">
                      ${language === 'ar' ? 'تصميم الويب' : 'Web Design'}
                    </h3>
                    <p style="color: #666; line-height: 1.6;">
                      ${language === 'ar' 
                        ? 'نصمم مواقع ويب عصرية ومتجاوبة'
                        : 'We design modern and responsive websites'
                      }
                    </p>
                  </div>
                  <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📱</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">
                      ${language === 'ar' ? 'تطوير التطبيقات' : 'App Development'}
                    </h3>
                    <p style="color: #666; line-height: 1.6;">
                      ${language === 'ar' 
                        ? 'نطور تطبيقات جوال وويب متقدمة'
                        : 'We develop advanced mobile and web applications'
                      }
                    </p>
                  </div>
                  <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📈</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">
                      ${language === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing'}
                    </h3>
                    <p style="color: #666; line-height: 1.6;">
                      ${language === 'ar' 
                        ? 'نساعدك في الوصول لجمهورك المستهدف'
                        : 'We help you reach your target audience'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Footer -->
            <footer style="background: #333; color: white; text-align: center; padding: 40px 0;">
              <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <p style="margin: 0 0 10px 0; font-size: 18px;">
                  ${language === 'ar' ? 'شركتي - جميع الحقوق محفوظة' : 'MyCompany - All Rights Reserved'}
                </p>
                <p style="margin: 0; opacity: 0.7;">
                  © 2024 ${language === 'ar' ? 'مولد تلقائياً بواسطة React Generator' : 'Auto-generated by React Generator'}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const getViewModeStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '800px' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'معاينة المشروع' : 'Project Preview'}
              </CardTitle>
              <CardDescription>
                {project.name} - {language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
              </CardDescription>
            </div>
            
            {/* View Mode Selector */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">
              {language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
            </Badge>
            <Badge variant="secondary">
              {viewMode === 'desktop' && (language === 'ar' ? 'سطح المكتب' : 'Desktop')}
              {viewMode === 'tablet' && (language === 'ar' ? 'تابلت' : 'Tablet')}
              {viewMode === 'mobile' && (language === 'ar' ? 'جوال' : 'Mobile')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center">
            <div 
              className="border border-border rounded-lg overflow-hidden shadow-lg"
              style={{
                ...getViewModeStyles(),
                maxWidth: '100%',
                transition: 'all 0.3s ease'
              }}
            >
              <iframe
                srcDoc={generatePreviewHTML()}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="Project Preview"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPreview;