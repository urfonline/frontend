import dayjs from 'dayjs';
// @ts-ignore
import tz from 'timezone';
// @ts-ignore
import London from 'timezone/Europe/London';
const ltz = tz([London]);

const pluginFunc: dayjs.PluginFunc = (_option: any, _dayjsClass: typeof dayjs.Dayjs, dayjsFactory: typeof dayjs) => {
  dayjsFactory.at = (zoneName: string, date?: dayjs.ConfigType, format?: string) => {
    return dayjsFactory(
      ltz(
        dayjsFactory.utc(date, format).format("YYYY-MM-DD HH:mm:ss"),
        zoneName
      )
    );
  };

  dayjsFactory.atTimeOnDay = (zoneName, day, time) => {
    return dayjsFactory(
      ltz(
        dayjsFactory.utc(time, "HH:mm").weekday(day).format("YYYY-MM-DD HH:mm:ss"),
        zoneName
      )
    );
  };
};

declare module 'dayjs' {
  export function at(zoneName: string,
                     date?: dayjs.ConfigType, format?: string): Dayjs

  export function atTimeOnDay(zoneName: string, day: number, time: string): Dayjs
}

export default pluginFunc;
