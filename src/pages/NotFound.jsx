import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, Calculator } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <AnimatedElement delay={100}>
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <AlertCircle className="h-24 w-24 text-primary/80" />
                <div className="absolute inset-0 flex items-center justify-center"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have
              been moved or deleted.
            </p>
          </div>
        </AnimatedElement>

        <AnimatedElement delay={300}>
          <Card className="bg-card/95 border-primary/10">
            <CardHeader>
              <CardTitle className="text-center">
                What would you like to do?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
                <Link to="/calculate" className="flex-1">
                  <Button className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Start Calculating
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>
    </div>
  );
}
