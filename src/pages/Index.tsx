
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, BookOpen, Quote, Lightbulb, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TalkPreferences {
  topic: string;
  length: string;
  format: string;
  includeScriptures: boolean;
  includeQuotes: boolean;
  includeConcepts: boolean;
  audience: string;
  personalExperiences: boolean;
  additionalNotes: string;
}

const Index = () => {
  const [preferences, setPreferences] = useState<TalkPreferences>({
    topic: '',
    length: '',
    format: '',
    includeScriptures: false,
    includeQuotes: false,
    includeConcepts: false,
    audience: '',
    personalExperiences: false,
    additionalNotes: ''
  });
  
  const [generatedTalk, setGeneratedTalk] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const { toast } = useToast();

  const handlePreferenceChange = (key: keyof TalkPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateTalk = async () => {
    if (!preferences.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your talk.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTalk = `# ${preferences.topic}

Dear Brothers and Sisters,

I'm grateful for the opportunity to speak with you today about ${preferences.topic}. This is a topic that has been on my heart and mind as I've prepared for this talk.

## Introduction

${preferences.format === 'full' ? 
  `As I've pondered the significance of ${preferences.topic}, I've been reminded of the Lord's words in the scriptures. Our Heavenly Father has provided us with guidance and understanding through His prophets and through the Spirit.` :
  `• Opening thought about ${preferences.topic}\n• Personal connection to the topic\n• Why this matters in our daily lives`
}

${preferences.includeScriptures ? `
## Scriptural Foundation

Let me share a scripture that has particular meaning regarding this topic:

"Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." - Proverbs 3:5-6

This scripture teaches us about the importance of ${preferences.topic} in our spiritual journey.
` : ''}

${preferences.includeQuotes ? `
## Prophetic Guidance

President Russell M. Nelson has taught: "The Lord loves effort, because effort brings rewards that can't come without it." This principle applies directly to our understanding of ${preferences.topic}.
` : ''}

${preferences.includeConcepts ? `
## Key Concepts to Consider

• Faith is the foundation of all righteous action
• Our relationship with Heavenly Father grows through consistent effort
• The Spirit guides us as we seek truth
• Service to others strengthens our own testimony
` : ''}

## Application in Our Lives

${preferences.format === 'full' ?
  `How can we apply these principles in our daily lives? I believe we can start by making small, consistent choices that align with gospel principles. When we do this, we invite the Spirit into our lives and create space for spiritual growth.` :
  `• Daily application ideas\n• Practical steps we can take\n• How to make this part of our routine`
}

## Testimony

I want to bear my testimony that ${preferences.topic} is a true principle. I know that as we apply these teachings in our lives, we will find the peace and direction that our Heavenly Father wants us to have.

In the name of Jesus Christ, Amen.`;

    setGeneratedTalk(mockTalk);
    setIsGenerating(false);
    
    toast({
      title: "Talk Generated!",
      description: "Your talk has been created. You can now chat to make improvements.",
    });
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);
    
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const assistantResponse = `I understand you'd like to adjust the talk. Here are some suggestions based on your request: "${userMessage}". Would you like me to revise a specific section or add more detail to certain points?`;
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    setIsChatting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LDS Talk Assistant</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create meaningful talks with AI assistance. Customize your preferences and receive personalized content to help you prepare.
          </p>
        </div>

        {/* Talk Preferences Card */}
        <Card className="mb-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Talk Preferences
            </CardTitle>
            <CardDescription>
              Tell us about your talk requirements and we'll create personalized content for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium">Talk Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Faith, Service, Gratitude"
                  value={preferences.topic}
                  onChange={(e) => handlePreferenceChange('topic', e.target.value)}
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length" className="text-sm font-medium">Talk Length</Label>
                <Select value={preferences.length} onValueChange={(value) => handlePreferenceChange('length', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">5 minutes</SelectItem>
                    <SelectItem value="10min">10 minutes</SelectItem>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="20min">20 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="format" className="text-sm font-medium">Format Preference</Label>
                <Select value={preferences.format} onValueChange={(value) => handlePreferenceChange('format', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Talk (Word-for-word)</SelectItem>
                    <SelectItem value="outline">Talking Points & Outline</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Key sections + points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-sm font-medium">Audience</Label>
                <Select value={preferences.audience} onValueChange={(value) => handlePreferenceChange('audience', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Congregation</SelectItem>
                    <SelectItem value="youth">Youth/Young Adults</SelectItem>
                    <SelectItem value="adults">Adults</SelectItem>
                    <SelectItem value="primary">Primary Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-sm font-medium">Include in Talk:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scriptures"
                    checked={preferences.includeScriptures}
                    onCheckedChange={(checked) => handlePreferenceChange('includeScriptures', checked)}
                  />
                  <Label htmlFor="scriptures" className="text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Scripture References
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quotes"
                    checked={preferences.includeQuotes}
                    onCheckedChange={(checked) => handlePreferenceChange('includeQuotes', checked)}
                  />
                  <Label htmlFor="quotes" className="text-sm flex items-center gap-2">
                    <Quote className="w-4 h-4" />
                    Prophet/Leader Quotes
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="concepts"
                    checked={preferences.includeConcepts}
                    onCheckedChange={(checked) => handlePreferenceChange('includeConcepts', checked)}
                  />
                  <Label htmlFor="concepts" className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Key Concepts & Ideas
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal"
                    checked={preferences.personalExperiences}
                    onCheckedChange={(checked) => handlePreferenceChange('personalExperiences', checked)}
                  />
                  <Label htmlFor="personal" className="text-sm">
                    Personal Experience Suggestions
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements, themes, or ideas you'd like included..."
                value={preferences.additionalNotes}
                onChange={(e) => handlePreferenceChange('additionalNotes', e.target.value)}
                className="border-gray-200 focus:border-blue-500 min-h-[80px]"
              />
            </div>
            
            <Button
              onClick={generateTalk}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Talk...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Generate Talk
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Talk Display */}
        {generatedTalk && (
          <div className="space-y-8">
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Your Generated Talk
                </CardTitle>
                <CardDescription>
                  Review your talk below. Use the chat feature to make adjustments and improvements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-blue max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {generatedTalk}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Refine Your Talk
                </CardTitle>
                <CardDescription>
                  Chat with our AI to make improvements, add details, or adjust the tone of your talk.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chatMessages.length > 0 && (
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask for changes, additions, or improvements..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1 border-gray-200 focus:border-blue-500"
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={isChatting || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isChatting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
