import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { MaterialContent } from "@/lib/materialContent";

// Brand palette — same values as src/lib/emailTemplates.ts (email) and
// src/app/globals.css (app UI), so a PDF, an email, and the app all read as
// the same product. Helvetica (react-pdf's built-in font) is used
// deliberately instead of a registered custom font: it renders reliably on
// Vercel's serverless functions with zero extra network/asset dependencies.
const AMBER = "#ffb020";
const AMBER_TINT = "#fff3dd";
const INK = "#1a1400";
const TEXT = "#20242c";
const TEXT_SOFT = "#5c6579";
const TEXT_FAINT = "#8a8f9c";
const BORDER = "#e7e3d8";
const BG = "#fbfaf6";
const CYAN = "#0e9c93";
const CYAN_TINT = "#e3f7f5";
const VIOLET = "#5b4fe8";
const VIOLET_TINT = "#ecebfd";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { backgroundColor: BG, padding: 40, fontSize: 10.5, color: TEXT, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  logoCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoLetter: { color: INK, fontFamily: "Helvetica-Bold", fontSize: 13 },
  brand: { fontFamily: "Helvetica-Bold", fontSize: 14, color: TEXT },
  brandTag: { fontSize: 8, color: TEXT_FAINT, marginTop: 1 },
  titleBlock: { marginBottom: 18 },
  pillRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
  pill: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: INK,
    backgroundColor: AMBER,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  pillOutline: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: TEXT_SOFT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 6 },
  intro: { fontSize: 10, color: TEXT_SOFT, lineHeight: 1.5 },
  section: { marginBottom: 16 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  sectionBar: { width: 3, height: 13, backgroundColor: CYAN, marginRight: 7, borderRadius: 2 },
  sectionHeading: { fontSize: 12.5, fontFamily: "Helvetica-Bold", color: TEXT },
  table: { borderWidth: 1, borderColor: BORDER, borderRadius: 6, overflow: "hidden" },
  tableHeadRow: { flexDirection: "row", backgroundColor: CYAN_TINT },
  tableRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER },
  tableRowAlt: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: "#f4f2ec" },
  colTerm: { width: "22%", padding: 7 },
  colPron: { width: "18%", padding: 7 },
  colMeaning: { width: "20%", padding: 7 },
  colExample: { width: "40%", padding: 7 },
  th: { fontSize: 8, fontFamily: "Helvetica-Bold", color: CYAN, textTransform: "uppercase", letterSpacing: 0.4 },
  term: { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT },
  pron: { fontSize: 9, color: TEXT_FAINT, fontFamily: "Helvetica-Oblique" },
  meaning: { fontSize: 9.5, color: TEXT },
  exampleEn: { fontSize: 9, color: TEXT, marginBottom: 2 },
  exampleEs: { fontSize: 8.5, color: TEXT_FAINT, fontFamily: "Helvetica-Oblique" },
  phraseCard: {
    borderLeftWidth: 3,
    borderLeftColor: VIOLET,
    backgroundColor: VIOLET_TINT,
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  phraseEn: { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 2 },
  phraseEs: { fontSize: 9, color: TEXT_SOFT },
  note: {
    fontSize: 9.5,
    color: TEXT_SOFT,
    backgroundColor: AMBER_TINT,
    borderRadius: 4,
    padding: 8,
    lineHeight: 1.5,
  },
  practiceBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: AMBER,
    borderRadius: 6,
    padding: 12,
    backgroundColor: AMBER_TINT,
  },
  practiceLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK, marginBottom: 4, letterSpacing: 0.4 },
  practiceText: { fontSize: 10, color: TEXT, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: TEXT_FAINT,
  },
});

export function MaterialPdfDocument({
  title,
  level,
  type,
  language,
  content,
}: {
  title: string;
  level: string;
  type: string;
  language: string;
  content: MaterialContent;
}) {
  return (
    <Document title={`${title} — Prixo`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>P</Text>
          </View>
          <View>
            <Text style={styles.brand}>Prixo</Text>
            <Text style={styles.brandTag}>Tu idioma, un paso a la vez.</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.pillRow}>
            <Text style={styles.pill}>{level}</Text>
            <Text style={styles.pillOutline}>{language}</Text>
            <Text style={styles.pillOutline}>{type}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.intro}>{content.intro}</Text>
        </View>

        {content.sections.map((section, si) => (
          <View key={si} style={styles.section} wrap={false}>
            <View style={styles.sectionHeadingRow}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionHeading}>{section.heading}</Text>
            </View>

            {section.vocab && section.vocab.length > 0 && (
              <View style={styles.table}>
                <View style={styles.tableHeadRow}>
                  <Text style={[styles.colTerm, styles.th]}>Inglés</Text>
                  <Text style={[styles.colPron, styles.th]}>Pronunciación</Text>
                  <Text style={[styles.colMeaning, styles.th]}>Español</Text>
                  <Text style={[styles.colExample, styles.th]}>Ejemplo</Text>
                </View>
                {section.vocab.map((v, vi) => (
                  <View key={vi} style={vi % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                    <Text style={[styles.colTerm, styles.term]}>{v.term}</Text>
                    <Text style={[styles.colPron, styles.pron]}>{v.pronunciation}</Text>
                    <Text style={[styles.colMeaning, styles.meaning]}>{v.meaning}</Text>
                    <View style={styles.colExample}>
                      <Text style={styles.exampleEn}>{v.example}</Text>
                      <Text style={styles.exampleEs}>{v.exampleEs}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {section.phrases && section.phrases.length > 0 && (
              <View>
                {section.phrases.map((p, pi) => (
                  <View key={pi} style={styles.phraseCard}>
                    <Text style={styles.phraseEn}>{p.phrase}</Text>
                    <Text style={styles.phraseEs}>{p.meaning}</Text>
                  </View>
                ))}
              </View>
            )}

            {section.note && <Text style={styles.note}>{section.note}</Text>}
          </View>
        ))}

        <View style={styles.practiceBox} wrap={false}>
          <Text style={styles.practiceLabel}>✎ PRACTICA</Text>
          <Text style={styles.practiceText}>{content.practice}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Prixo — prixo.cl</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
