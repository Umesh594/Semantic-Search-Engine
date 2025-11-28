import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe } from "lucide-react";

interface SearchFormProps {
  onSearch: (url: string, query: string) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && query) {
      onSearch(url, query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="relative">
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="url"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-12 h-14 text-lg border-2 focus:border-primary transition-all duration-300"
          required
          disabled={isLoading}
        />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Enter your search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 text-lg border-2 focus:border-primary transition-all duration-300"
          required
          disabled={isLoading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Content
          </span>
        )}
      </Button>
    </form>
  );
};

export default SearchForm;
