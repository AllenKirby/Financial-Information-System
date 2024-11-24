import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2'

import { useSuperAdminHook } from "../../hooks/useSuperAdminHook";

const AccessControl = () => {
  //state
  const [roles, setRoles] = useState([]);
  //hooks
  const {changeAccess, isLoading, error} = useSuperAdminHook()

  useEffect(() => {
    const retrieveRoles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/superadmin/roles`, {
          withCredentials: true
        });

        if (res.status === 200) {
          const data = res.data;
          setRoles(data);
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    retrieveRoles();
  }, []);

  const handleToggleChange = async(index, roleName) => {
    const updatedRoles = [...roles];
    const newPermissionValue = !updatedRoles[index].permission;

    updatedRoles[index].permission = !updatedRoles[index].permission;
    setRoles(updatedRoles);

    Swal.fire({
      title: "Do you really want to grant access",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Grant it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await changeAccess(roleName, newPermissionValue)
            if (res) {
                Swal.fire({
                    title: "Access Granted!",
                    text: "The account now has access",
                    icon: "success",
                });
            }else{
            Swal.fire({
                title: "Error!",
                text: {error},
                icon: "error",
            });
          }
        }
      }
    );
  };

  return (
    <section className="w-full h-full">
      <div className="w-full h-auto flex rounded-t-lg bg-superAdminBlue text-white px-1">
        <div className="w-full h-auto flex">
          <h1 className="w-1/4 px-2 py-1">Role</h1>
          <h1 className="w-1/4 px-2 py-1">Permission</h1>
          <h1 className="w-1/4 px-2 py-1">Granted Features</h1>
          <h1 className="w-1/4 px-2 py-1">Description</h1>
        </div>
      </div>
      <div className="w-full h-full bg-white p-1">
        {roles.length > 0 ? (
          roles.map((role, index) => (
            <div key={index} className="w-full h-auto border-[1px] flex rounded-md py-2 hover:bg-slate-100 cursor-pointer my-1">
              <p className="w-1/4 px-2 font-bold">{role.roleName}</p>
              <p className="w-1/4 px-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    disabled={isLoading}
                    checked={role.permission}
                    onChange={() => handleToggleChange(index, role.roleName)}
                  />
                  <div className="group peer bg-white rounded-full duration-300 w-8 h-4 ring-2 ring-superAdminMustard after:duration-300 after:bg-superAdminMustard peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
                </label>
              </p>
              <p className="w-1/4 px-2">{role.grantedAccess}</p>
              <p className="w-1/4 px-2 truncate">{role.description}</p>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div>
              <h1 className="text-xl font-semibold">No Roles Found</h1>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccessControl;
