import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";

//Components and Pages
import {AuthRole} from "../components/AuthRole";
import AdminPage from "./AdminPage";
import UserManagement from "../components/AdminComponents/UserManagement"
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


const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['1']}><AdminPage/></PrivateRoute>}>
          <Route index element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute allowedRoles={['1']}><Dashboard/></PrivateRoute>}/>
          <Route path="usermanagement" element={<PrivateRoute allowedRoles={['1']}><UserManagement /></PrivateRoute>}/>
        </Route>
        <Route path="/editor" element={<PrivateRoute allowedRoles={['4']}><EditorPage/></PrivateRoute>}>       
          <Route index element={<PrivateRoute allowedRoles={['1']}><DisbursementRecords/></PrivateRoute>} />
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

        <Route path="/unauthorized" element={<NotFound/>}/>
        <Route path="*" element={<NotFound/>}/>
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