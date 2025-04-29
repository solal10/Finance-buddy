import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CategoryTotal } from '@/types/finance';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/format';
import { useProfile } from '@/store/finance-store';
import Svg, { Path, Circle } from 'react-native-svg';

interface CategoryPieChartProps {
  data: CategoryTotal[];
}

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 64, 250);
const CHART_RADIUS = CHART_SIZE / 2;
const CHART_CENTER = CHART_SIZE / 2;

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const profile = useProfile();
  
  // Memoize calculations to prevent re-renders
  const totalAmount = useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, [data]);
  
  // Calculate the segments for the pie chart
  const segments = useMemo(() => {
    let startAngle = 0;
    
    return data.map((item) => {
      const percentage = totalAmount > 0 ? (item.amount / totalAmount) : 0;
      const sweepAngle = percentage * 360;
      
      const segment = {
        categoryId: item.categoryId,
        color: item.color,
        startAngle,
        sweepAngle,
        endAngle: startAngle + sweepAngle,
        percentage
      };
      
      startAngle += sweepAngle;
      return segment;
    });
  }, [data, totalAmount]);
  
  // Function to calculate the SVG path for a pie segment
  const getSegmentPath = (startAngle: number, sweepAngle: number, radius: number) => {
    if (sweepAngle >= 360) {
      return `M ${CHART_CENTER} ${CHART_CENTER} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
    }
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (startAngle + sweepAngle - 90) * Math.PI / 180;
    
    const x1 = CHART_CENTER + radius * Math.cos(startRad);
    const y1 = CHART_CENTER + radius * Math.sin(startRad);
    const x2 = CHART_CENTER + radius * Math.cos(endRad);
    const y2 = CHART_CENTER + radius * Math.sin(endRad);
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    
    return `M ${CHART_CENTER} ${CHART_CENTER} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.length > 0 ? (
          <View style={[styles.chart, { width: CHART_SIZE, height: CHART_SIZE }]}>
            <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
              {segments.map((segment) => (
                <Path
                  key={segment.categoryId}
                  d={getSegmentPath(segment.startAngle, segment.sweepAngle, CHART_RADIUS - 10)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="1"
                />
              ))}
              <Circle
                cx={CHART_CENTER}
                cy={CHART_CENTER}
                r={CHART_RADIUS / 3}
                fill="white"
              />
            </Svg>
          </View>
        ) : (
          <View style={[styles.emptyChart, { width: CHART_SIZE, height: CHART_SIZE }]}>
            <Text style={styles.emptyText}>No data</Text>
          </View>
        )}
      </View>
      
      <View style={styles.legendContainer}>
        {data.map((item) => {
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
          return (
            <View key={item.categoryId} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendName}>{item.categoryName}</Text>
                <Text style={styles.legendValue}>
                  {formatCurrency(item.amount, profile.currency)} ({percentage.toFixed(1)}%)
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chart: {
    position: 'relative',
  },
  emptyChart: {
    borderRadius: CHART_SIZE / 2,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  legendValue: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});