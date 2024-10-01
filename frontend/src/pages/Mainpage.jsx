import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";

//Components and Pages
import {AuthRole} from "../components/AuthRole";
import AdminPage from "./AdminPage";
import UserManagement from "../components/UserManagement"
import Dashboard from "../components/Dashboard";
import NotFound from "./NotFoundPage";
import EditorPage from "./EditorPage";
import DisbursementVoucher from "../components/DisbursementVoucher";
import DisbursementRecords from "../components/DisbursementRecords";

import PrivateRoute from '../AuthComponents/PrivateRoute';
import ViewDocument from "../components/ViewDocument";


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
          <Route path="disbursementvoucher" element={<PrivateRoute allowedRoles={['4']}><DisbursementVoucher/></PrivateRoute>}/>
          <Route path="disbursementrecords" element={<PrivateRoute allowedRoles={['4']}><DisbursementRecords/></PrivateRoute>}/>
          <Route path=":id" element={<PrivateRoute allowedRoles={['4']}><ViewDocument/></PrivateRoute>}/>

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