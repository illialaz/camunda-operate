import http from './axios';

type ResponseItem = {
  key: number;
  name: string;
  version: number;
  bpmnProcessId: string;
  tenantId: string;
};

type SearchProps = {
  filter: Partial<ResponseItem>;
  size: number;
  searchAfter: Object[];
  sort: { field: string; order: 'ASC' | 'DESC' }[];
};

type ResponseSearch = {
  items: ResponseItem[];
  sortValues: Object[];
  total: number;
};

export async function searchDefinitions(
  props: SearchProps,
): Promise<ResponseSearch> {
  return http
    .post<ResponseSearch>('process-definitions/search', JSON.stringify(props), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then((res) => res.data);
}

export async function getDefinitionByKey(key: number): Promise<ResponseItem> {
  return http
    .get<ResponseItem>(`process-definitions/${key}`, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((res) => res.data);
}

export async function getDefinitionXMLByKey(key: number): Promise<string> {
  return http
    .get<string>(`process-definitions/${key}/xml`, {
      headers: {
        Accept: 'text/xml',
      },
    })
    .then((res) => res.data);
}
