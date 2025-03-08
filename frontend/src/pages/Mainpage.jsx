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
import ControlBook from "../components/OperatorComponents/ControlBook";
import ViewControlBook from "../components/OperatorComponents/ViewControlBook";
import ComparisonView from "../components/AdminComponents/ComparisonView"
import Logs from "../components/SuperAdminComponents/Logs";
import DVRegister from "../components/EditorComponents/DVRegister";
import PayrollRecords from "../components/Shared/PayrollRecords";
import BURRecords from "../components/Shared/BURRecords";
import Records from "../components/Shared/Records";
import ViewBUR from "../components/Shared/ViewBUR";

const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        {/* Approver */}
        <Route path="/admin" element={<PrivateRoute allowedRoles={['1']}><AdminPage/></PrivateRoute>}>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>}/>
          <Route path="records" element={<PrivateRoute allowedRoles={['1']}><Records/></PrivateRoute>}>
            <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['1']}><DisbursementRecordsAdmin/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['1']}><ViewDocument/></PrivateRoute>}/>
            </Route>
            <Route path="burrecords" element={<PrivateRoute allowedRoles={['1']}><BURRecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['1']}><ViewBUR/></PrivateRoute>}/>
            </Route>
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['1']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="editform" element={<PrivateRoute allowedRoles={['1']}><Editform/></PrivateRoute>}/>
          <Route path="comparison" element={<PrivateRoute allowedRoles={['1']}><ComparisonView/></PrivateRoute>}/>
        </Route>
        {/* Preparer */}
        <Route path="/editor" element={<PrivateRoute allowedRoles={['4']}><EditorPage/></PrivateRoute>}> 
          <Route path="records" element={<PrivateRoute allowedRoles={['4']}><Records/></PrivateRoute>}>
            <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['4']}><DisbursementRecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewDocument/></PrivateRoute>}/>
            </Route>
            <Route path="payrollrecords" element={<PrivateRoute allowedRoles={['4']}><PayrollRecords/></PrivateRoute>}/>
            <Route path="burrecords" element={<PrivateRoute allowedRoles={['4']}><BURRecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewBUR/></PrivateRoute>}/>
            </Route>
          </Route>
          <Route path="controlbook" element={<PrivateRoute allowedRoles={['4']}><ControlBook/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewControlBook/></PrivateRoute>}/>
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['4']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="dvregister" element={<PrivateRoute allowedRoles={['4']}><DVRegister/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewDocument/></PrivateRoute>}/>
          </Route>
        </Route>
        {/* Funding */}
        <Route path="/operator" element={<PrivateRoute allowedRoles={['3']}><OperatorPage/></PrivateRoute>}>
          <Route path="records" element={<PrivateRoute allowedRoles={['3']}><Records/></PrivateRoute>}>
            <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['3']}><Disbursementrecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewDocument/></PrivateRoute>}/>
            </Route>
            <Route path="payrollrecords" element={<PrivateRoute allowedRoles={['3']}><PayrollRecords/></PrivateRoute>}/>
            <Route path="burrecords" element={<PrivateRoute allowedRoles={['3']}><BURRecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewBUR/></PrivateRoute>}/>
            </Route>
          </Route>
          <Route path="controlbook" element={<PrivateRoute allowedRoles={['3']}><ControlBook/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewControlBook/></PrivateRoute>}/> 
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['3']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="dvregister" element={<PrivateRoute allowedRoles={['3']}><DVRegister/></PrivateRoute>}>
            <Route path=":id" element={<PrivateRoute allowedRoles={['3']}><ViewDocument/></PrivateRoute>}/>
          </Route>
        </Route>
        {/* Budget Officer */}
        <Route path="/head" element={<PrivateRoute allowedRoles={['2']}><HeadPage/></PrivateRoute>}>
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['2']}><Dashboard/></PrivateRoute>}/>
          <Route path="records" element={<PrivateRoute allowedRoles={['2']}><Records/></PrivateRoute>}>
            <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['2']}><DisbursementRecordsHead/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['2']}><ViewDocument/></PrivateRoute>}/>
            </Route>
            <Route path="burrecords" element={<PrivateRoute allowedRoles={['2']}><BURRecords/></PrivateRoute>}>
              <Route path=":id" element={<PrivateRoute allowedRoles={['2']}><ViewBUR/></PrivateRoute>}/>
            </Route>
          </Route>
          <Route path="disbursementlogs" element={<PrivateRoute allowedRoles={['2']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="historylogs" element={<PrivateRoute allowedRoles={['2']}><HistoryLogs/></PrivateRoute>}/>
          <Route path="editform" element={<PrivateRoute allowedRoles={['2']}><Editform/></PrivateRoute>}/>
          <Route path="comparison" element={<PrivateRoute allowedRoles={['2']}><ComparisonView/></PrivateRoute>}/>
        </Route>
        {/* Super Admin */}
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
    <main className="w-full h-svh md:h-dvh lg:h-lvh flex items-center justify-center font-sans text-customFontColor">
      <RouterProvider router={router} />
    </main>
  )
}

export default Mainpage