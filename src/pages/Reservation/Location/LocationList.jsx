/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */

function LocationList() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <ul className="list-disc pl-5">
              <li className="mb-2">Location 1: 123 Main St, Cityville</li>
              <li className="mb-2">Location 2: 456 Oak Ave, Townsville</li>
              <li className="mb-2">Location 3: 789 Pine Rd, Villagetown</li>
              {/* Add more locations as needed */}
          </ul>
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate("/")}>Back</button>
      </div>
  );
}

export default LocationList;