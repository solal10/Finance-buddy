import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CategoryTotal } from '@/types/finance';

interface SimplePieChartProps {
  data: CategoryTotal[];
  size: number;
}

export default function SimplePieChart({ data, size }: SimplePieChartProps) {
  const radius = size / 2;
  const center = size / 2;
  
  // Calculate total for percentages
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, [data]);
  
  // Calculate segments
  const segments = useMemo(() => {
    let startAngle = 0;
    
    return data.map((item) => {
      const percentage = total > 0 ? (item.amount / total) : 0;
      const sweepAngle = percentage * 360;
      
      const segment = {
        categoryId: item.categoryId,
        color: item.color,
        startAngle,
        sweepAngle,
        endAngle: startAngle + sweepAngle
      };
      
      startAngle += sweepAngle;
      return segment;
    });
  }, [data, total]);
  
  // Function to calculate the SVG path for a pie segment
  const getSegmentPath = (startAngle: number, sweepAngle: number, radius: number) => {
    if (sweepAngle >= 360) {
      return `M ${center} ${center} m -${radius} 0 a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 -${radius * 2} 0`;
    }
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (startAngle + sweepAngle - 90) * Math.PI / 180;
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment) => (
          <path
            key={segment.categoryId}
            d={getSegmentPath(segment.startAngle, segment.sweepAngle, radius - 2)}
            fill={segment.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        <circle
          cx={center}
          cy={center}
          r={radius / 3}
          fill="white"
        />
      </svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});