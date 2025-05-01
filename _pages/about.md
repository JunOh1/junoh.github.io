---
permalink: /
title: "Hello!"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<!-- CSS to create the white box overlay -->
<style>
  /* Ensure the ClustrMaps iframe is visible */
  iframe[src*="clustrmaps"],
  div[id*="clustr"],
  div[class*="clustr"],
  #clustrmaps {
    display: block !important;
    width: 100% !important;
    height: auto !important;
  }

  /* White box overlay to block clicks */
  #clustrmaps-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white; /* Solid white color */
    z-index: 9999; /* Ensure it is on top */
  }

  /* Make sure the parent div of the iframe has relative positioning */
  .clustrmaps-container {
    position: relative;
    display: inline-block;
  }
</style>

<!-- Main content of your page -->

My name is Jun Oh and I am an assistant professor at Purdue University. I hold a Ph.D in Accounting from Cornell University and a CPA license in Korea (KICPA).

My research focuses on the use of firms’ public disclosures, including disclosures in financial statements and voluntary communications, by various stakeholders. 
I am interested in how firms strategically disclose (non-financial) information and the consequences such disclosures have on stakeholders such as competitors and regulators. 

My research is largely motivated by industrial organization topics, including contracting, product markets, innovation, and M&A. 


<!-- ClustrMaps script for tracking visitors (unchanged) -->
<script type="text/javascript" id="clustrmaps" src="//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=70&t=n&d=RMSvqEXZDNxGKMwY9IRg8QIkEpAIvhA8kEF4EKjMN7M&co=ffffff&ct=ffffff&cmo=ffffff&cmn=ffffff"></script>

<!-- Create a div container around ClustrMaps -->
<div class="clustrmaps-container">
  <!-- Invisible overlay that blocks interaction but keeps the map visible -->
  <script>
    window.addEventListener('load', function () {
      // Find the iframe containing the ClustrMaps map
      const clustrmapsIframe = document.querySelector('iframe[src*="clustrmaps"]');
      
      // If ClustrMaps iframe is found, add the overlay
      if (clustrmapsIframe) {
        const overlay = document.createElement('div');
        overlay.id = 'clustrmaps-overlay'; // Set the overlay ID
        clustrmapsIframe.parentElement.style.position = 'relative'; // Ensure the parent is positioned
        clustrmapsIframe.parentElement.style.zIndex = '9999'; // Set z-index for layering
        clustrmapsIframe.parentElement.appendChild(overlay); // Add overlay on top of the iframe
      }
    });
  </script>
</div>
