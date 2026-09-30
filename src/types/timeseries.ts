export interface TimeSeriesPoint {
  /** ISO date, yyyy-MM-dd */
  date: string;
  value: number;
}

export interface RevenueSeries {
  points: TimeSeriesPoint[];
  /** "week" once the range is long enough that daily points would be too dense to read. */
  granularity: "day" | "week";
}

export interface UsersSeriesPoint {
  /** ISO date, yyyy-MM-dd */
  date: string;
  newUsers: number;
  activeUsers: number;
}

export interface UsersSeries {
  points: UsersSeriesPoint[];
}
