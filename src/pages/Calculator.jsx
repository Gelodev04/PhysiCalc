import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">PhysiCalc</h1>
            <p className="text-muted-foreground">
              Select a calculation type to get started
            </p>
          </div>
        </div>

        {/* Calculator Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription>
              Your calculator interface will go here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add your physics calculation components here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
