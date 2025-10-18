import { Navbar1 } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Car, Shield, Clock, MapPin } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar1 />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              Your Journey Starts Here
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 px-4">
              Premium car rental services for every occasion. Reliable, affordable, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                Browse Cars
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Why Choose LGS Car Hire?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              We provide exceptional service and a wide range of vehicles to meet your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Car className="h-10 w-10" />}
              title="Wide Selection"
              description="From economy to luxury vehicles, we have the perfect car for every journey"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Fully Insured"
              description="All our vehicles come with comprehensive insurance for your peace of mind"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10" />}
              title="24/7 Support"
              description="Our dedicated team is available around the clock to assist you"
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10" />}
              title="Multiple Locations"
              description="Convenient pickup and drop-off points across the region"
            />
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">Popular Cars</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Check out our most booked vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CarCard
              name="Toyota Corolla"
              type="Sedan"
              price="49"
              image="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=80"
            />
            <CarCard
              name="Honda CR-V"
              type="SUV"
              price="69"
              image="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=80"
            />
            <CarCard
              name="BMW 3 Series"
              type="Luxury Sedan"
              price="99"
              image="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-4">
            Book your perfect car today and experience the freedom of the open road
          </p>
          <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto max-w-xs sm:max-w-none">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">LGS Car Hire</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for car rental services
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Our Fleet</a></li>
                <li><a href="#" className="hover:text-foreground">Locations</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@lgscarhire.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Main St, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LGS Car Hire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-card rounded-lg p-5 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="text-primary mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
    </div>
  );
};

const CarCard = ({ name, type, price, image }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold truncate">{name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{type}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-primary">${price}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">per day</p>
          </div>
        </div>
        <Button className="w-full mt-3 sm:mt-4">Book Now</Button>
      </div>
    </div>
  );
};

export default Home;
