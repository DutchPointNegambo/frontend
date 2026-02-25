const AboutUs = () => {
  return (
    <div className="w-full pt-24 md:pt-32">
      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-navy-600 mb-4">
                Nestled along the golden shores of Negombo, Dutch Point Negombo Beach Resort was created with a vision to offer a relaxing coastal escape that blends Sri Lanka’s natural beauty with warm, authentic hospitality.
              </p>
              <p className="text-lg text-navy-600 mb-4">
                Located just steps away from the sparkling waters of the Indian Ocean, our beachside resort welcomes both local and international travelers seeking comfort, tranquility, and unforgettable seaside experiences. From breathtaking sunsets over the ocean to the calming sound of the waves, every moment at Dutch Point is designed to reconnect you with nature.
              </p>
              <p className="text-lg text-navy-600 mb-4">
                Since our beginning, we have remained committed to delivering exceptional service, elegant accommodations, and memorable dining experiences. Our resort combines modern comfort with the charm of Negombo’s rich coastal heritage, creating a unique atmosphere where relaxation meets cultural warmth.
              </p>
              <p className="text-lg text-navy-600">
                At Dutch Point Negombo Beach Resort, every detail has been thoughtfully curated — from our beautifully designed rooms and event spaces to our personalized guest services — ensuring that your stay with us becomes more than just a visit, but a cherished memory.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Resort exterior"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Luxury</h3>
              <p className="text-navy-600">
                We believe in providing the finest experiences, where every detail matters and excellence is our standard.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Service</h3>
              <p className="text-navy-600">
                Our dedicated team is committed to providing personalized service that anticipates and exceeds your needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Sustainability</h3>
              <p className="text-navy-600">
                We are committed to preserving the natural beauty of our environment for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              The passionate professionals dedicated to making your stay exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: '########', role: 'General Manager', img: '👩‍💼' },
              { name: '########', role: 'Head Chef', img: '👨‍🍳' },
              { name: '########', role: 'Guest Relations Manager', img: '👩‍💻' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl">
                  {member.img}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{member.name}</h3>
                <p className="text-navy-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
