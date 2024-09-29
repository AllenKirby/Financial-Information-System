import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";

//Components and Pages
import {AuthRole} from "../components/AuthRole";
import AdminPage from "./AdminPage";
import UserManagement from "../components/UserManagement"
import Dashboard from "../components/Dashboard";
import NotFound from "./NotFoundPage";
import EditorPage from "./EditorPage";
import DisbursementVoucher from "../components/DisbursementVoucher";
import DisbursementRecords from "../components/DisbursementRecords";

const Mainpage = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<AuthRole/>} />
        <Route path="/admin" element={<AdminPage/>}>
          <Route index element={<Dashboard/>} />
          <Route path="dashboard" element={<Dashboard />}/>
          <Route path="usermanagement" element={<UserManagement />}/>
        </Route>
        <Route path="/editor" element={<EditorPage/>}>
          <Route path="disbursementvoucher" element={<DisbursementVoucher/>}/>
          <Route path="disbursementrecords" element={<DisbursementRecords/>}/>
        </Route>

        <Route path="*" element={<NotFound/>}/>
      </Route>
    )
    
  );

  return (
    <main className="h-screen w-full flex items-center justify-center font-poppins text-customFontColor">
      <RouterProvider router={router} />
    </main>
  )
}

export default Mainpage