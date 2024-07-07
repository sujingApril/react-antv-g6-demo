
import request from "../utils/request";

export const getPaintings = (id) =>
  request.get(`/api/industry/analysis/company/mainMember/detail/${id}`);
