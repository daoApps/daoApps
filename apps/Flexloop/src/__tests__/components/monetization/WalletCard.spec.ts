import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WalletCard from '@/components/monetization/WalletCard.vue';

const mockWalletData = {
  totalBalance: 234567.89,
  availableBalance: 198456.32,
  frozenBalance: 36111.57,
  currency: 'CNY' as const
};

describe('WalletCard', () => {
  it('should render wallet balance correctly', () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    expect(wrapper.text()).toContain('234,567.89');
    expect(wrapper.text()).toContain('198,456.32');
    expect(wrapper.text()).toContain('36,111.57');
  });

  it('should display total balance label', () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    expect(wrapper.text()).toContain('总余额');
  });

  it('should display available and frozen balance labels', () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    expect(wrapper.text()).toContain('可用余额');
    expect(wrapper.text()).toContain('冻结金额');
  });

  it('should have recharge and withdraw buttons', () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    const buttons = wrapper.findAll('button');
    const buttonTexts = buttons.map((btn) => btn.text());

    expect(buttonTexts).toContain('充值');
    expect(buttonTexts).toContain('提现');
  });

  it('should emit recharge event when recharge button is clicked', async () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    const rechargeButton = wrapper.findAll('button').find((btn) => btn.text() === '充值');
    await rechargeButton?.trigger('click');

    expect(wrapper.emitted('recharge')).toBeTruthy();
  });

  it('should emit withdraw event when withdraw button is clicked', async () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    const withdrawButton = wrapper.findAll('button').find((btn) => btn.text() === '提现');
    await withdrawButton?.trigger('click');

    expect(wrapper.emitted('withdraw')).toBeTruthy();
  });

  it('should display currency switcher buttons', () => {
    const wrapper = mount(WalletCard, {
      props: { data: mockWalletData }
    });

    expect(wrapper.text()).toContain('CNY');
    expect(wrapper.text()).toContain('USD');
    expect(wrapper.text()).toContain('EUR');
  });
});
