import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ResultCardProps {
  index: number;
  score: number;
  content: string;
}

const ResultCard = ({ index, score, content }: ResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate content for preview (show first 200 chars)
  const previewContent = content.length > 200 ? content.slice(0, 200) + "..." : content;
  const shouldShowToggle = content.length > 200;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-fade-in bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0">
              #{index}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Relevance:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {(score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {isExpanded ? content : previewContent}
          </div>
          {shouldShowToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full hover:bg-primary/10 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show More
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
