import "../public/styles/globals.css";

import type { Preview } from "@storybook/react";

//import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

const preview: Preview = {
  parameters: {
    // nextRouter: {
    //   Provider: RouterContext.Provider,
    // },
    // nextjs: {
    //   appDirectory: true,
    // },

    options: {
      storySort: {
        order: ["Pages", "Templates", "Widgets", "Elements"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
