---
permalink: /
title: "Hello!"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<style>
  iframe[src*="clustrmaps"],
  div[id*="clustr"],
  div[class*="clustr"],
  #clustrmaps {
    pointer-events: none !important;
    opacity: 0 !important;
    display: block !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
  }
</style>


My name is Jun Oh and I am an assistant professor at Purdue University. I hold a Ph.D in Accounting from Cornell University and a CPA license in Korea (KICPA).

My research focuses on the use of firms’ public disclosures, including disclosures in financial statements and voluntary communications, by various stakeholders. 
I am interested in how firms strategically disclose (non-financial) information and the consequences such disclosures have on stakeholders such as competitors and regulators. 

My research is largely motivated by industrial organization topics, including contracting, product markets, innovation, and M&A.

<script type="text/javascript" id="clustrmaps" src="//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=70&t=n&d=RMSvqEXZDNxGKMwY9IRg8QIkEpAIvhA8kEF4EKjMN7M&co=ffffff&ct=ffffff&cmo=ffffff&cmn=ffffff"></script>

<script>
  const observer = new MutationObserver(() => {
    const badNodes = document.querySelectorAll('[src*="clustrmaps"], [href*="clustrmaps"], iframe[src*="clustrmaps"], div[id*="clustr"], div[class*="clustr"]');
    badNodes.forEach(node => {
      node.style.pointerEvents = 'none';  // Disable interaction
      node.style.opacity = '1';           // Keep it visible
      node.style.width = '100%';          // Ensure it's properly displayed
      node.style.height = 'auto';         // Allow it to resize properly
      node.style.overflow = 'visible';    // Let it flow normally
    });
  });

  // Start observing the body for any added ClustrMaps content
  observer.observe(document.body, { childList: true, subtree: true });
</script>