import { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 20 },
  section: { marginBottom: 10 },
  grid: { display: "flex", gap: 16 },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "block",
    textDecoration: "underline",
    color: "#3b82f6",
  },
  text: { marginBottom: 5 },
});

const MyWorkoutPDF = ({ diet }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>My Diet Plan</Text>
        <Text style={styles.subtitle}>{diet?.dietName}</Text>

        {/* Health Metrics Section */}
        {diet.health_metrics && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Health Metrics</Text>
            <View style={styles.grid}>
              {Object.entries(diet.health_metrics).map(([key, value]) => (
                <Text key={key} style={styles.text}>
                  <Text style={{ fontWeight: "bold" }}>{`${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:`}</Text>{" "}
                  {value}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Breakfast Section */}
        {diet.breakfast && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Breakfast</Text>
            <View style={styles.grid}>
              {Object.entries(diet.breakfast).map(([key, value]) => (
                <Text key={key} style={styles.text}>
                  <Text style={{ fontWeight: "bold" }}>{`${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:`}</Text>{" "}
                  {value}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Lunch Section */}
        {diet.lunch && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Lunch</Text>
            <View style={styles.grid}>
              {Object.entries(diet.lunch).map(([key, value]) => (
                <Text key={key} style={styles.text}>
                  <Text style={{ fontWeight: "bold" }}>{`${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:`}</Text>{" "}
                  {value}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Dinner Section */}
        {diet.dinner && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Dinner</Text>
            {Object.entries(diet.dinner).map(([key, value]) => (
              <Text key={key} style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{`${
                  key.charAt(0).toUpperCase() + key.slice(1)
                }:`}</Text>{" "}
                {value}
              </Text>
            ))}
          </View>
        )}

        {/* Before Sleep Section */}
        {diet.sleep && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Before Sleep</Text>
            <Text style={styles.text}>
              <Text style={{ fontWeight: "bold" }}>Sleep:</Text>{" "}
              {diet?.sleep.sleep}
            </Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

// function MyWorkoutContent({ diet }) {
//   return (
//     <>
//       <PDFDownloadLink
//         document={<MyWorkoutPDF diet={diet} />}
//         fileName="diet-plan.pdf"
//         style={{
//           backgroundColor: "#3b82f6",
//           color: "#ffffff",
//           padding: "10px 20px",
//           borderRadius: "5px",
//           textDecoration: "none",
//         }}
//       >
//         {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
//       </PDFDownloadLink>

//       <div id="diet-plan-content" style={{ display: "none" }}>
//         {/* Optionally, include content for on-screen display */}
//       </div>
//     </>
//   );
// }

export default MyWorkoutPDF;
