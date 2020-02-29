import dayjs from 'dayjs';
// @ts-ignore
import tz from 'timezone';
// @ts-ignore
import London from 'timezone/Europe/London';
const ltz = tz([London]);

const pluginFunc: dayjs.PluginFunc = (_option: any, _dayjsClass: typeof dayjs.Dayjs, dayjsFactory: typeof dayjs) => {
  dayjsFactory.at = (zoneName: string, date?: dayjs.ConfigType, options?: dayjs.OptionType, locale?: string) => {
    return dayjsFactory(
      ltz(
        dayjsFactory(date, options, locale),
        "%F %T",
        zoneName
      ),
      "YYYY-MM-DD HH:mm:ss"
    )
  }
};

declare module 'dayjs' {
  export function at(zoneName: string,
                     date?: dayjs.ConfigType, options?: dayjs.OptionType, locale?: string): Dayjs
}

export default pluginFunc;
