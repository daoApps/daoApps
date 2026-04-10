import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCartStore } from '@/stores/useCartStore';

describe('Shopping Cart Integration - Complete Purchase Flow', () => {
  let cartStore: ReturnType<typeof useCartStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    cartStore = useCartStore();
    cartStore.clearCart();
  });

  const productA = {
    id: 'pa',
    name: '商品A',
    price: 199,
    stock: 100,
    description: '',
    category: '',
    subCategory: '',
    images: [],
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    tags: [],
    seller: {
      id: 's1',
      name: '卖家',
      avatar: '',
      storeName: '店铺',
      rating: 0,
      followerCount: 0,
      productCount: 0,
      description: '',
      isVerified: false
    },
    specs: [],
    type: 'digital' as const,
    createdAt: ''
  };
  const productB = {
    id: 'pb',
    name: '商品B',
    price: 50,
    stock: 100,
    description: '',
    category: '',
    subCategory: '',
    images: [],
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    tags: [],
    seller: {
      id: 's1',
      name: '卖家',
      avatar: '',
      storeName: '店铺',
      rating: 0,
      followerCount: 0,
      productCount: 0,
      description: '',
      isVerified: false
    },
    specs: [],
    type: 'digital' as const,
    createdAt: ''
  };
  const productC = {
    id: 'pc',
    name: '商品C',
    price: 300,
    stock: 100,
    description: '',
    category: '',
    subCategory: '',
    images: [],
    rating: 0,
    reviewCount: 0,
    salesCount: 0,
    tags: [],
    seller: {
      id: 's1',
      name: '卖家',
      avatar: '',
      storeName: '店铺',
      rating: 0,
      followerCount: 0,
      productCount: 0,
      description: '',
      isVerified: false
    },
    specs: [],
    type: 'digital' as const,
    createdAt: ''
  };

  describe('Add to cart flow', () => {
    it('adds single product to empty cart', () => {
      cartStore.addItem(productA);
      expect(cartStore.items.length).toBe(1);
      expect(cartStore.items[0].product.name).toBe('商品A');
    });

    it('increments quantity for duplicate product', () => {
      cartStore.addItem(productA);
      cartStore.addItem(productA);
      expect(cartStore.items.length).toBe(1);
      expect(cartStore.items[0].quantity).toBe(2);
    });

    it('adds different products as separate entries', () => {
      cartStore.addItem(productA);
      cartStore.addItem(productB);
      expect(cartStore.items.length).toBe(2);
    });
  });

  describe('Cart modification flow', () => {
    it('updates quantity and recalculates subtotal', () => {
      cartStore.addItem(productA);
      cartStore.updateQuantity('pa', 5);
      expect(cartStore.items[0].quantity).toBe(5);
      expect(cartStore.subtotal).toBe(995);
    });

    it('removes item and recalculates total', () => {
      cartStore.addItem(productA);
      cartStore.addItem(productB);
      cartStore.removeItem('pa');
      expect(cartStore.items.length).toBe(1);
      expect(cartStore.items[0].product.id).toBe('pb');
      expect(cartStore.subtotal).toBe(50);
    });

    it('setting quantity to 0 does not remove item (updateQuantity ignores <1)', () => {
      cartStore.addItem(productA);
      cartStore.updateQuantity('pa', 0);
      expect(cartStore.items.length).toBe(1);
    });
  });

  describe('Selection and checkout flow', () => {
    beforeEach(() => {
      cartStore.addItem(productA);
      cartStore.addItem(productB);
      cartStore.addItem(productC);
    });

    it('toggleSelect toggles individual item', () => {
      cartStore.toggleSelect('pa');
      expect(cartStore.selectedItems.length).toBe(2);

      cartStore.toggleSelect('pa');
      expect(cartStore.selectedItems.length).toBe(3);
    });

    it('toggleSelectAll selects/deselects all items', () => {
      cartStore.toggleSelectAll();
      expect(cartStore.selectedItems.length).toBe(0);

      cartStore.toggleSelectAll();
      expect(cartStore.selectedItems.length).toBe(3);
    });

    it('finalAmount only counts selected items', () => {
      cartStore.toggleSelect('pb');
      expect(cartStore.finalAmount).toBe(499);
    });

    it('free shipping when total >= 299', () => {
      expect(cartStore.shippingCost).toBe(0);
    });

    it('shipping cost applies when total < 299', () => {
      cartStore.removeItem('pa');
      cartStore.removeItem('pc');
      expect(cartStore.shippingCost).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('handles empty cart calculations gracefully', () => {
      expect(cartStore.subtotal).toBe(0);
      expect(cartStore.finalAmount).toBe(0);
      expect(cartStore.totalItems).toBe(0);
      expect(cartStore.selectedItems.length).toBe(0);
    });

    it('handles remove of non-existent item silently', () => {
      cartStore.addItem(productA);
      cartStore.addItem(productB);
      cartStore.removeItem('nonexistent');
      expect(cartStore.items.length).toBe(2);
    });

    it('handles update quantity for non-existent item', () => {
      cartStore.addItem(productA);
      cartStore.addItem(productB);
      cartStore.updateQuantity('nonexistent', 10);
      expect(cartStore.items.length).toBe(2);
    });

    it('large quantities calculate correctly (limited by stock)', () => {
      cartStore.addItem({ ...productA, price: 1, stock: 1000 });
      cartStore.updateQuantity('pa', 1000);
      expect(cartStore.subtotal).toBe(1000);
    });
  });
});
