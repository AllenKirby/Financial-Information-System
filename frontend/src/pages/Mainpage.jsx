import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";

//Components and Pages
import {AuthRole} from "../AuthComponents/AuthRole";
import AdminPage from "./AdminPage";
import UserManagement from "../components/SuperAdminComponents/UserManagement"
import Dashboard from "../components/AdminComponents/Dashboard";
import NotFound from "./NotFoundPage";
import EditorPage from "./EditorPage";
import DisbursementRecords from "../components/EditorComponents/DisbursementRecords";
import PrivateRoute from '../AuthComponents/PrivateRoute';
import ViewDocument from "../components/Shared/ViewDocument";
import OperatorPage from "./OperatorPage";
import Disbursementrecords from '../components/OperatorComponents/DisbursementRecords'
import HeadPage from "./HeadPage";
import DisbursementRecordsHead from "../components/HeadComponents/DisbursementRecordsHead";
import DisbursementRecordsAdmin from "../components/AdminComponents/DisbursementRecords"
import HistoryLogs from "../components/Shared/HistoryLogs";
import ForbiddenPage from "./ForbiddenPage";
import SuperAdminPage from "./SuperAdminPage";
import Editform from "../components/AdminComponents/EditForm";
import AccessControl from "../components/SuperAdminComponents/AccessControl";
import DashboardFunding from "../components/OperatorComponents/Dashboard"
import DashboardPreparer from "../components/EditorComponents/Dashboard"
import ControlBook from "../components/OperatorComponents/ControlBook";
import ViewControlBook from "../components/OperatorComponents/ViewControlBook";
import ComparisonView from "../components/AdminComponents/ComparisonView"
import Logs from "../components/SuperAdminComponents/Logs";
import DVRegister from "../components/EditorComponents/DVRegister";

const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['1']}><AdminPage/></PrivateRoute>}>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>}/>
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['1']}><DisbursementRecordsAdmin/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['1']}><ViewDocument/></PrivateRoute>}/>
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['1']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="editform" element={<PrivateRoute allowedRoles={['1']}><Editform/></PrivateRoute>}/>
          <Route path="comparison" element={<PrivateRoute allowedRoles={['1']}><ComparisonView/></PrivateRoute>}/>
        </Route>
        <Route path="/editor" element={<PrivateRoute allowedRoles={['4']}><EditorPage/></PrivateRoute>}> 
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['4']}><DisbursementRecords/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewDocument/></PrivateRoute>}/>
          </Route>
          <Route path="controlbook" element={<PrivateRoute allowedRoles={['4']}><ControlBook/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewControlBook/></PrivateRoute>}/>
          </Route>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['4']}><DashboardPreparer/></PrivateRoute>}/>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['4']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="dvregister" element={<PrivateRoute allowedRoles={['4']}><DVRegister/></PrivateRoute>}/>
        </Route>
        <Route path="/operator" element={<PrivateRoute allowedRoles={['3']}><OperatorPage/></PrivateRoute>}>
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['3']}><Disbursementrecords/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewDocument/></PrivateRoute>}/>
          </Route>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['3']}><DashboardFunding/></PrivateRoute>}/>
          <Route path="controlbook" element={<PrivateRoute allowedRoles={['3']}><ControlBook/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewControlBook/></PrivateRoute>}/> 
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['3']}><HistoryLogs/></PrivateRoute>}/>
        </Route>
        <Route path="/head" element={<PrivateRoute allowedRoles={['2']}><HeadPage/></PrivateRoute>}>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['2']}><Dashboard/></PrivateRoute>}/>
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['2']}><DisbursementRecordsHead/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['2']}><ViewDocument/></PrivateRoute>}/>
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['2']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="historylogs" element={<PrivateRoute allowedRoles={['2']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="editform" element={<PrivateRoute allowedRoles={['2']}><Editform/></PrivateRoute>}/>
          <Route path="comparison" element={<PrivateRoute allowedRoles={['2']}><ComparisonView/></PrivateRoute>}/>
        </Route>
        <Route path="/superadmin" element={<PrivateRoute allowedRoles={['0']}><SuperAdminPage/></PrivateRoute>}>
          <Route path="usermanagement" element={<PrivateRoute allowedRoles={['0']}><UserManagement /></PrivateRoute>}/>
          <Route path="accesscontrol" element={<PrivateRoute allowedRoles={['0']}><AccessControl /></PrivateRoute>}/>
          <Route path="logs" element={<PrivateRoute allowedRoles={['0']}><Logs /></PrivateRoute>}/>
        </Route>

        <Route path="/unauthorized" element={<NotFound/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/unauthorizedEmail" element={<ForbiddenPage/>}/>
      </Route>
    )
    
  );

  return (
    <main className="w-full h-svh flex items-center justify-center font-sans text-customFontColor">
      <RouterProvider router={router} />
    </main>
  )
}

export default Mainpage