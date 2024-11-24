import axios from "axios";
import { useEffect } from "react";
import { firestore } from "../../../config/firebase-config";
import { doc, onSnapshot } from "firebase/firestore"
import { useSelector, useDispatch } from "react-redux";
import { setRecords } from "../../../redux/RecordsRedux";
import { useAuthContext } from "../../../hooks/useAuthContext";
import PropTypes from 'prop-types'


const NumOfRecords = ({modal}) => {
    const { user } = useAuthContext()
    const dispatch = useDispatch()
    const recordx = useSelector((state) => state.records)

    useEffect(() => {
        const getRecords = async () => {
            try{
                const storedRecords = sessionStorage.getItem('records')
                if(storedRecords){
                    const recordData = JSON.parse(storedRecords)
                    dispatch(setRecords(recordData))
                    
                }else{
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getNumberOfRecords`, {
                    withCredentials: true
                    })
                    if(res.status === 200){
                        const rec = res.data.records
                        sessionStorage.setItem('records', JSON.stringify(rec))
                        dispatch(setRecords(rec))
                    }
                }
            }catch(error){
                console.log("Error on numofrecords (admin)", error)
            }
        }
        getRecords()
        const year = new Date().getFullYear()
        const numberRecordsCollection = doc(firestore, 'NumberOfRecords', year.toString())
        const unsubscribe = onSnapshot(numberRecordsCollection, (snapshot) => {
            if(snapshot.exists()){
                const snapData = snapshot.data()
                sessionStorage.setItem('records', JSON.stringify(snapshot.data()))
                dispatch(setRecords(snapData))
            }else{
                console.log("No such document!");
            }
        }, (error) => {
            console.error("Error fetching formData: ", error);
        })
        return () => unsubscribe()
    }, [])


    return (
        <div className="w-full h-full flex gap-3">
            <button onClick={() => modal('501 COB')} className="text-left w-3/12 rounded-lg overflow-hidden border-2 py-2 px-4">
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} w-full h-1/3 text-sm`}>501 COB</div>
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} h-2/3 text-4xl font-bold`}>{recordx.DVno501COB ? recordx.DVno501COB.replace(/^0+/, '') : '0'}</div>
            </button>
            <button onClick={() => modal('501 LFP')} className="text-left w-3/12 rounded-lg overflow-hidden border-2 py-2 px-4">
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} w-full h-1/3 text-sm`}>501 LFP</div>
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} h-2/3 text-4xl font-bold`}>{recordx.DVno501LFP ? recordx.DVno501LFP.replace(/^0+/, '') : '0'}</div>
            </button>
            <button onClick={() => modal('501 CARP')} className="text-left w-3/12 rounded-lg overflow-hidden border-2 py-2 px-4">
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} w-full h-1/3 text-sm`}>501 CARP</div>
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} h-2/3 text-4xl font-bold`}>{recordx.DVno501CARP ? recordx.DVno501CARP.replace(/^0+/, '') : '0'}</div>
            </button>
            <button onClick={() => modal('Contract Farming')} className="text-left w-3/12 rounded-lg overflow-hidden border-2 py-2 px-4">
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} w-full h-1/3 text-sm`}>Contract Farming</div>
              <div className={`${user?.role === '1' ? 'text-customgreen' : 'text-BOGreen'} h-2/3 text-4xl font-bold`}>{recordx.DVnoContractFarming ? recordx.DVnoContractFarming.replace(/^0+/, '') : '0'}</div>
            </button>
          </div>
    )
}

NumOfRecords.propTypes = {
    modal: PropTypes.func.isRequired
}

export default NumOfRecords;