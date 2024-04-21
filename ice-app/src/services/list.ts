import { request } from "ice";

export async function fetchPartnerList(data) {
  const { partner_id, date } = data;
  return await request.get(
    `/api/getListByPartner?partner_id=${partner_id}&date=${date}`
  );
}

export async function updatePartnerStatus(data) {
  return await request.post("/api/updatePartnerStatus", data);
}

export async function getAllPartner() {
  return await request.get("/api/getAllPartner");
}

export async function toHaveAppointment(data) {
  return await request.post("/api/toHaveAppointment", data);
}

export async function getAppointmentList(data) {
  return await request.post("/api/getAppointmentList", data);
}
