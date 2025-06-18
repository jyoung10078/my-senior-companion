import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, BookOpen, Quote, Lightbulb, Send, Loader2, Edit, Save, X, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTalk, setEditedTalk] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
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

> "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." - Proverbs 3:5-6

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
    setEditedTalk(mockTalk);
    setIsGenerating(false);
    
    toast({
      title: "Talk Generated!",
      description: "Your talk has been created. You can now edit or chat to make improvements.",
    });
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsChatting(true);
    
    // Simulate API response with actual talk modification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let assistantResponse = '';
    let modifiedTalk = editedTalk || generatedTalk;
    
    if (userMessage.toLowerCase().includes('shorter')) {
      assistantResponse = "I've made the talk shorter by condensing sections while keeping the key points intact.";
      // Actually modify the talk to be shorter
      modifiedTalk = modifiedTalk
        .split('\n')
        .filter(line => !line.includes('As I\'ve pondered') && !line.includes('I believe we can start by'))
        .join('\n')
        .replace(/Let me share a scripture that has particular meaning regarding this topic:\n\n> "Trust in the Lord with all thine heart.*?\n\nThis scripture teaches us about the importance of.*?\n/s, '')
        .replace(/\n\n/g, '\n');
    } else if (userMessage.toLowerCase().includes('longer') || userMessage.toLowerCase().includes('more detail')) {
      assistantResponse = "I've added more detail and expanded on the key concepts with additional insights.";
      // Add more content to make it longer
      modifiedTalk = modifiedTalk.replace(
        '## Application in Our Lives',
        `## Personal Reflection

Before we discuss application, let me share a personal thought. Each of us faces moments when we must rely on the principles we've discussed today. These moments test our faith and strengthen our resolve.

## Application in Our Lives`
      ).replace(
        'In the name of Jesus Christ, Amen.',
        `I encourage each of you to ponder these principles throughout the week. Consider how they apply to your personal circumstances and relationships.

May we all strive to live these truths daily, finding strength in the Lord's guidance and love.

In the name of Jesus Christ, Amen.`
      );
    } else if (userMessage.toLowerCase().includes('scripture')) {
      assistantResponse = "I've added more relevant scriptures and expanded the scriptural foundation section.";
      modifiedTalk = modifiedTalk.replace(
        '> "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." - Proverbs 3:5-6',
        `> "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." - Proverbs 3:5-6

> "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest." - Joshua 1:9`
      );
    } else if (userMessage.toLowerCase().includes('simple') || userMessage.toLowerCase().includes('basic')) {
      assistantResponse = "I've simplified the language and made the concepts more accessible.";
      modifiedTalk = modifiedTalk
        .replace(/pondered/g, 'thought about')
        .replace(/significance/g, 'importance')
        .replace(/ecclesiastical/g, 'church')
        .replace(/endeavor/g, 'try');
    } else {
      assistantResponse = `I understand you'd like to adjust the talk. Based on your request: "${userMessage}", I've made appropriate modifications to better align with your vision.`;
      // Make a general improvement
      modifiedTalk = modifiedTalk.replace(
        'I want to bear my testimony',
        'I want to share my testimony'
      );
    }
    
    // Update the talk content
    setEditedTalk(modifiedTalk);
    setGeneratedTalk(modifiedTalk);
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    setIsChatting(false);
    
    toast({
      title: "Talk Updated",
      description: "Your talk has been refined based on your feedback.",
    });
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedTalk(generatedTalk);
  };

  const saveEdit = () => {
    setGeneratedTalk(editedTalk);
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your edits have been saved to the talk.",
    });
  };

  const cancelEdit = () => {
    setEditedTalk(generatedTalk);
    setIsEditing(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTalk);
      setCopySuccess(true);
      toast({
        title: "Copied to Clipboard",
        description: "Your talk has been copied to your clipboard.",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4 bg-blue-50 py-2">{line.substring(2)}</blockquote>;
        }
        if (line.startsWith('• ')) {
          return <li key={index} className="ml-4 text-gray-800 mb-1">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-800 mb-3 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
            The Senior Companion
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create meaningful talks with AI assistance. Customize your preferences and receive personalized content to help you prepare.
          </p>
        </div>

        {/* Talk Preferences Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              Talk Preferences
            </CardTitle>
            <CardDescription className="text-lg">
              Tell us about your talk requirements and we'll create personalized content for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="topic" className="text-base font-semibold text-gray-700">Talk Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Faith, Service, Gratitude"
                  value={preferences.topic}
                  onChange={(e) => handlePreferenceChange('topic', e.target.value)}
                  className="border-2 border-gray-200 focus:border-blue-500 h-12 text-base"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Talk Length</Label>
                <ToggleGroup
                  type="single"
                  value={preferences.length}
                  onValueChange={(value) => value && handlePreferenceChange('length', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem value="5min" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 border-2">5 min</ToggleGroupItem>
                  <ToggleGroupItem value="10min" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 border-2">10 min</ToggleGroupItem>
                  <ToggleGroupItem value="15min" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 border-2">15 min</ToggleGroupItem>
                  <ToggleGroupItem value="20min" className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 border-2">20 min</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Format Preference</Label>
                <ToggleGroup
                  type="single"
                  value={preferences.format}
                  onValueChange={(value) => value && handlePreferenceChange('format', value)}
                  className="grid grid-cols-1 gap-2"
                >
                  <ToggleGroupItem value="full" className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 border-2">Full Talk (Word-for-word)</ToggleGroupItem>
                  <ToggleGroupItem value="outline" className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 border-2">Talking Points & Outline</ToggleGroupItem>
                  <ToggleGroupItem value="hybrid" className="data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700 border-2">Hybrid (Key sections + points)</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Audience</Label>
                <ToggleGroup
                  type="single"
                  value={preferences.audience}
                  onValueChange={(value) => value && handlePreferenceChange('audience', value)}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem value="general" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 border-2">General</ToggleGroupItem>
                  <ToggleGroupItem value="youth" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 border-2">Youth</ToggleGroupItem>
                  <ToggleGroupItem value="adults" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 border-2">Adults</ToggleGroupItem>
                  <ToggleGroupItem value="primary" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-700 border-2">Primary</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700">Include in Talk:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                  <Checkbox
                    id="scriptures"
                    checked={preferences.includeScriptures}
                    onCheckedChange={(checked) => handlePreferenceChange('includeScriptures', checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="scriptures" className="text-base flex items-center gap-2 cursor-pointer">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Scripture References
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                  <Checkbox
                    id="quotes"
                    checked={preferences.includeQuotes}
                    onCheckedChange={(checked) => handlePreferenceChange('includeQuotes', checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="quotes" className="text-base flex items-center gap-2 cursor-pointer">
                    <Quote className="w-5 h-5 text-purple-600" />
                    Prophet/Leader Quotes
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                  <Checkbox
                    id="concepts"
                    checked={preferences.includeConcepts}
                    onCheckedChange={(checked) => handlePreferenceChange('includeConcepts', checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="concepts" className="text-base flex items-center gap-2 cursor-pointer">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Key Concepts & Ideas
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100">
                  <Checkbox
                    id="personal"
                    checked={preferences.personalExperiences}
                    onCheckedChange={(checked) => handlePreferenceChange('personalExperiences', checked)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="personal" className="text-base cursor-pointer">
                    Personal Experience Suggestions
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-base font-semibold text-gray-700">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements, themes, or ideas you'd like included..."
                value={preferences.additionalNotes}
                onChange={(e) => handlePreferenceChange('additionalNotes', e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-500 min-h-[100px] text-base"
              />
            </div>
            
            <Button
              onClick={generateTalk}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating Your Talk...
                </>
              ) : (
                <>
                  <BookOpen className="w-6 h-6 mr-3" />
                  Generate Talk
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Talk Display */}
        {generatedTalk && (
          <div className="space-y-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <BookOpen className="w-6 h-6 text-green-600" />
                      Your Generated Talk
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Review your talk below. Use the edit button or chat feature to make adjustments.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={startEditing} variant="outline" size="sm" className="border-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <Textarea
                    value={editedTalk}
                    onChange={(e) => setEditedTalk(e.target.value)}
                    className="min-h-[500px] text-base leading-relaxed border-2 border-gray-200 focus:border-blue-500"
                  />
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-800 leading-relaxed space-y-2">
                      {renderMarkdown(generatedTalk)}
                    </div>
                  </div>
                )}
                
                {/* Copy to Clipboard Button */}
                {!isEditing && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button
                      onClick={copyToClipboard}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-5 h-5 mr-3" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-3" />
                          Copy Talk to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  Refine Your Talk
                </CardTitle>
                <CardDescription className="text-lg">
                  Chat with our AI to make improvements, add details, or adjust the tone of your talk.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {chatMessages.length > 0 && (
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Input
                    placeholder="Ask for changes, additions, or improvements..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1 border-2 border-gray-200 focus:border-blue-500 h-12 text-base"
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={isChatting || !chatInput.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 px-6"
                  >
                    {isChatting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
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
