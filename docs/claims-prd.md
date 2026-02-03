# **Claims Reskin V1 – Updated PRD & Project Status**

## **1\. Executive Summary**

The Claims Reskin V1 effort is a **visual modernization and platform migration** within the broader CX Reskin initiative, not a functional redesign. The primary goal is to deliver an **MVP (lift-and-shift)** of the existing Consumer (CDH) **Claims** experience onto a **React-based front end** using **Shadcn components with WEX styling**, while preserving all existing workflows, backend logic, admin configurations, and partner customizations.

In parallel, the team is exploring a **future-state (V2 / vision)** experience focused on improving automation and reducing customer friction. These vision concepts are intentionally separated from V1 unless a change is clearly small, low-risk, and fits within MVP guardrails.

---

## **2\. Current Project Status (as of Jan 14, 2026\)**

### **Delivery Model**

The team is operating on **two parallel tracks**:

* **V1 / MVP Track:** Lift-and-shift reskin with limited, targeted UX improvements  
* **V2 / Vision Track:** Exploratory concepts and workflows with no committed delivery date (targeting 2026\)

Final prioritization between these tracks has been **confirmed**. The team will first focus on delivering the MVP (V1) and aligning on it during working sessions and weekly syncs. This MVP is expected to **deploy at the start of Q2 2026**. Vision (V2) work will continue in parallel as capacity allows.

### **Development Ownership**

* **Primary UI developers:** Dimitri Rocha, Priyabrata Pradhan  
* **Extended team:** India Claims team (Vikrant team – 5 developers)  
  * 3 UI-focused  
  * 2 API-focused  
* \*\*Meeting representation: **Dimitri Rocha** will represent frontend development; **Meet Malhotra** will represent the India Claims team

---

## **3\. MVP Scope Definition (V1)**

### **In Scope**

* One-for-one replication of current Consumer Claims workflows  
* Reimbursement happy path (Claims AI enabled)  
* Claims homepage (MVP version aligned to current state)  
* Error paths and unhappy paths tied to existing logic  
* Visual updates using Shadcn \+ WEX styling

### **Allowed Targeted Improvements**

Small, low-risk changes are considered within MVP if they:

* Expose existing data previously hidden due to layout constraints  
* Improve clarity or education without changing logic  
* Do not require backend or admin portal changes

Examples include:

* Surfacing plan year, final filing, and final service dates  
* Reducing reliance on unclear tooltips  
* Clearer education around multi-document uploads disabling Claims AI  
* **Linking out to existing reimbursement preference pages** (e.g., HSA check vs direct deposit) as a V1 workaround, rather than rebuilding reimbursement logic  
* Calling out **claim denial text and repayment UX** as recommended improvements that require Operations or backend involvement (tracked as V2 / post-MVP items)

### **Out of Scope (V1)**

* Workflow reordering or simplification  
* New backend logic or Claims Engine changes  
* Multi-document AI support  
* QR-based mobile-to-desktop uploads  
* Auto-denials or claim splitting

---

## **4\. Immediate Design & Product Priorities**

### **Short-Term Focus (Now – Next Few Weeks)**

1. **Finalize MVP Happy Path (Reimbursement Focus)**  
   * Reimbursement (“Reimburse Myself”) confirmed as the **highest-impact Claims flow** and top priority  
   * Validate MVP behavior and constraints with stakeholders (Anne Jensen, Sanjana Surkund)  
   * Continue small, incremental V1 improvements (e.g., surfacing critical dates, clearer education)  
2. **Prepare for Experience Review (V1 \+ V2)**  
   * Develop an **experience review deck** focused first on the reimbursement flow  
   * Clearly present:  
     * V1 (MVP) experience  
     * V2 concepts (incomplete but directional)  
     * Technical and business constraints (Rules Engine, custom text, plan logic)  
   * Goal: get early feedback from leadership (e.g., Jennifer, Karen) **before development progresses too far**  
   * Target: **\~1 month** to prepare sufficient V2 concepts and constraints for review  
3. **Create MVP Claims Homepage**  
   * Align closely with current-state behavior  
   * Deprioritized relative to reimbursement flow  
   * Remove or isolate vision-only elements from MVP designs  
4. **Document Unhappy / Error Paths**  
   * Multi-document upload behavior and AI disablement  
   * AI opt-out scenarios  
   * Existing dead ends (e.g., Tech-Only partners)  
5. **Support MVP Jira Story Writing**  
   * Map MVP designs to epics and UI stories  
   * Ensure implementation clarity for Dimitri Rocha and Priyabrata Pradhan

### **Parallel (V2 / Vision – Secondary to MVP)**

* Continue capturing V2 / vision concepts to support the experience review  
* Maintain strict separation between MVP and vision in prototypes (e.g., mode switching)  
* Use V2 concepts to articulate **what would be possible with additional resources**

---

## **5\. Tooling & Handoff Approach**

### **Design & Prototyping**

* **Primary prototyping tool:** Cursor (code-backed, GitHub-based)  
* **Secondary design tool:** Figma  
* Cursor prototypes are expected to become a **source of truth** for development

### **Handoff Model**

* Transitioning from traditional "design handoff" to **"code handoff"**  
* Designers and developers reference the same GitHub-backed prototype where possible  
* Further guidance on handoff expectations to be finalized

---

## **6\. Timeline & Open Questions**

### **Confirmed Direction**

* **V1 / MVP (Claims Reskin)** is the primary focus and must be aligned and finalized first  
* MVP is expected to **deploy at the start of Q2 2026**  
* All Claims functionality must ultimately be rebuilt in the new components and APIs by **end of 2026**  
* Working sessions and weekly syncs will be used to lock MVP scope and designs

### **Experience Review Milestone**

* An experience review focused on **reimbursement** will be used to:  
  * Validate V1 direction  
  * Socialize V2 ideas  
  * Explicitly document constraints and tradeoffs  
* Target: **\~1 month** to prepare and present the experience review deck

### **Parallel Effort (Capacity-Dependent)**

* V2 / vision designs may continue in parallel  
* If vision work progresses well, it may be:  
  * Pulled into the next iteration after V1  
  * Accelerated by adding additional development resources

### **Still Open**

* Exact MVP design freeze date  
* Whether additional dev capacity will be added to accelerate V2  
* Scope and ownership for operational changes (e.g., claim denial text, repayment logic)

---

## **7\. Success Criteria (V1)**

* MVP shipped without workflow regressions  
* All admin configurations and partner customizations preserved  
* Claims AI happy path fully functional  
* Clearer user understanding of dates, balances, and AI behavior  
* Minimal design churn or rework during development

---

## **8\. Summary**

Claims Reskin V1 is a **time-sensitive MVP delivery** within the larger CX Reskin program. Its purpose is to modernize the Claims experience UI while preserving all existing behavior and integrations.

This document is intended to serve as a **single source of truth** for managers and stakeholders who want a clear snapshot of:

* Where the Claims work stands today  
* What is being delivered in V1 vs explored for V2  
* Who owns development and design decisions  
* What the immediate priorities and open questions are

Near-term success depends on confirming the MVP go-live timeline and focusing design and development effort on:

* Finalizing the Claims reimbursement happy path  
* Aligning the Claims homepage to current-state behavior  
* Documenting error and unhappy paths

Once MVP timing is confirmed, effort can be more decisively allocated between V1 execution and V2 visioning.
