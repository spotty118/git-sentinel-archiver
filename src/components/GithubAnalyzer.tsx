
import { useState, useEffect } from "react";
import { Github, FolderTree, Copy, Download, Key } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const GithubAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("openrouter_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid OpenRouter API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("openrouter_key", apiKey);
    setIsKeySet(true);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("openrouter_key");
    setApiKey("");
    setIsKeySet(false);
    toast({
      title: "Removed",
      description: "API key removed successfully",
    });
  };

  const handleAnalyze = async () => {
    if (!isKeySet) {
      toast({
        title: "Error",
        description: "Please set your OpenRouter API key first",
        variant: "destructive",
      });
      return;
    }

    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement actual GitHub API integration
      setAnalysis("Analysis in progress...");
      toast({
        title: "Analysis Started",
        description: "Processing repository structure...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze repository",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      toast({
        title: "Copied!",
        description: "Analysis copied to clipboard",
      });
    }
  };

  const handleExport = () => {
    if (analysis) {
      const blob = new Blob([analysis], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "github-analysis.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Exported!",
        description: "Analysis exported successfully",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
          GitHub Repository Analyzer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="p-6 animate-fade-in">
            <div className="space-y-6">
              {/* API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-mint" />
                  <h2 className="text-xl font-semibold">API Key Configuration</h2>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    placeholder="Enter OpenRouter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  {!isKeySet ? (
                    <Button 
                      onClick={handleSaveKey}
                      className="bg-mint hover:bg-mint-light text-white"
                    >
                      Save Key
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleRemoveKey}
                      variant="outline"
                      className="hover:text-destructive"
                    >
                      Remove Key
                    </Button>
                  )}
                </div>
              </div>

              {/* Repository Input Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-mint" />
                  <h2 className="text-xl font-semibold">Repository Input</h2>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter GitHub repository URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyze} 
                    className="bg-mint hover:bg-mint-light text-white"
                    disabled={!isKeySet}
                  >
                    Analyze
                  </Button>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FolderTree className="w-5 h-5 text-mint" />
                    <h3 className="text-lg font-medium">File Structure</h3>
                  </div>
                  <div className="bg-muted p-4 rounded-lg min-h-[300px] font-mono text-sm">
                    {/* File tree will be displayed here */}
                    <p className="text-muted-foreground">Repository structure will appear here...</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="p-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Analysis Results</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="hover:text-mint"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleExport}
                    className="hover:text-mint"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg min-h-[400px] font-mono text-sm">
                {analysis || (
                  <p className="text-muted-foreground">
                    Analysis results will appear here...
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
