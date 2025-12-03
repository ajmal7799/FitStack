import AxiosInstance from "../../../axios/axios";

export const getSubscriptionPage = async (
  page = 1,
  limit = 10,
  status?: string,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const response = await AxiosInstance.get(
    `/admin/subscriptions?${params.toString()}`
  );
  return response.data;
};

export const createSubscription = async (data: any) => {
  const response = await AxiosInstance.post("/admin/subscription", data);
  return response.data;
};

export const updateSubscriptionStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const response = await AxiosInstance.patch(
    `/admin/subscriptions/update-status`,
    { id, status }
  );
  return response.data;
};
