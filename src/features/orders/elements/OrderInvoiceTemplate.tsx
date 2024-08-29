import { convertUnixTimestampToIsoDate } from "@/utils/date/convertUnixTimestamp2IsoDate";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const OrderInvoiceTemplate = ({ order }: { order: any }) => {
  const deliveryDate = order?.deliveryDate;
  const creationDate = new Date().toLocaleString();
  const items = order.items;
  const orderObject = {
    id: order?.incrementId || "N/A",
    deliveryDateYMD:
      convertUnixTimestampToIsoDate(deliveryDate) || "0000/00/00",
    items: items || [],
    customerFirstname: order.customerFirstname || "Unknown",
    customerLastname: order.customerLastname || "",
    customerPhone: order.customerPhone || "N/A",
    total: order.total || "0.00",
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.header}>
            <View style={styles.headerImage}>
              <Image src="/images/kamioun-logo.b3a50ae8.png" />
            </View>
            <View style={styles.headerText}>
              <Text>Commande N°: {orderObject.id}</Text>
              <Text>Livraison: {orderObject.deliveryDateYMD}</Text>
            </View>
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.details}>
              <Text>Société</Text>
              <Text>Kamioun Distribution</Text>
              <Text>MF: 393930023993003</Text>
              <Text style={styles.signature}>Signature</Text>
            </View>
            <View style={styles.details}>
              <Text>Client</Text>
              <Text>
                {orderObject.customerFirstname}
                {orderObject.customerLastname}
              </Text>
              <Text>Tél: {orderObject.customerPhone}</Text>
            </View>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Référence</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Designation</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Prix Unitaire</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantité</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Prix Total (TND)</Text>
            </View>
          </View>
          {orderObject.items.map((item: any, index: any) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item?.productId || "****"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.productName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item?.productPrice || "****"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.quantity || "**"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item?.price || "****"}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.summary}>
          <View>
            {/* <View style={styles.bonus}>
                            <Text style={styles.bonusText}>
                                87 Points Bonus sur cette commande
                            </Text>
                            <Text style={styles.bonusText}>5123 points Bonus Total</Text>
                        </View> */}
          </View>
          <View>
            <View style={styles.totalItem}>
              <Text style={styles.totalItemLabel}>Total TTC à payer (TND)</Text>
              <Text style={styles.totalItemValue}>{orderObject.total}</Text>
            </View>
          </View>
        </View>
        {/* <Text style={styles.disclaimer}>
                    يجب على الحريف التأكد من عدد و حالة البضاعة المسلمة. شركة كميون لا
                    تتحمل مسؤولية اتلاف أو صلوحية أو نقصان
                </Text> */}
        <View style={styles.footerContainer}>
          <Text style={styles.footer}>
            000, Beja Z 1 Mghira 1 3, 2082; Fouchana, Ben Arous Tel: +216 21 610
            107 {creationDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Courier",
    fontSize: 11,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#3b82f6",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
  headerImage: {
    width: 200,
    height: 200,
    marginRight: 20,
  },
  headerText: {
    textAlign: "right",
  },
  invoiceDetails: {
    marginTop: "-100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    fontSize: 12,
    border: "1px solid black",
    width: "auto",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  signature: {
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  table: {
    //display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    padding: 8,
    textAlign: "center",
  },
  summary: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    fontSize: 12,
  },
  bonus: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    justifyContent: "space-between",
  },
  bonusText: {
    fontSize: 10,
    paddingRight: 20,
  },

  totalItem: {
    border: "2px solid black",
    padding: 10,
  },

  totalItemLabel: {
    fontWeight: "normal",
  },

  totalItemValue: {
    fontWeight: "bold",
  },

  summaryItemValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  disclaimer: {
    /* fontFamily: "NotoSansArabic", */
    direction: "rtl",
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    color: "#333",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#000",
    fontWeight: "bold",
    width: "100%",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
});

export default OrderInvoiceTemplate;
