import {
  BadgePoundSterling,
  Beaker,
  BookOpen,
  ClipboardCheck,
  Factory,
  FileText,
  Scale,
  Search,
  ShieldCheck,
  Target,
  TriangleAlert,
  UserSearch,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const guideIcons: Record<string, LucideIcon> = {
  "DSEAR overview": BookOpen,
  "Decision guide": Target,
  "Cost guide": BadgePoundSterling,
  "Supplier selection": UserSearch,
  "Supplier guide": UserSearch,
  "LEV overview": Workflow,
  "PSSR overview": Workflow,
  "LOLER overview": Workflow,
  "Sector guide": Factory,
  "Process guide": Workflow,
  "Hazard guide": TriangleAlert,
  "Comparison guide": Scale,
};

export function GuideIcon({ kind, size = "small" }: { kind: string; size?: "small" | "large" }) {
  const Icon = guideIcons[kind] ?? BookOpen;
  return (
    <span className={`guide-icon ${size}`} aria-hidden="true">
      <Icon strokeWidth={1.8} />
    </span>
  );
}

export function DecisionMap({ firstTitle = "Substances and processes", firstDetail = "What is present, produced or released?", signalDetail = "Which facts make DSEAR worth examining?" }: { firstTitle?: string; firstDetail?: string; signalDetail?: string } = {}) {
  const steps: Array<{ title: string; detail: string; icon: LucideIcon }> = [
    { title: firstTitle, detail: firstDetail, icon: Beaker },
    { title: "Relevance signal", detail: signalDetail, icon: Search },
    { title: "Scope and planning cost", detail: "What might competent work involve?", icon: FileText },
    { title: "Suitable specialists", detail: "Who has evidence that fits the project?", icon: ShieldCheck },
  ];
  return (
    <aside className="decision-map" aria-label="How Vendor Atlas turns site information into a buying brief">
      <div className="decision-map-head">
        <span className="eyebrow">Your route through the decision</span>
        <strong>One brief, four useful outputs</strong>
      </div>
      <ol className="decision-route">
        {steps.map(({ title, detail, icon: Icon }, index) => (
          <li key={title}>
            <span className="route-icon" aria-hidden="true">
              <Icon strokeWidth={1.8} />
            </span>
            <span>
              <small>0{index + 1}</small>
              <strong>{title}</strong>
              <span>{detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <p><ClipboardCheck aria-hidden="true" /> Explainable rules, cited evidence and no paid ranking.</p>
    </aside>
  );
}

export function StageIcon({ stage }: { stage: "check" | "scope" | "compare" }) {
  const icons = { check: Search, scope: FileText, compare: ShieldCheck };
  const Icon = icons[stage];
  return (
    <span className="stage-icon" aria-hidden="true">
      <Icon strokeWidth={1.8} />
    </span>
  );
}

export function DecisionMarker() {
  return (
    <span className="decision-marker" aria-hidden="true">
      <Target strokeWidth={1.8} />
    </span>
  );
}
