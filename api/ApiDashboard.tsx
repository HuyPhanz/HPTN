import {fetcher} from "@app/api/Fetcher";
import Constant from "@app/api/Constant";

export interface IStatsQuery {
  year?: number | string;
  store_id?: number[];
  month?: number | string;
}

export interface IParticipantStatsQuery {
  // page: number;
  // perpage: number;
  event_id?: number[];
  store_id?: number[];
  sort?: "purchase" | "checkin";
}

export interface IGeneralStatsResponse {
  customer: number;
  business: number;
  checked_in: number;
  purchased: number;
}

export interface ICheckinStatsResponse {
  data: {
    year: number;
    month: number;
    day: number;
    total_check_in: number;
    total_purchased: number;
  }[];
  store: {value: number; label: string}[];
}

interface ITrafficStatsResponse {
  year: number;
  month: number;
  day: number;
  total_traffic: number;
}
export interface IDataResponseParticipanr {
  name: string;
  checkin: number;
  purchase: number;
  allCheckIn: number;
}
export interface IParticipantStatsResponse {
  data: IDataResponseParticipanr[];
  store: {value: number; label: string}[];
}

function getGeneralStats(params?: IStatsQuery): Promise<IGeneralStatsResponse> {
  return fetcher({
    url: Constant.API_PATH.DASHBOARD_GET_GENERAL_STATS,
    method: "GET",
    params: params,
  });
}

function getCheckinStats(params?: IStatsQuery): Promise<ICheckinStatsResponse> {
  return fetcher({
    url: Constant.API_PATH.DASHBOARD_GET_CHECKIN_STATS,
    method: "GET",
    params: params,
  });
}

function getTrafficStats(
  params?: IStatsQuery
): Promise<ITrafficStatsResponse[]> {
  return fetcher({
    url: Constant.API_PATH.DASHBOARD_GET_TRAFFIC_STATS,
    method: "GET",
    params: params,
  });
}

function getParticipantStats(
  params?: IParticipantStatsQuery
): Promise<IParticipantStatsResponse> {
  return fetcher({
    url: Constant.API_PATH.DASHBOARD_GET_PARTICIPANT_STATS,
    method: "GET",
    params: params,
  });
}

export default {
  getCheckinStats,
  getGeneralStats,
  getTrafficStats,
  getParticipantStats,
};
