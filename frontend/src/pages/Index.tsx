import { useState } from "react";
import { toast } from "sonner";
import SearchForm from "@/components/SearchForm";
import ResultCard from "@/components/ResultCard";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { Search } from "lucide-react";
interface SearchResult {
  index: number;
  score: number;
  content: string;
}
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearch = async (url: string, query: string) => {
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, query }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch search results. Please check your backend connection.");
      }
      const data = await response.json();
      const mapped: SearchResult[] = (data.results || []).map((r: any, i: number) => ({
        index: (r.chunk_index ?? i) + 1,
        score: typeof r.score === "number" ? r.score : 0,
        content: r.text ?? "",
      }));
      setResults(mapped);
      toast.success("Search completed successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRetry = () => {
    setError(null);
    setResults([]);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-30" />
              <Search className="h-8 w-8 text-primary relative" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Semantic Search Engine
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-12">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        <div className="mt-12">
          {isLoading ? (
            <ResultsSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={handleRetry} />
          ) : results.length > 0 ? (
            <div className="w-full max-w-6xl mx-auto">
              <div className="mb-6 text-center animate-fade-in">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Top 10 Results
                </h2>
                <p className="text-muted-foreground">
                  Found {results.length} relevant content chunks for "{searchQuery}"
                </p>
              </div>
              <div className="space-y-4">
                {results.map((result) => (
                  <ResultCard
                    key={result.index}
                    index={result.index}
                    score={result.score}
                    content={result.content}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
      <footer className="border-t border-border/50 mt-20 py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Powered by Vector Database & Semantic Search Technology</p>
        </div>
      </footer>
    </div>
  );
};
export default Index;