(() => {
  "use strict";

  const form = document.getElementById("prime-finder");
  const limitInput = document.getElementById("prime-limit");
  const status = document.getElementById("prime-status");
  const results = document.getElementById("prime-results");
  const list = document.getElementById("prime-list");
  const download = document.getElementById("prime-download");
  let downloadUrl;

  function primesUpTo(limit) {
    const composite = new Uint8Array(limit + 1);
    for (let p = 2; p * p <= limit; p++) {
      if (composite[p]) continue;
      for (let n = p * p; n <= limit; n += p) composite[n] = 1;
    }
    const primes = [];
    for (let n = 2; n <= limit; n++) {
      if (!composite[n]) primes.push(n);
    }
    return primes;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = undefined;
    download.removeAttribute("href");

    const limit = limitInput.valueAsNumber;
    if (!Number.isInteger(limit) || limit < 2 || limit > 100000) {
      limitInput.setAttribute("aria-invalid", "true");
      results.hidden = true;
      status.textContent = "Enter a whole number between 2 and 100,000.";
      limitInput.focus();
      return;
    }

    limitInput.removeAttribute("aria-invalid");
    const primes = primesUpTo(limit);
    const output = primes.join(", ");
    list.value = output;
    downloadUrl = URL.createObjectURL(new Blob([output, "\n"], { type: "text/plain;charset=utf-8" }));
    download.href = downloadUrl;
    status.textContent = `${primes.length.toLocaleString("en-US")} prime ${primes.length === 1 ? "number" : "numbers"} up to ${limit.toLocaleString("en-US")}.`;
    results.hidden = false;
  });

  document.getElementById("prime-submit").disabled = false;
})();
