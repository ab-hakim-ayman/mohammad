import { StateScreen } from "@/shared/components/StateScreen";

export default function LocaleLoading() {
  return (
    <StateScreen
      state="loading"
      variant="gradientGlow"
      title="Assembling structural modules..."
      description="Please wait while we set up your localized workspace and preferences."
      className="min-h-[80vh]"
    />
  );
}