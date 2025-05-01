---
permalink: /
title: "Hello!"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<!-- CSS to handle ClustrMaps iframe visibility and the white overlay -->
<style>
  /* Ensure ClustrMaps iframe is styled correctly */
  iframe[src*="clustrmaps"] {
    position: relative; /* Make the iframe a positioned element */
    display: block;
    width: 100%;
    height: auto;
    z-index: 1; /* Position the iframe below the overlay */
  }

  /* Overlay to block interaction */
  #clustrmaps-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white; /* Solid white to block interaction */
    z-index: 2; /* Ensure overlay sits on top of the iframe */
  }

  /* Ensure the parent container is positioned */
  .clustrmaps-container {
    position: relative;
    display: inline-block;
    width: 100%;  /* Adjust according to your desired size */
    height: auto;
  }
</style>

<!-- Main content of your page -->

My name is Jun Oh and I am an assistant professor at Purdue University. I hold a Ph.D in Accounting from Cornell University and a CPA license in Korea (KICPA).

My research focuses on the use of firms’ public disclosures, including disclosures in financial statements and voluntary communications, by various stakeholders. 
I am interested in how firms strategically disclose (non-financial) information and the consequences such disclosures have on stakeholders such as competitors and regulators. 

My research is largely motivated by industrial organization topics, including contracting, product markets, innovation, and M&A. 

<!-- Container for ClustrMaps iframe -->
<div class="clustrmaps-container">
  <!-- White overlay box to block interaction -->
  <div id="clustrmaps-overlay"></div>

  <!-- ClustrMaps iframe that gets tracked -->
  <script type="text/javascript" id="clustrmaps" src="//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=70&t=n&d=RMSvqEXZDNxGKMwY9IRg8QIkEpAIvhA8kEF4EKjMN7M&co=ffffff&ct=ffffff&cmo=ffffff&cmn=ffffff"></script>
</div>

<script>
  // This script adds the white overlay to block interaction with the iframe
  window.addEventListener('load', function () {
    const overlay = document.getElementById('clustrmaps-overlay');
    const iframe = document.querySelector('iframe[src*="clustrmaps"]');
    
    // If ClustrMaps iframe exists, add the overlay on top
    if (iframe && overlay) {
      iframe.parentElement.style.position = 'relative'; // Ensure container is positioned
      overlay.style.position = 'absolute';  // Make overlay sit on top of iframe
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
    }
  });
</script>