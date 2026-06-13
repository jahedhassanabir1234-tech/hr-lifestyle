import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 font-poppins">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiMapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium font-poppins">Address</p>
                  <p className="text-sm text-gray-500 font-poppins">Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiPhone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium font-poppins">Phone</p>
                  <p className="text-sm text-gray-500 font-poppins">+880 1XXXXXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiMail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium font-poppins">Email</p>
                  <p className="text-sm text-gray-500 font-poppins">info@hrlifestyle.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 font-poppins">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-poppins">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field font-poppins"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-poppins">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field font-poppins"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-poppins">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field font-poppins"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-poppins">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  className="input-field font-poppins"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 font-poppins"
              >
                <FiSend className="h-4 w-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
