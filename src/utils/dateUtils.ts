export function isItemApproachingDate(dateString?: string, daysThreshold: number = 3): boolean {
  if (!dateString) return false;
  try {
    const targetDate = new Date(dateString + 'T23:59:59');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= daysThreshold;
  } catch {
    return false;
  }
}

export function getItemDateStatus(dateString?: string): {
  status: 'use_soon' | 'date_passed' | 'no_date' | 'ok';
  label: string;
  daysRemaining?: number;
} {
  if (!dateString) {
    return { status: 'no_date', label: 'No date added' };
  }

  try {
    const targetDate = new Date(dateString + 'T23:59:59');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        status: 'date_passed',
        label: daysAgo === 1 ? 'Date passed yesterday' : `Date passed ${daysAgo} days ago`,
        daysRemaining: diffDays
      };
    } else if (diffDays === 0) {
      return { status: 'use_soon', label: 'Use soon (Today)', daysRemaining: 0 };
    } else if (diffDays <= 3) {
      return {
        status: 'use_soon',
        label: diffDays === 1 ? 'Use soon (Tomorrow)' : `Use soon (In ${diffDays} days)`,
        daysRemaining: diffDays
      };
    } else {
      return {
        status: 'ok',
        label: `Entered date in ${diffDays} days`,
        daysRemaining: diffDays
      };
    }
  } catch {
    return { status: 'no_date', label: 'Invalid date' };
  }
}
