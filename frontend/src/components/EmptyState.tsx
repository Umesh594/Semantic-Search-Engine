import { Search, Sparkles } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow blur-2xl opacity-20 rounded-full" />
        <div className="relative bg-gradient-to-br from-primary to-accent p-6 rounded-full">
          <Search className="h-12 w-12 text-primary-foreground" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        Semantic Search Engine
        <Sparkles className="h-6 w-6 text-accent" />
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Enter a website URL and your search query above to find the most relevant content chunks from the page.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
        <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm text-muted-foreground">Semantic Search</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <p className="text-sm text-muted-foreground">Top 10 Results</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-muted-foreground">Relevance Scores</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
