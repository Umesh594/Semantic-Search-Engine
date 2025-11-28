import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-destructive blur-2xl opacity-20 rounded-full" />
        <div className="relative bg-destructive/10 p-6 rounded-full border-2 border-destructive/50">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {message}
      </p>
      <Button 
        onClick={onRetry}
        variant="outline"
        className="hover:bg-primary hover:text-primary-foreground transition-all"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
