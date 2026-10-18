export type MascotMood = 'hi' | 'joy' | 'wow' | 'love' | 'shh' | 'sad' | 'silly';

export type StageId = 'intro' | 'q0' | 'q1' | 'q2' | 'voice' | 'reveal' | 'party' | 'riddle' | 'letter' | 'plan' | 'sent';

export interface QuizOption {
  text: string;
  reaction: string;
  mood: MascotMood;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface DatePlan {
  day: string;
  time: string;
  activities: string[];
  note: string;
}

export interface AppConfig {
  recipientName: string;
  senderName: string;
  giftTag: string;
  letterGreeting: string;
  letterParagraphs: string[];
  letterSignoff: string;
  riddleAnswer: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
}
