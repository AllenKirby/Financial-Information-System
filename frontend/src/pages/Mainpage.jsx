import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";

//Components and Pages
import {AuthRole} from "../components/AuthRole";
import AdminPage from "./AdminPage";
import UserManagement from "../components/SuperAdminComponents/UserManagement"
import Dashboard from "../components/AdminComponents/Dashboard";
import NotFound from "./NotFoundPage";
import EditorPage from "./EditorPage";
import DisbursementRecords from "../components/EditorComponents/DisbursementRecords";
import PrivateRoute from '../AuthComponents/PrivateRoute';
import ViewDocument from "../components/ViewDocument";
import OperatorPage from "./OperatorPage";
import Disbursementrecords from '../components/OperatorComponents/DisbursementRecords'
import HeadPage from "./HeadPage";
import DisbursementRecordsHead from "../components/HeadComponents/DisbursementRecordsHead";
import DisbursementRecordsAdmin from "../components/AdminComponents/DisbursementRecords"
import HistoryLogs from "../components/AdminComponents/HistoryLogs";
import ForbiddenPage from "./ForbiddenPage";
import AccountsManagement from "../components/AdminComponents/AccountsManagement";
import SuperAdminPage from "./SuperAdminPage";
import Editform from "../components/AdminComponents/EditForm";


const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['1']}><AdminPage/></PrivateRoute>}>
          <Route index element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>}/>
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['1']}><DisbursementRecordsAdmin/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['1']}><ViewDocument/></PrivateRoute>}/>
          </Route>
          <Route path="historylogs" element={<PrivateRoute allowedRoles={['1']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="accountsmanagement" element={<PrivateRoute allowedRoles={['1']}><AccountsManagement/></PrivateRoute>} />
          <Route path="editform" element={<PrivateRoute allowedRoles={['1']}><Editform/></PrivateRoute>}/>
        </Route>
        <Route path="/editor" element={<PrivateRoute allowedRoles={['4']}><EditorPage/></PrivateRoute>}>       
          <Route index element={<PrivateRoute allowedRoles={['4']}><DisbursementRecords/></PrivateRoute>} />
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['4']}><DisbursementRecords/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewDocument/></PrivateRoute>}/>
          </Route>
        </Route>
        <Route path="/operator" element={<OperatorPage/>}>
          <Route path="disbursementrecords" element={<Disbursementrecords/>}>
            <Route path=":id" element={<ViewDocument/>}/>
          </Route>
        </Route>
        <Route path="/head" element={<HeadPage/>}>
          <Route path="disbursementrecords" element={<DisbursementRecordsHead/>}>
            <Route path=":id" element={<ViewDocument/>}/>
          </Route>
        </Route>
        <Route path="/superadmin" element={<SuperAdminPage/>}>
          <Route path="usermanagement" element={<UserManagement />}/>
        </Route>

        <Route path="/unauthorized" element={<NotFound/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/unauthorizedEmail" element={<ForbiddenPage/>}/>
      </Route>
    )
    
  );

  return (
    <main className="w-full h-svh flex items-center justify-center font-poppins text-customFontColor">
      <RouterProvider router={router} />
    </main>
  )
}

export default Mainpage