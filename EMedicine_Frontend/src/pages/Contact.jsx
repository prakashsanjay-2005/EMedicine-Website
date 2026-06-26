function Contact() {
  return (
    <div className="container mt-4">

      <div
        className="p-5 text-center text-white rounded shadow mb-4"
        style={{
          background:
            "linear-gradient(135deg,#198754,#0dcaf0)"
        }}
      >
        <h1>🏥 Contact Us</h1>
        <p className="mb-0">
          We're here to help you with your medicine orders.
        </p>
      </div>

      <div className="card shadow border-0">
        <div className="card-body">

          <h3 className="mb-4">
            Medical Store Information
          </h3>

          <p>
            <strong>🏥 Medical Name</strong><br />
            Sanjay's Medicals
          </p>

          <p>
            <strong>📍 Address</strong><br />
            Kovilur,Min nagar<br />
            Dindigul,<br />
            624706
          </p>

          <p>
            <strong>📞 Phone</strong><br />
            +91 9566750139
          </p>

          <p>
            <strong>✉ Email</strong><br />
            prakashsanjay230@gmail.com
          </p>

          <p>
            <strong>🕒 Working Hours</strong><br />
            Monday - Saturday<br />
            9:00 AM - 9:00 PM
          </p>

          <hr />

          <div className="d-flex gap-3 flex-wrap">

            <a
              href="tel:+919566750139"
              className="btn btn-success"
            >
              📞 Call Now
            </a>

            <a
              href="mailto:prakashsanjay230@gmail.com"
              className="btn btn-primary"
            >
              ✉ Email Us
            </a>

            <a
              href="https://maps.google.com/?q=Kovilur+Min+nagar+Dindigul"
              target="_blank"
              rel="noreferrer"
              className="btn btn-danger"
            >
              📍 Open Location
            </a>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Contact;