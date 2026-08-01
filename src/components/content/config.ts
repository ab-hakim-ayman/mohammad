import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import {
  CalloutBlock,
  VideoEmbedBlock,
  QuoteHighlightBlock,
  ProcessTimelineBlock,
  MetricGridBlock,
  ImageCaptionBlock,
  FeatureGridBlock,
  ComparisonTableBlock,
  TwoColumnBlock,
  InlineCtaBlock,
  CustomImageBlock,
  FaqBlock,
  TakeawaysBlock,
  CustomVideoBlock,
  CustomAudioBlock,
  CustomFileBlock,
} from "./blocks";

export const customBlockSpecs = {
  callout: CalloutBlock,
  videoEmbed: VideoEmbedBlock,
  quoteHighlight: QuoteHighlightBlock,
  processTimeline: ProcessTimelineBlock,
  metricGrid: MetricGridBlock,
  imageCaption: ImageCaptionBlock,
  featureGrid: FeatureGridBlock,
  comparisonTable: ComparisonTableBlock,
  twoColumn: TwoColumnBlock,
  cta: InlineCtaBlock,
  customImage: CustomImageBlock,
  faq: FaqBlock,
  takeaways: TakeawaysBlock,
  customVideo: CustomVideoBlock,
  customAudio: CustomAudioBlock,
  customFile: CustomFileBlock,
};

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...customBlockSpecs,
  },
});
