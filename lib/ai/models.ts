export type GroqModel = {
  id: string;
  label: string;
  description: string;
  tag: string;
  priority: number;
};

export const GROQ_MODELS: GroqModel[] = [
  {
    id: 'openai/gpt-oss-120b',
    label: 'GPT OSS 120B',
    description: 'Deep reasoning & highest accuracy',
    tag: 'Flagship',
    priority: 1,
  },
  {
    id: 'openai/gpt-oss-20b',
    label: 'GPT OSS 20B',
    description: 'Instant response & low latency',
    tag: 'Fast',
    priority: 2,
  },
  {
    id: 'qwen/qwen3.8-27b',
    label: 'Qwen 3.8 27B',
    description: 'Git code & commands expert',
    tag: 'Coding',
    priority: 3,
  },
  {
    id: 'qwen/qwen3.6-27b',
    label: 'Qwen 3.6 27B',
    description: 'Fast, balanced architecture',
    tag: 'Balanced',
    priority: 4,
  },
  {
    id: 'groq/compound',
    label: 'Groq Compound',
    description: 'Multi-step reasoning engine',
    tag: 'Reasoning',
    priority: 5,
  },
  {
    id: 'groq/compound-mini',
    label: 'Compound Mini',
    description: 'Lightweight fast router',
    tag: 'Turbo',
    priority: 6,
  },
  {
    id: 'allam-2-7b',
    label: 'Allam 2 7B',
    description: 'Compact 7B lightweight assistant',
    tag: 'Light',
    priority: 7,
  },
];

export function getModelLabel(modelId: string) {
  if (modelId === 'auto') return 'Auto (Best Available)';
  return (
    GROQ_MODELS.find((model) => model.id === modelId)?.label ?? modelId
  );
}
