import { useState, useCallback } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

interface ResumeUploadProps {
  onExtractComplete: (data: any) => void;
}

export const ResumeUpload = ({ onExtractComplete }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      // Read the PDF file
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extract text from all pages
      let fullText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      if (!fullText || fullText.trim().length === 0) {
        throw new Error("Could not extract text from PDF");
      }

      // Call edge function with extracted text
      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: { resumeText: fullText },
      });

      if (error) throw error;

      toast({
        title: "Resume parsed successfully",
        description: "Candidate information extracted",
      });

      onExtractComplete(data);
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to extract resume data",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card
      className={`
        relative overflow-hidden border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border bg-card hover:border-primary/50"
        }
        ${isProcessing ? "pointer-events-none opacity-60" : ""}
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="p-12 flex flex-col items-center justify-center space-y-6">
        {isProcessing ? (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground">Processing Resume</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
              <Upload className="relative h-16 w-16 text-primary" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Upload Resume
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Drag and drop a PDF file here, or click to browse
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>PDF files only</span>
            </div>

            <Button
              size="lg"
              className="relative group"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <span className="relative z-10">Choose File</span>
              <div className="absolute inset-0 bg-primary-glow opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
            </Button>

            <input
              id="file-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </>
        )}
      </div>
    </Card>
  );
};
