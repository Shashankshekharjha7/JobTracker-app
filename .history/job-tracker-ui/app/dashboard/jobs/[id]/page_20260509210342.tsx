"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
}

interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  jobDescription?: string;
  extractedSkills: string[];
  interviewQuestions: InterviewQuestion[];
  createdAt: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!job || !answer.trim()) return;

    const currentQuestion = job.interviewQuestions[currentQuestionIndex];
    setSubmitting(true);

    try {
      const response = await api.post(
        `/interviews/questions/${currentQuestion.id}/answer`,
        { answer: answer.trim() }
      );

      setFeedback(response.data);
      setAnswer("");

      // Move to next question after 3 seconds
      setTimeout(() => {
        if (currentQuestionIndex < job.interviewQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setFeedback(null);
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      
        Loading...
      
    );
  }

  if (!job) {
    return (
      
        Job not found
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        
      
    );
  }

  const currentQuestion = job.interviewQuestions[currentQuestionIndex];

  return (
    
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-4"
      >
        
        Back to Dashboard
      

      
        {/* Job Details */}
        
          
            
              {job.company}
              {job.role}
            
            
              
                Status
                {job.status}
              

              {job.location && (
                
                  Location
                  {job.location}
                
              )}

              {job.extractedSkills.length > 0 && (
                
                  
                    Required Skills
                  
                  
                    {job.extractedSkills.map((skill, index) => (
                      
                        {skill}
                      
                    ))}
                  
                
              )}

              {job.jobDescription && (
                
                  
                    Description
                  
                  
                    {job.jobDescription.slice(0, 200)}
                    {job.jobDescription.length > 200 ? "..." : ""}
                  
                
              )}
            
          
        

        {/* Interview Practice */}
        
          
            
              Interview Practice
              
                Question {currentQuestionIndex + 1} of {job.interviewQuestions.length}
              
            
            
              {job.interviewQuestions.length === 0 ? (
                
                  
                    No interview questions available yet.
                  
                  
                    Add a job description to generate AI-powered questions.
                  
                
              ) : (
                <>
                  
                    
                      {currentQuestion.category}
                      {currentQuestion.difficulty}
                    
                    
                      {currentQuestion.question}
                    
                  

                  
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={6}
                      disabled={submitting}
                    />
                  

                  
                    {submitting ? "Analyzing..." : "Submit Answer"}
                  

                  {feedback && (
                    
                      
                        Score: {feedback.analysis?.contentScore || 0}/100
                      
                      {feedback.feedback}
                    
                  )}

                  
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.min(job.interviewQuestions.length - 1, currentQuestionIndex + 1))}
                      disabled={currentQuestionIndex === job.interviewQuestions.length - 1}
                    >
                      Next
                    
                  
                </>
              )}
            
          
        
      
    
  );
}