import { getDefinitionXMLByKey } from '../../api/operate/processDefinitionAPI';
import type { ResponseStatistics } from '../../api/operate/processInstanceAPI';
import {
  getInstanceByKey,
  getInstanceSequenceFlowsByKey,
  getInstanceStatisticsByKey,
} from '../../api/operate/processInstanceAPI';

export const BPMNFetcher = async ({
  instanceId,
}: {
  instanceId?: number;
}): Promise<{
  bpmn: string;
  statistics: ResponseStatistics;
  flows: string[];
}> => {
  if (!instanceId) {
    return Promise.reject('Pass instanceId to BPMN');
  }

  const { processDefinitionKey } = await getInstanceByKey(instanceId);
  const statistics = await getInstanceStatisticsByKey(instanceId);
  const flows = await getInstanceSequenceFlowsByKey(instanceId);
  const bpmn = await getDefinitionXMLByKey(processDefinitionKey);

  return {
    bpmn,
    statistics,
    flows,
  };
};
