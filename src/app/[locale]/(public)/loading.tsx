import { StateScreen } from "@/shared/components/StateScreen";

export default function PublicLoading() {
  return (
    <StateScreen
      state="loading"
      variant="gradient-glow"
      title="Loading visual workspaces..."
      description="Preparing components, styles, and data streams for optimal performance."
    />
  );
}