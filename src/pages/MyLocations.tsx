import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { locationAPI, LocationDTO } from "@/services/api";
import { MapPin, Search, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function MyLocations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationAPI.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((location) => {
    if (searchQuery === "") return true;

    const query = searchQuery.toLowerCase();
    return (
      location.locationName.toLowerCase().includes(query) ||
      location.cityOrTown.toLowerCase().includes(query) ||
      location.provinceOrState.toLowerCase().includes(query) ||
      location.country.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Locations</h1>
          <p className="text-muted-foreground">Find a convenient pickup and drop-off location near you</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location name, city, province, or country..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLocations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No locations found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location) => (
                <Card key={location.locationID} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg capitalize">
                          {location.locationName}
                        </CardTitle>
                        <CardDescription>{location.cityOrTown}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">Address</p>
                        <p>
                          {location.streetNumber} {location.streetName}
                        </p>
                        <p>
                          {location.cityOrTown}, {location.provinceOrState}
                        </p>
                        <p>{location.postalCode}</p>
                        <p className="font-medium">{location.country}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => navigate("/browse-cars")}
                      >
                        Book a Car Here
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help Finding a Location?</CardTitle>
            <CardDescription>We're here to assist you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Convenient Pickup</h3>
                <p className="text-sm text-muted-foreground">
                  All our locations offer easy pickup and drop-off services with friendly staff ready to assist you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Flexible Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Most locations operate extended hours to accommodate your schedule. Contact us for specific timings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-muted-foreground">
                  Have questions about a location? Visit our contact page or call us for more information.
                </p>
                <Button
                  variant="link"
                  className="px-0 mt-2"
                  onClick={() => navigate("/contact")}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
