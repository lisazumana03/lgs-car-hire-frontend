import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar/Navbar";
import { Award, Shield, Clock, Heart, Users, Target } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All our vehicles are regularly maintained and inspected to ensure your safety on the road.",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "We pride ourselves on providing exceptional customer service and premium vehicles.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you.",
    },
    {
      icon: Heart,
      title: "Customer Focused",
      description: "Your satisfaction is our priority. We go the extra mile to exceed expectations.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Vehicles" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">About LGS Car Hire</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your trusted partner in car rental services since 2010
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010, LGS Car Hire has grown from a small local business to one of the most
                  trusted car rental services in the region. Our journey began with a simple mission: to
                  provide reliable, affordable, and quality vehicles to our customers.
                </p>
                <p>
                  Over the years, we've expanded our fleet to include a wide variety of vehicles, from
                  economical hatchbacks to luxury sedans and spacious SUVs. Our commitment to excellence
                  has earned us the trust of thousands of customers who return to us time and time again.
                </p>
                <p>
                  Today, we continue to innovate and improve our services, embracing new technology while
                  maintaining the personal touch that our customers love. We're not just a car rental
                  company - we're your partner in creating memorable journeys.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop"
                alt="Car showroom"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground">
                To provide accessible, reliable, and affordable car rental services that empower people to
                travel with confidence. We strive to exceed customer expectations through quality vehicles,
                transparent pricing, and exceptional service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground">
                To be the leading car rental service recognized for innovation, sustainability, and customer
                satisfaction. We envision a future where every journey with LGS Car Hire is seamless,
                enjoyable, and contributes to a more connected community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Behind LGS Car Hire is a dedicated team of professionals passionate about making your car rental
            experience exceptional. From our customer service representatives to our maintenance crew, every
            team member plays a vital role in delivering the quality service you deserve.
          </p>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic">
                "Our team is committed to ensuring that every customer feels valued and every journey is
                memorable. We're not just renting cars - we're building relationships and creating experiences."
              </p>
              <p className="text-foreground font-semibold mt-4">- The LGS Car Hire Team</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 LGS Car Hire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
