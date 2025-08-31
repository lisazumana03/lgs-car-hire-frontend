/*
Sibulele Nohamba
220374686
Date: 31/08/2025
 */

import { useEffect, useState } from "react";
import { getAllInsurance } from "../../services/insuranceService";

function InsuranceList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAllInsurance().then((res) => setRecords(res.data));
  }, []);

  return (
    <div>
      <h2>All Insurance Records</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Policy #</th>
            <th>Car</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.insuranceID}>
              <td>{r.insuranceID}</td>
              <td>{r.insuranceProvider}</td>
              <td>{r.status}</td>
              <td>{r.policyNumber}</td>
              <td>{r.car?.carID ?? r.carId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InsuranceList;