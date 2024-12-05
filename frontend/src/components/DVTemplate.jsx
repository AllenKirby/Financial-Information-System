import PropTypes from 'prop-types'
import { Page, Document, Text, View, StyleSheet } from '@react-pdf/renderer';

const DVTemplate = ({data}) => {
    const styles = StyleSheet.create({
        document: {
            fontFamily: 'Times-Roman'
        },
        page: {
            padding: 36,
            flexDirection: 'column',
        },
        header: {
            width: '100%',
            height: 60,
            display: 'flex',
            flexDirection: 'row',
        },
        logos: {
            width: '75%',
            height: '100%',
        },
        FDD: {
            width: '25%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        FundClusterCell: {
            width: '100%',
            height: '30%',
            fontSize: 7,
            padding: 2,
            borderTop: '1px solid black',   
            borderRight: '1px solid black', 
            borderLeft: '1px solid black'
        },
        FundCluster: {
            textAlign: 'center',
            fontSize: 8
        },
        DateCell: {
            width: '100%',
            height: '30%',
            fontSize: 7,
            padding: 2,
            borderTop: '1px solid black',   
            borderRight: '1px solid black', 
            borderLeft: '1px solid black'
        },
        Date: {
            textAlign: 'center',
            fontSize: 8
        },
        DVNoCell: {
            width: '100%',
            height: '40%',
            fontSize: 7,
            padding: 2,
            borderTop: '1px solid black',   
            borderRight: '1px solid black', 
            borderLeft: '1px solid black'
        },
        DVNo: {
            textAlign: 'center',
            fontSize: 10
        },
        title: {
            width: '100%',
            height: 20,
            textAlign: 'center',
            fontSize: 15,
            border: '1px solid black',
            fontWeight: '400'
        },
        MOPCell: {
            width: '100%',
            height: 25,
            flexDirection: 'row',
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black'
        },
        MOP: {
            width: '10%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 9,
            textAlign: 'center'
        },
        SelectMOP: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 20,
            gap: 8,
            fontSize: 8
        },
        OneMOP: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3
        },
        MOPBox: {
            width: 18,
            height: 11,
            border: '1px solid black'
        },
        PTO: {
            flexDirection: 'row',
            width: '100%',
            height: 25,
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black'
        },
        payee: {
            width: '50%',
            height: '100%',
            borderRight: '1px solid black',
            flexDirection: 'row',
        },
        payeeBox: {
            width: '20%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        payeeName: {
            width: '80%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10
        },
        tin: {
            width: '25%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 8,
            padding: 2
        },
        ors: {
            width: '25%',
            height: '100%',
            fontSize: 8,
            padding: 2
        },
        tinAndORS: {
            textAlign: 'center',
            fontSize: 10
        },
        addressCell: {
            width: '100%',
            height: 25,
            flexDirection: 'row',
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black'
        },
        addressBox: {
            width: '10%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid black',
            fontSize: 9,
        },
        addressName: {
            width: '90%',
            height: '100%',
            paddingLeft: 20,
            fontSize: 10,
            flexDirection: 'row',
            alignItems: 'center'
        },
        PRMA: {
            width: '100%',
            height: 15,
            flexDirection: 'row',
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black'
        },
        particulars: {
            width: '50%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ResCen: {
            width: '10%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        MP: {
            width: '15%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        amount: {
            width: '25%',
            height: '100%',
            fontSize: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        particularsTable: {
            width: '100%',
            height: 140,
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black',
            flexDirection: 'row'
        },
        particularsBox: {
            width: '50%',
            height: '100%',
            borderRight: '1px solid black',
            flexDirection: 'column'
        },
        rescenBox: {
            width: '10%',
            height: '100%',
            borderRight: '1px solid black',
        },
        MPBox: {
            width: '15%',
            height: '100%',
            borderRight: '1px solid black',
            flexDirection: 'column'
        },
        amountBox: {
            width: '25%',
            height: '100%',
        },
        particularsData: {
            width: '100%',
            height: '50%',
            fontSize: 8,
            padding: 3,
            textAlign: 'justify'
        },
        taxAndASA: {
            width: '100%',
            height: '50%'
        },
        tax: {
            width: '100%',
            height: '50%',
            fontSize: 8,
            padding: 3
        },
        ASA: {
            width: '100%',
            height: '50%',
            textAlign: 'center',
            fontSize: 8
        },
        ASAValue: {
            textAlign: 'left',
            width: '100%',
            height: '50%',
            padding: 3
        },
        amountLabel: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            height: '50%',
            fontSize: 10
        },
        rescenValue: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10
        },
        PesosSign1: {
            width: '100%',
            height: '50%',
            paddingTop: 3,
            alignItems: 'flex-end',
            fontSize: 10
        },
        PesosSign2: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            fontSize: 10
        },
        amountTotal: {
            width: '100%',
            height: '50%',
            padding: 3,
            alignItems: 'flex-end',
            fontSize: 10
        },
        amountDueBox: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            fontSize: 10,
        },
        totalTax: {
            width: '100%',
            height: '50%',
            alignItems: 'flex-end',
            fontSize: 10,
            padding: 3
        },
        amountDue: {
            width: '100%',
            height: '50%',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            fontSize: 10,
            padding: 3
        },
        boxA: {
            width: '100%',
            height: 40,
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black',
            flexDirection: 'column'
        },
        boxATitle: {
            flexDirection: 'row',
            width: '100%',
            height: '33.333333%'
        },
        A: {
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            fontSize: 9,
            paddingHorizontal: 2,
            width: '3%',
            textAlign: 'center'
        },
        AValue: {
            fontSize: 9,
            width: '97%'
        },
        nameAndOffice: {
            width: '100%',
            height: '66.666667%',
            fontSize: 10,
            textAlign: 'center'
        },
        office: {
            fontStyle: 'italic',
            fontWeight: 200
        },
        boxB: {
            width: '100%',
            height: 90,
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            flexDirection: 'column',
            borderBottom: '1px solid black'
        },
        boxBTitle: {
            flexDirection: 'row',
            width: '100%',
            height: '15%',
            borderBottom: '1px solid black',
        },
        B: {
            borderRight: '1px solid black',
            fontSize: 9,
            paddingHorizontal: 2,
            width: '3%',
            textAlign: 'center'
        },
        account: {
            width: '100%',
            height: '85%',
            flexDirection: 'row'
        },
        accountTitle: {
            width: '50%',
            height: '100%',
            flexDirection: 'column',
            borderRight: '1px solid black',
        },
        Ucode: {
            width: '16.6666667%',
            height: '100%',
            flexDirection: 'column',
            borderRight: '1px solid black',
        },
        debit: {
            width: '16.6666667%',
            height: '100%',
            flexDirection: 'column',
            borderRight: '1px solid black',
        },
        credit: {
            width: '16.6666667%',
            height: '100%',
            flexDirection: 'column'
        },
        accountHeader: {
            width: '100%',
            height: '15%',
            textAlign: 'center',
            fontSize: 9,
            borderBottom: '1px solid black'
        },
        accountTitles: {
            flexDirection: 'column',
            fontSize: 8,
            width: '100%',
            height: '85%',
            paddingHorizontal: 5,
            paddingVertical: 2
        },
        accTitles: {
            marginVertical: '1px' 
        },
        uacsCode: {
            flexDirection: 'column',
            fontSize: 8,
            width: '100%',
            height: '85%',
            paddingHorizontal: 5,
            paddingVertical: 2,
            textAlign: 'center'
        },
        debitValue: {
            flexDirection: 'column',
            fontSize: 8,
            width: '100%',
            height: '85%',
            paddingHorizontal: 5,
            paddingVertical: 2,
            textAlign: 'right'
        },
        debitAmount: {
            marginVertical: 3
        },
        creditValue: {
            flexDirection: 'column',
            fontSize: 8,
            width: '100%',
            height: '85%',
            justifyContent: 'flex-end'
        },
        creditBox: {
            width: '100%',
            height: '60%',
            textAlign: 'right',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
        },
        creditAmount: {
            marginVertical: 1
        },
        boxCandD: {
            width: '100%',
            height: 60,
            flexDirection: 'row',
            borderRight: '1px solid black',
            borderLeft: '1px solid black',
            borderBottom: '1px solid black',
        },
        boxC: {
            flexDirection: 'column',
            width: '50%',
            height: '100%',
            borderRight: '1px solid black',
        },
        boxCHeader: {
            flexDirection: 'row',
            width: '100%',
            height: '20%',
            borderBottom: '1px solid black',
        },
        boxCText: {
            fontSize: 9
        },
        C: {
            paddingLeft: 3,
            paddingRight: 6
        },
        boxD: {
            flexDirection: 'column',
            width: '50%',
            height: '100%',
        },
        boxCValues: {
            flexDirection: 'column',
            width: '100%',
            height: '80%',
            padding: 2,
            fontSize: 8
        },
        boxCData: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2
        },
        boxCBox: {
            width: 12,
            height: 12,
            borderTop: '1px solid black',
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            marginRight: 2
        },
        signature: {
            width: '100%',
            height: 30,
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            flexDirection: 'row'
        },
        signature1: {
            width: '50%',
            height: '100%',
            borderRight: '1px solid black',
            flexDirection: 'row'
        },
        signature2: {
            width: '50%',
            height: '100%',
            flexDirection: 'row'
        },
        signatureBox: {
            width: '20%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 8,
            alignItems: 'center',
            justifyContent: 'center'
        },
        signatureBox1: {
            width: '80%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9
        },
        printedName: {
            width: '100%',
            height: 20,
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            flexDirection: 'row'
        },
        boxE: {
            width: '100%',
            height: 100,
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
            flexDirection: 'row'
        },
        boxETitle: {
            width: '100%',
            height: '15%',
            borderBottom: '1px solid black',
            flexDirection: 'row'
        },
        boxEBox: {
            width: '70%',
            height: '100%',
            borderRight: '1px solid black',
        },
        E: {
            fontSize: 9,
            borderRight: '1px solid black',
            width: '10%',
            height: '100%',
            paddingHorizontal: 2,
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        ROP: {
            width: '90%',
            fontSize: 9,
            paddingHorizontal: 3
        },
        CDB: {
            width: '100%',
            height: '70%',
            borderBottom: '1px solid black',
            flexDirection: 'column'
        },
        CDB1: {
            flexDirection: 'row',
            width: '100%',
            height: '50%',
            borderBottom: '1px solid black',
        },
        CDB2: {
            flexDirection: 'row',
            width: '100%',
            height: '50%',
        },
        Check: {
            width: '14%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 7,
            padding: 2
        },
        checkValue: {
            width: '44%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 7
        },
        date: {
            width: '14%',
            height: '100%',
            borderRight: '1px solid black',
            fontSize: 7,
            padding: 2
        },
        bank: {
            width: '28%',
            height: '100%',
            fontSize: 7,
            padding: 2
        },
        OR: {
            width: '100%',
            height: '15%',
            fontSize: 9,
            paddingHorizontal: 2,
        },
        JD: {
            width: '30%',
            height: '100%',
            flexDirection: 'column'
        },
        jev: {
            width: '100%',
            height: '50%',
            borderBottom: '1px solid black',
            fontSize: 8,
            padding: 3
        },
        date1: {
            width: '100%',
            height: '50%',
            fontSize: 8,
            padding: 3
        },
        None: {
            marginTop: 10,
            textAlign: 'center'
        }
    })

    return (
        <Document >
            <Page style={styles.page} size="A4">
                <View style={styles.header}>
                    <View style={styles.logos}></View>
                    <View style={styles.FDD}>
                        <View style={styles.FundClusterCell}>
                            <Text>Fund Cluster:</Text>
                            <Text style={styles.FundCluster}>Contract Farming</Text>
                        </View>
                        <View style={styles.DateCell}>
                            <Text>Date:</Text>
                            <Text style={styles.Date}>October 24, 2024</Text>
                        </View>
                        <View style={styles.DVNoCell}>
                            <Text>DV No.:</Text>
                            <Text style={styles.DVNo}>501-2024-11-567</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.title}>
                    <Text>Disbursement Voucher</Text>
                </View>
                <View style={styles.MOPCell}>
                    <View style={styles.MOP}>
                        <Text>Mode of Payment</Text>
                    </View>
                    <View style={styles.SelectMOP}>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>MDS Check</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>Commercial Check</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>ADA</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>Others (Please Specify): </Text>
                            <Text>LCCA</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.PTO}>
                    <View style={styles.payee}>
                        <View style={styles.payeeBox}>
                            <Text>Payee</Text>
                        </View>
                        <View style={styles.payeeName}>
                            <Text>Allen Kirby V. Santileces</Text>
                        </View>
                    </View>
                    <View style={styles.tin}>
                        <Text>TIN/Employee No.:</Text>
                        <Text style={styles.tinAndORS}>123-123-122-243</Text>
                    </View>
                    <View style={styles.ors}>
                        <Text>ORS/BURS No.:</Text>
                        <Text style={styles.tinAndORS}>501-2024-11-546</Text>
                    </View>
                </View>
                <View style={styles.addressCell}>
                    <View style={styles.addressBox}>
                        <Text>Address</Text>
                    </View>
                    <View style={styles.addressName}>
                        <Text>Calauan, Laguna</Text>
                    </View>
                </View>
                <View style={styles.PRMA}>
                    <View style={styles.particulars}>
                        <Text>Particulars</Text>
                    </View>
                    <View style={styles.ResCen}>
                        <Text></Text>
                    </View>
                    <View style={styles.MP}>
                        <Text>MFO/PAP</Text>
                    </View>
                    <View style={styles.amount}>
                        <Text>Amount</Text>
                    </View>
                </View>
                <View style={styles.particularsTable}>
                    <View style={styles.particularsBox}>
                        <View style={styles.particularsData}>
                            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius at facilis illo facere sit rerum alias odio quasi culpa laboriosam dolorem perspiciatis voluptate, dignissimos, reprehenderit obcaecati quos, temporibus modi neque. Ullam, et! Neque, corrupti repudiandae facilis molestias reprehenderit, ex praesentium minus modi dolorem quo blanditiis delectus harum aperiam iure perspiciatis.</Text>
                        </View>
                        <View style={styles.taxAndASA}>
                            <View style={styles.tax}>
                                <Text>2000 x3% = 2000.00</Text>
                                <Text>2000 x3% = 2000.00</Text>
                            </View>
                            <View style={styles.ASA}>
                                <View style={styles.ASAValue}>
                                    <Text>ASA No.501-2024-296 Lopez SRIP</Text>
                                </View>
                                <View style={styles.amountLabel}>
                                    <Text>Amount Due</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rescenBox}>
                        <View style={styles.rescenValue}>
                            <Text>EOD</Text>
                        </View>
                    </View>
                    <View style={styles.MPBox}>
                        <View style={styles.PesosSign1}>
                            <Text>P</Text>
                        </View>
                        <View style={styles.PesosSign2}>
                            <Text>P</Text>
                        </View>
                    </View>
                    <View style={styles.amountBox}>
                        <View style={styles.amountTotal}>
                            <Text>20000</Text>
                        </View>
                        <View style={styles.amountDueBox}>
                            <View style={styles.totalTax}>
                                <Text>543</Text>
                            </View>
                            <View style={styles.amountDue}>
                                <Text>543</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.boxA}>
                    <View style={styles.boxATitle}>
                        <View style={styles.A}>
                            <Text>A</Text>
                        </View>
                        <View style={styles.AValue}>
                            <Text> Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</Text>
                        </View>
                    </View>
                    <View style={styles.nameAndOffice}>
                        <Text>ERWIN M. LUCELA</Text>
                        <Text style={styles.office}>Division Manager A, EOD</Text>
                    </View>
                </View>
                <View style={styles.boxB}>
                    <View style={styles.boxBTitle}>
                        <View style={styles.B}>
                            <Text>B</Text>
                        </View>
                        <View style={styles.AValue}>
                            <Text> Accounting Entry: </Text>
                        </View>
                    </View>
                    <View style={styles.account}>
                        <View style={styles.accountTitle}>
                            <View style={styles.accountHeader}>
                                <Text>Account Title</Text>
                            </View>
                            <View style={styles.accountTitles}>
                                <Text style={styles.accTitles}>Training Expenses</Text>
                                <Text style={styles.accTitles}>Office Supplies Inventory</Text>
                                <Text style={styles.accTitles}>Office Supplies Inventory</Text>
                                <Text style={styles.accTitles}>Due to BIR(3%)</Text>
                                <Text style={styles.accTitles}>Due to BIR(2%)</Text>
                                <Text style={styles.accTitles}>Cash in Bank</Text>
                            </View>
                        </View>
                        <View style={styles.Ucode}>
                            <View style={styles.accountHeader}>
                                <Text>UACS Code</Text>
                            </View>
                            <View style={styles.uacsCode}>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                            </View>
                        </View>
                        <View style={styles.debit}>
                            <View style={styles.accountHeader}>
                                <Text>Debit</Text>
                            </View>
                            <View style={styles.debitValue}>
                                <Text style={styles.debitAmount}>2000</Text>
                                <Text style={styles.debitAmount}>700</Text>
                            </View>
                        </View>
                        <View style={styles.credit}>
                            <View style={styles.accountHeader}>
                                <Text>Credit</Text>
                            </View>
                            <View style={styles.creditValue}>
                                <View style={styles.creditBox}>
                                    <Text style={styles.creditAmount}>7000</Text>
                                    <Text style={styles.creditAmount}>9000</Text>
                                    <Text style={styles.creditAmount}>27213</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.boxCandD}>
                    <View style={styles.boxC}>
                        <View style={styles.boxCHeader}>
                            <View style={styles.boxCText}>
                                <Text style={styles.C}>C.</Text>
                            </View>
                            <View style={styles.boxCText}>
                                <Text>Certified:</Text>
                            </View>
                        </View>
                        <View style={styles.boxCValues}>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Cash Available</Text>
                            </View>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Subject to Authority to Debit Account (when applicable)</Text>
                            </View>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Supporting documents complete and amount claimed proper</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.boxD}>
                        <View style={styles.boxCHeader}>
                            <View style={styles.boxCText}>
                                <Text style={styles.C}>D.</Text>
                            </View>
                            <View style={styles.boxCText}>
                                <Text>Approved for Payment</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.signature}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Signature</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Signature</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                </View>
                <View style={styles.printedName}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Printed Name</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Printed Name</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                </View>
                <View style={styles.signature}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Position</Text>
                        </View>
                        <View style={styles.signatureBox1}>
                            <Text>Chief Accountant B</Text>
                            <Text>Head, Accounting Unit/Authorized Representative</Text>
                        </View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Position</Text>
                        </View>
                        <View style={styles.signatureBox1}>
                            <Text>Rergional Manager A</Text>
                            <Text>Agency Head/Authorized Representative</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxE}>
                    <View style={styles.boxEBox}>
                        <View style={styles.boxETitle}>
                            <View style={styles.E}>
                                <Text>E.</Text>
                            </View>
                            <View style={styles.ROP}>
                                <Text>Receipt of Payment</Text>
                            </View>
                        </View>
                        <View style={styles.CDB}>
                            <View style={styles.CDB1}>
                                <View style={styles.Check}>
                                    <Text>Check/ADA No.:</Text>
                                </View>
                                <View style={styles.checkValue}>
                                    <Text></Text>
                                </View>
                                <View style={styles.date}>
                                    <Text>Date: </Text>
                                </View>
                                <View style={styles.bank}>
                                    <Text>Bank Name & Account Number: </Text>
                                </View>
                            </View>
                            <View style={styles.CDB2}>
                                <View style={styles.Check}>
                                    <Text>Signature</Text>
                                </View>
                                <View style={styles.checkValue}>
                                    <Text></Text>
                                </View>
                                <View style={styles.date}>
                                    <Text>Date: </Text>
                                </View>
                                <View style={styles.bank}>
                                    <Text>Printed Name</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.OR}>
                            <Text>Official Receipt No. & Date/Other Documents</Text>
                        </View>
                    </View>
                    <View style={styles.JD}>
                        <View style={styles.jev}>
                            <Text>JEV No.</Text>
                            <Text style={styles.None}>N/A</Text>
                        </View>
                        <View style={styles.date1}>
                            <Text>Date</Text>
                            <Text style={styles.None}>N/A</Text>
                        </View>
                    </View>
                </View>
            </Page>
            <Page style={styles.page} size="A4">
                <View style={styles.header}>
                    <View style={styles.logos}></View>
                    <View style={styles.FDD}>
                        <View style={styles.FundClusterCell}>
                            <Text>Fund Cluster:</Text>
                            <Text style={styles.FundCluster}>Contract Farming</Text>
                        </View>
                        <View style={styles.DateCell}>
                            <Text>Date:</Text>
                            <Text style={styles.Date}>October 24, 2024</Text>
                        </View>
                        <View style={styles.DVNoCell}>
                            <Text>DV No.:</Text>
                            <Text style={styles.DVNo}>501-2024-11-567</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.title}>
                    <Text>Disbursement Voucher</Text>
                </View>
                <View style={styles.MOPCell}>
                    <View style={styles.MOP}>
                        <Text>Mode of Payment</Text>
                    </View>
                    <View style={styles.SelectMOP}>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>MDS Check</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>Commercial Check</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>ADA</Text>
                        </View>
                        <View style={styles.OneMOP}>
                            <View style={styles.MOPBox}></View>
                            <Text>Others (Please Specify): </Text>
                            <Text>LCCA</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.PTO}>
                    <View style={styles.payee}>
                        <View style={styles.payeeBox}>
                            <Text>Payee</Text>
                        </View>
                        <View style={styles.payeeName}>
                            <Text>Allen Kirby V. Santileces</Text>
                        </View>
                    </View>
                    <View style={styles.tin}>
                        <Text>TIN/Employee No.:</Text>
                        <Text style={styles.tinAndORS}>123-123-122-243</Text>
                    </View>
                    <View style={styles.ors}>
                        <Text>ORS/BURS No.:</Text>
                        <Text style={styles.tinAndORS}>501-2024-11-546</Text>
                    </View>
                </View>
                <View style={styles.addressCell}>
                    <View style={styles.addressBox}>
                        <Text>Address</Text>
                    </View>
                    <View style={styles.addressName}>
                        <Text>Calauan, Laguna</Text>
                    </View>
                </View>
                <View style={styles.PRMA}>
                    <View style={styles.particulars}>
                        <Text>Particulars</Text>
                    </View>
                    <View style={styles.ResCen}>
                        <Text></Text>
                    </View>
                    <View style={styles.MP}>
                        <Text>MFO/PAP</Text>
                    </View>
                    <View style={styles.amount}>
                        <Text>Amount</Text>
                    </View>
                </View>
                <View style={styles.particularsTable}>
                    <View style={styles.particularsBox}>
                        <View style={styles.particularsData}>
                            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius at facilis illo facere sit rerum alias odio quasi culpa laboriosam dolorem perspiciatis voluptate, dignissimos, reprehenderit obcaecati quos, temporibus modi neque. Ullam, et! Neque, corrupti repudiandae facilis molestias reprehenderit, ex praesentium minus modi dolorem quo blanditiis delectus harum aperiam iure perspiciatis.</Text>
                        </View>
                        <View style={styles.taxAndASA}>
                            <View style={styles.tax}>
                                <Text>2000 x3% = 2000.00</Text>
                                <Text>2000 x3% = 2000.00</Text>
                            </View>
                            <View style={styles.ASA}>
                                <View style={styles.ASAValue}>
                                    <Text>ASA No.501-2024-296 Lopez SRIP</Text>
                                </View>
                                <View style={styles.amountLabel}>
                                    <Text>Amount Due</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rescenBox}>
                        <View style={styles.rescenValue}>
                            <Text>EOD</Text>
                        </View>
                    </View>
                    <View style={styles.MPBox}>
                        <View style={styles.PesosSign1}>
                            <Text>P</Text>
                        </View>
                        <View style={styles.PesosSign2}>
                            <Text>P</Text>
                        </View>
                    </View>
                    <View style={styles.amountBox}>
                        <View style={styles.amountTotal}>
                            <Text>20000</Text>
                        </View>
                        <View style={styles.amountDueBox}>
                            <View style={styles.totalTax}>
                                <Text>543</Text>
                            </View>
                            <View style={styles.amountDue}>
                                <Text>543</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.boxA}>
                    <View style={styles.boxATitle}>
                        <View style={styles.A}>
                            <Text>A</Text>
                        </View>
                        <View style={styles.AValue}>
                            <Text> Certified:  Expenses/Cash Advance necessary,  lawful and  incurred under my direct supervision.</Text>
                        </View>
                    </View>
                    <View style={styles.nameAndOffice}>
                        <Text>ERWIN M. LUCELA</Text>
                        <Text style={styles.office}>Division Manager A, EOD</Text>
                    </View>
                </View>
                <View style={styles.boxB}>
                    <View style={styles.boxBTitle}>
                        <View style={styles.B}>
                            <Text>B</Text>
                        </View>
                        <View style={styles.AValue}>
                            <Text> Accounting Entry: </Text>
                        </View>
                    </View>
                    <View style={styles.account}>
                        <View style={styles.accountTitle}>
                            <View style={styles.accountHeader}>
                                <Text>Account Title</Text>
                            </View>
                            <View style={styles.accountTitles}>
                                <Text style={styles.accTitles}>Training Expenses</Text>
                                <Text style={styles.accTitles}>Office Supplies Inventory</Text>
                                <Text style={styles.accTitles}>Office Supplies Inventory</Text>
                                <Text style={styles.accTitles}>Due to BIR(3%)</Text>
                                <Text style={styles.accTitles}>Due to BIR(2%)</Text>
                                <Text style={styles.accTitles}>Cash in Bank</Text>
                            </View>
                        </View>
                        <View style={styles.Ucode}>
                            <View style={styles.accountHeader}>
                                <Text>UACS Code</Text>
                            </View>
                            <View style={styles.uacsCode}>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                                <Text style={styles.accTitles}>5-02-02-010</Text>
                            </View>
                        </View>
                        <View style={styles.debit}>
                            <View style={styles.accountHeader}>
                                <Text>Debit</Text>
                            </View>
                            <View style={styles.debitValue}>
                                <Text style={styles.debitAmount}>2000</Text>
                                <Text style={styles.debitAmount}>700</Text>
                            </View>
                        </View>
                        <View style={styles.credit}>
                            <View style={styles.accountHeader}>
                                <Text>Credit</Text>
                            </View>
                            <View style={styles.creditValue}>
                                <View style={styles.creditBox}>
                                    <Text style={styles.creditAmount}>7000</Text>
                                    <Text style={styles.creditAmount}>9000</Text>
                                    <Text style={styles.creditAmount}>27213</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.boxCandD}>
                    <View style={styles.boxC}>
                        <View style={styles.boxCHeader}>
                            <View style={styles.boxCText}>
                                <Text style={styles.C}>C.</Text>
                            </View>
                            <View style={styles.boxCText}>
                                <Text>Certified:</Text>
                            </View>
                        </View>
                        <View style={styles.boxCValues}>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Cash Available</Text>
                            </View>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Subject to Authority to Debit Account (when applicable)</Text>
                            </View>
                            <View style={styles.boxCData}>
                                <View style={styles.boxCBox}></View> 
                                <Text>Supporting documents complete and amount claimed proper</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.boxD}>
                        <View style={styles.boxCHeader}>
                            <View style={styles.boxCText}>
                                <Text style={styles.C}>D.</Text>
                            </View>
                            <View style={styles.boxCText}>
                                <Text>Approved for Payment</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.signature}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Signature</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Signature</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                </View>
                <View style={styles.printedName}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Printed Name</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Printed Name</Text>
                        </View>
                        <View style={styles.signatureBox1}></View>
                    </View>
                </View>
                <View style={styles.signature}>
                    <View style={styles.signature1}>
                        <View style={styles.signatureBox}>
                            <Text>Position</Text>
                        </View>
                        <View style={styles.signatureBox1}>
                            <Text>Chief Accountant B</Text>
                            <Text>Head, Accounting Unit/Authorized Representative</Text>
                        </View>
                    </View>
                    <View style={styles.signature2}>
                        <View style={styles.signatureBox}>
                            <Text>Position</Text>
                        </View>
                        <View style={styles.signatureBox1}>
                            <Text>Rergional Manager A</Text>
                            <Text>Agency Head/Authorized Representative</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.boxE}>
                    <View style={styles.boxEBox}>
                        <View style={styles.boxETitle}>
                            <View style={styles.E}>
                                <Text>E.</Text>
                            </View>
                            <View style={styles.ROP}>
                                <Text>Receipt of Payment</Text>
                            </View>
                        </View>
                        <View style={styles.CDB}>
                            <View style={styles.CDB1}>
                                <View style={styles.Check}>
                                    <Text>Check/ADA No.:</Text>
                                </View>
                                <View style={styles.checkValue}>
                                    <Text></Text>
                                </View>
                                <View style={styles.date}>
                                    <Text>Date: </Text>
                                </View>
                                <View style={styles.bank}>
                                    <Text>Bank Name & Account Number: </Text>
                                </View>
                            </View>
                            <View style={styles.CDB2}>
                                <View style={styles.Check}>
                                    <Text>Signature</Text>
                                </View>
                                <View style={styles.checkValue}>
                                    <Text></Text>
                                </View>
                                <View style={styles.date}>
                                    <Text>Date: </Text>
                                </View>
                                <View style={styles.bank}>
                                    <Text>Printed Name</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.OR}>
                            <Text>Official Receipt No. & Date/Other Documents</Text>
                        </View>
                    </View>
                    <View style={styles.JD}>
                        <View style={styles.jev}>
                            <Text>JEV No.</Text>
                            <Text style={styles.None}>N/A</Text>
                        </View>
                        <View style={styles.date1}>
                            <Text>Date</Text>
                            <Text style={styles.None}>N/A</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

DVTemplate.propTypes = {
    data: PropTypes.object.isRequired
}

export default DVTemplate