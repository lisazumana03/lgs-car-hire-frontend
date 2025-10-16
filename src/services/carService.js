/*
Imtiyaaz Waggie 219374759
 */

import axios from "axios";

const API_URL = "http://localhost:3045/api/car";

export const create = (car) => {
  return axios.post(`${API_URL}/create`, car);
};

export const getCarById = (carId) => {
  return axios.get(`${API_URL}/read/${carId}`);
};

export const updateCar = (car) => {
  return axios.put(`${API_URL}/update`, car);
};

export const deleteCar = (carId) => {
  return axios.delete(`${API_URL}/delete/${carId}`);
};

export const getAllCars = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);

    // Process cars to create image URLs from byte arrays
    const carsWithImageUrls = response.data.map((car) => {
      if (car.imageData && car.imageType) {
        try {
          // Handle different data formats
          let imageData = car.imageData;

          // If imageData is already a string (base64), use it directly
          if (typeof imageData === "string") {
            car.imageUrl = `data:${car.imageType};base64,${imageData}`;
          }
          // If imageData is an array, convert it to base64
          else if (Array.isArray(imageData)) {
            const base64String = btoa(String.fromCharCode(...imageData));
            car.imageUrl = `data:${car.imageType};base64,${base64String}`;
          }
          // If imageData is an ArrayBuffer or Uint8Array
          else if (
            imageData instanceof ArrayBuffer ||
            imageData instanceof Uint8Array
          ) {
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array(imageData))
            );
            car.imageUrl = `data:${car.imageType};base64,${base64String}`;
          }
        } catch (error) {
          console.error("Error processing image for car:", car.carID, error);
        }
      }
      return car;
    });

    return { data: carsWithImageUrls };
  } catch (error) {
    console.error("Error fetching all cars:", error);
    throw error;
  }
};

export const getCarsByBrand = async (brand) => {
  try {
    const response = await axios.get(`${API_URL}/brand/${brand}`);

    // Process cars to create image URLs
    const carsWithImageUrls = response.data.map((car) => {
      if (car.imageData && car.imageType) {
        try {
          if (typeof car.imageData === "string") {
            car.imageUrl = `data:${car.imageType};base64,${car.imageData}`;
          } else if (Array.isArray(car.imageData)) {
            const base64String = btoa(String.fromCharCode(...car.imageData));
            car.imageUrl = `data:${car.imageType};base64,${base64String}`;
          }
        } catch (error) {
          console.error("Error processing image for car:", car.carID, error);
        }
      }
      return car;
    });

    return { data: carsWithImageUrls };
  } catch (error) {
    console.error("Error fetching cars by brand:", error);
    throw error;
  }
};

export const getAvailableCars = async () => {
  try {
    console.log(" Fetching available cars from:", `${API_URL}/available`);
    const response = await axios.get(`${API_URL}/available`);

    console.log(` Received ${response.data.length} cars from backend`);

    // Process cars to create image URLs from byte arrays
    const carsWithImageUrls = response.data.map((car, index) => {
      console.log(` Processing car ${index + 1}/${response.data.length}:`, {
        carID: car.carID,
        brand: car.brand,
        model: car.model,
        hasImageData: !!car.imageData,
        imageDataType: car.imageData ? typeof car.imageData : "null",
        imageDataLength: car.imageData
          ? Array.isArray(car.imageData)
            ? car.imageData.length
            : "N/A"
          : 0,
        imageType: car.imageType,
        imageName: car.imageName,
      });

      if (car.imageData && car.imageType) {
        try {
          // Handle different data formats
          let imageData = car.imageData;

          // If imageData is already a string (base64), use it directly
          if (typeof imageData === "string") {
            car.imageUrl = `data:${car.imageType};base64,${imageData}`;
            console.log(
              ` Car ${car.carID}: Used string imageData (already base64)`
            );
          }
          // If imageData is an array, convert it to base64
          else if (Array.isArray(imageData)) {
            const base64String = btoa(String.fromCharCode(...imageData));
            car.imageUrl = `data:${car.imageType};base64,${base64String}`;
            console.log(
              ` Car ${car.carID}: Converted byte array to base64 (${imageData.length} bytes)`
            );
          }
          // If imageData is an ArrayBuffer or Uint8Array
          else if (
            imageData instanceof ArrayBuffer ||
            imageData instanceof Uint8Array
          ) {
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array(imageData))
            );
            car.imageUrl = `data:${car.imageType};base64,${base64String}`;
            console.log(` Car ${car.carID}: Converted ArrayBuffer to base64`);
          } else {
            console.warn(` Car ${car.carID}: Unknown imageData format`);
          }
        } catch (error) {
          console.error(` Car ${car.carID}: Error processing image:`, error);
        }
      } else {
        console.log(
          `ℹ Car ${car.carID}: No image data (will use placeholder or endpoint)`
        );
      }
      return car;
    });

    console.log(
      `Processed ${
        carsWithImageUrls.filter((c) => c.imageUrl).length
      } cars with images`
    );

    return { data: carsWithImageUrls };
  } catch (error) {
    console.error(" Error fetching available cars:", error);
    throw error;
  }
};

export const getCarsByYear = (year) => {
  return axios.get(`${API_URL}/year/${year}`);
};

export const getCarsByPriceRange = (minPrice, maxPrice) => {
  return axios.get(`${API_URL}/price-range`, {
    params: { minPrice, maxPrice },
  });
};

export const updateCarAvailability = (carId, available) => {
  return axios.put(`${API_URL}/availability/${carId}`, null, {
    params: { available },
  });
};

export const uploadCarImage = (carId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  // Updated to use new CarImageController endpoint
  return axios.post(
    `http://localhost:3045/api/car/image/upload/${carId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// New image endpoints from CarImageController
export const deleteCarImage = (carId) => {
  return axios.delete(`http://localhost:3045/api/car/image/${carId}`);
};

export const checkCarImageExists = (carId) => {
  return axios.get(`http://localhost:3045/api/car/image/${carId}/exists`);
};

export const getCarImageUrl = (carId) => {
  return `http://localhost:3045/api/car/image/${carId}`;
};
