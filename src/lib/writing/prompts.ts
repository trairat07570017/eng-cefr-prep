import { WritingPrompt } from "@/types/writing";

export const EDUSYNCH_WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "prompt-ai-teachers",
    category: "education",
    title: "Artificial Intelligence vs Human Teachers",
    promptText:
      "Some people believe that artificial intelligence and educational software will eventually replace human teachers in schools. To what extent do you agree or disagree? Give specific reasons and examples from your educational experience to support your position.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
  {
    id: "prompt-homework-debate",
    category: "education",
    title: "The Role of Homework in Student Development",
    promptText:
      "Many educators and parents advocate for abolishing traditional homework in primary and secondary schools, arguing that it causes undue stress. Others believe homework instills discipline and reinforces learning. Discuss your viewpoint with concrete arguments and examples.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
  {
    id: "prompt-smartphones-classroom",
    category: "technology",
    title: "Smartphones in the Educational Environment",
    promptText:
      "Smartphones have become ubiquitous in daily life. Some schools have implemented strict bans on mobile devices in classrooms, while others integrate them as learning tools. Discuss the advantages and drawbacks, and state whether smartphones should be permitted in classrooms.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
  {
    id: "prompt-online-learning",
    category: "technology",
    title: "Effectiveness of Distance and Online Learning",
    promptText:
      "Distance learning and virtual classrooms have expanded rapidly. Do the benefits of online education, such as flexibility and accessibility, outweigh its potential disadvantages, such as lack of social interaction? Support your opinion with clear justifications.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
  {
    id: "prompt-early-language-education",
    category: "society",
    title: "Compulsory Foreign Language Education",
    promptText:
      "Some educational authorities argue that foreign language instruction should be mandatory for all children from an early age, while others think young students should focus on basic core subjects first. State your opinion with supporting reasons.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
  {
    id: "prompt-environmental-curriculum",
    category: "environment",
    title: "Environmental Education in Modern Schools",
    promptText:
      "Global climate change and environmental degradation are critical contemporary issues. Should schools include mandatory practical environmental conservation in their standard curriculum? Present your perspective with relevant examples.",
    recommendedTimeMinutes: 20,
    minWords: 150,
  },
];

export function getRandomWritingPrompt(excludeId?: string): WritingPrompt {
  const candidates = excludeId
    ? EDUSYNCH_WRITING_PROMPTS.filter((p) => p.id !== excludeId)
    : EDUSYNCH_WRITING_PROMPTS;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
