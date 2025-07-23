import React, { Suspense } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";

const App: React.FC = () => {
  return (
    <HeroUIProvider className="!bg-content1">
      <Suspense fallback={<div>Loading...</div>}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <RouterProvider router={router} />
          <Toaster />
          {/* <ToasterNotification position="bottom-right" richColors /> */}
        </NextThemesProvider>
      </Suspense>
    </HeroUIProvider>
  );
};

export default App;
