// lib/format.ts
export const formatLargeNumber = (num: number, decimals: number = 1): string => {
    if (num === 0) return '0';
    
    const k = 1000;
    const m = k * 1000;
    const b = m * 1000;
    const t = b * 1000;
    
    if (num >= t) {
        return (num / t).toFixed(decimals).replace(/\.0$/, '') + 'T';
    }
    if (num >= b) {
        return (num / b).toFixed(decimals).replace(/\.0$/, '') + 'B';
    }
    if (num >= m) {
        return (num / m).toFixed(decimals).replace(/\.0$/, '') + 'M';
    }
    if (num >= k) {
        return (num / k).toFixed(decimals).replace(/\.0$/, '') + 'k';
    }
    
    return num.toString();
};

// More flexible version with customizable suffixes
export const formatNumber = (
    num: number, 
    options: {
        decimals?: number;
        compact?: boolean;
        suffix?: string;
    } = {}
): string => {
    const { decimals = 1, compact = true, suffix = '' } = options;
    
    if (!compact) {
        return num.toLocaleString() + suffix;
    }
    
    const lookup = [
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' },
        { value: 1, symbol: '' }
    ];
    
    const item = lookup.find(item => num >= item.value);
    if (!item) return '0' + suffix;
    
    const formatted = (num / item.value)
        .toFixed(decimals)
        .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
    
    return formatted + item.symbol + suffix;
};