import path from 'path'

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import { INVOICE_STATUS_LABEL } from '@/lib/constants'
import type { InvoicePdfProps } from '@/types/pdf'

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'NanumGothic',
  fonts: [
    {
      src: path.join(FONT_DIR, 'NanumGothic-Regular.ttf'),
      fontWeight: 'normal',
    },
    { src: path.join(FONT_DIR, 'NanumGothic-Bold.ttf'), fontWeight: 'bold' },
  ],
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NanumGothic',
    fontSize: 10,
    padding: 32,
    color: '#111111',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 16,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 6,
  },
  colDescription: { flex: 3 },
  colQuantity: { flex: 1, textAlign: 'right' },
  colUnitPrice: { flex: 1.5, textAlign: 'right' },
  colAmount: { flex: 1.5, textAlign: 'right' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export function InvoiceTemplate({ data }: InvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.label}>견적서 번호</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={styles.label}>
              상태: {INVOICE_STATUS_LABEL[data.status]}
            </Text>
            <Text style={styles.label}>발행일: {data.issueDate}</Text>
            <Text style={styles.label}>유효기간: {data.validUntil}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>클라이언트명</Text>
          <Text>{data.clientName}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDescription}>항목</Text>
            <Text style={styles.colQuantity}>수량</Text>
            <Text style={styles.colUnitPrice}>단가</Text>
            <Text style={styles.colAmount}>금액</Text>
          </View>
          {data.items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.colDescription}>견적 항목이 없습니다</Text>
            </View>
          ) : (
            data.items.map(item => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colQuantity}>{item.quantity}</Text>
                <Text style={styles.colUnitPrice}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.colAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>총 금액</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(data.totalAmount)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
