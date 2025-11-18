import React from 'react'

const FacebookTermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Facebook Terms and Conditions</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using our Facebook page and services, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Services</h2>
          <p>
            Our services are provided through automated systems including n8n agents for content posting and management. 
            You agree to use our services only for lawful purposes and in accordance with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Content and Posting</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All content posted through our automated systems is subject to Facebook's Community Standards</li>
            <li>We reserve the right to moderate, edit, or remove content at our discretion</li>
            <li>Users are responsible for ensuring their content complies with applicable laws and regulations</li>
            <li>Automated posting is conducted through approved n8n workflows and API integrations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy and Data Protection</h2>
          <p>
            We are committed to protecting your privacy. Any personal information collected through our Facebook 
            interactions is handled in accordance with our Privacy Policy and applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Automated Systems</h2>
          <p>
            Our services utilize n8n automation workflows for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Scheduled content posting</li>
            <li>Response management</li>
            <li>Analytics and reporting</li>
            <li>User engagement tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Post spam, misleading, or harmful content</li>
            <li>Violate Facebook's Terms of Service or Community Guidelines</li>
            <li>Attempt to circumvent our automated systems</li>
            <li>Engage in any activity that could harm our reputation or services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
          <p>
            We shall not be liable for any direct, indirect, incidental, or consequential damages arising from 
            the use of our services or automated posting systems. Our liability is limited to the maximum extent 
            permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Service Availability</h2>
          <p>
            While we strive to maintain continuous service, automated systems may experience downtime for 
            maintenance, updates, or technical issues. We do not guarantee uninterrupted service availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
            posting. Continued use of our services constitutes acceptance of modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us through our 
            official Facebook page or designated support channels.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable local laws. 
            Any disputes shall be resolved through appropriate legal channels.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          By using our Facebook services and automated posting systems, you acknowledge that you have read, 
          understood, and agree to be bound by these Terms and Conditions.
        </p>
      </div>
    </div>
  )
}

export default FacebookTermsConditions