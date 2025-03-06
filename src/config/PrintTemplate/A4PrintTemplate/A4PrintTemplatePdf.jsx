import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fb4d30",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "semibold",
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
  },
});

// Create Document Component
const A4PrintTemplatePdf = ({ data, profileData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Image
          style={{ width: 100, height: 100 }}
          src={profileData?.companyLogo}
        />
      </View> */}
      <View>
        <Text style={styles.title}>{profileData?.name}</Text>
      </View>

      {/* Receipt Info */}
      <View style={styles.section}>
        <Text style={styles.text}>
          <Text style={styles.bold}>Receipt No: </Text>
          {data?.receipt_no}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Date: </Text>
          {moment(data?.transaction).format("DD-MM-YYYY")}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Currency: BDT </Text>
        </Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.section}>
        <Text style={styles.bold}>Payment Summary</Text>
        <View style={styles.row}>
          <Text>Total Cost: </Text>
          <Text>
            {parseInt(data?.packageFee) + parseInt(data?.admissionFee)} BDT
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Total Discount: </Text>
          <Text>{data?.discount} BDT</Text>
        </View>
        <View style={styles.row}>
          <Text>Total Received: </Text>
          <Text>
            {parseInt(data?.packageFee) +
              parseInt(data?.admissionFee) -
              parseInt(data?.discount)}{" "}
            BDT
          </Text>
        </View>
        <Text style={{ color: "green", fontWeight: "bold", marginTop: 5 }}>
          PAID
        </Text>
      </View>

      {/* Member Information */}
      <View style={styles.section}>
        <Text style={styles.bold}>Member Information</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Name: </Text>
          {data?.member_name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Contact: </Text>
          {data?.contact_no}
        </Text>
      </View>

      {/* Package Details */}
      <View style={styles.section}>
        <Text style={styles.bold}>Package Details</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Package Name: </Text>
          {data?.package_name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Validity: </Text>
          {data?.start_date} to {data?.end_date}
        </Text>
        <View style={styles.row}>
          <Text>Admission Fee: </Text>
          <Text>{data?.admissionFee} BDT</Text>
        </View>
        <View style={styles.row}>
          <Text>Package Fee: </Text>
          <Text>{data?.packageFee} BDT</Text>
        </View>

        <View style={styles.row}>
          <Text>Total Cost: </Text>
          <Text>
            {parseInt(data?.packageFee) +
              parseInt(data?.admissionFee) -
              parseInt(data?.discount)}
            BDT
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.subTitle}>{profileData?.address}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.subTitle}>{profileData?.mobile}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.subTitle}>{profileData?.email}</Text>
      </View>
    </Page>
  </Document>
);

export default A4PrintTemplatePdf;
