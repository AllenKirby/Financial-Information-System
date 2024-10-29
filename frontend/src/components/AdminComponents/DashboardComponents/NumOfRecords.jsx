import axios from "axios";
import { useState, useEffect } from "react";
import { firestore } from "../../../config/firebase-config";
import { collection, query, doc, onSnapshot, where } from "firebase/firestore"
import { useSelector, useDispatch } from "react-redux";
import { setRecords } from "../../../redux/RecordsRedux";


const NumOfRecords = () => {

    const dispatch = useDispatch()
    const recordx = useSelector((state) => state.records)

    useEffect(() => {
        const getRecords = async () => {
            try{
                console.log(recordx)
                const storedRecords = sessionStorage.getItem('records')
                if(storedRecords){
                    console.log('if')
                    const recordData = JSON.parse(storedRecords)
                    dispatch(setRecords(recordData))
                    
                }else{
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getNumberOfRecords`, {
                    withCredentials: true
                    })
                    if(res.status === 200){
                        console.log('else')
                        const rec = res.data.records
                        console.log(rec)
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
        <div className="w-4/5 h-3/5 grid grid-cols-2 grid-rows-2 gap-4">
            <div className="rounded-lg overflow-hidden">
              <div className="px-4 py-2 w-full h-1/3 bg-amber-500 text-white">501 COB</div>
              <div className="bg-amber-500 h-full text-white flex justify-center text-4xl p-2">{recordx.DVno501COB ? recordx.DVno501COB.replace(/^0+/, '') : '0'}</div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <div className="px-4 py-2 w-full h-1/3 bg-amber-500 text-white">501 LFP</div>
              <div className="bg-amber-500 h-full text-white flex justify-center text-4xl p-2">{recordx.DVno501LFP ? recordx.DVno501LFP.replace(/^0+/, '') : '0'}</div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <div className="px-4 py-2 w-full h-1/3 bg-amber-500 text-white">501 CARP</div>
              <div className="bg-amber-500 h-full text-white flex justify-center text-4xl p-2">{recordx.DVno501CARP ? recordx.DVno501CARP.replace(/^0+/, '') : '0'}</div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <div className="px-4 py-2 w-full h-1/3 bg-amber-500 text-white text-sm">Contract Farming</div>
              <div className="bg-amber-500 h-full text-white flex justify-center text-4xl p-2">{recordx.DVnoContractFarming ? recordx.DVnoContractFarming.replace(/^0+/, '') : '0'}</div>
            </div>
          </div>
    )
}

export default NumOfRecords;