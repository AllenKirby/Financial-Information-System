import { useEffect, useState, useRef } from "react";
import Swal from 'sweetalert2'
import { collection, onSnapshot } from "firebase/firestore"
import { firestore } from "../../config/firebase-config"

import { useSuperAdminHook } from "../../hooks/useSuperAdminHook";
import axios from "axios";

const AccessControl = () => {
  //state
  const [roles, setRoles] = useState([]);
  //hooks
  const {changeAccess, isLoading, error} = useSuperAdminHook()

  const apiURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const q = collection(firestore, 'Roles');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {...doc.data()}
        return acc;
      }, {});
      setRoles(users)
    })

    return () => unsubscribe()   
  }, []);

  const handleToggleChange = async( roleName, currentPermission) => {
    Swal.fire({
      title: `Do you really want to ${currentPermission ? 'revoke' : 'grant'} access?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Grant it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newPermission = !currentPermission
            const res = await changeAccess(roleName, newPermission)
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

  const [isDownloading, setIsDownloading] = useState(false);
  const downloadJSON = async () => {
    setIsDownloading(true);
    try{
      const res = await axios.get(`${apiURL}/superadmin/export`, {
        withCredentials:true
      })
      // const data = res.data;
      // console.log(data)
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "firestore_export.json");
      document.body.appendChild(downloadAnchorNode); // required for Firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }catch(error){
      console.error('Error downloading JSON:', error);
    } finally {
      setIsDownloading(false);
    }
  }

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('importing')
      const res = await axios.post(`${apiURL}/superadmin/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      console.log(res.status, res.data)
      alert('Import successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Import failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full h-full p-3 text-gray-500">
      <div className="w-full flex justify-end gap-2">
        <button
        disabled={isDownloading}
          onClick={downloadJSON} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >{isDownloading ? 'Exporting...' : 'Export'}</button>

        <button onClick={handleClick} disabled={isUploading} className="px-4 py-2 border border-2 border-blue-500 text-blue-500 rounded hover:bg-slate-200 hover:text-blue-700">{isUploading ? 'Uploading...' : 'Import'}</button>
        <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      </div>
      <div className="w-full h-auto p-2">
        <p className="text-superAdminBlue text-sm font-semibold">This page allows the Super Admin to manage access control by assigning roles, permissions, and granted features with descriptions for specific tasks.</p>
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-auto hidden sm:flex rounded-lg bg-gray-100 text-gray-500 px-1">
          <div className="w-full h-auto flex">
            <h1 className="w-1/4 px-2 font-semibold text-sm py-1">Role</h1>
            <h1 className="w-1/4 px-2 font-semibold text-sm py-1">Permission</h1>
            <h1 className="w-1/4 px-2 font-semibold text-sm py-1">Granted Features</h1>
            <h1 className="w-1/4 px-2 font-semibold text-sm py-1">Description</h1>
          </div>
        </div>
        <div className="w-full flex-1 overflow-y-auto bg-white">
          {roles && Object.entries(roles).length > 0 ? (
            Object.entries(roles).map(([key, role], index) => (
              <div key={key} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} w-full rounded-lg h-auto flex flex-col sm:flex-row py-2 cursor-pointer my-1`}>
                <p className="w-full sm:w-1/4 px-2 flex gap-2 font-bold"><span className="font-bold block sm:hidden">Role:</span>{role.roleName}</p>
                <p className="w-full sm:w-1/4 px-2 flex gap-2">
                  <span className="font-bold block sm:hidden">Permission:</span>
                  <label
                    className="has-[:checked]:bg-green-500 bg-gray-300 relative inline-block h-7 w-14 cursor-pointer rounded-full transition [-webkit-tap-highlight-color:_transparent]"
                  >
                    <input 
                      className="peer sr-only" 
                      id="AcceptConditions" 
                      type="checkbox" 
                      disabled={isLoading}
                      checked={role.permission}
                      onChange={() => handleToggleChange(role.roleName, role.permission)}/>
                    <span
                      className="absolute inset-y-0 m-1 rounded-full peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent start-0 size-5 bg-gray-300 ring-[6px] ring-inset ring-white transition-all"
                    ></span>
                  </label>
                </p>
                <p className="w-full sm:w-1/4 px-2 flex gap-2"><span className="font-bold block sm:hidden">Grant Access:</span>{role.grantedAccess}</p>
                <p className="w-full sm:w-1/4 px-2 flex gap-2"><span className="font-bold block sm:hidden">Description:</span>{role.description}</p>
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
      </div>
    </section>
  );
};

export default AccessControl;
