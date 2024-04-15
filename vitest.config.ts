import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
