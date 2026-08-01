export type ContentModelVariant =
  | "blog"
  | "service"
  | "project"
  | "caseStudy"
  | "industry"
  | "event"
  | "specialization"
  | "about"
  | "achievement"
  | "client"
  | "team"
  | "career"
  | "gallery";

export type RichContentDocument = {
  version: 1;
  editor: "blocknote";
  blocks: unknown[];
};

export type ContentEditorProps = {
  value: RichContentDocument | null | undefined;
  onChange: (value: RichContentDocument) => void;
  variant: ContentModelVariant;
  disabled?: boolean;
  placeholder?: string;
  onDirtyChange?: (isDirty: boolean) => void;
};

export type ContentRendererProps = {
  content: unknown;
  variant: ContentModelVariant;
  className?: string;
  legacyContent?: string | null;
};
