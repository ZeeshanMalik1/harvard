import React from 'react'
import "../Styles/privacy.css"
function Privacy() {
  return (
    <div className="privacyMain">
         <div class="wrap">
    <header>
      <div class="brand">
        <h1>The Harvard School</h1>
        <p>The Harvard School — Privacy Policy</p>
      </div>
      <div>
        <div class="meta">Last updated: <strong id="lastUpdated">2025-09-30</strong></div>
        <div class="meta small">Effective: <span id="effectiveDate">2025-09-30</span></div>
      </div>
    </header>

    <div class="card">
      <p class="small">This Privacy Policy describes how <strong>The Harvard School</strong> ("we", "us", or "our") collects, uses, and shares information when you use the <strong>The Harvard School</strong> mobile application and related services (the "Service"). Please read carefully.</p>

      <div class="toc">
        <a href="#what-we-collect">What we collect</a>
        <a href="#how-we-use">How we use information</a>
        <a href="#data-sharing">Data sharing</a>
        <a href="#security">Security</a>
        <a href="#rights">Your rights</a>
        <a href="#children">Children's privacy</a>
        <a href="#contact">Contact</a>
      </div>

      <hr/>

      <section id="what-we-collect" class="section">
        <h2>1. What we collect</h2>
        <p>We collect two types of information from users of the Service:</p>
        <ul>
          <li><strong>Personal information:</strong> name, email address, phone number, student ID, class/grade, parent/guardian contact information — only when provided by the school or voluntarily by users.</li>
          <li><strong>Non-personal information:</strong> device model, operating system, app version, anonymized usage statistics, crash logs and performance data collected automatically to help improve the app.</li>
        </ul>
      </section>

      <section id="how-we-use" class="section">
        <h2>2. How we use information</h2>
        <ul>
          <li>To provide the Service and personalize user experience.</li>
          <li>To communicate important announcements, schedules, grades, or emergency notices to students and parents.</li>
          <li>To troubleshoot issues, monitor and improve performance, and secure the Service.</li>
          <li>To comply with legal obligations and school policies.</li>
        </ul>
      </section>

      <section id="data-sharing" class="section">
        <h2>3. Data sharing & disclosure</h2>
        <p>We do not sell your personal information. We may share data with the following parties when necessary:</p>
        <ul>
          <li><strong>Authorized school staff:</strong> teachers, administrators — for legitimate educational purposes.</li>
          <li><strong>Service providers:</strong> hosting providers, analytics providers, push notification services who process data on our behalf.</li>
          <li><strong>Legal requests:</strong> if required by law or to protect rights and safety.</li>
        </ul>
      </section>

      <section id="security" class="section">
        <h2>4. Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards to protect personal information. However, no system is 100% secure — if a breach occurs we will notify affected parties as required by law.</p>
      </section>

      <section id="rights" class="section">
        <h2>5. Your rights</h2>
        <p>Depending on your location and role (student, parent, teacher), you may have rights to access, correct, or delete personal data. To make a request, contact us at the address below. We may need to verify your identity before fulfilling requests.</p>
      </section>

      <section id="children" class="section">
        <h2>6. Children’s privacy</h2>
        <p>Our Service is directed to students and may collect information about minors. We adhere to applicable child privacy laws. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected data without consent, contact us and we will take steps to remove the information.</p>
      </section>

      <section id="data-retention" class="section">
        <h2>7. Data retention</h2>
        <p>We retain personal information only as long as necessary for the purposes described in this policy or as required by law. When data is no longer needed it will be securely deleted or anonymized.</p>
      </section>

      <section id="third-party" class="section">
        <h2>8. Third-party services & analytics</h2>
        <p>We may use third-party services for analytics, crash reporting, or push notifications (for example: Google Analytics for Firebase, Sentry, or OneSignal). These providers collect technical data as described in their own policies. We recommend reviewing their privacy documents if you want more detail.</p>
      </section>

      <section id="changes" class="section">
        <h2>9. Changes to this policy</h2>
        <p>We may update this policy from time to time. When we make material changes we will update the "Last updated" date and, where required, notify users through the app or email.</p>
      </section>

      <section id="contact" class="section">
        <h2>10. Contact & requests</h2>
        <div class="contact">
          <p>If you have questions, want to access or correct your data, or need to request deletion, contact:</p>
          <p><strong>Email:</strong> <a href="mailto:theharvardschool@yahoo.com">theharvardschool@yahoo.com</a></p>
          <p><strong>Address:</strong> The Harvard School, 3P32+4PH, Faisalabad Rd، near Government Commerce College, Sargodha, Pakistan</p>
        </div>
      </section>

      <div class="actions">
        <a class="button primary" href="#contact">Contact Us</a>
        <a class="button ghost" href="#what-we-collect">View Sections</a>
      </div>

      <footer>
        <p class="small">This policy is tailored for The Harvard School in Pakistan. It should still be reviewed and adapted to ensure compliance with any applicable local laws and regulations (such as Pakistan’s data protection rules, COPPA for children, or GDPR if serving users in the EU). For high-stakes compliance (legal, regulatory, or children’s data) consult legal counsel.</p>
      </footer>
    </div>
  </div>
    </div>
  )
}

export default Privacy