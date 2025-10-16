import {Link} from "react-router-dom";

function AdminDashboard(){
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-black-100 p-4">
            <p> Welcome to the admin dashboard. </p>
            <p> Here you can manage users, view reports, and configure system settings. </p>

        </div>
    )
}

export default AdminDashboard;