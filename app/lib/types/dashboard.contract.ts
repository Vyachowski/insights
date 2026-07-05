export interface YearlyProfitTrendDto {
  week: number;
  current: number;
  previous: number;
}

export interface CityProfitDto {
  city: string;
  profit: number;
}

export interface YearlyCityProfitDto {
  year: number;
  cities: CityProfitDto[];
}
