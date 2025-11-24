import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, Zap, BookOpen } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* hero section */}
        <div className="text-center space-y-4">
          <AnimatedElement delay={100}>
            <img
              src="/physiCalcLogo.png"
              alt="logo"
              className="w-80 h-50 mx-auto block object-contain"
            />
          </AnimatedElement>
          <AnimatedElement delay={300}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solve complex physics problems with ease. Calculate motion,
              forces, energy, and more.
            </p>
          </AnimatedElement>
        </div>

        {/* features grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <AnimatedElement delay={500} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <Calculator className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Calculations</CardTitle>
                <CardDescription>
                  Quick and accurate physics calculations
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedElement>

          <AnimatedElement delay={700} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fast Results</CardTitle>
                <CardDescription>
                  Get instant solutions to your problems
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedElement>

          <AnimatedElement delay={900} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Learn & Understand</CardTitle>
                <CardDescription>
                  Step-by-step solutions included
                </CardDescription>
              </CardHeader>
            </Card>
          </AnimatedElement>
        </div>

        {/* cta button */}
        <AnimatedElement delay={1100} className="flex justify-center">
          <Link to="/calculate">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
              <Calculator className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </AnimatedElement>
      </div>
    </div>
  );
}
