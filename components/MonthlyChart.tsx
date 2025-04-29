import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MonthlyTotal } from '@/types/finance';
import { colors } from '@/constants/colors';
import { formatMonthYear } from '@/utils/format';
import { useTranslation } from '@/utils/i18n';
import { useProfile } from '@/store/finance-store';

interface MonthlyChartProps {
  data: MonthlyTotal[];
}

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 64) / 6 - 8; // For 6 months with padding

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const { t } = useTranslation();
  const profile = useProfile();
  
  // Find the maximum value for scaling
  const maxValue = useMemo(() => {
    return Math.max(
      ...data.map((item) => Math.max(item.expenses, item.income, 1))
    );
  }, [data]);
  
  // Reverse the data to show most recent months on the right
  const chartData = useMemo(() => {
    return [...data].reverse();
  }, [data]);
  
  // Format month names based on language
  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(profile.language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {chartData.map((item) => {
          const expenseHeight = (item.expenses / maxValue) * 150 || 2;
          const incomeHeight = (item.income / maxValue) * 150 || 2;
          
          return (
            <View key={item.month} style={styles.barGroup}>
              <View style={styles.bars}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      styles.expenseBar,
                      { height: expenseHeight }
                    ]} 
                  />
                </View>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      styles.incomeBar,
                      { height: incomeHeight }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.barLabel}>
                {formatMonth(item.month)}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>{t('expenses')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>{t('income')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 16,
  },
  barGroup: {
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    width: BAR_WIDTH / 2,
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: BAR_WIDTH / 2 - 2,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  expenseBar: {
    backgroundColor: colors.danger,
  },
  incomeBar: {
    backgroundColor: colors.success,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
});