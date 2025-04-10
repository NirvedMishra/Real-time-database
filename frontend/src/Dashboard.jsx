import NavbarDashboard from "./navbarDashboard";
import DataTable from "./DatabaseCard";
import { useAuth } from "./Auth/AuthProvider";
import EntryPage from "./addEntry";
import { useState } from "react";

function Dashboard(){
    const Auth = useAuth();
    console.log(JSON.parse(Auth.info).isTracking);
    const [isTracking, setIsTracking] = useState(JSON.parse(Auth.info).isTracking);
    const handleTrackingChange = () => {
        setIsTracking(!isTracking);
        const newInfo = {
            ...JSON.parse(Auth.info),
            isTracking: true,
        };
        Auth.setInfo(JSON.stringify(newInfo));
    };
    return (
        <div>
        <NavbarDashboard></NavbarDashboard>
        {isTracking && <DataTable></DataTable>}
        {!isTracking && <EntryPage isTracking={handleTrackingChange}/>}
        </div>
    );
}

export default Dashboard;