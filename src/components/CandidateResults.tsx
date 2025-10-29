import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Briefcase, GraduationCap, Code } from "lucide-react";

interface CandidateData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

interface CandidateResultsProps {
  data: CandidateData;
}

export const CandidateResults = ({ data }: CandidateResultsProps) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-700">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{data.name}</h2>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {data.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{data.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Experience</h3>
          </div>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-6" />}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {exp.duration}
                    </Badge>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Education</h3>
          </div>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {edu.year}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
