import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { carAPI, pricingAPI, locationAPI, CarDTO, PricingRuleDTO, LocationDTO } from "@/services/api";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, ChevronRight, Check, Calendar, MapPin, CreditCard, FileText } from "lucide-react";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const carId = searchParams.get("carId");
  const returnTo = searchParams.get("returnTo") || "/browse-cars"; // Default to browse-cars for logged-in users

  // Initialize current step from session storage or default to 1
  const getInitialStep = () => {
    const savedStep = sessionStorage.getItem(`booking_step_${carId}`);
    return savedStep ? parseInt(savedStep) : 1;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [car, setCar] = useState<CarDTO | null>(null);
  const [pricing, setPricing] = useState<PricingRuleDTO | null>(null);
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize form data from session storage or defaults
  const getInitialFormData = () => {
    const defaultData = {
      // Step 1: Rental Details
      pickupDate: "",
      pickupTime: "09:00",
      returnDate: "",
      returnTime: "09:00",
      pickupLocation: "",
      returnLocation: "",

      // Step 2: Additional Options
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,

      // Step 3: Personal Information (pre-filled from user)
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      licenseNumber: user?.licenseNumber || "",

      // Step 4: Payment
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    };

    const savedData = sessionStorage.getItem(`booking_${carId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge saved data with user data, prioritizing saved data for most fields
        // but always use current user data for personal info if not already filled
        return {
          ...parsed,
          fullName: parsed.fullName || user?.name || "",
          email: parsed.email || user?.email || "",
          phone: parsed.phone || user?.phoneNumber || "",
          licenseNumber: parsed.licenseNumber || user?.licenseNumber || "",
        };
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }

    return defaultData;
  };

  // Form data
  const [formData, setFormData] = useState(getInitialFormData);

  const steps = [
    { number: 1, title: "Rental Details", icon: Calendar },
    { number: 2, title: "Add-ons", icon: FileText },
    { number: 3, title: "Your Information", icon: MapPin },
    { number: 4, title: "Payment", icon: CreditCard },
  ];

  useEffect(() => {
    if (!carId) {
      toast.error("No car selected");
      navigate(returnTo);
      return;
    }
    fetchCarDetails();
  }, [carId]);

  // Save form data to session storage whenever it changes
  useEffect(() => {
    if (carId) {
      sessionStorage.setItem(`booking_${carId}`, JSON.stringify(formData));
    }
  }, [formData, carId]);

  // Save current step to session storage whenever it changes
  useEffect(() => {
    if (carId) {
      sessionStorage.setItem(`booking_step_${carId}`, currentStep.toString());
    }
  }, [currentStep, carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);

      // Fetch car details and locations in parallel
      const [carData, locationsData] = await Promise.all([
        carAPI.getById(parseInt(carId!)),
        locationAPI.getAll()
      ]);

      setCar(carData);
      setLocations(locationsData);

      // Fetch pricing for this car type
      try {
        const pricingData = await pricingAPI.getActiveForCarType(carData.carTypeID);
        console.log("Pricing fetched for carTypeID", carData.carTypeID, ":", pricingData);
        setPricing(pricingData);
      } catch (error) {
        console.error("Error fetching pricing for carTypeID", carData.carTypeID, ":", error);
        toast.error("Unable to load pricing for this vehicle");
      }
    } catch (error) {
      console.error("Error fetching car:", error);
      toast.error("Failed to load car details");
      navigate(returnTo);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const pickup = new Date(formData.pickupDate);
    const returnD = new Date(formData.returnDate);
    const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const baseRate = pricing?.baseDailyRate || 0;
    let total = baseRate * days;

    console.log("Calculate Total - Days:", days, "BaseRate:", baseRate, "Pricing:", pricing);

    // Add-ons pricing
    if (formData.insurance) total += 50 * days;
    if (formData.gps) total += 15 * days;
    if (formData.childSeat) total += 10 * days;
    if (formData.additionalDriver) total += 25 * days;

    console.log("Total calculated:", total);
    return total;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.pickupDate || !formData.returnDate || !formData.pickupLocation || !formData.returnLocation) {
          toast.error("Please fill in all rental details");
          return false;
        }
        if (new Date(formData.returnDate) <= new Date(formData.pickupDate)) {
          toast.error("Return date must be after pickup date");
          return false;
        }
        return true;
      case 2:
        return true; // Optional step
      case 3:
        if (!formData.fullName || !formData.email || !formData.phone || !formData.licenseNumber) {
          toast.error("Please fill in all personal information");
          return false;
        }
        return true;
      case 4:
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
          toast.error("Please fill in all payment details");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    if (!user || !car) {
      toast.error("Missing user or car information");
      return;
    }

    try {
      // Find location IDs from location names
      const pickupLoc = locations.find(loc => loc.locationName === formData.pickupLocation);
      const dropOffLoc = locations.find(loc => loc.locationName === formData.returnLocation);

      if (!pickupLoc || !dropOffLoc) {
        toast.error("Invalid pickup or return location");
        return;
      }

      // Prepare booking data
      const startDateTime = `${formData.pickupDate}T${formData.pickupTime}:00`;
      const endDateTime = `${formData.returnDate}T${formData.returnTime}:00`;

      // Backend expects full nested objects for user, car, and locations
      const bookingData = {
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          idNumber: user.idNumber,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          licenseNumber: user.licenseNumber,
        },
        car: {
          carID: car.carID,
          model: car.model,
          brand: car.brand,
          year: car.year,
          licensePlate: car.licensePlate,
          vin: car.vin,
          color: car.color,
          mileage: car.mileage,
          status: car.status,
          condition: car.condition,
          currentLocationID: car.currentLocationID,
          carType: {
            carTypeID: car.carTypeID,
            category: car.carTypeCategory,
            fuelType: car.carTypeFuelType,
            transmissionType: car.carTypeTransmissionType,
            numberOfSeats: car.carTypeNumberOfSeats,
            numberOfDoors: car.carTypeNumberOfDoors,
            airConditioned: car.carTypeAirConditioned,
            luggageCapacity: car.carTypeLuggageCapacity,
            description: car.carTypeDescription,
          },
        },
        startDate: startDateTime,
        endDate: endDateTime,
        pickupLocation: {
          locationID: pickupLoc.locationID,
          locationName: pickupLoc.locationName,
          streetNumber: pickupLoc.streetNumber,
          streetName: pickupLoc.streetName,
          cityOrTown: pickupLoc.cityOrTown,
          provinceOrState: pickupLoc.provinceOrState,
          postalCode: pickupLoc.postalCode,
          country: pickupLoc.country,
        },
        dropOffLocation: {
          locationID: dropOffLoc.locationID,
          locationName: dropOffLoc.locationName,
          streetNumber: dropOffLoc.streetNumber,
          streetName: dropOffLoc.streetName,
          cityOrTown: dropOffLoc.cityOrTown,
          provinceOrState: dropOffLoc.provinceOrState,
          postalCode: dropOffLoc.postalCode,
          country: dropOffLoc.country,
        },
        bookingStatus: "PENDING",
        discountAmount: 0.0,
      };

      console.log("Booking data being sent:", bookingData);

      // Create booking via API
      const response = await api.post("/api/booking/create", bookingData);

      if (response.data) {
        // Clear the saved form data on successful submission
        if (carId) {
          sessionStorage.removeItem(`booking_${carId}`);
          sessionStorage.removeItem(`booking_step_${carId}`);
        }

        toast.success("Booking created successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Booking creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create booking. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header Bar */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(returnTo)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Complete Your Booking</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {user?.name}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <p className={`text-xs sm:text-sm font-medium text-center ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Step 1: Rental Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Pickup Date *</Label>
                        <Input
                          id="pickupDate"
                          name="pickupDate"
                          type="date"
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Pickup Time *</Label>
                        <Input
                          id="pickupTime"
                          name="pickupTime"
                          type="time"
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="returnDate">Return Date *</Label>
                        <Input
                          id="returnDate"
                          name="returnDate"
                          type="date"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="returnTime">Return Time *</Label>
                        <Input
                          id="returnTime"
                          name="returnTime"
                          type="time"
                          value={formData.returnTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location *</Label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select pickup location</option>
                        {locations.map((location) => (
                          <option key={location.locationID} value={location.locationName}>
                            {location.locationName.charAt(0).toUpperCase() + location.locationName.slice(1)} - {location.cityOrTown}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnLocation">Return Location *</Label>
                      <select
                        id="returnLocation"
                        name="returnLocation"
                        value={formData.returnLocation}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select return location</option>
                        {locations.map((location) => (
                          <option key={location.locationID} value={location.locationName}>
                            {location.locationName.charAt(0).toUpperCase() + location.locationName.slice(1)} - {location.cityOrTown}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Add-ons */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Enhance your rental experience with these optional extras
                    </p>
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="checkbox"
                        name="insurance"
                        checked={formData.insurance}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Full Coverage Insurance</div>
                        <div className="text-sm text-muted-foreground">Complete protection for your rental</div>
                        <div className="text-sm font-semibold text-primary mt-1">R50/day</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="checkbox"
                        name="gps"
                        checked={formData.gps}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">GPS Navigation System</div>
                        <div className="text-sm text-muted-foreground">Never get lost with turn-by-turn directions</div>
                        <div className="text-sm font-semibold text-primary mt-1">R15/day</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="checkbox"
                        name="childSeat"
                        checked={formData.childSeat}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Child Safety Seat</div>
                        <div className="text-sm text-muted-foreground">Keep your little ones safe and secure</div>
                        <div className="text-sm font-semibold text-primary mt-1">R10/day</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input
                        type="checkbox"
                        name="additionalDriver"
                        checked={formData.additionalDriver}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Additional Driver</div>
                        <div className="text-sm text-muted-foreground">Add another licensed driver to your rental</div>
                        <div className="text-sm font-semibold text-primary mt-1">R25/day</div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Step 3: Personal Information */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+27 82 123 4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          placeholder="License number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate(returnTo)}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back to Cars
                    </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button onClick={nextStep}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      Complete Booking
                      <Check className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Car Info */}
                <div>
                  <div className="relative h-32 overflow-hidden bg-muted rounded-lg mb-3">
                    {car.imageBase64 ? (
                      <img
                        src={`data:${car.imageType};base64,${car.imageBase64}`}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-muted-foreground/40">
                          {car.brand.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{car.brand} {car.model}</h3>
                  <Badge variant="secondary" className="mt-1">{car.carTypeCategory}</Badge>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {/* Always show daily rate */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span className="font-semibold">R{pricing?.baseDailyRate || 0}</span>
                  </div>

                  {formData.pickupDate && formData.returnDate ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rental Period:</span>
                        <span className="font-semibold">{calculateDays()} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">R{(pricing?.baseDailyRate || 0) * calculateDays()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Select dates to see total
                    </div>
                  )}

                  {formData.insurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span>R{50 * calculateDays()}</span>
                    </div>
                  )}
                  {formData.gps && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GPS:</span>
                      <span>R{15 * calculateDays()}</span>
                    </div>
                  )}
                  {formData.childSeat && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Child Seat:</span>
                      <span>R{10 * calculateDays()}</span>
                    </div>
                  )}
                  {formData.additionalDriver && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Additional Driver:</span>
                      <span>R{25 * calculateDays()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total:</span>
                    {calculateTotal() > 0 ? (
                      <span className="font-bold text-2xl text-primary">
                        R{calculateTotal().toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-lg text-muted-foreground">
                        Select dates
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
