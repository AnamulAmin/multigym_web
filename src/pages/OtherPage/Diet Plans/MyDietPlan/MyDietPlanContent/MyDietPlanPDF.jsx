import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { backgroundColor: "#f3f4f6", padding: 20 },
  section: { marginBottom: 15 },
  title: {
    fontSize: 24,
    fontWeight: "extrabold",
    color: "#3b82f6",
    textAlign: "center",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
  },
  healthMetrics: {
    width: "33%",
    backgroundColor: "#6B7280",
    padding: 10,
    color: "#f3f4f6",
    fontSize: 10,
    justifyContent: "space-between",
  },
  mealsColumn: {
    width: "67%",
    backgroundColor: "#f3f4f6",
    border: "1px solid #6B7280",
    borderLeft: 0,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f3f4f6",
    backgroundColor: "#6B7280",
    padding: 8,
    marginBottom: 10,
    textAlign: "left",
  },
  healthMetricText: {
    marginBottom: 5,
    fontSize: 11,
  },
  mealText: {
    fontSize: 10,
    marginBottom: 6,
    paddingLeft: 5,
    textAlign: "left",
  },
  address: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },

  // Second Page Specific Styles for Tabular Layout
  tableContainer: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#6B7280",
    // borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#6B7280",
    color: "#f3f4f6",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#6B7280",
    borderRightStyle: "solid",
    textAlign: "left",
  },
  tableHeaderLast: {
    backgroundColor: "#6B7280",
    color: "#f3f4f6",
    padding: 8,
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    borderRightStyle: "solid",
    textAlign: "left",
  },
  tableCellLast: {
    padding: 8,
    fontSize: 10,
    flex: 1,
    textAlign: "left",
  },
});

const MyDietPlanPDF = ({ diet, profileData }) => (
  <Document>
    {/* First Page */}
    <Page size="A4" style={styles.page}>
      <View style={{ ...styles.section, paddingBottom: 15 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "black",
            color: "#eab308", // golden color for the title
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          My Diet Plan
        </Text>
        <View style={{ alignItems: "center", marginTop: 10, lineHeight: 1.6 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {profileData?.name}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "400", marginTop: 4 }}>
            {profileData?.address}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "400", marginTop: 2 }}>
            {profileData?.mobile}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "400", marginTop: 2 }}>
            {profileData?.email}
          </Text>
        </View>
      </View>


      <View style={styles.row}>
        {/* Health Metrics Column */}
        <View style={styles.healthMetrics}>
          {[
            ["Weight", diet?.health_metrics?.weight],
            ["Height", diet?.health_metrics?.height],
            ["Ideal Weight", diet?.health_metrics?.ideal_weight],
            ["Extra Weight", diet?.health_metrics?.extra_weight],
            ["B.P.", diet?.health_metrics?.bp],
            ["Calorie", diet?.health_metrics?.calorie],
            ["Water", diet?.health_metrics?.water],
            ["Sugar", diet?.health_metrics?.sugar],
            ["Oil", diet?.health_metrics?.oil],
            ["Suggestion", diet?.health_metrics?.suggestion],
          ].map(([label, value], index) => (
            <Text key={index} style={styles.healthMetricText}>
              {label}: {value || "N/A"}
            </Text>
          ))}
        </View>

        {/* Meals Column */}
        <View style={styles.mealsColumn}>
          {/* Breakfast Section */}
          {diet.breakfast && (
            <View style={styles.section}>
              <Text style={styles.subtitle}>Breakfast</Text>
              {Object.entries(diet.breakfast).map(([key, value]) => (
                key !== "_id" && key !== "__v" && (
                  <Text key={key} style={styles.mealText}>
                    {key.replaceAll("_", " ")}: {value}
                  </Text>
                )
              ))}
            </View>
          )}

          {/* Lunch Section */}
          {diet.lunch && (
            <View style={styles.section}>
              <Text style={styles.subtitle}>Lunch</Text>
              {Object.entries(diet.lunch).map(([key, value]) => (
                key !== "_id" && key !== "__v" && (
                  <Text key={key} style={styles.mealText}>
                    {key.replaceAll("_", " ")}: {value}
                  </Text>
                )
              ))}
            </View>
          )}

          {/* Dinner Section */}
          {diet.dinner && (
            <View style={styles.section}>
              <Text style={styles.subtitle}>Dinner</Text>
              {Object.entries(diet.dinner).map(([key, value]) => (
                key !== "_id" && key !== "__v" && (
                  <Text key={key} style={styles.mealText}>
                    {key.replaceAll("_", " ")}: {value}
                  </Text>
                )
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>

    {/* Second Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Food and Recommendations</Text>

        {/* Table Container */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Category</Text>
            <Text style={styles.tableHeaderLast}>Details</Text>
          </View>

          {/* Table Rows */}
          {[
            ["Food To Avoid", diet?.health_metrics?.food_to_avoid],
            ["Weekly", diet?.health_metrics?.weekly],
            ["Fruits", diet?.health_metrics?.fruits],
            ["Vegetables", diet?.health_metrics?.vegetables],
            ["Points To Note", diet?.health_metrics?.points_to_note],
          ].map(([label, value], index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{label}</Text>
              <Text style={styles.tableCellLast}>{value || "N/A"}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDietPlanPDF;
