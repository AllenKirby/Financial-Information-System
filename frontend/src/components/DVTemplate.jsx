import PropTypes from 'prop-types'
import { Page, Document, Text, View, StyleSheet } from '@react-pdf/renderer';

const DVTemplate = ({data}) => {

    const styles = StyleSheet.create({
        document: {
            fontFamily: 'Times-Roman'
        },
        page: {
            padding: 36,
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
            </Page>
        </Document>
    )
}

DVTemplate.propTypes = {
    data: PropTypes.object.isRequired
}

export default DVTemplate