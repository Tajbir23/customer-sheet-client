
const page = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dropbox API Usage Policy</h1>
        
        <section className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Storage & Security</h2>
          <p className="mb-4">
            We use Dropbox API to securely store and manage files uploaded through our service. All data is encrypted during transfer and at rest using industry-standard protocols.
          </p>
          <p className="mb-4">
            Files are stored in a dedicated Dropbox Business account with restricted access and regular security audits.
          </p>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Usage</h2>
          <p className="mb-4">
            Files uploaded via our service are used solely for the purpose of processing and analyzing customer data as specified in our service agreement.
          </p>
          <p className="mb-4">
            We do not share, sell, or distribute your files with any third parties. Access is strictly limited to authorized personnel.
          </p>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
          <p className="mb-4">
            Files are retained only for the duration necessary to provide our services. Upon request or account termination, all associated files will be permanently deleted from our Dropbox storage.
          </p>
          <p>
            For any questions about our Dropbox API usage or data handling practices, please contact our support team.
          </p>
        </section>
      </div>
    </div>
  )
}

export default page