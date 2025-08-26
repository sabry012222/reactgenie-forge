import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Plus, Palette, Layout, Type, Image } from 'lucide-react';

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

interface ModificationRequestProps {
  project: GeneratedProject;
  language: 'ar' | 'en';
  onModificationApplied: (updatedProject: GeneratedProject) => void;
}

const ModificationRequest = ({ project, language, onModificationApplied }: ModificationRequestProps) => {
  const [modificationText, setModificationText] = useState('');
  const [modificationType, setModificationType] = useState<'content' | 'design' | 'feature' | 'text'>('content');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const modificationTypes = [
    {
      type: 'content' as const,
      icon: Layout,
      label: language === 'ar' ? 'تعديل المحتوى' : 'Content Changes',
      description: language === 'ar' ? 'تغيير النصوص والمحتوى' : 'Change texts and content',
      examples: language === 'ar' 
        ? ['غير اسم الشركة إلى "تك سولوشنز"', 'أضف قسم "عن الشركة"', 'غير وصف الخدمات']
        : ['Change company name to "Tech Solutions"', 'Add "About Us" section', 'Change services description']
    },
    {
      type: 'design' as const,
      icon: Palette,
      label: language === 'ar' ? 'تعديل التصميم' : 'Design Changes',
      description: language === 'ar' ? 'تغيير الألوان والتخطيط' : 'Change colors and layout',
      examples: language === 'ar'
        ? ['غير الألوان إلى الأزرق والأخضر', 'اجعل الصفحة أكثر عرضاً', 'أضف ظلال للبطاقات']
        : ['Change colors to blue and green', 'Make page wider', 'Add shadows to cards']
    },
    {
      type: 'feature' as const,
      icon: Plus,
      label: language === 'ar' ? 'إضافة ميزة' : 'Add Feature',
      description: language === 'ar' ? 'إضافة وظائف جديدة' : 'Add new functionality',
      examples: language === 'ar'
        ? ['أضف نموذج اشتراك في النشرة', 'أضف معرض صور', 'أضف خريطة موقع']
        : ['Add newsletter signup form', 'Add image gallery', 'Add location map']
    },
    {
      type: 'text' as const,
      icon: Type,
      label: language === 'ar' ? 'تعديل النصوص' : 'Text Changes',
      description: language === 'ar' ? 'تغيير الخطوط والنصوص' : 'Change fonts and text',
      examples: language === 'ar'
        ? ['اجعل الخط أكبر', 'غير نوع الخط', 'أضف تأثيرات على العناوين']
        : ['Make font larger', 'Change font type', 'Add effects to headings']
    }
  ];

  const handleModificationSubmit = async () => {
    if (!modificationText.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى كتابة التعديل المطلوب" : "Please write the required modification",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing modification
    setTimeout(() => {
      // Apply mock modification based on type
      const updatedProject = applyMockModification(project, modificationText, modificationType, language);
      onModificationApplied(updatedProject);
      
      setModificationText('');
      setIsProcessing(false);
      
      toast({
        title: language === 'ar' ? "تم التعديل بنجاح!" : "Modification Applied!",
        description: language === 'ar' ? "تم تطبيق التعديلات على المشروع" : "Modifications have been applied to the project"
      });
    }, 2500);
  };

  const selectedType = modificationTypes.find(t => t.type === modificationType);

  return (
    <div className="space-y-6">
      {/* Modification Type Selector */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary" />
            {language === 'ar' ? 'نوع التعديل' : 'Modification Type'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'اختر نوع التعديل الذي تريده على المشروع'
              : 'Choose the type of modification you want for the project'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.type}
                  variant={modificationType === type.type ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-start text-left"
                  onClick={() => setModificationType(type.type)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{type.label}</span>
                  </div>
                  <p className="text-sm opacity-80">{type.description}</p>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modification Request Form */}
      <Card className="bg-gradient-card shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedType && <selectedType.icon className="w-5 h-5 text-primary" />}
            {language === 'ar' ? 'وصف التعديل' : 'Modification Description'}
          </CardTitle>
          <CardDescription>
            {selectedType?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="modification">
              {language === 'ar' ? 'اكتب التعديل المطلوب بالتفصيل' : 'Write the required modification in detail'}
            </Label>
            <Textarea
              id="modification"
              placeholder={
                language === 'ar' 
                  ? 'مثال: غير لون الخلفية إلى اللون الأزرق الداكن وأضف المزيد من المساحة بين الأقسام...'
                  : 'Example: Change background color to dark blue and add more spacing between sections...'
              }
              value={modificationText}
              onChange={(e) => setModificationText(e.target.value)}
              className="min-h-[120px] resize-none"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Examples for selected type */}
          {selectedType && (
            <div>
              <Label className="text-sm text-muted-foreground">
                {language === 'ar' ? 'أمثلة:' : 'Examples:'}
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedType.examples.map((example, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setModificationText(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleModificationSubmit}
            disabled={isProcessing}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {language === 'ar' ? 'جاري تطبيق التعديل...' : 'Applying Modification...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                {language === 'ar' ? 'طبق التعديل' : 'Apply Modification'}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Mock function to apply modifications
const applyMockModification = (
  project: GeneratedProject, 
  modification: string, 
  type: string, 
  language: 'ar' | 'en'
): GeneratedProject => {
  const updatedProject = { ...project };
  
  // Find and update relevant files based on modification type
  if (type === 'design' && modification.includes(language === 'ar' ? 'أزرق' : 'blue')) {
    // Update CSS colors to blue theme
    const cssFile = updatedProject.files.find(f => f.name === 'App.css');
    if (cssFile) {
      cssFile.content = cssFile.content.replace(
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
      );
    }
  }
  
  if (type === 'content' && modification.includes(language === 'ar' ? 'اسم' : 'name')) {
    // Update company name in relevant files
    updatedProject.files.forEach(file => {
      if (file.name.includes('.jsx')) {
        file.content = file.content.replace(
          language === 'ar' ? 'شركتي' : 'MyCompany',
          language === 'ar' ? 'تك سولوشنز' : 'Tech Solutions'
        );
      }
    });
  }
  
  if (type === 'feature' && (modification.includes(language === 'ar' ? 'نشرة' : 'newsletter') || modification.includes(language === 'ar' ? 'اشتراك' : 'signup'))) {
    // Add newsletter signup component
    const footerFile = updatedProject.files.find(f => f.name === 'Footer.jsx');
    if (footerFile) {
      const newsletterSection = `
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>
            ${language === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to Our Newsletter'}
          </h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="email" 
              placeholder="${language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}"
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }} 
            />
            <button 
              style={{ 
                padding: '10px 20px', 
                background: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ${language === 'ar' ? 'اشترك' : 'Subscribe'}
            </button>
          </div>
        </div>`;
      
      footerFile.content = footerFile.content.replace(
        '<div className="container">',
        `<div className="container">\n        ${newsletterSection}`
      );
    }
  }
  
  return updatedProject;
};

export default ModificationRequest;