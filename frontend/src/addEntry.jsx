import NavbarDashboard from "./navbarDashboard";
import EnterData from "./dataEntryForm";

function EntryPage({isTracking}){
    return(
        <div>
            <EnterData isTracking={isTracking}></EnterData>
        </div>
    );
}

export default EntryPage;