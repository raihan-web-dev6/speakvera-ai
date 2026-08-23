import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type Props = {
  certificateCode:
    string;

  recipientName:
    string;

  title:
    string;

  cefrLevel?:
    string;

  score?:
    number;

  issuedAt:
    string;

  verificationUrl:
    string;

  qrDataUrl:
    string;
};

const styles =
  StyleSheet.create({
    page: {
      backgroundColor:
        "#ffffff",

      padding:
        34,

      fontFamily:
        "Helvetica",
    },

    border: {
      borderWidth:
        3,

      borderColor:
        "#2563eb",

      height:
        "100%",

      padding:
        38,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    brand: {
      fontSize:
        13,

      color:
        "#2563eb",

      letterSpacing:
        3,

      textTransform:
        "uppercase",

      marginBottom:
        14,
    },

    heading: {
      fontSize:
        32,

      fontFamily:
        "Helvetica-Bold",

      color:
        "#0f172a",

      marginBottom:
        26,

      textAlign:
        "center",
    },

    presented: {
      fontSize:
        11,

      color:
        "#64748b",

      marginBottom:
        10,
    },

    recipient: {
      fontSize:
        29,

      color:
        "#0f172a",

      fontFamily:
        "Helvetica-Bold",

      marginBottom:
        20,

      textAlign:
        "center",
    },

    completion: {
      fontSize:
        11,

      color:
        "#64748b",

      marginBottom:
        9,
    },

    title: {
      fontSize:
        19,

      lineHeight:
        1.4,

      color:
        "#1d4ed8",

      fontFamily:
        "Helvetica-Bold",

      maxWidth:
        520,

      textAlign:
        "center",
    },

    stats: {
      flexDirection:
        "row",

      gap:
        25,

      marginTop:
        24,

      marginBottom:
        25,
    },

    stat: {
      alignItems:
        "center",
    },

    statLabel: {
      fontSize:
        8,

      color:
        "#94a3b8",

      textTransform:
        "uppercase",

      marginBottom:
        5,
    },

    statValue: {
      fontSize:
        15,

      color:
        "#0f172a",

      fontFamily:
        "Helvetica-Bold",
    },

    line: {
      width:
        "70%",

      borderBottomWidth:
        1,

      borderBottomColor:
        "#e2e8f0",

      marginVertical:
        18,
    },

    bottom: {
      width:
        "100%",

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop:
        15,
    },

    bottomSection: {
      width:
        "32%",

      alignItems:
        "center",
    },

    label: {
      fontSize:
        8,

      color:
        "#94a3b8",

      marginBottom:
        5,
    },

    value: {
      fontSize:
        9,

      color:
        "#334155",

      textAlign:
        "center",
    },

    qr: {
      width:
        75,

      height:
        75,
    },

    disclaimer: {
      fontSize:
        7,

      color:
        "#94a3b8",

      textAlign:
        "center",

      marginTop:
        20,

      maxWidth:
        500,

      lineHeight:
        1.5,
    },
  });

export default function CertificatePdfDocument({
  certificateCode,
  recipientName,
  title,
  cefrLevel,
  score,
  issuedAt,
  verificationUrl,
  qrDataUrl,
}: Props) {
  return (
    <Document
      title={`${title} - ${recipientName}`}
      author="Speakvera AI"
      subject="Speakvera Certificate"
      keywords="Speakvera English Certificate"
    >
      <Page
        size="A4"
        orientation="landscape"
        style={
          styles.page
        }
      >
        <View
          style={
            styles.border
          }
        >
          <Text
            style={
              styles.brand
            }
          >
            Speakvera AI
          </Text>

          <Text
            style={
              styles.heading
            }
          >
            Certificate of Completion
          </Text>

          <Text
            style={
              styles.presented
            }
          >
            This certificate is presented to
          </Text>

          <Text
            style={
              styles.recipient
            }
          >
            {
              recipientName
            }
          </Text>

          <Text
            style={
              styles.completion
            }
          >
            for successfully completing
          </Text>

          <Text
            style={
              styles.title
            }
          >
            {title}
          </Text>

          {(cefrLevel ||
            typeof score ===
              "number") && (
            <View
              style={
                styles.stats
              }
            >
              {cefrLevel && (
                <View
                  style={
                    styles.stat
                  }
                >
                  <Text
                    style={
                      styles.statLabel
                    }
                  >
                    Estimated Level
                  </Text>

                  <Text
                    style={
                      styles.statValue
                    }
                  >
                    {
                      cefrLevel
                    }
                  </Text>
                </View>
              )}

              {typeof score ===
                "number" && (
                <View
                  style={
                    styles.stat
                  }
                >
                  <Text
                    style={
                      styles.statLabel
                    }
                  >
                    Final Score
                  </Text>

                  <Text
                    style={
                      styles.statValue
                    }
                  >
                    {Math.round(
                      score
                    )}
                    /100
                  </Text>
                </View>
              )}
            </View>
          )}

          <View
            style={
              styles.line
            }
          />

          <View
            style={
              styles.bottom
            }
          >
            <View
              style={
                styles.bottomSection
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                DATE ISSUED
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {
                  issuedAt
                }
              </Text>
            </View>

            <View
              style={
                styles.bottomSection
              }
            >
              <Image
                src={
                  qrDataUrl
                }
                style={
                  styles.qr
                }
              />

              <Text
                style={[
                  styles.value,
                  {
                    marginTop:
                      5,
                  },
                ]}
              >
                Scan to verify
              </Text>
            </View>

            <View
              style={
                styles.bottomSection
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                CERTIFICATE ID
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {
                  certificateCode
                }
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.disclaimer
            }
          >
            Verification:{" "}
            {
              verificationUrl
            }
            {"\n"}
            This Speakvera certificate records completion of a Speakvera learning program. It is not an official CEFR or IELTS qualification.
          </Text>
        </View>
      </Page>
    </Document>
  );
}