import { useState } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { CandidateResults } from "@/components/CandidateResults";
import { FileText } from "lucide-react";

const Index = () => {
  const [candidateData, setCandidateData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Resume Parser
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a resume PDF to automatically extract the information
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <ResumeUpload onExtractComplete={setCandidateData} />

          {candidateData && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              <CandidateResults data={candidateData} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Made with love!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
