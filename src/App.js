import React, { useState, useEffect } from 'react';
// Removed all Firebase imports and related global variables.

// Function to call Gemini API for text generation
const callGeminiTextAPI = async (prompt) => {
  try {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    // Your API key is placed directly here. Keep it secure!
    const apiKey = "AIzaSyDr8Zs5bbGFhGHHGq0o4MiUzX2KEnPb89g";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API response structure unexpected:", result);
      return "Failed to generate text. Please try again.";
    }
  } catch (error) {
    console.error("Error generating text:", error);
    return "Error generating text. Please check console.";
  }
};

// Function to call Imagen API for image generation
const callImagenAPI = async (prompt) => {
  try {
    const payload = { instances: { prompt: prompt }, parameters: { "sampleCount": 1 } };
    // Your API key is placed directly here. Keep it secure!
    const apiKey = "AIzaSyDr8Zs5bbGFhGHHGq0o4MiUzX2KEnPb89g";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
      return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    } else {
      console.error("Imagen API response structure unexpected:", result);
      return "https://placehold.co/1200x600/0A1931/FFD700?text=Image+Error"; // Fallback placeholder
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return "https://placehold.co/1200x600/0A1931/FFD700?text=Image+Error"; // Fallback placeholder
  }
};

// Home Page Component
const HomePage = () => {
  const [heroImage, setHeroImage] = useState("https://placehold.co/1200x600/0A1931/0A1931"); // Initial placeholder background
  const [loadingImage, setLoadingImage] = useState(false);

  // This function is still available if you wish to re-add a button to trigger image generation
  const generateHeroImage = async () => {
    setLoadingImage(true);
    const imageUrl = await callImagenAPI("Abstract digital background with glowing blue and purple lines, subtle geometric patterns, professional, high-tech, dark tones, similar to McKinsey's website backdrop.");
    setHeroImage(imageUrl);
    setLoadingImage(false);
  };

  return (
    <section id="home" className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 md:py-32 overflow-hidden rounded-b-lg shadow-lg">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional Consulting Background"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/0A1931/0A1931"; }}
        />
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg text-yellow-400">
          <span className="font-merriweather-bold text-white">Max</span>
          <span className="font-inter-light text-mckinsey-light-gray">&nbsp;Ventures</span>
        </h1>
        {/* If you want to put a button to generate images again, uncomment this:
        <button
            onClick={generateHeroImage}
            className="bg-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 flex items-center justify-center"
            disabled={loadingImage}
          >
            {loadingImage ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Generate Hero Image'
            )}
          </button>
          */}
      </div>
    </section>
  );
};

// About Page Component
const AboutPage = () => {
  const [aboutText, setAboutText] = useState("Max Ventures empowers businesses through strategic financial leadership and operational excellence. With a proven track record in real estate development, corporate finance, and performance optimization, we deliver decisive insights that drive unparalleled growth and lasting value. Led by Albert Martinez-Arizala, we are committed to forging successful futures.");
  const [aboutImage, setAboutImage] = useState("https://placehold.co/600x400/0A1931/FFD700?text=Conceptual+Partnership");
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const generateAboutText = async () => {
    setLoadingText(true);
    const text = await callGeminiTextAPI("Write an extremely brief 'About Us' section for a consulting business named Max Ventures, emphasizing strategic financial leadership, operational excellence, transformative growth, and lasting value. Include a mention of Albert Martinez-Arizala's leadership. Maintain a victorious American style. Do not mention specific company names from his resume.");
    setAboutText(text);
    setLoadingText(false);
  };

  const generateAboutImage = async () => {
    setLoadingImage(true);
    const imageUrl = await callImagenAPI("Abstract concept of strategic partnership and collaboration, clean lines, subtle gold accents, deep blue and white tones, professional, minimalist, high resolution");
    setAboutImage(imageUrl);
    setLoadingImage(false);
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-blue-900 mb-6 leading-tight">
            About Max Ventures
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {aboutText}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={generateAboutText}
              className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-800 transition duration-300 transform hover:scale-105 flex items-center justify-center"
              disabled={loadingText}
            >
              {loadingText ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Generate About Text'
              )}
            </button>
            <button
              onClick={generateAboutImage}
              className="bg-gray-200 text-blue-900 px-6 py-3 rounded-md font-semibold shadow-md hover:bg-gray-300 transition duration-300 transform hover:scale-105 flex items-center justify-center"
              disabled={loadingImage}
            >
              {loadingImage ? (
                <svg className="animate-spin h-5 w-5 text-blue-900 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Generate About Image'
              )}
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={aboutImage}
            alt="About Us"
            className="rounded-lg shadow-xl w-full max-w-md object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/0A1931/FFD700?text=Conceptual+Partnership"; }}
          />
        </div>
      </div>
    </section>
  );
};

