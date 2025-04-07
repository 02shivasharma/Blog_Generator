import { useState } from "react"
import { Sparkles, FileText, ChevronRight, Lightbulb, Search, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BlogGenerator() {
  const [keyword, setKeyword] = useState("")
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [blogContent, setBlogContent] = useState("");


  const handleGenerate = async () => {
  if (!keyword.trim() || !topic.trim()) return;

  setIsGenerating(true);

  try {
    const res = await fetch("http://localhost:3000/generate-blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword, topic }),
    });

    const data = await res.json();

   if (data.blog) {
  setSuggestions(data.suggestions);
  setBlogContent(data.blog); // <--- add this
  console.log(data.blog);
}
 else {
      alert("Blog generation failed!");
    }
  } catch (err) {
    console.error(err);
    alert("Error calling the API");
  } finally {
    setIsGenerating(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 mr-2 text-purple-500" />
          <h1 className="text-3xl md:text-4xl font-bold">BlogGenius</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Generate SEO-optimized blog posts with AI. Just enter your keywords and topic, and we'll do the rest.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card className="md:col-span-2 overflow-hidden border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="create" className="w-full">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger
                    value="create"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Create Blog
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestions"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Keyword Suggestions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="create" className="p-6 space-y-6 mt-0">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium mb-1">
                      SEO Keywords
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="keyword"
                        placeholder="e.g., content marketing, SEO strategy"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Enter primary keywords for better SEO ranking</p>
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium mb-1">
                      Blog Topic
                    </label>
                    <Textarea
                      id="topic"
                      placeholder="e.g., 10 Effective Content Marketing Strategies for 2025"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={!keyword.trim() || !topic.trim() || isGenerating}
                      className="w-full md:w-auto"
                    >
                      {isGenerating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Blog Post <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="p-6 mt-0">
                {suggestions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Keyword Suggestions for "{keyword}"</h3>
                    <ul className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center">
                          <Button
                            variant="outline"
                            className="text-left justify-start w-full"
                            onClick={() => setKeyword(suggestion)}
                          >
                            <Search className="h-4 w-4 mr-2 text-slate-400" />
                            {suggestion}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Enter your keywords and topic in the Create Blog tab, then generate to see keyword suggestions.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-slate-500" />
              <h2 className="text-xl font-semibold">Blog Preview</h2>
            </div>

            {topic ? (
  <div className="space-y-4">
    <div className="border-b pb-4">
      <h3 className="text-2xl font-bold">{topic}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {keyword.split(",").map((k, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-xs"
          >
            {k.trim()}
          </span>
        ))}
      </div>
    </div>

    <div className="space-y-4 text-slate-700 dark:text-slate-300">
      {isGenerating ? (
        <>
          <p className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></p>
          <p className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12 animate-pulse"></p>
          <p className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></p>
          <div className="py-2"></div>
          <p className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></p>
          <p className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse"></p>
        </>
      ) : (
        blogContent.split("\n").map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))
      )}
    </div>
  </div>
) : (

              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your blog preview will appear here</h3>
                <p className="text-slate-500 max-w-md">
                  Enter your SEO keywords and blog topic to generate a preview of your blog post.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} BlogGenius. All rights reserved.</p>
        <p className="mt-1">Powered by AI to create SEO-optimized content.</p>
      </footer>
    </div>
  )
}