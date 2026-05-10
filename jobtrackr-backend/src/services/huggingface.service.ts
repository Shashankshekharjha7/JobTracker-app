import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// ============================================================================
// OPTIMIZED QUESTION GENERATION (Low Token Usage)
// ============================================================================

export const generateInterviewQuestions = async (
  role: string,
  skills: string[],
  count: number = 5 // Reduced from 10 to save tokens
): Promise<Array<{ question: string; category: string; difficulty: string }>> => {
  
  // Use smaller, efficient model
  const prompt = `Generate ${count} interview questions for ${role}.
Skills: ${skills.slice(0, 5).join(', ')}
Format: Q1. [category] [difficulty] question text
Categories: Tech, Behavioral, Problem-solving
Difficulties: Easy, Medium, Hard`;

  try {
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2', // Free, efficient model
      inputs: prompt,
      parameters: {
        max_new_tokens: 400, // ✅ Reduced tokens (was unlimited)
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      }
    });

    // Parse response
    const questions = parseQuestions(response.generated_text);
    return questions.slice(0, count);
    
  } catch (error) {
    console.error('HuggingFace error:', error);
    // Fallback to basic questions
    return generateBasicQuestions(role, skills, count);
  }
};

function parseQuestions(text: string): Array<{ question: string; category: string; difficulty: string }> {
  const lines = text.split('\n').filter(l => l.trim());
  const questions = [];
  
  for (const line of lines) {
    // Parse: "Q1. [Technical] [Medium] What is React?"
    const match = line.match(/\[([^\]]+)\]\s*\[([^\]]+)\]\s*(.+)/);
    if (match) {
      questions.push({
        category: match[1].trim(),
        difficulty: match[2].trim(),
        question: match[3].trim()
      });
    }
  }
  
  return questions.length > 0 ? questions : generateBasicQuestions('', [], 5);
}

// ============================================================================
// REAL-TIME QUESTION GENERATION (During Interview)
// ============================================================================

export const generateFollowUpQuestion = async (
  previousQuestion: string,
  userAnswer: string,
  skills: string[]
): Promise<{ question: string; category: string }> => {
  
  // Very short prompt to minimize tokens
  const prompt = `Previous Q: ${previousQuestion.slice(0, 50)}
User said: ${userAnswer.slice(0, 100)}
Skills: ${skills.slice(0, 3).join(', ')}
Generate 1 follow-up question (max 20 words):`;

  try {
    const response = await hf.textGeneration({
      model: 'google/flan-t5-base', // Smaller model for speed
      inputs: prompt,
      parameters: {
        max_new_tokens: 50, // ✅ Very small for follow-ups
        temperature: 0.8,
      }
    });

    return {
      question: response.generated_text.trim(),
      category: 'Follow-up'
    };
  } catch (error) {
    return {
      question: `Can you elaborate more on ${skills[0]}?`,
      category: 'Follow-up'
    };
  }
};

// ============================================================================
// OPTIMIZED ANSWER ANALYSIS (Low Token Usage)
// ============================================================================

export const analyzeAnswer = async (
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> => {
  
  // Minimal prompt
  const prompt = `Q: ${question.slice(0, 50)}
A: ${answer.slice(0, 150)}
Rate 0-100 and give 1 sentence feedback:`;

  try {
    const response = await hf.textGeneration({
      model: 'google/flan-t5-small', // Smallest model for analysis
      inputs: prompt,
      parameters: {
        max_new_tokens: 30, // ✅ Minimal tokens
      }
    });

    // Parse score from response
    const scoreMatch = response.generated_text.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0]) : 70;
    
    return {
      score: Math.min(100, Math.max(0, score)),
      feedback: response.generated_text
    };
  } catch (error) {
    return {
      score: 75,
      feedback: 'Good answer. Could provide more examples.'
    };
  }
};

// ============================================================================
// FALLBACK BASIC QUESTIONS (FREE, NO API)
// ============================================================================

function generateBasicQuestions(
  role: string, 
  skills: string[], 
  count: number
): Array<{ question: string; category: string; difficulty: string }> {
  
  const questions = [
    { question: `Tell me about your experience with ${skills[0] || 'this role'}?`, category: 'Experience', difficulty: 'Easy' },
    { question: 'Describe a challenging project you worked on.', category: 'Behavioral', difficulty: 'Medium' },
    { question: 'How do you handle tight deadlines?', category: 'Behavioral', difficulty: 'Easy' },
    { question: `What's your approach to learning ${skills[1] || 'new technologies'}?`, category: 'Technical', difficulty: 'Medium' },
    { question: 'Where do you see yourself in 3 years?', category: 'Career', difficulty: 'Easy' },
  ];
  
  return questions.slice(0, count);
}