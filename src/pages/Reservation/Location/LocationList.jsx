/*
Lisakhanya Zumana (230864821)
Date: 24/08/2025
 */

function LocationList() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <table>
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Location Name</th>
                        <th className="px-4 py-2 border">Street Name</th>
                        <th className="px-4 py-2 border">City or Town</th>
                        <th className="px-4 py-2 border">Province or State</th>
                        <th className="px-4 py-2 border">Country</th>
                        <th className="px-4 py-2 border">Postal Code</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through locations and display them here */}
                </tbody>
          </table>
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => navigate("/")}>Back</button>
      </div>
  );
}

export default LocationList;