// Services Page Component
const ServicesPage = () => {
  const [servicesText, setServicesText] = useState({
    strategy: "Strategic Financial Advisory: Guiding robust financial planning, forecasting, and performance optimization for superior outcomes.",
    operations: "Operational Transformation: Streamlining processes, enhancing efficiency, and implementing robust controls to maximize profitability.",
    manda: "M&A & Valuation Advisory: Navigating complex transactions, due diligence, and valuation to secure advantageous deals.",
    realestate: "Real Estate & Capital Management: Expertise in property acquisition, securing financing, and optimizing capital assets and tax strategies."
  });
  const [loadingText, setLoadingText] = useState(false);

  // Helper for generating all service descriptions
  const generateAllServiceTexts = async () => {
    setLoadingText(true);
    const servicePrompts = {
      strategy: "Write an extremely brief and impactful description for a consulting business service focused on strategic financial advisory, planning, forecasting, and performance optimization, for a 'victorious American' style website.",
      operations: "Write an extremely brief and impactful description for a consulting business service focused on operational transformation, efficiency, and implementing robust controls, for a 'victorious American' style website.",
      manda: "Write an extremely brief and impactful description for a consulting business service focused on Mergers & Acquisitions (M&A) and valuation advisory, covering transactions, due diligence, and deal structuring, for a 'victorious American' style website.",
      realestate: "Write an extremely brief and impactful description for a consulting business service focused on real estate investment & capital management, including property acquisition, securing financing, and optimizing capital assets and tax strategies, for a 'victorious American' style website."
    };

    const newServices = {};
    for (const key in servicePrompts) {
      newServices[key] = await callGeminiTextAPI(servicePrompts[key]);
    }
    setServicesText(newServices);
    setLoadingText(false);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Services</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          Driving unparalleled success through focused expertise.
        </p>
        <button
          onClick={generateAllServiceTexts}
          className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-800 transition duration-300 transform hover:scale-105 mb-12 flex items-center justify-center mx-auto"
          disabled={loadingText}
        >
          {loadingText ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Generate All Service Descriptions'
          )}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Service Card 1: Strategic Financial Advisory */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
            <div className="text-yellow-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Strategic Financial Advisory</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{servicesText.strategy}</p>
          </div>

          {/* Service Card 2: Operational Transformation */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
            <div className="text-yellow-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Operational Transformation</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{servicesText.operations}</p>
          </div>

          {/* Service Card 3: M&A & Valuation Advisory */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
            <div className="text-yellow-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">M&A & Valuation Advisory</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{servicesText.manda}</p>
          </div>

          {/* Service Card 4: Real Estate & Capital Management */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
            <div className="text-yellow-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Real Estate & Capital Management</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{servicesText.realestate}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Page Component
const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "info@maxventures.com",
    phone: "+1 (555) 123-4567",
    address: "100 Victory Blvd, Suite 101, New York, NY 10001"
  });
  const [loadingText, setLoadingText] = useState(false);

  const generateContactInfo = async () => {
    setLoadingText(true);
    const text = await callGeminiTextAPI("Generate extremely brief and professional contact information for a consulting business named Max Ventures, including email, phone, and a plausible American address, in a victorious American style.");
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const newContact = {};
    lines.forEach(line => {
      if (line.toLowerCase().startsWith('email:')) newContact.email = line.substring(6).trim();
      if (line.toLowerCase().startsWith('phone:')) newContact.phone = line.substring(6).trim();
      if (line.toLowerCase().startsWith('address:')) newContact.address = line.substring(8).trim();
    });
    setContactInfo(prev => ({ ...prev, ...newContact }));
    setLoadingText(false);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-100 rounded-t-lg shadow-lg">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">Connect With Us</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          Your journey to success starts here.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Contact Information</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-blue-800">Email:</span> {contactInfo.email}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-blue-800">Phone:</span> {contactInfo.phone}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-blue-800">Address:</span> {contactInfo.address}
            </p>
            <button
              onClick={generateContactInfo}
              className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-800 transition duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
              disabled={loadingText}
            >
              {loadingText ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Generate Contact Info'
              )}
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-left text-gray-700 text-sm font-bold mb-2">Name</label>
                <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-left text-gray-700 text-sm font-bold mb-2">Email</label>
                <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-left text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea id="message" name="message" rows="3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-800 transition duration-300 transform hover:scale-105 w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // Removed userId and isAuthReady states as Firebase is removed
  // const [userId, setUserId] = useState(null);
  // const [isAuthReady, setIsAuthReady] = useState(false);

  // Removed Firebase initialization in useEffect
  // useEffect(() => { /* ... */ }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />; // Removed userId prop
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />; // Removed userId prop
    }
  };

  return (
    <div className="font-sans antialiased text-gray-800 bg-gray-50">
    

      {/* Header */}
      <header className="header-bg-color shadow-lg py-4 px-6 md:px-12 sticky top-0 z-50">
        <nav className="container mx-auto flex items-center justify-between">
          {/* Hamburger Icon for Mobile */}
          <button className="md:hidden text-white hover:text-gray-200 focus:outline-none mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>

          {/* Max Ventures Logo (Text-based, mimicking McKinsey) */}
          <a href="/" onClick={() => setCurrentPage('home')} className="flex items-baseline space-x-1 rounded-md p-2 hover:bg-blue-800 transition duration-300">
            <span className="text-3xl font-merriweather-bold text-white">Max</span>
            <span className="text-2xl font-inter-light text-mckinsey-light-gray">&nbsp;Ventures</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 ml-auto">
            <a href="/" onClick={() => setCurrentPage('home')} className="text-mckinsey-light-gray hover:text-white font-medium transition duration-300 rounded-md p-2 hover:bg-blue-800">Home</a>
            <a href="/about" onClick={() => setCurrentPage('about')} className="text-mckinsey-light-gray hover:text-white font-medium transition duration-300 rounded-md p-2 hover:bg-blue-800">About</a>
            <a href="/services" onClick={() => setCurrentPage('services')} className="text-mckinsey-light-gray hover:text-white font-medium transition duration-300 rounded-md p-2 hover:bg-blue-800">Services</a>
            <a href="/contact" onClick={() => setCurrentPage('contact')} className="text-mckinsey-light-gray hover:text-white font-medium transition duration-300 rounded-md p-2 hover:bg-blue-800">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        {renderPage()}
        {/* Testimonials section remains on the home page for brevity and impact */}
        {currentPage === 'home' && (
          <section id="testimonials" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6 md:px-12 text-center">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Client Success</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                Voices of our impact.
              </p>
              {/* Removed Generate Testimonials button as it currently doesn't update UI state.
                  Testimonials are hardcoded for simplicity. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Testimonials are hardcoded for now, as state management for them across pages would require more complex setup */}
                <div className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-xl italic text-gray-800 mb-6">"Max Ventures delivered exceptional results. A true partner."</p>
                  <p className="text-lg font-semibold text-blue-800">- CEO, Global Innovations</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-xl italic text-gray-800 mb-6">"Their strategic insights were pivotal to our success."</p>
                  <p className="text-lg font-semibold text-blue-800">- Founder, Apex Solutions</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-12 rounded-t-lg">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p>&copy; {new Date().getFullYear()} Max Ventures. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Strategic Partner: Albert Martinez-Arizala</p>
          <p className="text-sm text-gray-400 mt-1">Built with AI-powered content generation.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
