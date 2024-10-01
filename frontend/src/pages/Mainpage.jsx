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
import ViewDocument from "../components/ViewDocument";

const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        <Route path="/admin" element={<AdminPage/>}>
        <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="usermanagement" element={<UserManagement />}/>
        </Route>
        <Route path="/editor" element={<EditorPage/>}>
          <Route index element={<Navigate to="/editor/disbursementvoucher"/>} />
          <Route path="disbursementvoucher" element={<DisbursementVoucher/>}/>
          <Route path="disbursementrecords" element={<DisbursementRecords/>}/>
          <Route path=":id" element={<ViewDocument/>}/>
        </Route>

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