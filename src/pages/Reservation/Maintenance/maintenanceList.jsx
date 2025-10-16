/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */

import { useEffect, useState } from "react";
import { getAllMaintenance } from "../../../services/maintenanceService";

function MaintenanceList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAllMaintenance().then((res) => setRecords(res.data));
  }, []);

  return (
    <div>
      <h2>All Maintenance Sessions</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Mechanic</th>
            <th>Car</th>
          </tr>
        </thead>
        <tbody>
          {records.map((m) => (
            <tr key={m.maintenanceID}>
              <td>{m.maintenanceID}</td>
              <td>{m.serviceDate?.slice(0, 10)}</td>
              <td>{m.description}</td>
              <td>{m.cost}</td>
              <td>{m.status}</td>
              <td>{m.mechanic}</td>
              <td>{m.car?.carID ?? m.carId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceList;