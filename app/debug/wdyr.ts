import React from "react";

/// <reference types="@welldone-software/why-did-you-render" />
if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    });
  }
}
