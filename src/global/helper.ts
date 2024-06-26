import { BigNumber } from "@ijstech/eth-wallet";
import { moment } from '@ijstech/components';

export enum SITE_ENV {
  DEV = 'dev',
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export const DefaultDateTimeFormat = 'DD/MM/YYYY HH:mm:ss';
export const DefaultDateFormat = 'DD/MM/YYYY';

export const formatDate = (date: any, customType?: string, showTimezone?: boolean) => {
  const formatType = customType || DefaultDateFormat;
  const formatted = moment(date).format(formatType);
  if (showTimezone) {
    let offsetHour = moment().utcOffset() / 60;
    //will look like UTC-2 UTC+2 UTC+0
    return `${formatted} (UTC${offsetHour>=0?"+":""}${offsetHour})`;
  }
  return formatted;
}

export const formatUTCDate = (date: any, customType?: string, showTimezone?: boolean) => {
  const formatType = customType || DefaultDateFormat;
  const formatted = moment(date).utc().format(formatType);
  return showTimezone?  `${formatted} (UTC)` : formatted;
}

export const compareDate = (fromDate: any, toDate?: any) => {
  if (!toDate) {
    toDate = moment();
  }
  return moment(fromDate).isSameOrBefore(toDate);
}

export const formatNumber = (value: any, decimals?: number, options?: { min?: number, sign?: string }) => {
  let val = value;
  const { min = '0.0000001', sign = '' } = options || {};
  const minValue = min;
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  if (val != 0 && new BigNumber(val).lt(minValue)) {
    return `< ${sign}${minValue}`;
  }
  return `${sign}${formatNumberWithSeparators(val, decimals || 4)}`;
};

export const formatPercentNumber = (value: any, decimals?: number) => {
  let val = value;
  if (typeof value === 'string') {
    val = new BigNumber(value).toNumber();
  } else if (typeof value === 'object') {
    val = value.toNumber();
  }
  return formatNumberWithSeparators(val, decimals || 2);
};

export const formatNumberWithSeparators = (value: number, precision?: number) => {
  if (!value) value = 0;
  if (precision) {
    let outputStr = '';
    if (value >= 1) {
      const unit = Math.pow(10, precision);
      const rounded = Math.floor(value * unit) / unit;
      outputStr = rounded.toLocaleString('en-US', { maximumFractionDigits: precision });
    } else {
      outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }
  return value.toLocaleString('en-US');
}

export const isInvalidInput = (val: any) => {
  const value = new BigNumber(val);
  if (value.lt(0)) return true;
  return (val || '').toString().substring(0, 2) === '00' || val === '-';
};

export const limitInputNumber = (input: any, decimals: number) => {
  const amount = input.value;
  if (isInvalidInput(amount)) {
    input.value = '0';
    return;
  }
  if (!new BigNumber(amount).isNaN()) {
    input.value = limitDecimals(amount, decimals || 18);
  }
}

export const limitDecimals = (value: any, decimals: number) => {
  let val = value;
  if (typeof value !== 'string') {
    val = val.toString();
  }
  let chart;
  if (val.includes('.')) {
    chart = '.';
  } else if (val.includes(',')) {
    chart = ',';
  } else {
    return value;
  }
  const parts = val.split(chart);
  let decimalsPart = parts[1];
  if (decimalsPart && decimalsPart.length > decimals) {
    parts[1] = decimalsPart.substr(0, decimals);
  }
  return parts.join(chart);
}

export async function getAPI(url:string, paramsObj?: any): Promise<any> {
  let queries = '';
  if (paramsObj) {
      try {
          queries = new URLSearchParams(paramsObj).toString();
      } catch(err) {
          console.log('err', err)
      }
  }
  let fullURL = url + (queries ? `?${queries}` : '');
  const response = await fetch(fullURL, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
  });
  return response.json();
}

export const toWeiInv = (n: string, unit?: number) => {
  if (new BigNumber(n).eq(0)) return new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'); 
  return new BigNumber('1').shiftedBy((unit || 18)*2).idiv(new BigNumber(n).shiftedBy(unit || 18));
}

export const padLeft = function(string: string, chars: number, sign?: string){
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}

export const numberToBytes32 = (value: any, prefix?: string) => {
  if (!value) return;
  let v = value;
  if (typeof value == "number") {
    // covert to a hex string
    v = value.toString(16);
  } else if (/^[0-9]*$/.test(value)) {
    // assuming value to be a decimal number, value could be a hex
    v = new BigNumber(value).toString(16);
  } else if (/^(0x)?[0-9A-Fa-f]*$/.test(value)) {
    // value already a hex
    v = value;
  } else if (BigNumber.isBigNumber(value)) {
    v = value.toString(16);
  }
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = '0x' + v
  return v;
}

export const getParamsFromUrl = () => {
  const startIdx = window.location.href.indexOf("?");
  const search = window.location.href.substring(startIdx, window.location.href.length)
  const queryString = search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

export const uniqWith = (array: any[], compareFn: (cur: any, oth: any) => boolean) => {
  const unique: any = [];
  for (const cur of array) {
    const isDuplicate = unique.some((oth: any) => compareFn(cur, oth));
    if (!isDuplicate) unique.push(cur);
  }
  return unique;
}

export const getWeekDays = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  let days = [];
  let day = d;
  for (let i = 0; i < 7; i++) {
    days.push(day.setDate(day.getDate() + 1));
  }
  return days;
}

export const showResultMessage = (result: any, status: 'warning' | 'success' | 'error', content?: string | Error) => {
  if (!result) return;
  let params: any = { status };
  if (status === 'success') {
    params.txtHash = content;
  } else {
    params.content = content;
  }
  result.message = { ...params };
  result.showModal();
}

export function flatMap<T, U>(array: T[], callback: (item: T) => U[]): U[] {
  return array.reduce((acc, item) => {
    return acc.concat(callback(item));
  }, [] as U[]);
}
