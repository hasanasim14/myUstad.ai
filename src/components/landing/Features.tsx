import {
  BookOpenCheck,
  BotMessageSquare,
  Languages,
  NotebookPen,
} from "lucide-react";

const features = [
  {
    name: "Learn by Asking, Not Just Reading",
    description:
      "Instantly interact with your course material and get clear, concise answers to your questions.",
    icon: BookOpenCheck,
  },
  {
    name: "Smart Study Material",
    description:
      "Automatically create study guides, briefs, FAQs, and mind maps tailored to your course content.",
    icon: NotebookPen,
  },
  {
    name: "Learning That Speaks Your Language",
    description:
      "Listen to podcasts in English, Urdu, Punjabi, Sindhi, and Pashto for flexible, on-the-go learning.",
    icon: Languages,
  },
  {
    name: "Talk. Ask. Learn",
    description:
      "Use the conversational AI Agent to ask course-related queries and get instant, human-like responses anytime.",
    icon: BotMessageSquare,
  },
];

export default function Features() {
  return (
    <section className="space-y-4 py-4 md:py-4">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl pb-10 text-gray-900">
          Your Learning Reinvented
        </h2>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative overflow-hidden rounded-lg border  border-gray-300 p-8 bg-transparent"
          >
            <div className="flex items-center text-black gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
