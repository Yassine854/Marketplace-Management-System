import { axios } from "@/libs/axios";
import { logError } from "@/utils/logError";

type Params = {
  toDate: string;
  fromDate: string;
  agentId: string;
};

export const generateAgentReport = async ({
  toDate,
  fromDate,
  agentId,
}: Params): Promise<string> => {
  try {
    const res = await axios.magentoClient.get(
      `/agents/agent_report?deliveryDateStart=${fromDate}&deliveryDateEnd=${toDate}&agentId=${agentId}`,
    );
    return res?.data;
  } catch (error) {
    logError(error);
    throw new Error();
  }
};
