/**
 * This function applies the theme effect based on the user's preference or the system preference.
 * It sets the appropriate CSS classes and meta tags to reflect the selected theme (dark or light).
 *
 * @returns The selected theme ("dark" or "light").
 */
export const themeEffect = function () {
  // Retrieve the theme preference from localStorage
  // `null` preference implies system (auto)
  const pref = localStorage.getItem("theme");
  // Apply the system theme if the preference is null
  if (null === pref) {
    document.documentElement.classList.add("theme-system");
  } else {
    document.documentElement.classList.remove("theme-system");
  }
  // Check if the preference is "dark" or if the system preference is dark
  if (
    pref === "dark" ||
    (!pref && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    // Apply the "dark" theme classes and meta tags
    document.documentElement.classList.add("pause-transitions");
    document.documentElement.classList.add("dark");
    document.head
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", "#1c1c1c");
    // Remove the transition pause class after the changes have taken effect
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("pause-transitions");
    });
    return "dark";
  } else {
    // Apply the "light" theme classes and meta tags
    document.documentElement.classList.add("pause-transitions");
    document.documentElement.classList.remove("dark");
    document.head
      .querySelector("meta[name=theme-color]")
      ?.setAttribute("content", "#fcfcfc");
    // Remove the transition pause class after the changes have taken effect
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("pause-transitions");
    });
    return "light";
  }
};

// This function applies the theme effect based on the user's preference or the system preference. Here's a breakdown of what it does:

// Retrieves the theme preference from the localStorage.

// Applies the system theme if the preference is null by adding the "theme-system" CSS class to the document's root element.

// Checks if the preference is "dark" or if the system preference is dark using window.matchMedia("(prefers-color-scheme: dark)").matches.

// If the theme is "dark" or the system preference is dark:
// Adds the necessary CSS classes and meta tags for the "dark" theme.
// Sets the content attribute of the meta[name=theme-color] tag to "#1c1c1c" (dark color).
// Adds the "pause-transitions" CSS class to the document's root element to pause CSS transitions.
// Removes the "pause-transitions" class after the changes have taken effect.
// Returns "dark" as the selected theme.

// If the theme is not "dark" and the system preference is not dark:
// Adds the necessary CSS classes and meta tags for the "light" theme.
// Sets the content attribute of the meta[name=theme-color] tag to "#fcfcfc" (light color).
// Adds the "pause-transitions" CSS class to the document's root element to pause CSS transitions.
// Removes the "pause-transitions" class after the changes have taken effect.
// Returns "light" as the selected theme.
