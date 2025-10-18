import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Fuel, Settings, Loader2, ArrowLeft } from "lucide-react";
import { carAPI, CarDTO, pricingAPI, PricingRuleDTO } from "@/services/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function BrowseCars() {
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
    navigate(`/booking?carId=${carId}&returnTo=/browse-cars`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const carsData = await carAPI.getAll();
      setCars(carsData);

      const pricingData = await pricingAPI.getActive();
      const pricingMap = new Map<number, PricingRuleDTO>();
      pricingData.forEach((rule) => {
        pricingMap.set(rule.carTypeID, rule);
      });
      setPricing(pricingMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter to only show AVAILABLE and RENTED cars
  const filteredCars = cars.filter((car) => {
    const isDisplayableStatus = car.status === "AVAILABLE" || car.status === "RENTED";
    if (!isDisplayableStatus) return false;

    // If availableOnly is checked, only show AVAILABLE cars
    if (availableOnly && car.status !== "AVAILABLE") return false;

    const matchesSearch =
      searchQuery === "" ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || car.carTypeCategory === categoryFilter;

    const matchesTransmission =
      transmissionFilter === "all" || car.carTypeTransmissionType === transmissionFilter;

    return matchesSearch && matchesCategory && matchesTransmission;
  });

  const categories = Array.from(new Set(cars.map((car) => car.carTypeCategory)));
  const transmissions = Array.from(new Set(cars.map((car) => car.carTypeTransmissionType)));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Our Fleet</h1>
          <p className="text-muted-foreground">Find the perfect vehicle for your journey</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by brand or model..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value)}
              >
                <option value="all">All Transmissions</option>
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="availableOnly"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="availableOnly"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show only available cars
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCars.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No vehicles found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setTransmissionFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredCars.length} {filteredCars.length === 1 ? "vehicle" : "vehicles"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => {
                const carPricing = pricing.get(car.carTypeID);
                const dailyRate = carPricing?.baseDailyRate || 0;

                return (
                  <Card key={car.carID} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {car.imageBase64 ? (
                        <img
                          src={`data:${car.imageType};base64,${car.imageBase64}`}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="text-4xl font-bold text-primary/40">
                            {car.brand.charAt(0)}
                            {car.model.charAt(0)}
                          </div>
                        </div>
                      )}
                      {dailyRate > 0 && (
                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg">
                          R{dailyRate}/day
                        </Badge>
                      )}
                      <Badge
                        className={`absolute top-3 left-3 ${
                          car.status === "AVAILABLE"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {car.status}
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl">
                        {car.brand} {car.model}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{car.year}</p>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{car.carTypeNumberOfSeats} Seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <span>{car.carTypeTransmissionType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <span>{car.carTypeFuelType}</span>
                        </div>
                        <div>
                          <Badge variant="secondary">{car.carTypeCategory}</Badge>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleBookNow(car.carID)}
                        disabled={car.status !== "AVAILABLE"}
                      >
                        {car.status === "AVAILABLE" ? "Book Now" : "Currently Unavailable"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
