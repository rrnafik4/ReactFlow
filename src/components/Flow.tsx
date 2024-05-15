import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  BackgroundVariant,
  ControlButton,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import { DataType, MenuType, NodeType, NodeVariant } from "./types";

import "./NodeBlocks/BasicNode/BasicNode.css";
import { ContextMenu } from "./contextMenu/ContextMenu";
import { BasicNode } from "./NodeBlocks/BasicNode/BasicNode";
import { ConditionalBlock } from "./NodeBlocks/ConditionalBlock/ConditionalBlock";

type BlcokProps = {
  data: DataType;
  isEditable: boolean;
  onSave?: (data: DataType) => void;
};

/*
Функция преобразования в нод в NodeType[] или обратно в Node[]
*/
const getNodesData = (
  data: NodeType[] | Node[],
  isForNativeData = false
): NodeType[] | Node[] => {
  if (isForNativeData) {
    return (data as Node[]).map((node) => {
      return {
        id: node.id,
        position: node.position,
        type: node.type as NodeVariant,
        label: node.data.label,
      };
    });
  }
  return (data as NodeType[]).map((node) => {
    return {
      id: node.id,
      position: node.position,
      // type: node.type,
      data: { label: node.label },
    };
  });
};

const nodeTypes = {
  basic: BasicNode,
  conditional: ConditionalBlock,
};

export const Flow = ({ data, isEditable, onSave }: BlcokProps) => {
  const initialNodes = useMemo(
    () => getNodesData(data.nodes) as Node[],
    [data.nodes]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log(event.clientY, event.clientX);
      event.preventDefault();
      const pane = (
        ref.current as HTMLDivElement
      )?.getBoundingClientRect() as DOMRect;
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const controlOnAddBlock = () => {
    const lastId = String(nodes.length ? Number(nodes.at(-1)?.id) + 1 : 1);
    const nodeToAdd = {
      id: lastId,
      position: { x: 0, y: 0 },
      type: "basic",
      data: { label: "Новый блок" },
    };
    setNodes([...nodes, nodeToAdd]);
  };

  const controlOnSave = () => {
    onSave?.({
      nodes: getNodesData(nodes, true) as NodeType[],
      edges,
    });
  };

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div className="container">
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
      >
        <Controls showInteractive={isEditable}>
          {onSave && (
            <ControlButton onClick={controlOnSave}>
              <div>save</div>
            </ControlButton>
          )}

          {isEditable && (
            <ControlButton onClick={controlOnAddBlock}>
              <div>add</div>
            </ControlButton>
          )}
        </Controls>
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
};
