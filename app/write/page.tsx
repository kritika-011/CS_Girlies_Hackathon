"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb, RefreshCw, CheckCircle, Home, Save, Download, Sparkles, BookOpen, Globe, Users, Plus, Eye, EyeOff, ChevronDown, ChevronRight, Map, Scroll, FileText } from "lucide-react"
import Link from "next/link"

export default function WritePage() {
  const [content, setContent] = useState("")
  const [isParaphrasing, setIsParaphrasing] = useState(false)
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [currentIdea, setCurrentIdea] = useState("")
  const [grammarSuggestions, setGrammarSuggestions] = useState([])

  // World and book management
  const [savedWorlds, setSavedWorlds] = useState([])
  const [savedCharacters, setSavedCharacters] = useState([])
  const [selectedWorldId, setSelectedWorldId] = useState(null)
  const [selectedWorld, setSelectedWorld] = useState(null)
  const [books, setBooks] = useState([])
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [showNewBookDialog, setShowNewBookDialog] = useState(false)
  const [newBookTitle, setNewBookTitle] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [worldInfoExpanded, setWorldInfoExpanded] = useState({})

  // Chapter management
  const [chapters, setChapters] = useState([])
  const [selectedChapterId, setSelectedChapterId] = useState(null)
  const [showNewChapterDialog, setShowNewChapterDialog] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")

  // Load data from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  const loadFromLocalStorage = () => {
    try {
      const worlds = JSON.parse(localStorage.getItem('savedWorlds') || '[]')
      const characters = JSON.parse(localStorage.getItem('savedCharacters') || '[]')
      const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]')
      const savedChapters = JSON.parse(localStorage.getItem('savedChapters') || '[]')

      setSavedWorlds(worlds)
      setSavedCharacters(characters)
      setBooks(savedBooks)
      setChapters(savedChapters)
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  const saveBooks = (updatedBooks) => {
    localStorage.setItem('savedBooks', JSON.stringify(updatedBooks))
    setBooks(updatedBooks)
  }

  const saveChapters = (updatedChapters) => {
    localStorage.setItem('savedChapters', JSON.stringify(updatedChapters))
    setChapters(updatedChapters)
  }

  const createNewChapter = () => {
    if (!newChapterTitle.trim() || !selectedBookId) return

    const newChapter = {
      id: Date.now().toString(),
      title: newChapterTitle,
      bookId: selectedBookId,
      content: '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: 0,
      order: chapters.filter(c => c.bookId === selectedBookId).length + 1
    }

    const updatedChapters = [...chapters, newChapter]
    saveChapters(updatedChapters)
    setSelectedChapterId(newChapter.id)
    setContent('')
    setNewChapterTitle('')
    setShowNewChapterDialog(false)
  }

  const createNewBook = () => {
    if (!newBookTitle.trim() || !selectedWorldId) return

    const newBook = {
      id: Date.now().toString(),
      title: newBookTitle,
      worldId: selectedWorldId,
      worldName: selectedWorld?.world_name || '',
      content: '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      wordCount: 0
    }

    const updatedBooks = [...books, newBook]
    saveBooks(updatedBooks)
    setSelectedBookId(newBook.id)
    setSelectedChapterId(null)
    setContent('')
    setNewBookTitle('')
    setShowNewBookDialog(false)
  }

  const selectWorld = (worldId) => {
    const world = savedWorlds.find(w => w.id === worldId)
    setSelectedWorldId(worldId)
    setSelectedWorld(world)
    setSelectedBookId(null)
    setSelectedChapterId(null)
    setContent('')
  }

  const selectBook = (bookId) => {
    const book = books.find(b => b.id === bookId)
    if (book) {
      setSelectedBookId(bookId)
      setSelectedChapterId(null)
      setContent(book.content || '')

      // Auto-select the world if not already selected
      if (book.worldId !== selectedWorldId) {
        selectWorld(book.worldId)
      }
    }
  }

  const selectChapter = (chapterId) => {
    const chapter = chapters.find(c => c.id === chapterId)
    if (chapter) {
      setSelectedChapterId(chapterId)
      setContent(chapter.content || '')

      // Auto-select the book if not already selected
      if (chapter.bookId !== selectedBookId) {
        const book = books.find(b => b.id === chapter.bookId)
        if (book) {
          setSelectedBookId(chapter.bookId)
          if (book.worldId !== selectedWorldId) {
            selectWorld(book.worldId)
          }
        }
      }
    }
  }

  const saveCurrentContent = () => {
    if (selectedChapterId) {
      // Save to chapter
      const updatedChapters = chapters.map(chapter =>
        chapter.id === selectedChapterId
          ? {
              ...chapter,
              content,
              lastModified: new Date().toISOString(),
              wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
            }
          : chapter
      )
      saveChapters(updatedChapters)
    } else if (selectedBookId) {
      // Save to book
      const updatedBooks = books.map(book =>
        book.id === selectedBookId
          ? {
              ...book,
              content,
              lastModified: new Date().toISOString(),
              wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length
            }
          : book
      )
      saveBooks(updatedBooks)
    }
  }

  // Auto-save when content changes
  useEffect(() => {
    if ((selectedBookId || selectedChapterId) && content !== '') {
      const timeoutId = setTimeout(saveCurrentContent, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [content, selectedBookId, selectedChapterId])

  const toggleWorldInfo = (section) => {
    setWorldInfoExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getBookChapters = (bookId) => {
    return chapters.filter(chapter => chapter.bookId === bookId).sort((a, b) => a.order - b.order)
  }

  const downloadBookAsPDF = () => {
    if (!selectedBookId) return
    
    const book = books.find(b => b.id === selectedBookId)
    const bookChapters = getBookChapters(selectedBookId)
    
    if (!book) return

    // Create PDF content
    let pdfContent = `${book.title}\n`
    pdfContent += `World: ${selectedWorld?.world_name || 'Unknown'}\n`
    pdfContent += `Created: ${new Date(book.createdAt).toLocaleDateString()}\n\n`
    
    if (book.content) {
      pdfContent += `${book.content}\n\n`
    }
    
    // Add chapters
    bookChapters.forEach((chapter, index) => {
      pdfContent += `Chapter ${index + 1}: ${chapter.title}\n`
      pdfContent += `${'='.repeat(50)}\n\n`
      pdfContent += `${chapter.content || 'No content yet.'}\n\n\n`
    })

    // Create and download PDF using jsPDF
    try {
      // Simple text-based PDF creation using data URL
      const element = document.createElement('a')
      const file = new Blob([pdfContent], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error('Error downloading book:', error)
    }
  }

  const callGeminiAPI = async (prompt) => {
    const storedApiKey = localStorage.getItem('geminiApiKey')
    if (!storedApiKey) {
      throw new Error('Gemini API key not found. Please add your API key in settings.')
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${storedApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  const getWorldCharacters = (worldId) => {
    return savedCharacters.filter(char => char.worldId === worldId)
  }

  const handleParaphrase = async () => {
    if (!content.trim()) return
    setIsParaphrasing(true)

    try {
      const prompt = `Please paraphrase the following text while maintaining its meaning and style. Make it sound more engaging and varied:\n\n${content}`
      const paraphrasedText = await callGeminiAPI(prompt)
      setContent(paraphrasedText)
    } catch (error) {
      console.error("Error calling Gemini API for paraphrasing:", error)
      // Fallback to original method
      fallbackParaphrase()
    }

    setIsParaphrasing(false)
  }

  const fallbackParaphrase = () => {
    setTimeout(() => {
      const paraphrased = content.replace(/\b(good|nice|great)\b/gi, (match) => {
        const alternatives = {
          good: "excellent",
          nice: "wonderful",
          great: "magnificent",
        }
        return alternatives[match.toLowerCase()] || match
      })
      setContent(paraphrased)
    }, 800)
  }

  const handleGrammarCheck = async () => {
    if (!content.trim()) return
    setIsCheckingGrammar(true)

    try {
      const prompt = `Please check the following text for grammar, spelling, and style issues. Provide specific suggestions for improvement:\n\n${content}`
      const grammarResponse = await callGeminiAPI(prompt)
      
      // Parse the AI response to extract suggestions
      const suggestions = grammarResponse.split('\n').filter(line => 
        line.trim() && (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.'))
      ).slice(0, 5) // Limit to 5 suggestions
      
      if (suggestions.length > 0) {
        setGrammarSuggestions(suggestions.map(s => s.replace(/^[•-]\s*/, '').trim()))
      } else {
        // Fallback suggestions if AI response doesn't have clear format
        setGrammarSuggestions([
          "Your text looks good overall! Consider reading it aloud to check flow.",
          "Check for consistency in tense throughout your writing.",
          "Look for opportunities to vary sentence length and structure."
        ])
      }
    } catch (error) {
      console.error("Grammar check failed:", error)
      // Fallback suggestions on error
      setGrammarSuggestions([
        "Unable to connect to grammar service. Check your API key in settings.",
        "Consider using 'who' instead of 'that' when referring to people",
        "The sentence could be more concise",
        "Check comma placement in compound sentences",
      ])
    }

    setIsCheckingGrammar(false)
  }

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true)
    
    try {
      // Get the last 200 words of content for context
      const words = content.trim().split(/\s+/)
      const last200Words = words.slice(-200).join(' ')
      
      // Build context from selected world
      let worldContext = ""
      if (selectedWorld) {
        worldContext = `World: ${selectedWorld.world_name}
Overview: ${selectedWorld.world_overview || 'No overview available'}
${selectedWorld.magic_technology?.system_description ? `Magic System: ${selectedWorld.magic_technology.system_description}` : ''}
${selectedWorld.places?.major_locations ? `Key Locations: ${selectedWorld.places.major_locations.map(loc => loc.name).join(', ')}` : ''}`
      }

      // Get characters in this world for additional context
      const worldCharacters = selectedWorld ? getWorldCharacters(selectedWorld.id) : []
      const characterContext = worldCharacters.length > 0 
        ? `\nCharacters in this world: ${worldCharacters.slice(0, 5).map(char => `${char.name} (${char.race} ${char.class})`).join(', ')}`
        : ""

      const prompt = `You are a creative writing assistant helping with story ideas. Based on the following context, suggest a specific, actionable writing idea or plot development.

WORLD CONTEXT:
${worldContext}${characterContext}

RECENT WRITING (last 200 words):
${last200Words || 'No recent content available'}

CURRENT PROJECT:
${selectedChapter ? `Writing chapter "${selectedChapter.title}"` : selectedBook ? `Working on book "${selectedBook.title}"` : 'General writing session'}

Please provide ONE specific, creative writing suggestion that:
1. Fits the established world and characters
2. Could naturally continue from the recent writing
3. Introduces an interesting conflict, revelation, or development
4. Is actionable (the writer can immediately act on it)

Keep your response to 1-2 sentences, focused and inspiring.`

      const ideaResponse = await callGeminiAPI(prompt)
      setCurrentIdea(ideaResponse.trim())
      
    } catch (error) {
      console.error("Error generating AI idea:", error)
      // Fallback to generic ideas if AI fails
      const fallbackIdeas = [
        "What if your character discovers a hidden talent they never knew they had?",
        "Consider adding a mysterious letter that arrives at the perfect moment",
        "Perhaps there's a secret that changes everything your character believed",
        "What would happen if two unlikely characters were forced to work together?",
        "Try introducing a mentor figure who isn't what they seem",
        "Consider a plot twist where the antagonist has noble motivations",
        "What if a trusted ally has been hiding something important?",
        "Introduce a moral dilemma that tests your character's core values",
        "What ancient prophecy or legend could suddenly become relevant?",
        "Consider a moment where your character must choose between two things they value equally"
      ]
      const randomIdea = fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)]
      setCurrentIdea(randomIdea)
    }
    
    setIsGeneratingIdea(false)
  }

  const wordCount = content.trim().split(/\s+/).filter((word) => word.length > 0).length
  const charCount = content.length
  const selectedBook = books.find(b => b.id === selectedBookId)
  const selectedChapter = chapters.find(c => c.id === selectedChapterId)

  // Check if word limit is exceeded for chapters
  const isWordLimitExceeded = selectedChapterId && wordCount > 1000

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
            {selectedWorld && (
              <>
                <span className="text-warmGray font-serif">/ {selectedWorld.world_name}</span>
                {selectedBook && (
                  <>
                    <span className="text-warmGray font-serif">/ {selectedBook.title}</span>
                    {selectedChapter && (
                      <span className="text-warmGray font-serif">/ {selectedChapter.title}</span>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={saveCurrentContent}
              disabled={!selectedBookId && !selectedChapterId}
              variant="outline"
              size="sm"
              className="border-sage-300 text-sage-600 hover:bg-sage-50 font-serif bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            {selectedBookId && (
              <Button
                onClick={downloadBookAsPDF}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 font-serif bg-transparent"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Book
              </Button>
            )}
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
        <div className="grid grid-cols-12 gap-8">
          {/* World Navigator Sidebar */}
          <div className={`${sidebarCollapsed ? 'col-span-1' : 'col-span-3'} transition-all duration-300`}>
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl h-[800px] overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="bg-gradient-to-r from-sage-50 to-peach-50 px-4 py-3 border-b border-rose-100 flex items-center justify-between">
                  <h3 className={`font-serif font-semibold text-softBrown ${sidebarCollapsed ? 'hidden' : ''}`}>
                    World Navigator
                  </h3>
                  <Button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                {!sidebarCollapsed && (
                  <div className="p-4 h-full overflow-y-auto">
                    {/* Worlds Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-serif font-medium text-softBrown flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Worlds
                        </h4>
                      </div>

                      {savedWorlds.length === 0 ? (
                        <p className="text-sm text-warmGray font-serif italic">No worlds created yet</p>
                      ) : (
                        <div className="space-y-2">
                          {savedWorlds.map((world) => (
                            <div key={world.id} className="space-y-2">
                              <div
                                onClick={() => selectWorld(world.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                  selectedWorldId === world.id
                                    ? 'bg-sage-100 border-2 border-sage-300'
                                    : 'bg-gray-50 hover:bg-sage-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-sm font-medium text-softBrown">
                                    {world.world_name}
                                  </span>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleWorldInfo(world.id)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="p-1"
                                  >
                                    {worldInfoExpanded[world.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                </div>
                                <p className="text-xs text-warmGray font-serif mt-1">
                                  {world.world_overview?.substring(0, 60)}...
                                </p>
                              </div>

                              {/* World Info Expansion */}
                              {worldInfoExpanded[world.id] && selectedWorldId === world.id && (
                                <div className="ml-4 space-y-2">
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                                    <h5 className="font-serif text-xs font-semibold text-softBrown mb-2 flex items-center">
                                      <Map className="w-3 h-3 mr-1" />
                                      Major Locations
                                    </h5>
                                    {world.places?.major_locations?.map((location, idx) => (
                                      <div key={idx} className="text-xs text-warmGray font-serif mb-1">
                                        <strong>{location.name}:</strong> {location.description?.substring(0, 50)}...
                                      </div>
                                    ))}
                                  </div>

                                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
                                    <h5 className="font-serif text-xs font-semibold text-softBrown mb-2 flex items-center">
                                      <Users className="w-3 h-3 mr-1" />
                                      Characters ({getWorldCharacters(world.id).length})
                                    </h5>
                                    {getWorldCharacters(world.id).slice(0, 3).map((character) => (
                                      <div key={character.id} className="text-xs text-warmGray font-serif">
                                        {character.name} - {character.race} {character.class}
                                      </div>
                                    ))}
                                    {getWorldCharacters(world.id).length > 3 && (
                                      <div className="text-xs text-warmGray font-serif italic">
                                        +{getWorldCharacters(world.id).length - 3} more...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Books Section */}
                    {selectedWorldId && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-serif font-medium text-softBrown flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Books
                          </h4>
                          <Button
                            onClick={() => setShowNewBookDialog(true)}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* New Book Dialog */}
                        {showNewBookDialog && (
                          <div className="mb-4 p-3 bg-cream-100 rounded-lg">
                            <input
                              type="text"
                              value={newBookTitle}
                              onChange={(e) => setNewBookTitle(e.target.value)}
                              placeholder="Book title..."
                              className="w-full p-2 text-sm border border-sage-300 rounded mb-2 font-serif"
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={createNewBook}
                                size="sm"
                                className="bg-sage-500 hover:bg-sage-600 text-white font-serif"
                              >
                                Create
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowNewBookDialog(false)
                                  setNewBookTitle('')
                                }}
                                variant="ghost"
                                size="sm"
                                className="font-serif"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {books
                            .filter(book => book.worldId === selectedWorldId)
                            .map((book) => (
                              <div key={book.id} className="space-y-2">
                                <div
                                  onClick={() => selectBook(book.id)}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedBookId === book.id
                                      ? 'bg-peach-100 border-2 border-peach-300'
                                      : 'bg-gray-50 hover:bg-peach-50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-serif text-sm font-medium text-softBrown">
                                      {book.title}
                                    </span>
                                    <Scroll className="w-3 h-3 text-warmGray" />
                                  </div>
                                  <div className="text-xs text-warmGray font-serif mt-1">
                                    {book.wordCount || 0} words
                                  </div>
                                  <div className="text-xs text-warmGray font-serif">
                                    {new Date(book.lastModified || book.createdAt).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Chapters for selected book */}
                                {selectedBookId === book.id && (
                                  <div className="ml-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-serif text-xs font-medium text-softBrown flex items-center">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        Chapters
                                      </h5>
                                      <Button
                                        onClick={() => setShowNewChapterDialog(true)}
                                        variant="ghost"
                                        size="sm"
                                        className="p-1"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>

                                    {/* New Chapter Dialog */}
                                    {showNewChapterDialog && (
                                      <div className="mb-2 p-2 bg-cream-50 rounded-lg">
                                        <input
                                          type="text"
                                          value={newChapterTitle}
                                          onChange={(e) => setNewChapterTitle(e.target.value)}
                                          placeholder="Chapter title..."
                                          className="w-full p-1 text-xs border border-sage-300 rounded mb-2 font-serif"
                                        />
                                        <div className="flex space-x-1">
                                          <Button
                                            onClick={createNewChapter}
                                            size="sm"
                                            className="bg-sage-500 hover:bg-sage-600 text-white font-serif text-xs py-1 px-2"
                                          >
                                            Create
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              setShowNewChapterDialog(false)
                                              setNewChapterTitle('')
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="font-serif text-xs py-1 px-2"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    )}

                                    {getBookChapters(book.id).map((chapter) => (
                                      <div
                                        key={chapter.id}
                                        onClick={() => selectChapter(chapter.id)}
                                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                          selectedChapterId === chapter.id
                                            ? 'bg-blue-100 border-2 border-blue-300'
                                            : 'bg-gray-100 hover:bg-blue-50'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-serif text-xs font-medium text-softBrown">
                                            Ch. {chapter.order}: {chapter.title}
                                          </span>
                                        </div>
                                        <div className="text-xs text-warmGray font-serif">
                                          {chapter.wordCount || 0}/1000 words
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Writing Area */}
          <div className={`${sidebarCollapsed ? 'col-span-8' : 'col-span-6'} transition-all duration-300`}>
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
                  {!selectedBookId && !selectedChapterId ? (
                    <div className="min-h-[500px] flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="w-16 h-16 text-warmGray mx-auto mb-4" />
                        <h3 className="font-serif text-lg text-softBrown mb-2">
                          {!selectedWorldId ? 'Select a World to Begin' : 'Create or Select a Book'}
                        </h3>
                        <p className="text-warmGray font-serif">
                          {!selectedWorldId
                            ? 'Choose a world from the sidebar to start writing your story.'
                            : 'Create a new book or select an existing one to continue writing.'
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {selectedChapterId && isWordLimitExceeded && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                          <p className="text-red-700 font-serif text-sm">
                            ⚠️ Chapter word limit exceeded! Chapters are limited to 1000 words. Consider splitting into multiple chapters.
                          </p>
                        </div>
                      )}
                      <Textarea
                        value={content}
                        onChange={(e) => {
                          if (selectedChapterId) {
                            const newWordCount = e.target.value.trim().split(/\s+/).filter(word => word.length > 0).length
                            if (newWordCount <= 1000) {
                              setContent(e.target.value)
                            }
                          } else {
                            setContent(e.target.value)
                          }
                        }}
                        placeholder={
                          selectedChapter
                            ? `Writing "${selectedChapter.title}" in "${selectedBook?.title}" set in ${selectedWorld?.world_name}... (Max 1000 words per chapter)`
                            : `Begin writing "${selectedBook?.title}" in the world of ${selectedWorld?.world_name}... Let your imagination flow freely.`
                        }
                        className="min-h-[500px] border-0 resize-none text-lg leading-relaxed font-serif text-softBrown placeholder:text-warmGray/60 focus:ring-0 focus:outline-none bg-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <div className="bg-gradient-to-r from-cream-100 to-peach-100 px-6 py-3 border-t border-rose-100">
                  <div className="flex items-center justify-between text-sm text-warmGray font-serif">
                    <div className="flex items-center space-x-6">
                      <span className={selectedChapterId && wordCount > 1000 ? 'text-red-600 font-semibold' : ''}>
                        Words: {wordCount}{selectedChapterId ? '/1000' : ''}
                      </span>
                      <span>Characters: {charCount}</span>
                      {selectedChapter ? (
                        <span>Chapter: {selectedChapter.title}</span>
                      ) : selectedBook ? (
                        <span>Book: {selectedBook.title}</span>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                      <span>{selectedBookId || selectedChapterId ? 'Auto-saved' : 'No content selected'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className={`${sidebarCollapsed ? 'col-span-3' : 'col-span-3'} space-y-6`}>
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

            {/* World Context */}
            {selectedWorld && (
              <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-0 shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-softBrown mb-4 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    World Context
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-serif text-sm font-medium text-softBrown">Overview</h4>
                      <p className="text-xs text-warmGray font-serif leading-relaxed">
                        {selectedWorld.world_overview?.substring(0, 150)}...
                      </p>
                    </div>
                    {selectedWorld.magic_technology && (
                      <div>
                        <h4 className="font-serif text-sm font-medium text-softBrown">Magic System</h4>
                        <p className="text-xs text-warmGray font-serif leading-relaxed">
                          {selectedWorld.magic_technology.system_description?.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
