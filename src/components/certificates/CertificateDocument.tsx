import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type Props = {
  recipientName: string;

  title: string;

  certificateCode: string;

  issuedAt: string;

  cefrLevel?: string;

  score?: number;

  qrCodeDataUrl: string;
};

const styles =
  StyleSheet.create({
    page: {
      padding: 45,

      backgroundColor:
        "#ffffff",

      fontFamily:
        "Helvetica",
    },

    border: {
      flex: 1,

      borderWidth: 3,

      borderColor:
        "#2563eb",

      padding: 40,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    brand: {
      fontSize: 14,

      color:
        "#2563eb",

      letterSpacing: 2,

      marginBottom: 18,
    },

    heading: {
      fontSize: 30,

      fontWeight: 700,

      marginBottom: 28,
    },

    small: {
      fontSize: 11,

      color:
        "#64748b",
    },

    name: {
      fontSize: 30,

      marginVertical: 18,

      fontWeight: 700,

      color:
        "#0f172a",
    },

    title: {
      fontSize: 20,

      color:
        "#2563eb",

      marginTop: 12,

      textAlign:
        "center",
    },

    details: {
      marginTop: 18,

      fontSize: 11,

      color:
        "#475569",
    },

    qr: {
      width: 75,

      height: 75,

      marginTop: 25,
    },

    code: {
      marginTop: 8,

      fontSize: 9,

      color:
        "#64748b",
    },
  });

export default function CertificateDocument({
  recipientName,
  title,
  certificateCode,
  issuedAt,
  cefrLevel,
  score,
  qrCodeDataUrl,
}: Props) {
  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        <View style={styles.border}>
          <Text style={styles.brand}>
            SPEAKVERA AI
          </Text>

          <Text style={styles.heading}>
            Certificate of Achievement
          </Text>

          <Text style={styles.small}>
            This certifies that
          </Text>

          <Text style={styles.name}>
            {recipientName}
          </Text>

          <Text style={styles.small}>
            successfully completed
          </Text>

          <Text style={styles.title}>
            {title}
          </Text>

          {cefrLevel && (
            <Text style={styles.details}>
              Estimated CEFR Level:{" "}
              {cefrLevel}
            </Text>
          )}

          {typeof score ===
            "number" && (
            <Text style={styles.details}>
              Score: {score}/100
            </Text>
          )}

          <Text style={styles.details}>
            Issued: {issuedAt}
          </Text>

          <Image
            src={qrCodeDataUrl}
            style={styles.qr}
          />

          <Text style={styles.code}>
            {certificateCode}
          </Text>
        </View>
      </Page>
    </Document>
  );
}