"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb, RefreshCw, CheckCircle, Home, Save, Download, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"

export default function WritePage() {
  const [content, setContent] = useState("")
  const [isParaphrasing, setIsParaphrasing] = useState(false)
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [currentIdea, setCurrentIdea] = useState("")
  const [grammarSuggestions, setGrammarSuggestions] = useState<string[]>([])

  const handleParaphrase = async () => {
    if (!content.trim()) return

    setIsParaphrasing(true)
    // Simulate API call
    setTimeout(() => {
      const paraphrased = content.replace(/\b(good|nice|great)\b/gi, (match) => {
        const alternatives = {
          good: "excellent",
          nice: "wonderful",
          great: "magnificent",
        }
        return alternatives[match.toLowerCase() as keyof typeof alternatives] || match
      })
      setContent(paraphrased)
      setIsParaphrasing(false)
    }, 1500)
  }

  const handleGrammarCheck = async () => {
    if (!content.trim()) return

    setIsCheckingGrammar(true)
    // Simulate grammar checking
    setTimeout(() => {
      const suggestions = [
        "Consider using 'who' instead of 'that' when referring to people",
        "The sentence could be more concise",
        "Check comma placement in compound sentences",
      ]
      setGrammarSuggestions(suggestions)
      setIsCheckingGrammar(false)
    }, 1000)
  }

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true)
    // Simulate idea generation
    setTimeout(() => {
      const ideas = [
        "What if your character discovers a hidden talent they never knew they had?",
        "Consider adding a mysterious letter that arrives at the perfect moment",
        "Perhaps there's a secret that changes everything your character believed",
        "What would happen if two unlikely characters were forced to work together?",
        "Try introducing a mentor figure who isn't what they seem",
        "Consider a plot twist where the antagonist has noble motivations",
      ]
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)]
      setCurrentIdea(randomIdea)
      setIsGeneratingIdea(false)
    }, 1200)
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const charCount = content.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-peach-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">SN</span>
              </div>
              <span className="text-xl font-serif font-bold text-softBrown">The Story Nook</span>
            </Link>
            <span className="text-warmGray font-serif">/ Writing Space</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-sage-300 text-sage-600 hover:bg-sage-50 font-serif bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 font-serif bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-warmGray hover:text-softBrown font-serif">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Writing Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Toolbar */}
                <div className="bg-gradient-to-r from-sage-50 to-peach-50 px-6 py-4 border-b border-rose-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleGenerateIdea}
                      disabled={isGeneratingIdea}
                      className="bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-sage-700 text-white font-serif shadow-md"
                    >
                      {isGeneratingIdea ? (
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Lightbulb className="w-4 h-4 mr-2" />
                      )}
                      Get Idea
                    </Button>

                    <Button
                      onClick={handleParaphrase}
                      disabled={isParaphrasing || !content.trim()}
                      variant="outline"
                      className="border-peach-300 text-peach-600 hover:bg-peach-50 font-serif bg-transparent"
                    >
                      {isParaphrasing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Paraphrase
                    </Button>

                    <Button
                      onClick={handleGrammarCheck}
                      disabled={isCheckingGrammar || !content.trim()}
                      variant="outline"
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 font-serif bg-transparent"
                    >
                      {isCheckingGrammar ? (
                        <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Grammar Check
                    </Button>
                  </div>
                </div>

                {/* Writing Area */}
                <div className="p-6">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Begin your story here... Let your imagination flow freely."
                    className="min-h-[500px] border-0 resize-none text-lg leading-relaxed font-serif text-softBrown placeholder:text-warmGray/60 focus:ring-0 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-cream-100 to-peach-100 px-6 py-3 border-t border-rose-100">
                  <div className="flex items-center justify-between text-sm text-warmGray font-serif">
                    <div className="flex items-center space-x-6">
                      <span>Words: {wordCount}</span>
                      <span>Characters: {charCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                      <span>Auto-saved</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Idea */}
            {currentIdea && (
              <Card className="bg-gradient-to-br from-sage-100 to-sage-50 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-softBrown mb-2">Writing Inspiration</h3>
                      <p className="text-warmGray font-serif text-sm leading-relaxed">{currentIdea}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grammar Suggestions */}
            {grammarSuggestions.length > 0 && (
              <Card className="bg-gradient-to-br from-rose-100 to-rose-50 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-serif font-semibold text-softBrown">Grammar Suggestions</h3>
                  </div>
                  <div className="space-y-3">
                    {grammarSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-warmGray font-serif text-sm leading-relaxed">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setGrammarSuggestions([])}
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-rose-600 hover:bg-rose-100 font-serif"
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Tools */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-softBrown mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Quick Tools
                </h3>
                <div className="space-y-3">
                  <Link href={"/character-maker"}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-warmGray hover:text-softBrown hover:bg-sage-50 font-serif"
                  >
                    Character Generator
                  </Button>
                  </Link>
                  <Link href="/world-maker">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-warmGray hover:text-softBrown hover:bg-peach-50 font-serif"
                  >
                    World Builder
                  </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-warmGray hover:text-softBrown hover:bg-rose-50 font-serif"
                  >
                    Plot Outline
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Writing Stats */}
            <Card className="bg-gradient-to-br from-peach-100 to-peach-50 border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-serif font-semibold text-softBrown mb-4">Today's Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-warmGray font-serif text-sm">Words Written</span>
                    <span className="font-serif font-semibold text-softBrown">{wordCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-warmGray font-serif text-sm">Time Spent</span>
                    <span className="font-serif font-semibold text-softBrown">25 min</span>
                  </div>
                  <div className="w-full bg-peach-200 rounded-full h-2">
                    <div
                      className="bg-peach-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((wordCount / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-warmGray font-serif">Goal: 500 words</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
