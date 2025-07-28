console.log("test console.log");

// Function with a common issue: using eval (security risk)
function runUserCode(userInput) {
    // This is intentionally insecure for Semgrep autofix testing
    eval(userInput);
}