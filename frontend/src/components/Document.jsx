const Document = () => {
  return (
    <section id='pdf' className='w-a4-width h-a4-height text-black text-xs'>
      <header className='w-full h-auto flex'>
        <div className='w-1/4 h-28'></div>
        <div className='w-2/4 h-28'></div>
        <div className='w-1/4 border-t-2 border-r-2 border-l-2 border-black h-28 flex flex-col'>
          <div className='w-full h-1/3 border-b-2 border-black flex items-center'>Fund Cluster: 501 LFP</div>
          <div className='w-full h-1/3 border-b-2 border-black flex items-center'>Date: September 29, 2024</div>
          <div className='w-full h-1/3 flex items-center'>DV No. 501-2024-09-507</div>
        </div>
      </header>
      <body>
        <div className='w-full h-9 flex border-2 border-black'>
          <div className='w-20 border-r-2 border-black flex items-center justify-center'>Mode of <br/> Payment</div>
          <div className='w-5/6 py-2 flex gap-3 px-7'>
            <div className='flex items-center justify-center'>
              <input type="checkbox" className='w-5 h-5'/>
              <label>MDS Check</label>
            </div>
            <div className='flex items-center justify-center'>
              <input type="checkbox" className='w-5 h-5'/>
              <label>Commercial Check</label>
            </div>
            <div className='flex items-center justify-center'>
              <input type="checkbox" className='w-5 h-5'/>
              <label>ADA</label>
            </div>
            <div className='flex items-center justify-center'>
              <input type="checkbox" className='w-5 h-5'/>
              <label>Others (Please Specify)</label>
            </div>
          </div>
        </div>
        <div className='w-full h-9 flex border-l-2 border-r-2 border-b-2 border-black'>
          <div className='w-20 border-r-2 border-black flex items-center justify-center px-9'>Payee</div>
          <div className='w-3/6 px-5 border-r-2 border-black flex items-center justify-center'>MAKU OFFICE AND SCHOOL SUPPLIES TRADING</div>
          <div className='w-full flex'>
            <div className='w-1/2 px-2 border-r-2 border-black py-1'>
              <div className=''>TIN/Employee No.: </div>
              <div className=' text-center'>NON VAT 624-177-117-000</div>
            </div>
            <div className="w-1/2 px-2 py-1">
              <div>ORS/BURS No.:  </div>
              <div className='text-center'>501-2024-09-408</div>
            </div>
          </div>
        </div>
        <div className='w-full h-7 flex border-l-2 border-r-2 border-b-2 border-black'>
          <div className='w-20 border-r-2 border-black flex items-center justify-center px-9'>Address</div>
          <div className='w-auto h-full flex items-center justify-center px-3'>Sta. Cruz, Laguna</div>
        </div>
        <div className='w-full h-60 flex border-l-2 border-r-2 border-b-2 border-black'>
            <div className='w-72 border-r-2 border-black flex-col'>
              <div className="w-full text-center border-b-2 border-black">Particulars</div>
              <div className="w-full h-3/6 text-justify px-1 pb-2">To payment of Identity Poloshirt (50 pcs.) for the conduct of Orientation and Basic Training on the Application of Building Information Modeling (BIM) for the Evaluation of Bids of Project under the Design and Build Scheme on August 29-30, 2024 as per attached supporting documents  in the amount of - - </div>
              <div className="flex gap-3 px-3 py-1">
                <div>24,900</div>
                <div>x 3%</div>
                <div>=</div>
                <div>747.00</div>
              </div>
              <div className="flex gap-3 px-3 py-1">
                <div>24,900</div>
                <div>x 2%</div>
                <div>=</div>
                <div>498.00</div>
              </div>
              <div className="px-2 py-1">ASA No.501-2024-296 Lopez SRIP</div>
              <div className="w-full flex items-center justify-center font-bold py-1">Amount Due</div>
            </div>
            <div className='w-36 border-r-2 border-black flex-col'>
              <div className="w-full text-center border-b-2 border-black">Responsibilty Center</div>
              <div className="w-full h-3/6 flex items-center justify-center p-1">EOD</div>
            </div>
            <div className='w-32 border-r-2 border-black'>
              <div className="w-full text-center border-b-2 border-black">MFO/PAP</div>
              <div className="w-full h-3/6 flex items-center justify-center p-2"></div>
            </div>
            <div className='w-60'>
              <div className="w-full text-center border-b-2 border-black">Amount</div>
              <div className="w-full h-3/6 flex items-center justify-end p-1">24,900</div>
              <div className="w-full h-24 flex justify-between items-end font-bold">
                <div>₱</div>
                <div>23.655</div>
              </div>
            </div>
        </div>
        <div className="w-full h-16 flex flex-col border-l-2 border-r-2 border-b-2 border-black">
            <div className="w-full flex">
                <div className="p-1 border-r-2 border-b-2 border-black font-bold">A.</div>
                <div className="flex items-center px-2">Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</div>
            </div>
            <div className="w-full text-center font-bold underline">ERWIN M. LUCELA</div>
            <div className="w-full text-center italic">Division Manager A, EOD</div>
        </div>
        <div className="h-32 w-full border-l-2 border-r-2 border-b-2 border-black">
            <div className="w-full border-b-2 border-black">
                <div className="p-1 w-6 border-r-2 border-black font-bold">B.</div>
            </div>
            <div className="w-full h-full flex">
                <div className="w-2/5 h-[100px] border-r-2 border-black">
                    <div className="w-full text-center border-b-2 border-black">Account Title</div>
                    <div className="w-full pt-1 pl-5">Training Expenses</div>
                    <div className="w-full pt-1 pl-5">Due to BIR(3%)</div>
                    <div className="w-full pt-1 pl-5">Due to BIR(2%)</div>
                    <div className="w-full pt-1 pl-5">Cash in Back</div>
                </div>
                <div className="w-1/5 h-[100px] border-r-2 border-black">
                    <div className="w-full text-center border-b-2 border-black">UACS Code</div>
                    <div className="w-full pt-1 text-center">5-02-02-010</div>
                    <div className="w-full pt-1 text-center">2 02 01 010</div>
                    <div className="w-full pt-1 text-center">2 02 01 010</div>
                    <div className="w-full pt-1 text-center">1 01 02 020</div>
                </div>
                <div className="w-1/5 h-[100px] border-r-2 border-black">
                    <div className="w-full text-center border-b-2 border-black">Debit</div>
                    <div className="w-full pt-1 text-end px-2">24,900</div>
                </div>
                <div className="w-1/5 h-[100px] border-black">
                    <div className="w-full text-center border-b-2 border-black">Credit</div>
                    <div className="w-full pt-1 text-end px-2">0</div>
                    <div className="w-full pt-1 text-end px-2">747.00</div>
                    <div className="w-full pt-1 text-end px-2">498.00</div>
                    <div className="w-full pt-1 text-end px-2">23,655.00</div>
                </div>
            </div>
        </div>
        <div className="w-full flex h-28 border-l-2 border-b-2 border-black">
            <div className="w-1/2 border-r-2 border-black">
                <div className="w-full flex border-b-2 border-black">
                    <div className="border-r-2 border-black p-1">C.</div>
                    <div className="flex items-center px-2">Certified:</div>
                </div> 
                <div className='pt-1 flex items-center px-2'>
                    <input type="checkbox" className='w-5 h-5 mr-2'/>
                    <label>Cash Available</label>
                </div>
                <div className='pt-1 flex items-center px-2'>
                    <input type="checkbox" className='w-5 h-5 mr-2'/>
                    <label>Subject to Authority to Debit Account (when applicable)</label>
                </div>
                <div className='pt-1 flex items-center px-2'>
                    <input type="checkbox" className='w-5 h-5 mr-2'/>
                    <label>Supporting Documents complete amount claimed proper</label>
                </div>
            </div>
            <div className="w-1/2 border-r-2 border-black">
                <div className="w-full flex border-b-2 border-black">
                    <div className="border-r-2 border-black p-1">D.</div>
                    <div className="flex items-center px-2">Approved for Payment</div>
                </div> 
            </div>
        </div>
        <div className="w-full flex h-[147px] border-l-2 border-r-2 border-b-2 border-black">
            <div className="w-1/2 flex flex-col border-r-2 border-black">
                <div className="w-full flex border-b-2 border-black">
                    <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                    <div className="w-5/6"></div>
                </div>
                <div className="w-full flex border-b-2 border-black">
                    <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                    <div className="w-5/6 font-bold text-sm flex items-center justify-center">JEMMELA ANNE V. MASICAT</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black">Position</div>
                    <div className="w-5/6 text-center">Chief Corporate Accountant B</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black"></div>
                    <div className="w-5/6 text-center">Head, Accounting Unit/Authorized Representative</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black"></div>
                    <div className="w-5/6 text-center flex gap-7 items-center justify-center">
                        <div>AIL-</div>
                        <div>BEM-</div>
                    </div>
                </div>
                <div className="w-full flex">
                    <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                    <div className="w-5/6 text-center"></div>
                </div>
            </div>
            <div className="w-1/2">
                <div className="w-full flex border-b-2 border-black">
                    <div className="w-1/6 border-r-2 border-black py-2">Signature</div>
                    <div className="w-5/6"></div>
                </div>
                <div className="w-full flex border-b-2 border-black">
                    <div className="w-1/6 border-r-2 border-black">Printed Name</div>
                    <div className="w-5/6 font-bold text-sm flex items-center justify-center">ROBERTO J. DELA CRUZ</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black">Position</div>
                    <div className="w-5/6 text-center">Regional Manager A</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black"></div>
                    <div className="w-5/6 text-center">Agency Head/Authorized Representative</div>
                </div>
                <div className="w-full border-b-2 flex border-black">
                    <div className="w-1/6 border-r-2 border-black"></div>
                    <div className="w-5/6 text-center flex gap-7 items-center justify-center text-white">dasd</div>
                </div>
                <div className="w-full flex">
                    <div className="w-1/6 border-r-2 py-1 border-black">Date</div>
                    <div className="w-5/6 text-center"></div>
                </div>
            </div>
        </div>
        <div className="w-full flex h-30 border-l-2 border-r-2 border-b-2 border-black">
            <div className="w-3/4 border-r-2 border-black">
                <div className="flex border-b-2 border-black">
                    <div className="p-1 border-r-2 border-black">E.</div>
                    <div className="flex items-center px-2">Receipt of Payment</div>
                </div>
                <div className="w-full flex-col">
                    <div className="h-2/3 py- flex border-b-2 border-black">
                        <div className="w-1/6 border-r-2 border-black">Check/ADA No. :</div>
                        <div className="w-2/6 border-r-2 border-black"></div>
                        <div className="w-1/6 border-r-2 border-black">Date: </div>
                        <div className="w-2/6 flex-col">
                            <div className="w-full">Bank Name & Account Number:</div>
                            <div className="w-full text-center">LBP Account No. 0242-1113-46</div>
                        </div>
                    </div>
                    <div className="h-1/3 flex">
                        <div className="w-1/6 border-r-2 border-black">Signature: </div>
                        <div className="w-2/6 border-r-2 border-black"></div>
                        <div className="w-1/6 border-r-2 border-black">Date: </div>
                        <div className="w-2/6 flex-col"></div>
                    </div>
                </div>
            </div>
            <div className="w-1/4 flex-col">
                <div className="w-full border-b-2 border-black">
                    <div className="flex items-center p-1">JEV No.</div>
                    <div className="text-center p-1">N/A</div>
                </div>
                <div className="w-full p-1">Date: N/A</div>
            </div>
        </div>
        <div className="w-full p-1 border-l-2 border-r-2 border-b-2 border-black">Official Receipt No. & Date/Other Documents</div>
      </body>
    </section>
  )
}

export default Document