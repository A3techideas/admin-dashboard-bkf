// Utility to force dropdown theme colors
export const applyDropdownTheme = () => {
  // Force apply theme colors to all select elements
  const selects = document.querySelectorAll('select');
  
  selects.forEach(select => {
    // Add custom class for additional styling
    select.classList.add('theme-dropdown');
    
    // Force override any remaining browser defaults
    select.style.setProperty('color', '#102A43', 'important');
    select.style.setProperty('background-color', 'white', 'important');
    
    // Add event listeners to force styling on interaction
    select.addEventListener('focus', (e) => {
      e.target.style.setProperty('border-color', '#102A43', 'important');
      e.target.style.setProperty('box-shadow', '0 0 0 3px rgba(16, 42, 67, 0.1)', 'important');
    });
    
    select.addEventListener('blur', (e) => {
      e.target.style.setProperty('border-color', '#d1d5db', 'important');
      e.target.style.setProperty('box-shadow', 'none', 'important');
    });
  });
  
  // Apply to options as well
  const options = document.querySelectorAll('select option');
  options.forEach(option => {
    option.style.setProperty('background-color', 'white', 'important');
    option.style.setProperty('color', '#102A43', 'important');
  });
};

// Auto-apply on DOM content loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', applyDropdownTheme);
  
  // Re-apply when new content is added (for dynamic content)
  const observer = new MutationObserver(() => {
    applyDropdownTheme();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
