import {Link} from "react-router-dom";

function AdminDashboard(){
    return(
        <div>
            <p> Welcome to the admin dashboard. </p>
            <p> Here you can manage users, view reports, and configure system settings. </p>
            <Link to="/register-location" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> Register a Location </Link>
            <Link to="/register-car" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> Register a Car </Link>
            <Link to="/queries" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-800 transition"> Submit a Query </Link>
        </div>
    )
}

export default AdminDashboard;