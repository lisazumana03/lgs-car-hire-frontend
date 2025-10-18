import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar/Navbar";
import { Search, Users, Fuel, Settings, Loader2 } from "lucide-react";
import { carAPI, CarDTO, pricingAPI, PricingRuleDTO } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function CarCatalog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [pricing, setPricing] = useState<Map<number, PricingRuleDTO>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleBookNow = (carId: number) => {
    if (!user) {
      toast.error("Please log in to book a car");
      // Save the intended destination and redirect to login
      navigate(`/login?redirect=/booking&carId=${carId}&returnTo=/cars`);
      return;
    }
    navigate(`/booking?carId=${carId}&returnTo=/cars`);
  };

  // Fetch cars and pricing from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch cars
      const carsData = await carAPI.getAll();
      setCars(carsData);

      // Fetch active pricing rules
      const pricingData = await pricingAPI.getActive();
      console.log("Pricing data received:", pricingData);

      // Create a map of carTypeID -> PricingRule for quick lookup
      const pricingMap = new Map<number, PricingRuleDTO>();
      pricingData.forEach((rule) => {
        console.log(`Adding pricing: carTypeID ${rule.carTypeID} = R${rule.baseDailyRate}`);
        pricingMap.set(rule.carTypeID, rule);
      });
      console.log("Pricing map created:", pricingMap);
      setPricing(pricingMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter cars based on search and filters
  const filteredCars = cars.filter((car) => {
    // Only show AVAILABLE and RENTED cars (exclude MAINTENANCE, OUT_OF_SERVICE, RESERVED)
    const isDisplayableStatus = car.status === "AVAILABLE" || car.status === "RENTED";
    if (!isDisplayableStatus) return false;

    const carName = `${car.brand} ${car.model}`.toLowerCase();
    const matchesSearch = carName.includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || car.carTypeCategory === categoryFilter;
    const matchesTransmission = transmissionFilter === "all" || car.carTypeTransmissionType === transmissionFilter;
    const matchesAvailability = !availableOnly || car.status === "AVAILABLE";

    return matchesSearch && matchesCategory && matchesTransmission && matchesAvailability;
  });

  // Get unique categories and transmissions from cars
  const categories = ["all", ...Array.from(new Set(cars.map((car) => car.carTypeCategory)))];
  const transmissions = ["all", ...Array.from(new Set(cars.map((car) => car.carTypeTransmissionType)))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Our Fleet</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose from our wide selection of quality vehicles. Find the perfect car for your journey.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              {/* Transmission Filter */}
              <select
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission === "all" ? "All Transmissions" : transmission}
                  </option>
                ))}
              </select>

              {/* Availability Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">Available only</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading cars...</span>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCars.length}</span> of{" "}
              <span className="font-semibold text-foreground">{cars.length}</span> cars
            </p>
          </div>
        )}

        {/* Car Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
            <Card key={car.carID} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Car Image */}
              <div className="relative h-40 overflow-hidden bg-muted">
                {car.imageBase64 ? (
                  <img
                    src={`data:${car.imageType};base64,${car.imageBase64}`}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                    <span className="text-4xl font-bold text-muted-foreground/40">
                      {car.brand.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Price Badge */}
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-lg">
                  <div className="flex items-baseline gap-1">
                    {(() => {
                      const price = pricing.get(car.carTypeID);
                      console.log(`Car ${car.brand} ${car.model}, carTypeID: ${car.carTypeID}, price:`, price);
                      return price ? (
                        <>
                          <span className="text-lg font-bold">R{price.baseDailyRate}</span>
                          <span className="text-xs">/day</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-bold">Contact</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                {car.status !== "AVAILABLE" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm">{car.status.replace('_', ' ')}</Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-1 pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{car.brand} {car.model}</CardTitle>
                    <Badge variant="secondary" className="mt-1.5 text-xs">{car.carTypeCategory}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-2 pt-2">
                {/* Car Details */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{car.carTypeNumberOfSeats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span>{car.carTypeTransmissionType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    <span>{car.carTypeFuelType}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  className="w-full"
                  size="sm"
                  disabled={car.status !== "AVAILABLE"}
                  onClick={() => handleBookNow(car.carID)}
                >
                  {car.status === "AVAILABLE" ? "Book Now" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No cars found matching your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setTransmissionFilter("all");
                setAvailableOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2025 LGS Car Hire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
