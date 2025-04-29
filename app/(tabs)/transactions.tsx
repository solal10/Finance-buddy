import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFinanceStore } from '@/store/finance-store';
import { colors } from '@/constants/colors';
import TransactionItem from '@/components/TransactionItem';
import { Plus, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TransactionsScreen() {
  const router = useRouter();
  const transactions = useFinanceStore((state) => state.transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Memoize filtered transactions to prevent re-renders
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    
    return transactions.filter((t) => 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {showSearch ? (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              placeholderTextColor={colors.textLight}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={20} color={colors.textLight} />
              </Pressable>
            ) : null}
          </View>
          <Pressable onPress={() => {
            setShowSearch(false);
            setSearchQuery('');
          }}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Pressable onPress={() => setShowSearch(true)}>
            <Search size={24} color={colors.text} />
          </Pressable>
        </View>
      )}
      
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onPress={(transaction) => router.push(`/transaction/${transaction.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No matching transactions' : 'No transactions yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery 
              ? 'Try a different search term'
              : 'Add your first transaction to get started'}
          </Text>
        </View>
      )}
      
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push('/add-transaction')}
      >
        <Plus size={24} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: colors.text,
  },
  cancelButton: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});