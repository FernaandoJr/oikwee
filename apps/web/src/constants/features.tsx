import {
  BarChart3,
  Bell,
  CalendarClock,
  PiggyBank,
  Receipt,
  Repeat,
  Tags,
  Wallet,
} from 'lucide-react';

const iconSize = 'h-4 w-4';

export interface BentoFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  meta?: string;
  status?: string;
  tags?: string[];
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

export const featuresItems: BentoFeature[] = [
  {
    title: 'recurringExpenses',
    description: 'recurringWithRemindersAndForecast',
    icon: <Repeat className={`${iconSize} text-blue-500`} />,
    status: 'featured',
    tags: ['recurring', 'subscriptions', 'fixed'],
  },
  {
    title: 'categories',
    description: 'organizeByCategoryCustom',
    icon: <Tags className={`${iconSize} text-violet-500`} />,
    status: 'active',
    tags: ['organization', 'filters'],
  },
  {
    title: 'monthlySummary',
    description: 'totalSpentComparisonAndTrends',
    icon: <BarChart3 className={`${iconSize} text-emerald-500`} />,
    status: 'new',
    tags: ['reports', 'analytics'],
  },
  {
    title: 'budgetByCategory',
    description: 'limitsPerCategoryTrackRemaining',
    icon: <PiggyBank className={`${iconSize} text-amber-500`} />,
    tags: ['limits', 'goals'],
    colSpan: 2,
  },
  {
    title: 'spendAlerts',
    description: 'alertsNearLimitOrRecurringDue',
    icon: <Bell className={`${iconSize} text-rose-500`} />,
    status: 'beta',
    tags: ['reminders', 'limits'],
  },
  {
    title: 'quickEntry',
    description: 'recordExpensesAmountCategoryDateFast',
    icon: <Receipt className={`${iconSize} text-cyan-500`} />,
    tags: ['entry', 'fast'],
  },
  {
    title: 'dueDateForecast',
    description: 'fixedExpenseDueAvoidSurprises',
    icon: <CalendarClock className={`${iconSize} text-orange-500`} />,
    tags: ['recurring', 'planning'],
  },
  {
    title: 'walletView',
    description: 'balanceAndFlowsInOnePlace',
    icon: <Wallet className={`${iconSize} text-teal-500`} />,
    status: 'live',
    tags: ['dashboard', 'summary'],
  },
];
