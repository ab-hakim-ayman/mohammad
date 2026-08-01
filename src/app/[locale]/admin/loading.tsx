import { memo } from "react";
import { StateScreen } from "@/shared/components/StateScreen";

function AdminLoadingComponent() {
  return (
    <StateScreen
      state="loading"
      variant="glassmorphic"
      title="Loading admin workspace..."
      description="Verifying operational credentials and fetching workspace data."
      className="min-h-[calc(100vh-140px)] w-full bg-transparent"
    />
  );
}

const AdminLoading = memo(AdminLoadingComponent);

export default AdminLoading;