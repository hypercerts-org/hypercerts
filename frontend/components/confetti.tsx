import JSConfetti from "js-confetti";
import React from "react";

export const ConfettiContext = React.createContext<JSConfetti | undefined>(
  undefined,
);

/**
 * Use this to retrieve the confetti object
 * See here to for options to `addConfetti`
 * https://www.npmjs.com/package/js-confetti
 */
export const useConfetti = () => React.useContext(ConfettiContext);

/**
 * This should be set only once at the app root (see the catchall page)
 */
export function ConfettiContainer({ children }: { children: React.ReactNode }) {
  const jsConfettiRef = React.useRef<JSConfetti>();

  React.useEffect(() => {
    jsConfettiRef.current = new JSConfetti();
  });

  return (
    <ConfettiContext.Provider value={jsConfettiRef.current}>
      {children}
    </ConfettiContext.Provider>
  );
}
