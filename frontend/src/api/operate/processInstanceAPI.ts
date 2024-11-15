import http from './axios';

type ResponseItem = {
  key: number;
  processVersion: number;
  bpmnProcessId: string;
  parentKey: number;
  parentFlowNodeInstanceKey: number;
  startDate: string;
  endDate: string;
  state: 'ACTIVE' | 'COMPLETED' | 'CANCELED';
  processDefinitionKey: number;
  tenantId: string;
  parentProcessInstanceKey: number;
};

export type ResponseStatistics = Array<{
  activityId: string;
  active: number;
  canceled: number;
  incidents: number;
  completed: number;
}>;

type SearchProps = {
  filter?: Partial<ResponseItem>;
  size?: number;
  searchAfter?: Object[];
  sort?: { field: string; order: 'ASC' | 'DESC' }[];
};

type ResponseSearch = {
  items: ResponseItem[];
  sortValues: Object[];
  total: number;
};

export async function searchInstances(
  props: SearchProps,
): Promise<ResponseSearch> {
  return http
    .post<ResponseSearch>('process-instances/search', JSON.stringify(props), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then((res) => res.data);
}

export async function getInstanceByKey(key: number): Promise<ResponseItem> {
  return http
    .get<ResponseItem>(`process-instances/${key}`, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((res) => res.data);
}

export async function getInstanceStatisticsByKey(
  key: number,
): Promise<ResponseStatistics> {
  return http
    .get<ResponseStatistics>(`process-instances/${key}/statistics`, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((res) => res.data);
}

export async function getInstanceSequenceFlowsByKey(
  key: number,
): Promise<string[]> {
  return http
    .get<string[]>(`process-instances/${key}/sequence-flows`, {
      headers: {
        Accept: '*/*',
      },
    })
    .then((res) => res.data);
}
