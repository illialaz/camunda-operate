import './styles.scss';

import BpmnJS from 'bpmn-js/lib/NavigatedViewer';
import { useEffect, useRef, useState } from 'react';

import type { ResponseStatistics } from '@/api/operate/processInstanceAPI';

import { BPMNFetcher } from './utils';

type BPMNProps = {
  instanceId?: number;
};

const BPMN = ({ instanceId }: BPMNProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bpmnXML, setBPMNXML] = useState('');
  const [statistics, setStatistics] = useState<ResponseStatistics>([]);
  const [flows, setFlows] = useState<string[]>([]);

  useEffect(() => {
    BPMNFetcher({ instanceId })
      .then(({ bpmn, statistics, flows }) => {
        setBPMNXML(bpmn);
        setStatistics(statistics);
        setFlows(flows);
      })
      .catch(() => {});
  }, [instanceId]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const bpmnViewer = new BpmnJS({
      container: containerRef.current,
    });

    bpmnViewer.on('import.done', () => {
      bpmnViewer
        .get<{ zoom: (width: string, height: string) => void }>('canvas')
        .zoom('fit-viewport', 'auto');

      if (statistics.length) {
        const overlays = bpmnViewer.get<{
          add: (
            id: string,
            name: string,
            options: {
              position: {
                top?: number;
                left?: number;
                bottom?: number;
                right?: number;
              };
              html: string;
            },
          ) => void;
        }>('overlays');

        console.log(statistics);

        statistics.forEach(
          ({ activityId, incidents, completed, canceled, active }) => {
            if (incidents > 0) {
              overlays.add(activityId, 'flowNodeState', {
                position: {
                  bottom: 9,
                  right: 0,
                },
                html: `<div class="flow-node flow-node-incident">${incidents}</div>`,
              });
            }
            if (completed > 0) {
              overlays.add(activityId, 'flowNodeState', {
                position: {
                  top: -9,
                  left: 0,
                },
                html: `<div class="flow-node flow-node-completed">${completed}</div>`,
              });
            }
            if (canceled > 0) {
              overlays.add(activityId, 'flowNodeState', {
                position: {
                  top: -9,
                  right: 0,
                },
                html: `<div class="flow-node flow-node-canceled">${canceled}</div>`,
              });
            }
            if (active > 0) {
              overlays.add(activityId, 'flowNodeState', {
                position: {
                  bottom: 9,
                  left: 0,
                },
                html: `<div class="flow-node flow-node-active">${active}</div>`,
              });
            }
          },
        );

        flows.forEach((sequenceFlow) => {
          const elementRegistry = bpmnViewer.get<{
            get: (elem: string) => any;
            getGraphics: (elem: any) => any;
          }>('elementRegistry');
          const graphicsFactory = bpmnViewer.get<{
            update: (name: string, elem: any, gfx: any) => void;
          }>('graphicsFactory');
          const element = elementRegistry?.get(sequenceFlow);
          if (element?.di !== undefined) {
            element.di.set('stroke', '#0015ff');

            const gfx = elementRegistry?.getGraphics(element);
            if (gfx !== undefined) {
              graphicsFactory?.update('connection', element, gfx);
            }
          }
        });
      }
    });

    if (bpmnXML) {
      bpmnViewer.importXML(bpmnXML);
    }

    return () => bpmnViewer.destroy();
  }, [bpmnXML, statistics, flows]);

  return (
    <div
      className="react-bpmn-diagram-container"
      style={{ height: '100vh' }}
      ref={containerRef}
    />
  );
};

export default BPMN;
