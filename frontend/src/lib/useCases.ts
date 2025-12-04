import { type SupportedLanguage } from "../components/providers/LanguageProvider";
import {
  useCases,
  type LocalizedString,
  type UseCaseDefinition,
} from "../config/useCases";

export type LocalizedUseCase = {
  slug: string;
  icon: string;
  label: string;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryBenefit: string;
  challenges: string[];
  outcomes: string[];
  metrics: Array<{ label: string; value: string; helper?: string }>;
  handledByOnDuty: Array<{ title: string; description: string }>;
  exampleConversation: Array<{ from: "user" | "agent"; text: string }>;
  workflowSteps: Array<{ title: string; description: string }>;
  kpis: string[];
  channels: string[];
};

const translate = (text: LocalizedString, language: SupportedLanguage) => text[language];

const localizeMetrics = (definition: UseCaseDefinition, language: SupportedLanguage) =>
  definition.metrics.map((metric) => ({
    label: translate(metric.label, language),
    value: metric.value,
    helper: metric.helper ? translate(metric.helper, language) : undefined,
  }));

export function getUseCaseList(language: SupportedLanguage) {
  return useCases.map((useCase) => ({
    slug: useCase.slug,
    icon: useCase.icon,
    label: translate(useCase.label, language),
    badge: translate(useCase.badge, language),
    primaryBenefit: translate(useCase.primaryBenefit, language),
    heroSubtitle: translate(useCase.heroSubtitle, language),
  }));
}

export function getUseCaseDetail(slug: string, language: SupportedLanguage): LocalizedUseCase | null {
  const definition = useCases.find((uc) => uc.slug === slug);
  if (!definition) return null;

  return {
    slug: definition.slug,
    icon: definition.icon,
    label: translate(definition.label, language),
    badge: translate(definition.badge, language),
    heroTitle: translate(definition.heroTitle, language),
    heroSubtitle: translate(definition.heroSubtitle, language),
    primaryBenefit: translate(definition.primaryBenefit, language),
    challenges: definition.challenges.map((item) => translate(item, language)),
    outcomes: definition.outcomes.map((item) => translate(item, language)),
    metrics: localizeMetrics(definition, language),
    handledByOnDuty: definition.handledByOnDuty.map((item) => ({
      title: translate(item.title, language),
      description: translate(item.description, language),
    })),
    exampleConversation: definition.exampleConversation.map((message) => ({
      from: message.from,
      text: translate(message.text, language),
    })),
    workflowSteps: definition.workflowSteps.map((step) => ({
      title: translate(step.title, language),
      description: translate(step.description, language),
    })),
    kpis: definition.kpis.map((kpi) => translate(kpi, language)),
    channels: definition.channels.map((channel) => translate(channel, language)),
  };
}

export function getUseCaseSlugs() {
  return useCases.map((useCase) => useCase.slug);
}
